import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { asc, eq, max } from "drizzle-orm";
import { db } from "@/db/client";
import { clients } from "@/db/schema";
import { requireSession } from "@/lib/require-session";
import { slugify } from "@/lib/slugify";

export const dynamic = "force-dynamic";

const urlish = z
  .string()
  .trim()
  .max(500)
  .refine((v) => v.startsWith("/") || /^https?:\/\//.test(v), "Must be a path or http(s) URL")
  .nullish();

const createSchema = z.object({
  name: z.string().trim().min(1).max(200),
  logoUrl: urlish,
  website: urlish,
  active: z.boolean().optional(),
});

export async function GET() {
  const rows = await db.select().from(clients).where(eq(clients.active, true)).orderBy(asc(clients.order)).all();
  return NextResponse.json(
    { clients: rows.map((c) => ({ name: c.name, slug: c.slug, logo: c.logoUrl || null, website: c.website || null })) },
    { headers: { "Cache-Control": "public, max-age=60, stale-while-revalidate=300" } }
  );
}

export async function POST(req: NextRequest) {
  const { error } = await requireSession();
  if (error) return error;

  const parsed = createSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  const { name, logoUrl, website, active } = parsed.data;

  const slug = slugify(name);
  if (!slug) return NextResponse.json({ error: "Name must contain letters or numbers" }, { status: 400 });
  const dup = await db.select({ id: clients.id }).from(clients).where(eq(clients.slug, slug)).get();
  if (dup) return NextResponse.json({ error: "A client with this name already exists" }, { status: 409 });

  const [{ m }] = await db.select({ m: max(clients.order) }).from(clients).all();
  const [client] = await db
    .insert(clients)
    .values({ name, slug, logoUrl: logoUrl || null, website: website || null, active: active ?? true, order: (m ?? -1) + 1 })
    .returning();
  return NextResponse.json(client);
}
