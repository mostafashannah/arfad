import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/client";
import { projects } from "@/db/schema";
import { asc, count } from "drizzle-orm";
import { requireSession } from "@/lib/require-session";

export async function GET() {
  const all = await db.select().from(projects).orderBy(asc(projects.order)).all();
  return NextResponse.json(all);
}

export async function POST(req: NextRequest) {
  const { error } = await requireSession();
  if (error) return error;

  const body = await req.json();
  const [{ n }] = await db.select({ n: count() }).from(projects).all();

  const [project] = await db
    .insert(projects)
    .values({
      slug: body.slug,
      title: body.title,
      client: body.client,
      location: body.location,
      scope: body.scope,
      description: body.description,
      vendorNo: body.vendorNo || null,
      featured: body.featured ?? false,
      images: JSON.stringify(body.images || []),
      published: body.published ?? true,
      order: n,
    })
    .returning();

  return NextResponse.json(project);
}
