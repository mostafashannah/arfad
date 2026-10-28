import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/require-session";
import { getSavedCertificates, resetCertificates, saveCertificates } from "@/lib/certificates";

export const dynamic = "force-dynamic";

// Public: the Certificates page reads this. `null` means nothing was edited, so the built-in page stays as is.
export async function GET() {
  return NextResponse.json({ certificates: await getSavedCertificates() }, { headers: { "Cache-Control": "public, max-age=30, stale-while-revalidate=120" } });
}

export async function PUT(req: NextRequest) {
  const { error } = await requireSession();
  if (error) return error;
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  return NextResponse.json({ certificates: await saveCertificates("certificates" in body ? (body as { certificates: unknown }).certificates : body) });
}

// Back to the built-in certificates.
export async function DELETE() {
  const { error } = await requireSession();
  if (error) return error;
  await resetCertificates();
  return NextResponse.json({ ok: true });
}
