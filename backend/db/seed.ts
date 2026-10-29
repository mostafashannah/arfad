import "dotenv/config";
import bcrypt from "bcryptjs";
import { db } from "./client";
import { existsSync, readdirSync, statSync } from "fs";
import path from "path";
import { users, services, projects, settings, clients, vendors, accreditations, navItems, siteBlocks, posts, mediaAssets } from "./schema";
import { eq, and, like } from "drizzle-orm";
import { slugify } from "../lib/slugify";
import defaults from "./site-defaults.json";
import { getFooter, getNavTree, resetFooter, resetNav, saveFooter, saveNav } from "../lib/site-content";

const servicesData = [
  { anchor: "doors", title: "Wooden Doors", summary: "Engineered doors from fire-rated to X-ray protected, built to full specification.", image: "/img/mod-doors-teaser.jpg", features: ["Wooden Internal Doors", "Wooden External Doors", "Fire-Rated Doors", "Flush Doors"] },
  { anchor: "joinery", title: "Joinery", summary: "Custom joints, timber framing and architectural fit-outs, built to spec.", image: "/img/svc-joinery.jpg", features: ["Reception Counters", "Feature Panels", "Hotel Joinery", "Restaurant Joinery"] },
  { anchor: "cabinets", title: "Interior Woodworks", summary: "Complete interior solutions, cabinets, wardrobes, staircases and handrails.", image: "/img/svc-interior-woodwork.jpg", features: ["Wooden Partitions", "Decorative Wood Screens", "Wooden Skirting", "Wooden Staircases"] },
  { anchor: "cladding", title: "Cladding & Ceilings", summary: "Architectural wall cladding and ceilings, from decorative to slatted finishes.", image: "/img/svc-cladding.jpg", features: ["Internal Wooden Wall Cladding", "External Wooden Cladding", "Thermowood Exterior Cladding", "Decorative Wooden Panels"] },
  { anchor: "thermowood", title: "Thermowood", summary: "Heat-treated timber cladding, decking and pergolas for lasting exterior use.", image: "/img/svc-thermowood.jpg", features: ["Thermowood Exterior Cladding", "Thermowood Decking", "Pergolas", "Architectural Louvers"] },
  { anchor: "furniture", title: "Furniture & Interiors", summary: "Custom furniture for hotels, restaurants, offices and residential interiors.", image: "/img/svc-furniture.jpg", features: ["Loose Furniture", "Hotel Furniture", "Restaurant Furniture", "Office Furniture"] },
  { anchor: "countertops", title: "Countertops & Surfaces", summary: "In-house fabricated natural stone, quartz and engineered stone surfaces.", image: "/img/svc-countertops-reception.jpg", features: ["Natural Stone Countertops", "Engineered Stone Countertops", "Quartz Countertops", "Kitchen Countertops"] },
  { anchor: "traditional", title: "Traditional Woodworks", summary: "Hand-carved panels, mashrabiya screens and heritage Islamic craftsmanship.", image: "/img/svc-traditional.jpg", features: ["Hand-Carved Decorative Panels", "Geometric Mashrabiya Screens", "Islamic-Patterned Wooden Doors", "Traditional Wooden Screens"] },
  { anchor: "wpc", title: "WPC Works", summary: "Wood-look composite decking and cladding built for weather resistance.", image: "/img/svc-wpc.jpg", features: ["WPC Decking", "Exterior Wall Cladding", "Façade Applications", "Pergolas"] },
];

