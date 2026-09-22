import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/client";
import { services } from "@/db/schema";
import { asc, count } from "drizzle-orm";
import { requireSession } from "@/lib/require-session";

export async function GET() {
  const all = await db.select().from(services).orderBy(asc(services.order)).all();
  return NextResponse.json(all);
}

export async function POST(req: NextRequest) {
  const { error } = await requireSession();
  if (error) return error;

  const body = await req.json();
  const [{ n }] = await db.select({ n: count() }).from(services).all();

  const [service] = await db
    .insert(services)
    .values({
      anchor: body.anchor,
      title: body.title,
      summary: body.summary,
      image: body.image || null,
      features: JSON.stringify(body.features || []),
      published: body.published ?? true,
      order: n,
    })
    .returning();

  return NextResponse.json(service);
}
