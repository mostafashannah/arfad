import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { db } from "@/db/client";
import { posts } from "@/db/schema";

export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: { slug: string } }) {
  const p = await db
    .select()
    .from(posts)
    .where(and(eq(posts.slug, params.slug), eq(posts.published, true)))
    .get();
  if (!p) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(
    {
      post: { slug: p.slug, title: p.title, category: p.category, excerpt: p.excerpt, body: p.body, cover: p.coverUrl || null, date: p.publishedAt },
    },
    { headers: { "Cache-Control": "public, max-age=60, stale-while-revalidate=300" } }
  );
}
