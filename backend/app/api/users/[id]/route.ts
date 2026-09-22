import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/client";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/require-session";

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const { error, session } = await requireAdmin();
  if (error) return error;

  if (session!.user && (session!.user as any).id === params.id) {
    return NextResponse.json({ error: "You cannot remove your own account." }, { status: 400 });
  }

  await db.delete(users).where(eq(users.id, params.id)).run();
  return NextResponse.json({ ok: true });
}
