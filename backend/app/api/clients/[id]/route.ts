import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { clients } from "@/db/schema";
import { requireSession } from "@/lib/require-session";

const urlish = z
  .string()
  .trim()
  .max(500)
  .refine((v) => v.startsWith("/") || /^https?:\/\//.test(v), "Must be a path or http(s) URL")
  .nullable();

const patchSchema = z.object({
  name: z.string().trim().min(1).max(200).optional(),
  logoUrl: urlish.optional(),
  website: urlish.optional(),
  active: z.boolean().optional(),
  order: z.number().int().min(0).optional(),
});

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { error } = await requireSession();
  if (error) return error;

  const parsed = patchSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  const { name, logoUrl, website, active, order } = parsed.data;

  const set = {
    ...(name !== undefined && { name }),
    ...(logoUrl !== undefined && { logoUrl: logoUrl || null }),
    ...(website !== undefined && { website: website || null }),
    ...(active !== undefined && { active }),
    ...(order !== undefined && { order }),
  };
  if (Object.keys(set).length === 0) return NextResponse.json({ error: "Nothing to update" }, { status: 400 });

  const [client] = await db.update(clients).set(set).where(eq(clients.id, params.id)).returning();
  if (!client) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(client);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const { error } = await requireSession();
  if (error) return error;

  await db.delete(clients).where(eq(clients.id, params.id)).run();
  return NextResponse.json({ ok: true });
}