const projectsData = [
  { slug: "royal-commission", title: "Royal Commission for Jubail & Yanbu Projects", client: "Royal Commission for Jubail & Yanbu", location: "Al Jubail", scope: "Phase C71, Apartment Buildings; Phase C13, Housing; Phase C08 / C09, Housing; Phase C03, Housing; Phase C16, Family Apar", description: "Supply, installation and joinery works across apartment buildings, family apartments, housing phases and schools in Jubail.", vendorNo: "14902", featured: true, images: ["/img/projects/royal-commission-1.jpg"] },
  { slug: "saudi-aramco", title: "Saudi Aramco Projects", client: "Saudi Aramco", location: "Jubail, Dhahran, Ras Al Khair", scope: "Al Mutrafiah Home Ownership Housing, Increment 1; Al Mutrafiah Home Ownership Housing, Increment 2; South Dhahran Housin", description: "Housing, maritime complex and mosque woodworks delivered for Saudi Aramco.", vendorNo: "10064085", featured: true, images: ["/img/projects/saudi-aramco-1.jpg"] },
  { slug: "redsea-amaala", title: "The Red Sea Global & AMAALA Projects", client: "Red Sea Global & AMAALA", location: "AMAALA, Triple Bay, NEOM", scope: "AMAALA Staff Village, Package 1; Staff Village, Zones 1, 2 & 7; Six Senses Resort, Triple Bay; Southern Dunes Hotel; Sec", description: "Staff villages, luxury resorts and hotel developments across AMAALA and the Red Sea, with a total of 4,758+ doors installed.", vendorNo: "S10357393", featured: true, images: ["/img/projects/redsea-amaala-1.jpg", "/img/projects/redsea-amaala-2.jpg", "/img/projects/redsea-amaala-3.jpg", "/img/projects/redsea-amaala-4.jpg", "/img/projects/redsea-amaala-5.jpg", "/img/projects/redsea-amaala-6.jpg", "/img/projects/redsea-amaala-7.jpg", "/img/projects/redsea-amaala-8.jpg", "/img/projects/redsea-amaala-9.jpg", "/img/projects/redsea-amaala-10.jpg"] },
  { slug: "neom", title: "NEOM Projects", client: "NEOM (BECo)", location: "NEOM", scope: "Multipurpose Hall; Auditorium; VIP Lounge", description: "Multipurpose hall, auditorium and VIP lounge woodworks delivered at NEOM.", featured: true, images: ["/img/projects/neom-1.jpg", "/img/projects/neom-2.jpg", "/img/projects/neom-3.jpg", "/img/projects/neom-4.jpg", "/img/projects/neom-5.jpg", "/img/projects/neom-6.jpg"] },
  { slug: "movenpick", title: "Movenpick 5-Star Hotel, Wa'ad Al Shamal", client: "Movenpick", location: "Wa'ad Al Shamal", scope: "Supply and installation of 850 wooden doors, kitchen cabinets, and 4,850 m² wooden wall cl", description: "Supply and installation of 850 wooden doors, kitchen cabinets, and 4,850 m² wooden wall cladding.", featured: false, images: ["/img/projects/movenpick-1.jpg", "/img/projects/movenpick-2.jpg", "/img/projects/movenpick-3.jpg"] },
  { slug: "karan", title: "KARAN 5-Star Hotel, Al Jubail", client: "KARAN Group", location: "Al Jubail", scope: "Interior wood cladding for restaurants and function rooms, with wooden doors throughout th", description: "Interior wood cladding for restaurants and function rooms, with wooden doors throughout the hotel.", featured: false, images: ["/img/projects/karan-1.jpg", "/img/projects/karan-2.jpg", "/img/projects/karan-3.jpg"] },
  { slug: "misk", title: "MISK School Phase 1 & 2, Riyadh", client: "MISK Foundation (Baytur)", location: "Riyadh", scope: "Supply and installation of 1,500 wooden doors, 2,000 m² of wooden wall cladding, and 700 m", description: "Supply and installation of 1,500 wooden doors, 2,000 m² of wooden wall cladding, and 700 m² of wooden ceiling works.", featured: false, images: ["/img/projects/misk-1.jpg", "/img/projects/misk-2.jpg", "/img/projects/misk-3.jpg"] },
  { slug: "kafd", title: "KAFD, King Abdullah Financial District, Riyadh", client: "KAFD", location: "Riyadh", scope: "Premium woodworks and joinery works throughout one of Riyadh's key financial district deve", description: "Premium woodworks and joinery works throughout one of Riyadh's key financial district developments.", featured: true, images: ["/img/projects/kafd-1.jpg", "/img/projects/kafd-2.jpg", "/img/projects/kafd-3.jpg"] },
  { slug: "ministry-of-defense", title: "Ministry of Defense Supporting Buildings, Al Qassim", client: "Ministry of Defense", location: "Al Qassim", scope: "Supply and installation of wooden doors for 100 flats, 1,500 m² of wall cladding, 250 m² o", description: "Supply and installation of wooden doors for 100 flats, 1,500 m² of wall cladding, 250 m² of ceiling works, and related woodworks.", featured: true, images: ["/img/projects/ministry-of-defense-1.jpg", "/img/projects/ministry-of-defense-2.jpg", "/img/projects/ministry-of-defense-3.jpg"] },
  { slug: "marafiq", title: "MARAFIQ New Head Office, Al Jubail", client: "MARAFIQ", location: "Al Jubail", scope: "Complete office joinery and woodworks for MARAFIQ headquarters.", description: "Complete office joinery and woodworks for MARAFIQ headquarters.", featured: false, images: ["/img/projects/marafiq-1.jpg", "/img/projects/marafiq-2.jpg", "/img/projects/marafiq-3.jpg"] },
  { slug: "el-eissa", title: "Al Eissa Compound Project, ZAC", client: "Al Eissa Compound", location: "", scope: "Supply and installation of external doors, internal doors, roof canopies, and shade pavili", description: "Supply and installation of external doors, internal doors, roof canopies, and shade pavilions.", featured: false, images: ["/img/projects/el-eissa-1.jpg", "/img/projects/el-eissa-2.jpg", "/img/projects/el-eissa-3.jpg"] },
  { slug: "primer-steak-house", title: "PRIMER Steak House & Lounge, Riyadh", client: "PRIMER Steak House", location: "Riyadh", scope: "Full interior fit-out, including custom dining furniture, bar joinery, and feature woodwor", description: "Full interior fit-out, including custom dining furniture, bar joinery, and feature woodworks.", featured: false, images: ["/img/projects/primer-steak-house-1.jpg", "/img/projects/primer-steak-house-2.jpg", "/img/projects/primer-steak-house-3.jpg"] },
];

