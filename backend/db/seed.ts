import "dotenv/config";
import bcrypt from "bcryptjs";
import { db } from "./client";
import { existsSync } from "fs";
import path from "path";
import { users, services, projects, settings, clients, accreditations, navItems, siteBlocks, posts } from "./schema";
import { eq, and } from "drizzle-orm";
import { slugify } from "../lib/slugify";
import defaults from "./site-defaults.json";
import { resetFooter, resetNav } from "../lib/site-content";

const servicesData = [
  { anchor: "doors", title: "Wooden Doors", summary: "Fire-rated, non-fire rated, solid, flush, louver, sliding, pocket and X-ray protected doors.", image: "/img/svc-doors.jpg", features: ["Wooden Internal Doors", "Wooden External Doors", "Fire-Rated Doors", "Flush Doors"] },
  { anchor: "wall-cladding", title: "Wooden Wall Claddings", summary: "Internal, external, thermowood, decorative and slatted wall cladding.", image: "/img/svc-cladding.jpg", features: ["Internal Wooden Wall Cladding", "External Wooden Cladding", "Thermowood Exterior Cladding", "Decorative Wooden Panels"] },
  { anchor: "ceilings", title: "Wooden Ceilings", summary: "Wooden, decorative and slatted wooden ceilings.", image: "/img/svc-interior.jpg", features: ["Wooden Ceilings", "Decorative Ceiling Panels", "Slatted Wooden Ceilings"] },
  { anchor: "flooring", title: "Wooden Floorings", summary: "Wooden flooring supplied and installed as part of complete woodwork packages.", image: "/img/svc-furniture.jpg", features: ["Wooden Floorings", "Thermowood Decking", "WPC Decking", "Timber Decking"] },
  { anchor: "kitchens", title: "Kitchens & Cabinets", summary: "Kitchen cabinets with countertops, delivered at housing-development scale.", image: "/img/svc-cabinets.jpg", features: ["Kitchen Cabinets", "Kitchen Countertops", "Cabinets with Countertops", "Storage"] },
  { anchor: "wardrobes", title: "Wardrobes & Closets", summary: "Wardrobes and closets supplied and installed across villas and apartment buildings.", image: "/img/svc-cabinets.jpg", features: ["Wardrobes", "Closets", "Full wardrobe supply and installation", "Storage"] },
  { anchor: "vanities", title: "Vanities & Storage Systems", summary: "Vanity units, vanity tops and storage systems.", image: "/img/svc-countertops.jpg", features: ["Vanities", "Vanity Tops", "Vanity Shelves", "Laundry Shelves"] },
  { anchor: "reception-counters", title: "Reception Counters", summary: "Reception counters and bespoke joinery built to spec.", image: "/img/svc-joinery.jpg", features: ["Reception Counters", "Feature Panels", "Hotel Joinery", "Restaurant Joinery"] },
  { anchor: "furniture", title: "Interior Furniture & Decors", summary: "Custom furniture and interior woodworks for hospitality, residential, commercial and public spaces.", image: "/img/svc-furniture.jpg", features: ["Loose Furniture", "Hotel Furniture", "Restaurant Furniture", "Office Furniture"] },
  { anchor: "exterior", title: "Exterior Woodworks", summary: "Thermowood and WPC decking, cladding, pergolas, louvers, screens and canopies.", image: "/img/svc-thermowood.jpg", features: ["Thermowood Exterior Cladding", "Thermowood Decking", "Pergolas and Architectural Louvers", "Screens & Privacy Panels"] },
  { anchor: "countertops", title: "Counter Tops & Solid Surfaces", summary: "Natural stone, engineered stone, quartz and travertine tops, fabricated and finished in-house.", image: "/img/svc-countertops-reception.jpg", features: ["Natural Stone Countertops", "Engineered Stone Countertops", "Quartz Countertops", "Kitchen Countertops"] },
  { anchor: "traditional", title: "Traditional Woodworks", summary: "Hand-carved panels, mashrabiya screens, Islamic-patterned doors and majlis furniture.", image: "/img/svc-traditional.jpg", features: ["Hand-Carved Decorative Panels", "Geometric Mashrabiya Screens", "Islamic-Patterned Wooden Doors", "Traditional Wooden Screens"] },
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
  const retiredAnchors = ["joinery", "cabinets", "cladding", "thermowood", "wpc"];
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

  // Once only: the marker row keeps deleted posts from reappearing after a restart.
  if (!(await db.select().from(siteBlocks).where(eq(siteBlocks.key, "posts_seeded")).get())) {
    for (const p of defaults.posts) {
      await db
        .insert(posts)
        .values({ slug: p.slug, title: p.title, category: p.category as "events" | "exhibitions" | "news", excerpt: p.excerpt, body: p.body, coverUrl: p.cover || null, publishedAt: p.date, published: true })
        .onConflictDoNothing()
        .run();
    }
    await db.insert(siteBlocks).values({ key: "posts_seeded", value: "1" }).run();
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
