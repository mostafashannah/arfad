import { randomUUID } from "crypto";
import { asc, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db/client";
import { navItems, siteBlocks } from "@/db/schema";
import defaults from "@/db/site-defaults.json";

export const DEFAULT_FOOTER = defaults.footer as FooterDoc;

const href = z
  .string()
  .trim()
  .min(1, "Link is required")
  .max(300)
  .refine((v) => !/^(javascript|data|vbscript):/i.test(v.replace(/[\u0000- ]/g, "")), "That link type is not allowed");
const label = z.string().trim().min(1, "Label is required").max(60);
const text = (max: number) => z.string().trim().min(1, "This field is required").max(max);
const link = z.object({ label, href });

export const navSchema = z.object({
  items: z
    .array(
      z.object({
        label,
        href,
        active: z.boolean().default(true),
        children: z.array(z.object({ label, href, active: z.boolean().default(true) })).max(30).default([]),
      })
    )
    .max(20),
});

const brand = {
  title: text(120),
  arabicName: text(120),
  tagline: text(300),
  downloadLabel: text(60),
  badges: z.array(text(60)).max(10),
};
const contact = {
  title: text(60),
  addressLines: z.array(text(200)).max(6),
  phone: text(40),
  mobile: text(40),
  mobileWhatsApp: z.string().trim().regex(/^\d{6,20}$/, "WhatsApp number must be digits only"),
  email: text(120),
  credentialsTitle: text(60),
  credentials: z.array(text(200)).max(10),
};
const columns = z.array(z.object({ title: text(60), links: z.array(link).max(30) })).max(6);
const bottom = { left: text(200), right: text(200) };

export const footerSchema = z.object({
  brand: z.object(brand),
  columns,
  contact: z.object(contact),
  accreditedLabel: text(60),
  bottom: z.object(bottom),
});
export type FooterDoc = z.infer<typeof footerSchema>;

function pick<T>(schema: z.ZodType<T>, value: unknown, fallback: T): T {
  const r = schema.safeParse(value);
  return r.success ? r.data : fallback;
}

function group<S extends z.ZodRawShape>(shape: S, raw: unknown, fallback: z.infer<z.ZodObject<S>>) {
  const o = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  return Object.fromEntries(
    Object.entries(shape).map(([k, s]) => [k, pick(s as z.ZodType, o[k], (fallback as Record<string, unknown>)[k])])
  ) as z.infer<z.ZodObject<S>>;
}

export function mergeFooter(raw: unknown): FooterDoc {
  const o = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const d = DEFAULT_FOOTER;
  return {
    brand: group(brand, o.brand, d.brand),
    columns: pick(columns, o.columns, d.columns),
    contact: group(contact, o.contact, d.contact),
    accreditedLabel: pick(footerSchema.shape.accreditedLabel, o.accreditedLabel, d.accreditedLabel),
    bottom: group(bottom, o.bottom, d.bottom),
  };
}

export async function getFooter(): Promise<FooterDoc> {
  const row = await db.select().from(siteBlocks).where(eq(siteBlocks.key, "footer")).get();
  let raw: unknown = null;
  try {
    raw = row ? JSON.parse(row.value) : null;
  } catch {}
  return mergeFooter(raw);
}

export async function saveFooter(doc: FooterDoc) {
  const value = JSON.stringify(doc);
  await db
    .insert(siteBlocks)
    .values({ key: "footer", value })
    .onConflictDoUpdate({ target: siteBlocks.key, set: { value, updatedAt: new Date() } })
    .run();
}

export const resetFooter = () => saveFooter(DEFAULT_FOOTER);

type NavInput = z.infer<typeof navSchema>["items"];

export async function saveNav(items: NavInput) {
  await db.transaction(async (tx) => {
    await tx.delete(navItems).run();
    for (const [i, item] of items.entries()) {
      const id = randomUUID();
      await tx.insert(navItems).values({ id, parentId: null, label: item.label, href: item.href, order: i, active: item.active }).run();
      for (const [j, c] of item.children.entries()) {
        await tx.insert(navItems).values({ parentId: id, label: c.label, href: c.href, order: j, active: c.active }).run();
      }
    }
  });
}

export const resetNav = () =>
  saveNav(defaults.nav.map((n) => ({ ...n, active: n.active !== false, children: n.children.map((c) => ({ ...c, active: true })) })));

export async function getNavTree() {
  const rows = await db.select().from(navItems).orderBy(asc(navItems.order)).all();
  return rows
    .filter((r) => !r.parentId)
    .map((r) => ({
      id: r.id,
      label: r.label,
      href: r.href,
      active: r.active,
      children: rows
        .filter((c) => c.parentId === r.id)
        .map((c) => ({ id: c.id, label: c.label, href: c.href, active: c.active })),
    }));
}
