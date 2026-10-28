import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { siteBlocks } from "@/db/schema";

export type Branding = { headerLogo: string | null; footerLogo: string | null };

const KEY = "branding";

function safe(v: unknown): string | null {
  if (typeof v !== "string") return null;
  const u = v.trim();
  if (!u || u.length > 500) return null;
  if (!(u.startsWith("/") || /^https?:\/\//i.test(u))) return null;
  return u;
}

export function cleanBranding(raw: unknown): Branding {
  const o = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  return { headerLogo: safe(o.headerLogo), footerLogo: safe(o.footerLogo) };
}

export async function getBranding(): Promise<Branding> {
  const row = await db.select().from(siteBlocks).where(eq(siteBlocks.key, KEY)).get();
  try {
    return cleanBranding(row ? JSON.parse(row.value) : null);
  } catch {
    return { headerLogo: null, footerLogo: null };
  }
}

export async function saveBranding(raw: unknown): Promise<Branding> {
  const b = cleanBranding(raw);
  const value = JSON.stringify(b);
  await db
    .insert(siteBlocks)
    .values({ key: KEY, value })
    .onConflictDoUpdate({ target: siteBlocks.key, set: { value, updatedAt: new Date() } })
    .run();
  return b;
}
