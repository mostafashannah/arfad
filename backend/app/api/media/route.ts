import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/client";
import { mediaAssets } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { requireSession } from "@/lib/require-session";
import { saveUpload } from "@/lib/storage";

export async function GET() {
  const all = await db.select().from(mediaAssets).orderBy(desc(mediaAssets.createdAt)).all();
  return NextResponse.json(all);
}

export async function POST(req: NextRequest) {
  const { error } = await requireSession();
  if (error) return error;

  const form = await req.formData();
  const file = form.get("file") as File | null;
  const folder = (form.get("folder") as string) || "uploads";

  if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });
  const isVideo = ["video/mp4", "video/webm", "video/quicktime"].includes(file.type);
  const isPdf = file.type === "application/pdf";
  if (!file.type.startsWith("image/") && !isVideo && !isPdf) {
    return NextResponse.json({ error: "Only image uploads, PDFs (or MP4, WebM and MOV videos) are allowed" }, { status: 400 });
  }
  const max = isVideo ? 40 : isPdf ? 25 : 10;
  if (file.size > max * 1024 * 1024) {
    return NextResponse.json({ error: `File too large (max ${max}MB)` }, { status: 400 });
  }

  const { url, filename } = await saveUpload(file, folder);
  const [asset] = await db.insert(mediaAssets).values({ url, filename, folder }).returning();
  return NextResponse.json(asset);
}

export async function DELETE(req: NextRequest) {
  const { error } = await requireSession();
  if (error) return error;

  const { id } = await req.json();
  await db.delete(mediaAssets).where(eq(mediaAssets.id, id)).run();
  return NextResponse.json({ ok: true });
}
