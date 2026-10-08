import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { posts } from "@/db/schema";
import { slugify } from "@/lib/slugify";

export const CATEGORIES = ["events", "exhibitions", "news"] as const;

export const postFields = {
  title: z.string().trim().min(1).max(160),
  category: z.enum(CATEGORIES),
  excerpt: z.string().trim().min(1).max(400),
  body: z.string().trim().min(1).max(20000),
  coverUrl: z
    .string()
    .trim()
    .max(500)
    .refine((v) => v.startsWith("/") || /^https?:\/\//i.test(v), "Cover must be a path or http(s) URL")
    .nullish(),
  publishedAt: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD")
    .refine((v) => new Date(v + "T00:00:00Z").toISOString().slice(0, 10) === v, "Invalid date"),
  published: z.boolean(),
  slug: z
    .string()
    .trim()
    .min(1)
    .max(120)
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Slug must be lowercase kebab-case"),
};

export async function uniqueSlug(base: string, exceptId?: string) {
  const root = slugify(base).slice(0, 110) || "post";
  for (let n = 1; ; n++) {
    const slug = n === 1 ? root : `${root}-${n}`;
    if (slug === "admin") continue;
    const hit = await db.select({ id: posts.id }).from(posts).where(eq(posts.slug, slug)).get();
    if (!hit || hit.id === exceptId) return slug;
  }
}
