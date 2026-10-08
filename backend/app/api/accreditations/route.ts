import { NextResponse } from "next/server";
import { asc, eq } from "drizzle-orm";
import { db } from "@/db/client";
import { accreditations } from "@/db/schema";

export const dynamic = "force-dynamic";

export async function GET() {
  const rows = await db.select().from(accreditations).where(eq(accreditations.active, true)).orderBy(asc(accreditations.order)).all();
  return NextResponse.json(
    { items: rows.map((a) => ({ name: a.name, logo: a.logoUrl, light: a.light })) },
    { headers: { "Cache-Control": "public, max-age=60, stale-while-revalidate=300" } }
  );
}
