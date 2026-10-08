import { readFile, stat } from "fs/promises";
import { NextResponse } from "next/server";
import { CUSTOM_PROFILE, DEFAULT_PROFILE } from "@/lib/profile-file";

export const dynamic = "force-dynamic";

// Public: the website's "Download Profile" button. Serves the file uploaded in
// the admin, or the bundled default when none has been uploaded.
export async function GET() {
  for (const file of [CUSTOM_PROFILE, DEFAULT_PROFILE]) {
    try {
      const [data, s] = await Promise.all([readFile(file), stat(file)]);
      return new NextResponse(data, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": 'attachment; filename="ARFAD-Company-Profile.pdf"',
          "Cache-Control": "public, max-age=300, must-revalidate",
          "Last-Modified": s.mtime.toUTCString(),
          "X-Content-Type-Options": "nosniff",
        },
      });
    } catch {
      continue;
    }
  }
  return new NextResponse("Not found", { status: 404 });
}
