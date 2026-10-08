import { readFile } from "fs/promises";
import path from "path";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db/client";
import { enquiries } from "@/db/schema";
import { requireSession } from "@/lib/require-session";
import { DATA_DIR } from "@/lib/data-dir";

export const dynamic = "force-dynamic";

const TYPES: Record<string, string> = {
  ".pdf": "application/pdf",
  ".doc": "application/msword",
  ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
};

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const { error } = await requireSession();
  if (error) return error;
  const id = Number(params.id);
  if (!Number.isInteger(id)) return new NextResponse("Not found", { status: 404 });
  const row = await db.select().from(enquiries).where(eq(enquiries.id, id)).get();
  if (!row?.cvFile) return new NextResponse("Not found", { status: 404 });
  try {
    const file = path.join(DATA_DIR, "cv", path.basename(row.cvFile));
    const data = await readFile(file);
    const name = (row.cvName || row.cvFile).replace(/"/g, "");
    return new NextResponse(data, {
      headers: {
        "Content-Type": TYPES[path.extname(file).toLowerCase()] || "application/octet-stream",
        "Content-Disposition": `attachment; filename="${name}"`,
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
