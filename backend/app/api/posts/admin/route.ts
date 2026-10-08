import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { desc } from "drizzle-orm";
import { db } from "@/db/client";
import { posts } from "@/db/schema";
import { requireSession } from "@/lib/require-session";
import { postFields, uniqueSlug } from "@/lib/posts";

export const dynamic = "force-dynamic";

const { slug, published, ...rest } = postFields;
const createSchema = z.object({ ...rest, slug: slug.optional(), published: published.optional() });

export async function GET() {
  const { error } = await requireSession();
  if (error) return error;

  const rows = await db.select().from(posts).orderBy(desc(posts.publishedAt), desc(posts.createdAt)).all();
  return NextResponse.json({ posts: rows });
}

export async function POST(req: NextRequest) {
  const { error } = await requireSession();
  if (error) return error;

  const parsed = createSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  const { slug: wanted, coverUrl, published: pub, ...data } = parsed.data;

  const [post] = await db
    .insert(posts)
    .values({ ...data, slug: await uniqueSlug(wanted || data.title), coverUrl: coverUrl || null, published: pub ?? true })
    .returning();
  return NextResponse.json(post);
}
