import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { accreditations } from "@/db/schema";
import { requireSession } from "@/lib/require-session";

const logoUrl = z
  .string()
  .trim()
  .min(1, "Logo is required")
  .max(500)
  .refine((v) => v.startsWith("/") || /^https?:\/\//i.test(v), "Must be a path or http(s) URL");

const patchSchema = z.object({
  name: z.string().trim().min(1).max(80).optional(),
  logoUrl: logoUrl.optional(),
  light: z.boolean().optional(),
  active: z.boolean().optional(),
  order: z.number().int().min(0).optional(),
});

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { error } = await requireSession();
  if (error) return error;

  const parsed = patchSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  const { name, logoUrl, light, active, order } = parsed.data;

  const set = {
    ...(name !== undefined && { name }),
    ...(logoUrl !== undefined && { logoUrl }),
    ...(light !== undefined && { light }),
    ...(active !== undefined && { active }),
    ...(order !== undefined && { order }),
  };
  if (Object.keys(set).length === 0) return NextResponse.json({ error: "Nothing to update" }, { status: 400 });

  const [item] = await db.update(accreditations).set(set).where(eq(accreditations.id, params.id)).returning();
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(item);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const { error } = await requireSession();
  if (error) return error;

  await db.delete(accreditations).where(eq(accreditations.id, params.id)).run();
  return NextResponse.json({ ok: true });
}
