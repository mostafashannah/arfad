import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { posts } from "@/db/schema";
import { requireSession } from "@/lib/require-session";
import { postFields, uniqueSlug } from "@/lib/posts";

export const dynamic = "force-dynamic";

const patchSchema = z.object(postFields).partial();

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { error } = await requireSession();
  if (error) return error;

  const parsed = patchSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  const { slug, coverUrl, ...rest } = parsed.data;

  const set = {
    ...rest,
    ...(coverUrl !== undefined && { coverUrl: coverUrl || null }),
    ...(slug !== undefined && { slug: await uniqueSlug(slug, params.id) }),
    updatedAt: new Date(),
  };
  const [post] = await db.update(posts).set(set).where(eq(posts.id, params.id)).returning();
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(post);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const { error } = await requireSession();
  if (error) return error;

  await db.delete(posts).where(eq(posts.id, params.id)).run();
  return NextResponse.json({ ok: true });
}
