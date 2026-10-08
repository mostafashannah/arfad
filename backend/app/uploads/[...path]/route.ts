import { readFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { DATA_DIR } from "@/lib/data-dir";

export const dynamic = "force-dynamic";

const ROOTS = [path.join(DATA_DIR, "uploads"), path.join(process.cwd(), "public", "uploads")];
const TYPES: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".pdf": "application/pdf",
};

export async function GET(_req: Request, { params }: { params: { path: string[] } }) {
  for (const root of ROOTS) {
    const file = path.resolve(root, ...params.path);
    const type = TYPES[path.extname(file).toLowerCase()];
    if (!file.startsWith(root + path.sep) || !type) continue;
    try {
      const data = await readFile(file);
      return new NextResponse(data, {
        headers: {
          "Content-Type": type,
          "Cache-Control": "public, max-age=3600",
          "X-Content-Type-Options": "nosniff",
          "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'; sandbox",
        },
      });
    } catch {
      continue;
    }
  }
  return new NextResponse("Not found", { status: 404 });
}
