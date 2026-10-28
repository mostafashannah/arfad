import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { asc, eq, max } from "drizzle-orm";
import { db } from "@/db/client";
import { vendors } from "@/db/schema";
import { requireSession } from "@/lib/require-session";

export const dynamic = "force-dynamic";

const urlish = z
  .string()
  .trim()
  .max(500)
  .refine((v) => v.startsWith("/") || /^https?:\/\//.test(v), "Must be a path or http(s) URL")
  .nullish();

const createSchema = z.object({
  name: z.string().trim().min(1).max(200),
  vendorNo: z.string().trim().max(120).optional(),
  logoUrl: urlish,
  active: z.boolean().optional(),
});

// Public: the Registered Vendors page reads this and replaces its built-in list.
export async function GET() {
  const rows = await db.select().from(vendors).where(eq(vendors.active, true)).orderBy(asc(vendors.order)).all();
  return NextResponse.json(
    { vendors: rows.map((v) => ({ name: v.name, no: v.vendorNo, logo: v.logoUrl || null })) },
    { headers: { "Cache-Control": "public, max-age=30, stale-while-revalidate=120" } }
  );
}

export async function POST(req: NextRequest) {
  const { error } = await requireSession();
  if (error) return error;
  const parsed = createSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  const { name, vendorNo, logoUrl, active } = parsed.data;
  const [{ m }] = await db.select({ m: max(vendors.order) }).from(vendors).all();
  const [vendor] = await db
    .insert(vendors)
    .values({ name, vendorNo: vendorNo ?? "", logoUrl: logoUrl || null, active: active ?? true, order: (m ?? -1) + 1 })
    .returning();
  return NextResponse.json(vendor);
}
