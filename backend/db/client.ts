import { createClient, type Client } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";
import path from "path";
import { mkdirSync } from "fs";
import { DATA_DIR, DATA_DIR_CONFIGURED } from "@/lib/data-dir";

const envUrl = (process.env.DATABASE_URL || "").replace(/^file:/, "");
// With DATA_DIR set, the database lives there unless DATABASE_URL is an absolute path.
const resolvedPath = DATA_DIR_CONFIGURED && !path.isAbsolute(envUrl)
  ? path.join(DATA_DIR, "arfad.db")
  : path.isAbsolute(envUrl || "./dev.db")
    ? envUrl
    : path.join(process.cwd(), envUrl || "./dev.db");

mkdirSync(path.dirname(resolvedPath), { recursive: true });

const globalForDb = globalThis as unknown as { sqlite?: Client };

export const sqlite = globalForDb.sqlite ?? createClient({ url: `file:${resolvedPath}` });
sqlite.execute("PRAGMA foreign_keys = ON").catch(() => {});

if (process.env.NODE_ENV !== "production") globalForDb.sqlite = sqlite;

export const db = drizzle(sqlite, { schema });
