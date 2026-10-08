import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/require-session";
import { getNavTree, navSchema, saveNav } from "@/lib/site-content";

export const dynamic = "force-dynamic";

export async function GET() {
  const { error } = await requireSession();
  if (error) return error;
  return NextResponse.json({ items: await getNavTree() });
}

export async function PUT(req: NextRequest) {
  const { error } = await requireSession();
  if (error) return error;
  const parsed = navSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    const i = parsed.error.issues[0];
    return NextResponse.json({ error: `${i.path.join(".")}: ${i.message}` }, { status: 400 });
  }
  await saveNav(parsed.data.items);
  return NextResponse.json({ items: await getNavTree() });
}
