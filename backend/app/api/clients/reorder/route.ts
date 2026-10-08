import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { clients } from "@/db/schema";
import { requireSession } from "@/lib/require-session";

const schema = z.object({ ids: z.array(z.string().min(1)).min(1) });

export async function POST(req: NextRequest) {
  const { error } = await requireSession();
  if (error) return error;

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "ids must be a non-empty array" }, { status: 400 });

  for (const [i, id] of parsed.data.ids.entries()) {
    await db.update(clients).set({ order: i }).where(eq(clients.id, id)).run();
  }
  return NextResponse.json({ ok: true });
}
