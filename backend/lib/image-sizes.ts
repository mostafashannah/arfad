// Recommended upload sizes, taken from how the website crops each picture. Shown next to every upload in the admin.
export const SIZE_HINTS = {
  hero: "Page header picture: 1920 × 1080 px (16:9, landscape), JPG or WebP, under 500 KB if possible. Keep the subject in the middle, because the edges are cropped on phones. Header video: MP4 (H.264), 1920 × 1080, 10–20 seconds, no sound, under 40 MB.",
  homeHero: "Home slider picture: 1920 × 1080 px (16:9), JPG or WebP. Video: MP4 (H.264), 1920 × 1080, 10–20 seconds, no sound, under 40 MB. Keep the subject in the middle.",
  split: "Picture beside the text: 1600 × 1100 px (about 16:11, landscape), JPG or WebP.",
  card: "Project / service card picture: 1200 × 900 px (4:3) or 1200 × 750 px (16:10), landscape, JPG or WebP.",
  thumb: "Service card thumbnail: 1000 × 600 px (landscape), JPG or WebP. It is shown about 150 px tall and cropped from the middle.",
  machine: "Machine photo: 1200 × 900 px (4:3), JPG or WebP.",
  band: "Wide background band: 2000 × 1000 px or larger, landscape, JPG or WebP. It is darkened behind the text.",
  cover: "Post cover: 1600 × 1000 px (16:10), JPG or WebP.",
  logoHeader: "Header logo: PNG with a transparent background, about 600 × 160 px (wide), displayed 54 px tall.",
  logoFooter: "Footer logo: PNG with a transparent background, at least 900 px wide, in the wide format (mark and lettering side by side). A logo on a white background is cleaned automatically.",
  logoSquare: "Logo: PNG or SVG with a transparent background, about 600 × 300 px (wide) or 400 × 400 px (square). It is shown small on a light or dark tile.",
  certificate: "Certificate file: PDF (up to 25 MB), or a JPG/PNG of the document. Logo: PNG with a transparent background, about 300 × 150 px.",
  generic: "Recommended: 1600 × 1000 px (landscape), JPG or WebP, under 500 KB.",
} as const;

/** Pick a hint for a picture in the page editor from the CSS classes the catalog recorded for it. */
export function hintForClasses(cls?: string): string {
  const c = ` ${cls ?? ""} `;
  if (c.includes(" split-img ")) return SIZE_HINTS.split;
  if (c.includes(" gallery-card ")) return SIZE_HINTS.card;
  if (c.includes(" thumb ")) return SIZE_HINTS.thumb;
  if (c.includes(" machine-img ")) return SIZE_HINTS.machine;
  if (c.includes(" photo-band ") || c.includes(" pb-img ")) return SIZE_HINTS.band;
  if (c.includes(" post-cover ") || c.includes(" post-article-cover ")) return SIZE_HINTS.cover;
  if (c.includes(" feature-card ")) return SIZE_HINTS.card;
  return SIZE_HINTS.generic;
}
