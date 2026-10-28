import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/require-session";
import { getBranding, saveBranding } from "@/lib/branding";

export const dynamic = "force-dynamic";

// Public: the website reads the header and footer logo from here.
export async function GET() {
  return NextResponse.json({ branding: await getBranding() }, { headers: { "Cache-Control": "public, max-age=30, stale-while-revalidate=120" } });
}

export async function PUT(req: NextRequest) {
  const { error } = await requireSession();
  if (error) return error;
  const body = await req.json().catch(() => null);
  return NextResponse.json({ branding: await saveBranding(body && typeof body === "object" && "branding" in body ? (body as { branding: unknown }).branding : body) });
}
