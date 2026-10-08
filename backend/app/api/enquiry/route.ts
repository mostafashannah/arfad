import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import nodemailer from "nodemailer";
import { eq } from "drizzle-orm";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import crypto from "crypto";
import { db } from "@/db/client";
import { enquiries } from "@/db/schema";
import { DATA_DIR } from "@/lib/data-dir";

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
type Cv = { name: string; file: string; fullPath: string } | null;

const CV_DIR = path.join(DATA_DIR, "cv");
const CV_MAX = 5 * 1024 * 1024;
const CV_TYPES: Record<string, (b: Buffer) => boolean> = {
  ".pdf": (b) => b.subarray(0, 4).toString() === "%PDF",
  ".docx": (b) => b[0] === 0x50 && b[1] === 0x4b,
  ".doc": (b) => b[0] === 0xd0 && b[1] === 0xcf,
};

async function sendMail(e: Enquiry, ip: string | null, cv: Cv): Promise<"sent" | "not_configured"> {
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
    ["CV", cv ? cv.name : "-"],
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
    attachments: cv ? [{ filename: cv.name, path: cv.fullPath }] : undefined,
    subject: `[Website enquiry] ${(e.subject || e.enquiryType || "New message").replace(/[\r\n]+/g, " ")}`,
    text,
    html,
  });
  return "sent";
}

// Public, unauthenticated: called by the website's enquiry form.
export async function POST(req: NextRequest) {
  const ok = () => NextResponse.json({ ok: true });
  const bad = (error: string, status = 400) => NextResponse.json({ ok: false, error }, { status });
  try {
    let body: Record<string, unknown> | null = null;
    let upload: File | null = null;
    if ((req.headers.get("content-type") || "").includes("multipart/form-data")) {
      const fd = await req.formData().catch(() => null);
      if (!fd) return bad("Invalid request.");
      body = {};
      for (const [k, v] of fd.entries()) {
        if (typeof v === "string") body[k] = v;
        else if (k === "cv" && v.size > 0) upload = v;
      }
    } else {
      body = await req.json().catch(() => null);
    }
    if (!body || typeof body !== "object") return bad("Invalid request.");

    if (typeof body.website === "string" && body.website.trim() !== "") return ok();
    const t = Number(body.t);
    if (Number.isFinite(t) && t > 0 && Date.now() - t < 3000) return ok();

    const parsed = schema.safeParse(body);
    if (!parsed.success) return bad(parsed.error.issues[0]?.message || "Please check the form and try again.");

    const forwardedFor = req.headers.get("x-forwarded-for");
    const ip = (forwardedFor ? forwardedFor.split(",")[0].trim() : null) || req.headers.get("x-real-ip");
    if (rateLimited(ip || "unknown")) return bad("Too many enquiries. Please try again later.", 429);

    let cv: Cv = null;
    if (upload) {
      const ext = path.extname(upload.name).toLowerCase();
      if (!CV_TYPES[ext]) return bad("Please attach your CV as a PDF or Word document (.pdf, .doc, .docx).");
      if (upload.size > CV_MAX) return bad("Your CV is larger than 5 MB. Please attach a smaller file.");
      const buf = Buffer.from(await upload.arrayBuffer());
      if (!CV_TYPES[ext](buf)) return bad("That file does not look like a valid PDF or Word document.");
      const file = `${crypto.randomUUID()}${ext}`;
      await mkdir(CV_DIR, { recursive: true });
      await writeFile(path.join(CV_DIR, file), buf);
      const name = path.basename(upload.name).replace(/[^\w.\- ()]+/g, "_").slice(0, 120) || `cv${ext}`;
      cv = { name, file, fullPath: path.join(CV_DIR, file) };
    }

    const e = parsed.data;
    const row = await db
      .insert(enquiries)
      .values({ ...e, ip, cvName: cv?.name ?? null, cvFile: cv?.file ?? null })
      .returning({ id: enquiries.id })
      .get();

    let status: "sent" | "failed" | "not_configured" = "failed";
    let error: string | null = null;
    try {
      status = await sendMail(e, ip, cv);
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
    return bad("Something went wrong. Please try again later.", 500);
  }
}
