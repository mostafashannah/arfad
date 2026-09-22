import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/client";
import { services } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireSession } from "@/lib/require-session";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const service = await db.select().from(services).where(eq(services.id, params.id)).get();
  if (!service) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(service);
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { error } = await requireSession();
  if (error) return error;

  const body = await req.json();
  const [service] = await db
    .update(services)
    .set({
      ...(body.anchor !== undefined && { anchor: body.anchor }),
      ...(body.title !== undefined && { title: body.title }),
      ...(body.summary !== undefined && { summary: body.summary }),
      ...(body.image !== undefined && { image: body.image }),
      ...(body.features !== undefined && { features: JSON.stringify(body.features) }),
      ...(body.published !== undefined && { published: body.published }),
      ...(body.order !== undefined && { order: body.order }),
      updatedAt: new Date(),
    })
    .where(eq(services.id, params.id))
    .returning();

  return NextResponse.json(service);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const { error } = await requireSession();
  if (error) return error;

  await db.delete(services).where(eq(services.id, params.id)).run();
  return NextResponse.json({ ok: true });
}
