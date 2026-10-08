import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import nodemailer from "nodemailer";
import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { enquiries } from "@/db/schema";

export const runtime = "nodejs";

const optional = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .nullable()
    .transform((v) => v || null);

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(120, "Name is too long."),
  email: z.string().trim().email("Please enter a valid email address.").max(200, "Email is too long."),
  phone: optional(40),
  subject: optional(200),
  enquiryType: optional(80),
  message: z.string().trim().min(5, "Please enter a message.").max(5000, "Message is too long."),
  page: optional(512),
});

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) {
    for (const [k, v] of hits) if (v.every((t) => now - t >= WINDOW_MS)) hits.delete(k);
  }
  return false;
}

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

type Enquiry = z.infer<typeof schema>;

async function sendMail(e: Enquiry, ip: string | null): Promise<"sent" | "not_configured"> {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) return "not_configured";

  const port = Number(process.env.SMTP_PORT) || 465;
  const secure = process.env.SMTP_SECURE ? process.env.SMTP_SECURE !== "false" : port === 465;
  const transport = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
  });

  const rows: [string, string][] = [
    ["Name", e.name],
    ["Email", e.email],
    ["Phone", e.phone || "-"],
    ["Type", e.enquiryType || "-"],
    ["Subject", e.subject || "-"],
    ["Page", e.page || "-"],
    ["IP", ip || "-"],
  ];
  const text = [...rows.map(([k, v]) => `${k}: ${v}`), "", "Message:", e.message].join("\n");
  const html =
    `<table cellpadding="6" style="font-family:Arial,sans-serif;font-size:14px">` +
    rows.map(([k, v]) => `<tr><td><b>${esc(k)}</b></td><td>${esc(v)}</td></tr>`).join("") +
    `</table><p style="font-family:Arial,sans-serif;font-size:14px;white-space:pre-wrap">${esc(e.message)}</p>`;

  await transport.sendMail({
    from: process.env.MAIL_FROM || user,
    to: process.env.MAIL_TO || "info@arfad.com.sa",
    replyTo: e.email,
    subject: `[Website enquiry] ${(e.subject || e.enquiryType || "New message").replace(/[\r\n]+/g, " ")}`,
    text,
    html,
  });
  return "sent";
}

// Public, unauthenticated: called by the website's enquiry form.
export async function POST(req: NextRequest) {
  const ok = () => NextResponse.json({ ok: true });
  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
    }

    if (typeof body.website === "string" && body.website.trim() !== "") return ok();
    const t = Number(body.t);
    if (Number.isFinite(t) && t > 0 && Date.now() - t < 3000) return ok();

    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: parsed.error.issues[0]?.message || "Please check the form and try again." },
        { status: 400 }
      );
    }

    const forwardedFor = req.headers.get("x-forwarded-for");
    const ip = (forwardedFor ? forwardedFor.split(",")[0].trim() : null) || req.headers.get("x-real-ip");
    if (rateLimited(ip || "unknown")) {
      return NextResponse.json(
        { ok: false, error: "Too many enquiries. Please try again later." },
        { status: 429 }
      );
    }

    const e = parsed.data;
    const row = await db
      .insert(enquiries)
      .values({ ...e, ip })
      .returning({ id: enquiries.id })
      .get();

    let status: "sent" | "failed" | "not_configured" = "failed";
    let error: string | null = null;
    try {
      status = await sendMail(e, ip);
    } catch (err) {
      error = (err instanceof Error ? err.message : String(err)).slice(0, 500);
    }
    await db
      .update(enquiries)
      .set({ emailStatus: status, emailError: error })
      .where(eq(enquiries.id, row.id))
      .run()
      .catch(() => {});

    return ok();
  } catch {
    return NextResponse.json({ ok: false, error: "Something went wrong. Please try again later." }, { status: 500 });
  }
}
