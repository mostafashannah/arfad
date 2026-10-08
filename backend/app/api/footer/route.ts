import { NextResponse } from "next/server";
import { getFooter } from "@/lib/site-content";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ footer: await getFooter() }, { headers: { "Cache-Control": "public, max-age=60, stale-while-revalidate=300" } });
}
