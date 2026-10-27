import { NextResponse } from "next/server";
import { requireSession } from "@/lib/require-session";
import { CATALOG, countEdited } from "@/lib/page-overrides";

export const dynamic = "force-dynamic";

export async function GET() {
  const { error } = await requireSession();
  if (error) return error;
  const edited = await countEdited();
  const pages = Object.entries(CATALOG).map(([file, p]) => ({ file, title: p.title, editable: p.items.length, edited: edited[file] ?? 0 }));
  return NextResponse.json({ pages });
}
