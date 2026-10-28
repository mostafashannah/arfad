import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { siteBlocks } from "@/db/schema";
import defaults from "@/db/site-defaults.json";

export type CertItem = { title: string; sub: string; file: string; logo: string; group: string };
export type CertTab = { id: string; label: string; heading: string; lede: string; items: CertItem[] };
export type Certificates = { tabs: CertTab[] };

const KEY = "certificates";

const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const url = (v: unknown) => {
  const u = str(v, 500);
  return u.startsWith("/") || /^https?:\/\//i.test(u) ? u : "";
};

export function cleanCertificates(raw: unknown): Certificates {
  const tabsIn = Array.isArray((raw as { tabs?: unknown })?.tabs) ? ((raw as { tabs: unknown[] }).tabs) : [];
  const used = new Set<string>();
  const tabs: CertTab[] = [];
  for (const t of tabsIn.slice(0, 20)) {
    const o = (t && typeof t === "object" ? t : {}) as Record<string, unknown>;
    const label = str(o.label, 60);
    if (!label) continue;
    let id = str(o.id, 40).toLowerCase().replace(/[^a-z0-9-]/g, "") || label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "tab";
    while (used.has(id)) id += "-x";
    used.add(id);
    const itemsIn = Array.isArray(o.items) ? o.items : [];
    const items: CertItem[] = [];
    for (const i of itemsIn.slice(0, 300)) {
      const p = (i && typeof i === "object" ? i : {}) as Record<string, unknown>;
      const title = str(p.title, 200);
      if (!title) continue;
      items.push({ title, sub: str(p.sub, 300), file: url(p.file), logo: url(p.logo), group: str(p.group, 80) });
    }
    tabs.push({ id, label, heading: str(o.heading, 200), lede: str(o.lede, 800), items });
  }
  return { tabs };
}

export function defaultCertificates(): Certificates {
  return cleanCertificates((defaults as { certificates?: unknown }).certificates);
}

/** The admin's saved list, or null while the built-in certificates are still in use. */
export async function getSavedCertificates(): Promise<Certificates | null> {
  const row = await db.select().from(siteBlocks).where(eq(siteBlocks.key, KEY)).get();
  if (!row) return null;
  try {
    return cleanCertificates(JSON.parse(row.value));
  } catch {
    return null;
  }
}

export async function saveCertificates(raw: unknown): Promise<Certificates> {
  const c = cleanCertificates(raw);
  const value = JSON.stringify(c);
  await db
    .insert(siteBlocks)
    .values({ key: KEY, value })
    .onConflictDoUpdate({ target: siteBlocks.key, set: { value, updatedAt: new Date() } })
    .run();
  return c;
}

export async function resetCertificates() {
  await db.delete(siteBlocks).where(eq(siteBlocks.key, KEY)).run();
}
