// Local-disk storage adapter (writes into /public/uploads). This is fine for
// a self-hosted Node server (Railway, Render, a VPS, Docker) where the
// filesystem persists between requests. It will NOT work on Vercel's
// serverless functions, whose filesystem is read-only/ephemeral outside
// /tmp — for that target, swap this file's implementation for an object
// storage provider (Vercel Blob, S3, Cloudinary, UploadThing) and keep the
// same `saveUpload()` signature so nothing else in the app has to change.

import { writeFile, mkdir } from "fs/promises";
import path from "path";
import crypto from "crypto";

const UPLOAD_ROOT = path.join(process.cwd(), "public", "uploads");

export async function saveUpload(file: File, folder = "uploads"): Promise<{ url: string; filename: string }> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const ext = path.extname(file.name) || "";
  const safeName = `${Date.now()}-${crypto.randomBytes(4).toString("hex")}${ext}`;

  const dir = path.join(UPLOAD_ROOT, folder);
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, safeName), buffer);

  return { url: `/uploads/${folder}/${safeName}`, filename: safeName };
}
