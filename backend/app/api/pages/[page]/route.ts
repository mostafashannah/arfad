import { NextResponse } from "next/server";
import { getOverrides, isPage } from "@/lib/page-overrides";

export const dynamic = "force-dynamic";

// Public: the website reads this to apply text and image edits made in the admin.
export async function GET(_req: Request, { params }: { params: { page: string } }) {
  if (!isPage(params.page)) return NextResponse.json({ overrides: {} });
  return NextResponse.json(
    { overrides: await getOverrides(params.page) },
    { headers: { "Cache-Control": "public, max-age=30, stale-while-revalidate=120" } }
  );
}
