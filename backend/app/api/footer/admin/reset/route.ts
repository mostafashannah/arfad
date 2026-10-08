import { NextResponse } from "next/server";
import { requireSession } from "@/lib/require-session";
import { getFooter, resetFooter } from "@/lib/site-content";

export const dynamic = "force-dynamic";

export async function POST() {
  const { error } = await requireSession();
  if (error) return error;
  await resetFooter();
  return NextResponse.json({ footer: await getFooter() });
}
