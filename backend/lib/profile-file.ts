import { stat } from "fs/promises";
import path from "path";
import { DATA_DIR } from "@/lib/data-dir";

export const PROFILE_DIR = path.join(DATA_DIR, "profile");
export const CUSTOM_PROFILE = path.join(PROFILE_DIR, "ARFAD-Company-Profile.pdf");
export const DEFAULT_PROFILE = path.join(process.cwd(), "public", "files", "ARFAD-Company-Profile.pdf");
export const PROFILE_MAX_BYTES = 100 * 1024 * 1024;

export async function profileInfo() {
  try {
    const s = await stat(CUSTOM_PROFILE);
    return { custom: true, size: s.size, updatedAt: s.mtime.toISOString() };
  } catch {
    try {
      const s = await stat(DEFAULT_PROFILE);
      return { custom: false, size: s.size, updatedAt: s.mtime.toISOString() };
    } catch {
      return { custom: false, size: 0, updatedAt: null as string | null };
    }
  }
}
