import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/require-session";
import { footerSchema, getFooter, saveFooter } from "@/lib/site-content";

export const dynamic = "force-dynamic";

export async function GET() {
  const { error } = await requireSession();
  if (error) return error;
  return NextResponse.json({ footer: await getFooter() });
}

export async function PUT(req: NextRequest) {
  const { error } = await requireSession();
  if (error) return error;
  const body = await req.json().catch(() => null);
  const parsed = footerSchema.safeParse(body && typeof body === "object" && "footer" in body ? (body as { footer: unknown }).footer : body);
  if (!parsed.success) {
    const i = parsed.error.issues[0];
    return NextResponse.json({ error: `${i.path.join(".")}: ${i.message}` }, { status: 400 });
  }
  await saveFooter(parsed.data);
  return NextResponse.json({ footer: parsed.data });
}
