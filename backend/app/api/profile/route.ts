import { mkdir, rename, rm, writeFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, requireSession } from "@/lib/require-session";
import { CUSTOM_PROFILE, PROFILE_DIR, PROFILE_MAX_BYTES, profileInfo } from "@/lib/profile-file";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const { error } = await requireSession();
  if (error) return error;
  return NextResponse.json(await profileInfo());
}

export async function POST(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;
  const fd = await req.formData().catch(() => null);
  const file = fd?.get("file");
  if (!file || typeof file === "string") return NextResponse.json({ error: "Choose a PDF file." }, { status: 400 });
  if (!file.name.toLowerCase().endsWith(".pdf")) return NextResponse.json({ error: "The profile must be a PDF file." }, { status: 400 });
  if (file.size > PROFILE_MAX_BYTES) return NextResponse.json({ error: "File is too large (max 100 MB)." }, { status: 400 });
  const buf = Buffer.from(await file.arrayBuffer());
  if (buf.subarray(0, 4).toString() !== "%PDF") return NextResponse.json({ error: "That file is not a valid PDF." }, { status: 400 });
  await mkdir(PROFILE_DIR, { recursive: true });
  const tmp = `${CUSTOM_PROFILE}.tmp`;
  await writeFile(tmp, buf);
  await rename(tmp, CUSTOM_PROFILE);
  return NextResponse.json({ ok: true, ...(await profileInfo()) });
}

export async function DELETE() {
  const { error } = await requireAdmin();
  if (error) return error;
  await rm(CUSTOM_PROFILE, { force: true });
  return NextResponse.json({ ok: true, ...(await profileInfo()) });
}
