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
  ".mp4": "video/mp4",
  ".m4v": "video/mp4",
  ".webm": "video/webm",
  ".mov": "video/quicktime",
};

export async function GET(req: Request, { params }: { params: { path: string[] } }) {
  for (const root of ROOTS) {
    const file = path.resolve(root, ...params.path);
    const type = TYPES[path.extname(file).toLowerCase()];
    if (!file.startsWith(root + path.sep) || !type) continue;
    try {
      const data = await readFile(file);
      // videos need byte-range responses so browsers (Safari especially) can play and seek them
      const range = /^bytes=(\d*)-(\d*)$/.exec(req.headers.get("range") || "");
      if (range && type.startsWith("video/")) {
        const size = data.length;
        const start = range[1] ? Math.min(parseInt(range[1], 10), size - 1) : Math.max(0, size - parseInt(range[2] || "0", 10));
        const end = range[1] && range[2] ? Math.min(parseInt(range[2], 10), size - 1) : size - 1;
        return new NextResponse(data.subarray(start, end + 1), {
          status: 206,
          headers: {
            "Content-Type": type,
            "Content-Range": `bytes ${start}-${end}/${size}`,
            "Accept-Ranges": "bytes",
            "Content-Length": String(end - start + 1),
            "Cache-Control": "public, max-age=3600",
            "X-Content-Type-Options": "nosniff",
          },
        });
      }
      return new NextResponse(data, {
        headers: {
          "Content-Type": type,
          "Accept-Ranges": "bytes",
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
