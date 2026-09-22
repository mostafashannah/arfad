import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

// TEMPORARY PREVIEW BYPASS — set to false (or delete this block and the
// PREVIEW_SESSION usages below) before this holds any real content. While
// true, every admin API route treats every request as a logged-in ADMIN,
// with no password required.
const PREVIEW_NO_LOGIN = true;
const PREVIEW_SESSION = {
  user: { id: "preview", name: "Preview Admin", email: "preview@arfad.com.sa", role: "ADMIN" },
} as any;

export async function requireSession() {
  if (PREVIEW_NO_LOGIN) return { session: PREVIEW_SESSION, error: null };
  const session = await getServerSession(authOptions);
  if (!session) {
    return { session: null, error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  return { session, error: null };
}

export async function requireAdmin() {
  if (PREVIEW_NO_LOGIN) return { session: PREVIEW_SESSION, error: null };
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any)?.role !== "ADMIN") {
    return { session: null, error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }
  return { session, error: null };
}
