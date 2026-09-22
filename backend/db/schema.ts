// Drizzle ORM schema for the ARFAD content admin.
//
// This targets SQLite (via better-sqlite3) so the app runs with zero
// external setup — no database server, no network calls at install time.
// better-sqlite3 compiles from source on `npm install`, which works fully
// offline/behind restrictive network policies (unlike some ORMs that fetch
// prebuilt native binaries from their own CDN at install time).
//
// To move to Postgres for production (e.g. on Vercel + Neon/Supabase):
// swap the `drizzle-orm/better-sqlite3` + `sqlite-core` imports below for
// `drizzle-orm/node-postgres` + `pg-core`, adjust column types (text ids
// stay the same, `integer({ mode: "boolean" })` becomes `boolean()`,
// `integer({ mode: "timestamp" })` becomes `timestamp()`), and point
// db/client.ts at a `pg.Pool` instead of a sqlite file. The rest of the
// app (every db.* query) does not need to change.

import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { randomUUID } from "crypto";

const id = () =>
  text("id")
    .primaryKey()
    .$defaultFn(() => randomUUID());

export const users = sqliteTable("users", {
  id: id(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: text("role", { enum: ["ADMIN", "EDITOR"] })
    .notNull()
    .default("EDITOR"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

export const settings = sqliteTable("settings", {
  id: id(),
  section: text("section").notNull(),
  key: text("key").notNull(),
  label: text("label").notNull(),
  value: text("value").notNull(),
  type: text("type").notNull().default("text"),
});

export const services = sqliteTable("services", {
  id: id(),
  order: integer("order").notNull().default(0),
  anchor: text("anchor").notNull().unique(),
  title: text("title").notNull(),
  summary: text("summary").notNull(),
  image: text("image"),
  features: text("features").notNull().default("[]"), // JSON-encoded string[]
  published: integer("published", { mode: "boolean" }).notNull().default(true),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

export const projects = sqliteTable("projects", {
  id: id(),
  order: integer("order").notNull().default(0),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  client: text("client").notNull(),
  location: text("location").notNull(),
  scope: text("scope").notNull(),
  description: text("description").notNull(),
  vendorNo: text("vendor_no"),
  featured: integer("featured", { mode: "boolean" }).notNull().default(false),
  images: text("images").notNull().default("[]"), // JSON-encoded string[]
  published: integer("published", { mode: "boolean" }).notNull().default(true),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

export const mediaAssets = sqliteTable("media_assets", {
  id: id(),
  url: text("url").notNull(),
  filename: text("filename").notNull(),
  folder: text("folder").notNull().default("uploads"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

export const certificates = sqliteTable("certificates", {
  id: id(),
  order: integer("order").notNull().default(0),
  title: text("title").notNull(),
  number: text("number"),
  image: text("image").notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});
