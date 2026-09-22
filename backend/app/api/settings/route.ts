import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/client";
import { settings } from "@/db/schema";
import { asc, eq } from "drizzle-orm";
import { requireSession } from "@/lib/require-session";

export async function GET() {
  const all = await db.select().from(settings).orderBy(asc(settings.section), asc(settings.key)).all();
  return NextResponse.json(all);
}

// Body: { updates: { id: string, value: string }[] }
export async function PATCH(req: NextRequest) {
  const { error } = await requireSession();
  if (error) return error;

  const body = await req.json();
  const updates: { id: string; value: string }[] = body.updates || [];

  for (const u of updates) {
    await db.update(settings).set({ value: u.value }).where(eq(settings.id, u.id)).run();
  }

  return NextResponse.json({ ok: true, count: updates.length });
}
