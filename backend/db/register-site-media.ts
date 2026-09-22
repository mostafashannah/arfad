import fs from "fs";
import path from "path";
import { db } from "./client";
import { mediaAssets } from "./schema";
import { eq } from "drizzle-orm";

// Registers every image already shipped in public/img/ (the site's own
// photography — hero, projects, certs, machine photos, etc.) as a Media
// Library asset, so the admin's Media page shows everything the public
// site actually uses, not just images uploaded through the admin later.
// Idempotent: skipped for any url already present as a row.

const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg"]);

function walk(dir: string, base: string): string[] {
  let out: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out = out.concat(walk(full, base));
    } else if (IMAGE_EXT.has(path.extname(entry.name).toLowerCase())) {
      out.push(path.relative(base, full));
    }
  }
  return out;
}

export async function registerSiteMedia() {
  const imgDir = path.join(process.cwd(), "public", "img");
  if (!fs.existsSync(imgDir)) return;

  const files = walk(imgDir, path.join(process.cwd(), "public"));
  for (const rel of files) {
    const url = "/" + rel.split(path.sep).join("/");
    const existing = await db.select().from(mediaAssets).where(eq(mediaAssets.url, url)).get();
    if (existing) continue;

    const filename = path.basename(rel);
    const dir = path.dirname(rel); // "img", "img/certs", "img/projects"
    const folder = dir === "img" ? "site" : dir.split(path.sep).slice(1).join("/");

    await db.insert(mediaAssets).values({ url, filename, folder }).run();
  }
}

if (require.main === module) {
  registerSiteMedia()
    .then(() => {
      console.log("Registered site images into the media library.");
      process.exit(0);
    })
    .catch((e) => {
      console.error(e);
      process.exit(1);
    });
}
