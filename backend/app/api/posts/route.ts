import { NextRequest, NextResponse } from "next/server";
import { and, desc, eq } from "drizzle-orm";
import { db } from "@/db/client";
import { posts } from "@/db/schema";
import { CATEGORIES } from "@/lib/posts";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const category = req.nextUrl.searchParams.get("category");
  const cat = CATEGORIES.find((c) => c === category);
  const rows = await db
    .select()
    .from(posts)
    .where(and(eq(posts.published, true), cat ? eq(posts.category, cat) : undefined))
    .orderBy(desc(posts.publishedAt), desc(posts.createdAt))
    .all();
  return NextResponse.json(
    {
      posts: rows.map((p) => ({
        slug: p.slug,
        title: p.title,
        category: p.category,
        excerpt: p.excerpt,
        cover: p.coverUrl || null,
        date: p.publishedAt,
      })),
    },
    { headers: { "Cache-Control": "public, max-age=60, stale-while-revalidate=300" } }
  );
}
