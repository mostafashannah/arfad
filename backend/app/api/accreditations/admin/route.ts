import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { asc, max } from "drizzle-orm";
import { db } from "@/db/client";
import { accreditations } from "@/db/schema";
import { requireSession } from "@/lib/require-session";

export const dynamic = "force-dynamic";

const logoUrlSchema = z
  .string()
  .trim()
  .min(1, "Logo is required")
  .max(500)
  .refine((v) => v.startsWith("/") || /^https?:\/\//i.test(v), "Must be a path or http(s) URL");

const createSchema = z.object({
  name: z.string().trim().min(1).max(80),
  logoUrl: logoUrlSchema,
  light: z.boolean().optional(),
});

export async function GET() {
  const { error } = await requireSession();
  if (error) return error;

  const rows = await db.select().from(accreditations).orderBy(asc(accreditations.order)).all();
  return NextResponse.json({ items: rows });
}

export async function POST(req: NextRequest) {
  const { error } = await requireSession();
  if (error) return error;

  const parsed = createSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  const { name, logoUrl, light } = parsed.data;

  const [{ m }] = await db.select({ m: max(accreditations.order) }).from(accreditations).all();
  const [item] = await db
    .insert(accreditations)
    .values({ name, logoUrl, light: light ?? false, order: (m ?? -1) + 1 })
    .returning();
  return NextResponse.json(item);
}