const clientsData = ["Royal Commission for Jubail & Yanbu", "Saudi Aramco", "SATORP", "YASREF", "MA'ADEN", "SABIC", "MARAFIQ", "Red Sea Global", "The Red Sea Development Company", "AMAALA", "NEOM", "Misk Schools", "MISK Foundation", "KAFD", "Six Senses", "Movenpick", "Saudi Arabian Baytur", "BEC Arabia", "Astra", "Azmeel Contracting", "Khonaini International Co. Ltd", "Saudi Arabia Railways", "Hassan Allam", "Samama", "Aleisa Residence", "ZAC International", "Marco", "Haif Company", "ICAD", "SIAC Construction", "National Blue Company Ltd", "Ewan", "Thabat", "Retal Residence", "Nesma & Partners", "TMG", "Jabal Technical Institute", "Imam Abdulrahman Bin Faisal University", "Zakat, Tax and Customs Authority", "GACA", "Dar Al-Arkan", "Technical Development for Contracting"];

const settingsData: { section: string; key: string; label: string; value: string; type?: string }[] = [
  { section: "hero", key: "eyebrow", label: "Hero eyebrow", value: "Est. 2004 · Jubail, KSA" },
  { section: "hero", key: "headline", label: "Hero headline", value: "Two Decades of Mastery in WOODWORKS." },
  { section: "hero", key: "lede", label: "Hero paragraph", value: "Established in 2004, ARFAD operates in architectural wood works, interior furnishing and wooden furniture manufacturing from Jubail Industrial City." },
  { section: "stats", key: "doors", label: "Wooden doors installed", value: "237,000+" },
  { section: "stats", key: "kitchens", label: "Kitchens & wardrobes fitted", value: "347,000+ m²" },
  { section: "stats", key: "cladding", label: "Cladding, ceiling & flooring works delivered", value: "161,500+ m²" },
  { section: "stats", key: "factory", label: "Factory size", value: "20,000 m²" },
  { section: "stats", key: "employees", label: "Production employees", value: "200+" },
  { section: "contact", key: "address", label: "Address", value: "Support Industrial, Jubail Industrial City, KSA" },
  { section: "contact", key: "phone", label: "Phone", value: "+966 13 341 7773" },
  { section: "contact", key: "whatsapp", label: "WhatsApp", value: "+966 56 916 4017" },
  { section: "contact", key: "email", label: "Email", value: "info@arfad.com.sa" },
  { section: "contact", key: "website", label: "Website", value: "www.arfad.com.sa" },
  { section: "about", key: "story", label: "Company story", value: "Established in 2004, ARFAD operates in architectural wood works, interior furnishing and wooden furniture manufacturing from Jubail Industrial City.", type: "textarea" },
];

