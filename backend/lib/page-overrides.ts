import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { siteBlocks } from "@/db/schema";
import catalogJson from "@/db/page-catalog.json";

export type CatalogItem = {
  key: string;
  kind: "text" | "image" | "hero" | "link";
  tag: string;
  group: string;
  text?: string;
  url?: string;
  images?: string[];
};
export type CatalogPage = { title: string; items: CatalogItem[] };
export type Overrides = Record<string, string | string[]>;

// Written by frontend/build.py: every editable text, image and page header of every page.
export const CATALOG = catalogJson as unknown as Record<string, CatalogPage>;

export const isPage = (page: string) => Object.prototype.hasOwnProperty.call(CATALOG, page);

const blockKey = (page: string) => `page:${page}`;

const norm = (u: string) => (/^(https?:)?\/\//.test(u) || u.startsWith("/") ? u : `/${u}`);

function safeUrl(v: unknown): string | null {
  if (typeof v !== "string") return null;
  const u = v.trim();
  if (!u || u.length > 600) return null;
  if (/^(javascript|data|vbscript):/i.test(u.replace(/[\u0000- ]/g, ""))) return null;
  return u;
}

function safeLink(v: unknown): string | null {
  if (typeof v !== "string") return null;
  const u = v.trim();
  if (!u || u.length > 300) return null;
  if (/^(javascript|data|vbscript):/i.test(u.replace(/[\u0000-\u0020]/g, ""))) return null;
  return u;
}

/** Keeps only values that match a real item of the page, with the right type and a safe shape. */
export function sanitize(page: string, raw: unknown): Overrides {
  const out: Overrides = {};
  if (!isPage(page) || !raw || typeof raw !== "object") return out;
  const src = raw as Record<string, unknown>;
  for (const item of CATALOG[page].items) {
    const v = src[item.key];
    if (v == null) continue;
    if (item.kind === "text") {
      if (typeof v === "string" && v.trim() && v.length <= 2000 && v.trim() !== (item.text ?? "")) out[item.key] = v.trim();
    } else if (item.kind === "link") {
      const u = safeLink(v);
      if (u && u !== (item.url ?? "")) out[item.key] = u;
    } else if (item.kind === "image") {
      const u = safeUrl(v);
      if (u && norm(u) !== norm(item.url ?? "")) out[item.key] = u;
    } else if (Array.isArray(v)) {
      const urls = v.map(safeUrl).filter((x): x is string => !!x).slice(0, 12);
      if (urls.length && JSON.stringify(urls.map(norm)) !== JSON.stringify((item.images ?? []).map(norm))) out[item.key] = urls;
    }
  }
  return out;
}

export async function getOverrides(page: string): Promise<Overrides> {
  if (!isPage(page)) return {};
  const row = await db.select().from(siteBlocks).where(eq(siteBlocks.key, blockKey(page))).get();
  if (!row) return {};
  try {
    return sanitize(page, JSON.parse(row.value));
  } catch {
    return {};
  }
}

export async function saveOverrides(page: string, raw: unknown): Promise<Overrides> {
  const clean = sanitize(page, raw);
  if (Object.keys(clean).length === 0) {
    await db.delete(siteBlocks).where(eq(siteBlocks.key, blockKey(page))).run();
    return clean;
  }
  const value = JSON.stringify(clean);
  await db
    .insert(siteBlocks)
    .values({ key: blockKey(page), value })
    .onConflictDoUpdate({ target: siteBlocks.key, set: { value, updatedAt: new Date() } })
    .run();
  return clean;
}

export async function countEdited(): Promise<Record<string, number>> {
  const rows = await db.select().from(siteBlocks).all();
  const out: Record<string, number> = {};
  for (const r of rows) {
    if (!r.key.startsWith("page:")) continue;
    const page = r.key.slice(5);
    try {
      out[page] = Object.keys(sanitize(page, JSON.parse(r.value))).length;
    } catch {}
  }
  return out;
}
