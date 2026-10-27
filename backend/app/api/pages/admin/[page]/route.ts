import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/require-session";
import { CATALOG, getOverrides, isPage, saveOverrides } from "@/lib/page-overrides";

export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest, { params }: { params: { page: string } }) {
  const { error } = await requireSession();
  if (error) return error;
  if (!isPage(params.page)) return NextResponse.json({ error: "Page not found" }, { status: 404 });
  return NextResponse.json({ page: CATALOG[params.page], overrides: await getOverrides(params.page) });
}

export async function PUT(req: NextRequest, { params }: { params: { page: string } }) {
  const { error } = await requireSession();
  if (error) return error;
  if (!isPage(params.page)) return NextResponse.json({ error: "Page not found" }, { status: 404 });
  const body = await req.json().catch(() => null);
  const overrides = await saveOverrides(params.page, body && typeof body === "object" && "overrides" in body ? (body as { overrides: unknown }).overrides : body);
  return NextResponse.json({ overrides });
}

export async function DELETE(_req: NextRequest, { params }: { params: { page: string } }) {
  const { error } = await requireSession();
  if (error) return error;
  if (!isPage(params.page)) return NextResponse.json({ error: "Page not found" }, { status: 404 });
  await saveOverrides(params.page, {});
  return NextResponse.json({ overrides: {} });
}
