import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { vendors } from "@/db/schema";
import { requireSession } from "@/lib/require-session";

const urlish = z
  .string()
  .trim()
  .max(500)
  .refine((v) => v.startsWith("/") || /^https?:\/\//.test(v), "Must be a path or http(s) URL")
  .nullable();

const patchSchema = z.object({
  name: z.string().trim().min(1).max(200).optional(),
  vendorNo: z.string().trim().max(120).optional(),
  logoUrl: urlish.optional(),
  active: z.boolean().optional(),
});

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { error } = await requireSession();
  if (error) return error;
  const parsed = patchSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  const { name, vendorNo, logoUrl, active } = parsed.data;
  const set = {
    ...(name !== undefined && { name }),
    ...(vendorNo !== undefined && { vendorNo }),
    ...(logoUrl !== undefined && { logoUrl: logoUrl || null }),
    ...(active !== undefined && { active }),
  };
  if (Object.keys(set).length === 0) return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  const [vendor] = await db.update(vendors).set(set).where(eq(vendors.id, params.id)).returning();
  if (!vendor) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(vendor);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const { error } = await requireSession();
  if (error) return error;
  await db.delete(vendors).where(eq(vendors.id, params.id)).run();
  return NextResponse.json({ ok: true });
}
