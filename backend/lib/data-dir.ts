import path from "path";

// Where runtime data lives (database, uploads, CVs, company profile). Point
// DATA_DIR at a folder OUTSIDE the deployed app (for example
// /home/<user>/arfad-data) so redeploys never erase it.
export const DATA_DIR_CONFIGURED = Boolean(process.env.DATA_DIR);
export const DATA_DIR = process.env.DATA_DIR
  ? path.resolve(process.env.DATA_DIR)
  : path.join(process.cwd(), "data");
