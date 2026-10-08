import { NextResponse } from "next/server";
import { getNavTree } from "@/lib/site-content";

export const dynamic = "force-dynamic";

export async function GET() {
  const tree = await getNavTree();
  const items = tree
    .filter((i) => i.active)
    .map((i) => ({
      label: i.label,
      href: i.href,
      children: i.children.filter((c) => c.active).map((c) => ({ label: c.label, href: c.href })),
    }));
  return NextResponse.json({ items }, { headers: { "Cache-Control": "public, max-age=60, stale-while-revalidate=300" } });
}
