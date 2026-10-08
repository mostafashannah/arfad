import { sqlite } from "./client";

// TEMPORARY PREVIEW BOOTSTRAP — creates the SQLite schema automatically on
// server startup (via instrumentation.ts) so the app works with zero setup
// (no SSH, no `drizzle-kit push`) while previewing on a host like Hostinger.
// Safe to run on every boot: every statement is idempotent (IF NOT EXISTS).
// Once the site is real, prefer running `npm run db:push` deliberately and
// remove this file + its call in instrumentation.ts.

const STATEMENTS = [
  `CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'EDITOR',
    created_at INTEGER NOT NULL DEFAULT (unixepoch())
  )`,
  `CREATE TABLE IF NOT EXISTS settings (
    id TEXT PRIMARY KEY NOT NULL,
    section TEXT NOT NULL,
    key TEXT NOT NULL,
    label TEXT NOT NULL,
    value TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'text'
  )`,
  `CREATE TABLE IF NOT EXISTS services (
    id TEXT PRIMARY KEY NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    anchor TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    summary TEXT NOT NULL,
    image TEXT,
    features TEXT NOT NULL DEFAULT '[]',
    published INTEGER NOT NULL DEFAULT 1,
    updated_at INTEGER NOT NULL DEFAULT (unixepoch())
  )`,
  `CREATE TABLE IF NOT EXISTS projects (
    id TEXT PRIMARY KEY NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    client TEXT NOT NULL,
    location TEXT NOT NULL,
    scope TEXT NOT NULL,
    description TEXT NOT NULL,
    vendor_no TEXT,
    featured INTEGER NOT NULL DEFAULT 0,
    images TEXT NOT NULL DEFAULT '[]',
    published INTEGER NOT NULL DEFAULT 1,
    updated_at INTEGER NOT NULL DEFAULT (unixepoch())
  )`,
  `CREATE TABLE IF NOT EXISTS media_assets (
    id TEXT PRIMARY KEY NOT NULL,
    url TEXT NOT NULL,
    filename TEXT NOT NULL,
    folder TEXT NOT NULL DEFAULT 'uploads',
    created_at INTEGER NOT NULL DEFAULT (unixepoch())
  )`,
  `CREATE TABLE IF NOT EXISTS certificates (
    id TEXT PRIMARY KEY NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    title TEXT NOT NULL,
    number TEXT,
    image TEXT NOT NULL,
    updated_at INTEGER NOT NULL DEFAULT (unixepoch())
  )`,
  `CREATE TABLE IF NOT EXISTS page_views (
    id TEXT PRIMARY KEY NOT NULL,
    path TEXT NOT NULL,
    country TEXT,
    referrer TEXT,
    created_at INTEGER NOT NULL DEFAULT (unixepoch())
  )`,
  `CREATE INDEX IF NOT EXISTS page_views_created_at_idx ON page_views (created_at)`,
  `CREATE INDEX IF NOT EXISTS page_views_path_idx ON page_views (path)`,
  `CREATE TABLE IF NOT EXISTS enquiries (
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    subject TEXT,
    enquiry_type TEXT,
    message TEXT NOT NULL,
    page TEXT,
    ip TEXT,
    email_status TEXT NOT NULL DEFAULT 'pending',
    email_error TEXT,
    created_at INTEGER NOT NULL DEFAULT (unixepoch())
  )`,
  `CREATE TABLE IF NOT EXISTS clients (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    logo_url TEXT,
    website TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    active INTEGER NOT NULL DEFAULT 1,
    created_at INTEGER NOT NULL DEFAULT (unixepoch())
  )`,
  `CREATE TABLE IF NOT EXISTS accreditations (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    logo_url TEXT NOT NULL,
    light INTEGER NOT NULL DEFAULT 0,
    "order" INTEGER NOT NULL DEFAULT 0,
    active INTEGER NOT NULL DEFAULT 1,
    created_at INTEGER NOT NULL DEFAULT (unixepoch())
  )`,
  `CREATE TABLE IF NOT EXISTS posts (
    id TEXT PRIMARY KEY NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    excerpt TEXT NOT NULL,
    body TEXT NOT NULL,
    cover_url TEXT,
    published_at TEXT NOT NULL,
    published INTEGER NOT NULL DEFAULT 1,
    created_at INTEGER NOT NULL DEFAULT (unixepoch()),
    updated_at INTEGER NOT NULL DEFAULT (unixepoch())
  )`,
  `CREATE TABLE IF NOT EXISTS nav_items (
    id TEXT PRIMARY KEY NOT NULL,
    parent_id TEXT,
    label TEXT NOT NULL,
    href TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    active INTEGER NOT NULL DEFAULT 1
  )`,
  `CREATE TABLE IF NOT EXISTS site_blocks (
    key TEXT PRIMARY KEY NOT NULL,
    value TEXT NOT NULL,
    updated_at INTEGER NOT NULL DEFAULT (unixepoch())
  )`,
];

let ensured: Promise<void> | null = null;

export function ensureSchema(): Promise<void> {
  if (!ensured) {
    ensured = (async () => {
      for (const sql of STATEMENTS) {
        await sqlite.execute(sql);
      }
      const cols = await sqlite.execute(`PRAGMA table_info(enquiries)`);
      const have = new Set(cols.rows.map((r) => String(r.name)));
      if (!have.has("cv_name")) await sqlite.execute(`ALTER TABLE enquiries ADD COLUMN cv_name TEXT`);
      if (!have.has("cv_file")) await sqlite.execute(`ALTER TABLE enquiries ADD COLUMN cv_file TEXT`);
    })();
  }
  return ensured;
}
