import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/client";
import { projects } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireSession } from "@/lib/require-session";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const project = await db.select().from(projects).where(eq(projects.id, params.id)).get();
  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(project);
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { error } = await requireSession();
  if (error) return error;

  const body = await req.json();
  const [project] = await db
    .update(projects)
    .set({
      ...(body.slug !== undefined && { slug: body.slug }),
      ...(body.title !== undefined && { title: body.title }),
      ...(body.client !== undefined && { client: body.client }),
      ...(body.location !== undefined && { location: body.location }),
      ...(body.scope !== undefined && { scope: body.scope }),
      ...(body.description !== undefined && { description: body.description }),
      ...(body.vendorNo !== undefined && { vendorNo: body.vendorNo }),
      ...(body.featured !== undefined && { featured: body.featured }),
      ...(body.images !== undefined && { images: JSON.stringify(body.images) }),
      ...(body.published !== undefined && { published: body.published }),
      ...(body.order !== undefined && { order: body.order }),
      updatedAt: new Date(),
    })
    .where(eq(projects.id, params.id))
    .returning();

  return NextResponse.json(project);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const { error } = await requireSession();
  if (error) return error;

  await db.delete(projects).where(eq(projects.id, params.id)).run();
  return NextResponse.json({ ok: true });
}
