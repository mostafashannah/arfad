import { NextResponse } from "next/server";
import { requireSession } from "@/lib/require-session";
import { getNavTree, resetNav } from "@/lib/site-content";

export const dynamic = "force-dynamic";

export async function POST() {
  const { error } = await requireSession();
  if (error) return error;
  await resetNav();
  return NextResponse.json({ items: await getNavTree() });
}
