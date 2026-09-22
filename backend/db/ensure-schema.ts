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
];

let ensured: Promise<void> | null = null;

export function ensureSchema(): Promise<void> {
  if (!ensured) {
    ensured = (async () => {
      for (const sql of STATEMENTS) {
        await sqlite.execute(sql);
      }
    })();
  }
  return ensured;
}
