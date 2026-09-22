import { createClient, type Client } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";
import path from "path";

const dbPath = (process.env.DATABASE_URL || "file:./dev.db").replace(/^file:/, "");
const resolvedPath = path.isAbsolute(dbPath) ? dbPath : path.join(process.cwd(), dbPath);

const globalForDb = globalThis as unknown as { sqlite?: Client };

const sqlite = globalForDb.sqlite ?? createClient({ url: `file:${resolvedPath}` });
sqlite.execute("PRAGMA foreign_keys = ON").catch(() => {});

if (process.env.NODE_ENV !== "production") globalForDb.sqlite = sqlite;

export const db = drizzle(sqlite, { schema });