export async function runSeed() {
  const email = process.env.SEED_ADMIN_EMAIL || "admin@arfad.com.sa";
  const password = process.env.SEED_ADMIN_PASSWORD || "changeme123";
  const passwordHash = await bcrypt.hash(password, 10);

  const existing = await db.select().from(users).where(eq(users.email, email)).get();
  if (!existing) {
    await db.insert(users).values({ name: "Admin", email, passwordHash, role: "ADMIN" }).run();
    console.log(`Seeded admin user: ${email} / ${password} (CHANGE THIS AFTER FIRST LOGIN)`);
  } else {
    console.log(`Admin user ${email} already exists, skipping.`);
  }

  // Upsert (not insert-if-missing): keeps existing rows in sync with the
  // canonical copy in this file whenever it changes and the server
  // restarts/redeploys, e.g. wording fixes like the em-dash cleanup. This
  // is the right tradeoff while the site is still in preview and content
  // only changes here; once real edits are made through the admin UI,
  // switch back to insert-if-missing so those edits aren't overwritten.
  for (const [i, s] of servicesData.entries()) {
    const existingService = await db.select().from(services).where(eq(services.anchor, s.anchor)).get();
    const values = { ...s, order: i, features: JSON.stringify(s.features) };
    if (existingService) {
      await db.update(services).set(values).where(eq(services.anchor, s.anchor)).run();
    } else {
      await db.insert(services).values(values).run();
    }
  }
  const retiredAnchors = ["wall-cladding", "ceilings", "flooring", "kitchens", "wardrobes", "vanities", "reception-counters", "exterior"];
  for (const anchor of retiredAnchors) {
    await db.delete(services).where(eq(services.anchor, anchor)).run();
  }
  console.log(`Seeded services`);

  for (const [i, p] of projectsData.entries()) {
    const existingProject = await db.select().from(projects).where(eq(projects.slug, p.slug)).get();
    const values = { ...p, order: i, images: JSON.stringify(p.images) };
    if (existingProject) {
      await db.update(projects).set(values).where(eq(projects.slug, p.slug)).run();
    } else {
      await db.insert(projects).values(values).run();
    }
  }
  console.log(`Seeded projects`);

  // Insert-if-missing only: admin edits to clients must survive redeploys.
  for (const [i, name] of clientsData.entries()) {
    const slug = slugify(name);
    const existingClient = await db.select().from(clients).where(eq(clients.slug, slug)).get();
    if (existingClient) continue;
    const logoPath = `/img/clients/${slug}.png`;
    const logoUrl = existsSync(path.join(process.cwd(), "public", logoPath)) ? logoPath : null;
    await db.insert(clients).values({ name, slug, logoUrl, order: i }).run();
  }
  console.log(`Seeded clients`);

  // Once only: the marker row keeps deleted vendors from reappearing after a restart.
  if (!(await db.select().from(siteBlocks).where(eq(siteBlocks.key, "vendors_seeded")).get())) {
    for (const [i, v] of (defaults as { vendors?: { name: string; no: string; logo: string | null }[] }).vendors?.entries() ?? []) {
      await db.insert(vendors).values({ name: v.name, vendorNo: v.no, logoUrl: v.logo, order: i }).run();
    }
    await db.insert(siteBlocks).values({ key: "vendors_seeded", value: "1" }).run();
  }
  console.log(`Seeded vendors`);

  // Only when empty: admin edits and deletions of accreditations must survive redeploys.
  if (!(await db.select({ id: accreditations.id }).from(accreditations).get())) {
    for (const [i, a] of defaults.accreditations.entries()) {
      await db.insert(accreditations).values({ name: a.name, logoUrl: a.logo, light: a.light, order: i, active: true }).run();
    }
  }
  console.log(`Seeded accreditations`);

  // Insert-if-missing only: admin edits to the menu and footer must survive redeploys.
  if (!(await db.select({ id: navItems.id }).from(navItems).get())) await resetNav();
  if (!(await db.select().from(siteBlocks).where(eq(siteBlocks.key, "footer")).get())) await resetFooter();
  console.log(`Seeded menu and footer`);

  // Once only: fill in the logos of vendors that were saved without one (never overwrites a logo set in the admin).
  if (!(await db.select().from(siteBlocks).where(eq(siteBlocks.key, "vendor_logos_v3")).get())) {
    for (const v of (defaults as { vendors?: { name: string; logo: string | null }[] }).vendors ?? []) {
      if (!v.logo) continue;
      const row = await db.select().from(vendors).where(eq(vendors.name, v.name)).get();
      if (row && !row.logoUrl) await db.update(vendors).set({ logoUrl: v.logo }).where(eq(vendors.id, row.id)).run();
    }
    await db.insert(siteBlocks).values({ key: "vendor_logos_v3", value: "1" }).run();
  }

  // Once only: put every image and video the site ships with into the Media library (certificate thumbnails excluded).
  if (!(await db.select().from(siteBlocks).where(eq(siteBlocks.key, "site_media_seeded")).get())) {
    const root = path.join(process.cwd(), "public", "img");
    const walk = (dir: string): string[] =>
      readdirSync(dir).flatMap((n) => {
        const p = path.join(dir, n);
        return statSync(p).isDirectory() ? (n === "certs" ? [] : walk(p)) : [p];
      });
    if (existsSync(root)) {
      const have = new Set((await db.select({ u: mediaAssets.url }).from(mediaAssets).all()).map((r) => r.u));
      for (const p of walk(root).sort()) {
        if (!/\.(jpe?g|png|webp|svg|mp4|webm)$/i.test(p)) continue;
        const rel = path.relative(path.join(process.cwd(), "public"), p).split(path.sep).join("/");
        const url = `/${rel}`;
        if (have.has(url)) continue;
        const parts = rel.split("/");
        await db.insert(mediaAssets).values({ url, filename: parts[parts.length - 1], folder: parts.length > 3 ? parts[1] : "site" }).run();
      }
    }
    await db.insert(siteBlocks).values({ key: "site_media_seeded", value: "1" }).run();
  }
  // Once only: the PDFs and documents the site ships with (certificates, manuals, company profile).
  if (!(await db.select().from(siteBlocks).where(eq(siteBlocks.key, "site_files_seeded")).get())) {
    const froot = path.join(process.cwd(), "public", "files");
    const fwalk = (dir: string): string[] =>
      readdirSync(dir).flatMap((n) => {
        const p = path.join(dir, n);
        return statSync(p).isDirectory() ? fwalk(p) : [p];
      });
    if (existsSync(froot)) {
      const have = new Set((await db.select({ u: mediaAssets.url }).from(mediaAssets).all()).map((r) => r.u));
      for (const p of fwalk(froot).sort()) {
        if (!/\.pdf$/i.test(p)) continue;
        const rel = path.relative(path.join(process.cwd(), "public"), p).split(path.sep).join("/");
        const url = `/${rel}`;
        if (have.has(url)) continue;
        const parts = rel.split("/");
        await db.insert(mediaAssets).values({ url, filename: parts[parts.length - 1], folder: parts.length > 2 ? parts[1] : "documents" }).run();
      }
    }
    await db.insert(siteBlocks).values({ key: "site_files_seeded", value: "1" }).run();
  }
  console.log(`Seeded media library`);

  // Once only: the three ISO marks in the saved Accreditations list switch to the new colour artwork (shown on white tiles).
  if (!(await db.select().from(siteBlocks).where(eq(siteBlocks.key, "iso_marks_v3")).get())) {
    for (const f of ["iso-9001", "iso-14001", "iso-45001"]) {
      await db.update(accreditations).set({ logoUrl: `/img/accreditation/${f}.png?v=3`, light: true }).where(like(accreditations.logoUrl, `/img/accreditation/${f}.png%`)).run();
    }
    await db.insert(siteBlocks).values({ key: "iso_marks_v3", value: "1" }).run();
  }

  // Once only: add "Certificates & Awards" to the Quick Links column of the saved footer.
  if (!(await db.select().from(siteBlocks).where(eq(siteBlocks.key, "footer_certs_link")).get())) {
    const footer = await getFooter();
    const col = footer.columns.find((c) => c.title === "Quick Links");
    if (col && !col.links.some((l) => l.href === "certificates.html")) {
      const at = col.links.findIndex((l) => l.href === "factory.html") + 1;
      col.links.splice(at || col.links.length, 0, { label: "Certificates & Awards", href: "certificates.html" });
      await saveFooter(footer);
    }
    await db.insert(siteBlocks).values({ key: "footer_certs_link", value: "1" }).run();
  }

  // Once only: Kitchens & Cabinets and Wardrobes & Closets now have their own pages; repoint the saved menu and footer.
  if (!(await db.select().from(siteBlocks).where(eq(siteBlocks.key, "kitchens_wardrobes_pages")).get())) {
    const map: Record<string, string> = { "service-cabinets.html#sub-kitchens": "service-kitchens.html", "service-cabinets.html#sub-wardrobes": "service-wardrobes.html" };
    const tree = await getNavTree();
    let changed = false;
    for (const n of tree) for (const c of n.children) if (map[c.href]) { c.href = map[c.href]; changed = true; }
    if (changed) await saveNav(tree.map((n) => ({ label: n.label, href: n.href, active: n.active, children: n.children.map((c) => ({ label: c.label, href: c.href, active: c.active })) })));
    await db.insert(siteBlocks).values({ key: "kitchens_wardrobes_pages", value: "1" }).run();
  }

  // Once only: Thermowood and WPC Works become sub-items under Exterior Woodworks in the saved Services menu.
  if (!(await db.select().from(siteBlocks).where(eq(siteBlocks.key, "services_sub_migrated")).get())) {
    const tree = await getNavTree();
    const svc = tree.find((n) => n.href === "services.html");
    const moved = svc?.children.filter((c) => c.href === "service-thermowood.html" || c.href === "service-wpc.html") ?? [];
    const ext = svc?.children.findIndex((c) => c.href === "service-thermowood.html#sub-exterior") ?? -1;
    if (svc && moved.length && ext >= 0) {
      const rest = svc.children.filter((c) => !moved.includes(c));
      const at = rest.findIndex((c) => c.href === "service-thermowood.html#sub-exterior") + 1;
      rest.splice(at, 0, ...moved.map((c) => ({ ...c, label: c.label.startsWith("– ") ? c.label : `– ${c.label}` })));
      svc.children = rest;
      await saveNav(tree.map((n) => ({ label: n.label, href: n.href, active: n.active, children: n.children.map((c) => ({ label: c.label, href: c.href, active: c.active })) })));
    }
    await db.insert(siteBlocks).values({ key: "services_sub_migrated", value: "1" }).run();
  }

  // Once only: move an existing menu and footer from the 12-service structure to the 9 services.
  if (!(await db.select().from(siteBlocks).where(eq(siteBlocks.key, "services_9_migrated")).get())) {
    const oldHrefs = new Set(["service-wall-cladding.html", "service-ceilings.html", "service-flooring.html", "service-kitchens.html", "service-wardrobes.html", "service-vanities.html", "service-reception-counters.html", "service-exterior.html"]);
    const newServices = defaults.nav.find((n) => n.href === "services.html")?.children ?? [];
    const tree = await getNavTree();
    const svc = tree.find((n) => n.href === "services.html");
    if (svc && svc.children.some((c) => oldHrefs.has(c.href))) {
      svc.children = newServices.map((c, i) => ({ id: `n${i}`, label: c.label, href: c.href, active: true }));
      await saveNav(tree.map((n) => ({ label: n.label, href: n.href, active: n.active, children: n.children.map((c) => ({ label: c.label, href: c.href, active: c.active })) })));
    }
    const footer = await getFooter();
    const col = footer.columns.find((c) => c.links.some((l) => oldHrefs.has(l.href)));
    if (col) {
      col.links = newServices.map((c) => ({ label: c.label, href: c.href }));
      await saveFooter(footer);
    }
    await db.insert(siteBlocks).values({ key: "services_9_migrated", value: "1" }).run();
  }

  // Once only: the marker row keeps deleted posts from reappearing after a restart.
  if (!(await db.select().from(siteBlocks).where(eq(siteBlocks.key, "posts_seeded")).get())) {
    for (const p of defaults.posts) {
      await db
        .insert(posts)
        .values({ slug: p.slug, title: p.title, category: p.category as "events" | "exhibitions" | "news", excerpt: p.excerpt, body: p.body, coverUrl: p.cover || null, publishedAt: p.date, published: (p as { published?: boolean }).published !== false })
        .onConflictDoNothing()
        .run();
    }
    await db.insert(siteBlocks).values({ key: "posts_seeded", value: "1" }).run();
  }
  // Once only: the two sample posts start unpublished (switch them on from Admin > Posts).
  if (!(await db.select().from(siteBlocks).where(eq(siteBlocks.key, "sample_posts_unpublished")).get())) {
    for (const slug of ["visit-our-jubail-factory", "meet-arfad-at-upcoming-exhibitions", "4758-doors-amaala-red-sea", "neom-multipurpose-hall-auditorium-vip-lounge", "intertek-certified-fire-rated-doors", "fsc-chain-of-custody-responsible-sourcing"]) {
      await db.update(posts).set({ published: false }).where(eq(posts.slug, slug)).run();
    }
    await db.insert(siteBlocks).values({ key: "sample_posts_unpublished", value: "1" }).run();
  }
  console.log(`Seeded posts`);

  for (const s of settingsData) {
    const existingSetting = await db
      .select()
      .from(settings)
      .where(and(eq(settings.section, s.section), eq(settings.key, s.key)))
      .get();
    const values = { ...s, type: s.type || "text" };
    if (existingSetting) {
      await db
        .update(settings)
        .set(values)
        .where(and(eq(settings.section, s.section), eq(settings.key, s.key)))
        .run();
    } else {
      await db.insert(settings).values(values).run();
    }
  }
  console.log(`Seeded settings`);
  console.log("Done.");
}

if (require.main === module) {
  runSeed().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
