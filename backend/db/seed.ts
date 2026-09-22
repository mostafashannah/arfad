import "dotenv/config";
import bcrypt from "bcryptjs";
import { db } from "./client";
import { users, services, projects, settings } from "./schema";
import { eq, and } from "drizzle-orm";

const servicesData = [
  { anchor: "doors", title: "Wooden Doors", summary: "Fire-rated, non-fire rated, solid, flush, louver, sliding, pocket and X-ray protected doors, Intertek certified up to 120 minutes fire resistance.", image: "/img/mod-doors-teaser.jpg", features: ["Fire-rated up to 120 minutes, Intertek certified", "Solid, flush, louver and X-ray protected core options", "Sliding and pocket door systems available", "Ironmongery and hardware fitted in-house"] },
  { anchor: "joinery", title: "Joinery", summary: "Custom joints, timber framing, architectural moldings, reception counters, hotel, restaurant, office and retail joinery, built to spec.", image: "/img/svc-joinery.jpg", features: ["Custom timber framing and architectural moldings", "Reception counters and bespoke millwork", "Hotel, restaurant, office and retail fit-outs", "Built to architect shop drawings and specification"] },
  { anchor: "cabinets", title: "Interior Woodworks", summary: "Kitchen cabinets, wardrobes, vanities and storage systems manufactured for residential and hospitality scale.", image: "/img/svc-cabinets.jpg", features: ["Kitchen cabinets and fitted wardrobes", "Vanities and bathroom storage systems", "Engineered for residential and hospitality scale", "Soft-close hardware and moisture-resistant finishes"] },
  { anchor: "cladding", title: "Cladding & Ceilings", summary: "Internal and external wooden wall cladding, decorative panels, slatted wood, wooden and slatted ceilings engineered for precision.", image: "/img/svc-cladding.jpg", features: ["Internal and external wall cladding", "Decorative panels and slatted wood ceilings", "Engineered for precision alignment", "Weather-rated finishes for exterior use"] },
  { anchor: "thermowood", title: "Thermowood", summary: "Exterior cladding, decking, pergolas, louvers, screens and canopies built for durability and dimensional stability outdoors.", image: "/img/svc-thermowood.jpg", features: ["Exterior cladding, decking and pergolas", "Thermally modified for dimensional stability", "Louvers, screens and canopies", "Built to withstand heat and humidity"] },
  { anchor: "furniture", title: "Furniture & Interiors", summary: "Loose, hotel, restaurant and office furniture, custom seating and bespoke pieces for schools, auditoriums, villas and airports.", image: "/img/svc-furniture.jpg", features: ["Loose furniture for hotels and offices", "Custom seating for schools and auditoriums", "Bespoke pieces for villas and airports", "Finished to match interior design specification"] },
  { anchor: "countertops", title: "Countertops & Surfaces", summary: "Natural stone, engineered stone, quartz, kitchen and vanity tops, fabricated and finished in-house.", image: "/img/svc-countertops-reception.jpg", features: ["Natural stone and engineered quartz", "Kitchen and vanity tops", "Fabricated and finished in-house", "Precision-cut and polished to order"] },
  { anchor: "traditional", title: "Traditional Woodworks", summary: "Hand-carved panels, geometric mashrabiya screens, Islamic-patterned doors and mosque furniture rooted in Arabic craftsmanship.", image: "/img/svc-traditional.jpg", features: ["Hand-carved panels and screens", "Geometric mashrabiya patterns", "Islamic-patterned doors and mosque furniture", "Rooted in Arabic craftsmanship traditions"] },
  { anchor: "wpc", title: "WPC Works", summary: "Wood-look decking, wall cladding, pergolas and fencing engineered for weather resistance and low maintenance.", image: "/img/svc-wpc.jpg", features: ["Wood-look decking and wall cladding", "Pergolas and fencing systems", "Engineered for weather resistance", "Low-maintenance, long-lasting finish"] },
];

const projectsData = [
  { slug: "royal-commission", title: "Royal Commission for Jubail & Yanbu", client: "Royal Commission", location: "Al Jubail", scope: "7 housing & school phases", description: "7 housing & school phases across Jubail 2,500+ doors, kitchens, wardrobes, vanity tops and handrails delivered. Registered Vendor No. 14902.", vendorNo: "14902", featured: true, images: ["/img/projects/royal-commission-1.jpg"] },
  { slug: "saudi-aramco", title: "Saudi Aramco", client: "Saudi Aramco", location: "Jubail · Dharan · Ras Al Khair", scope: "Home ownership housing, SDHOP, SATORP", description: "Al Mutrafiah Home Ownership Housing, SDHOP, SATORP, King Salman Maritime Complex & Royal Commission mosques. Registered Vendor No. 10064085.", vendorNo: "10064085", featured: true, images: ["/img/projects/saudi-aramco-1.jpg"] },
  { slug: "neom", title: "NEOM Multipurpose Hall, Auditorium & VIP Lounge", client: "NEOM (BECo)", location: "NEOM", scope: "Multipurpose hall, auditorium, VIP lounge", description: "100 doors, 1,700 m² cladding, 500 m² ceiling and 100 m² flooring for the Multipurpose Hall, plus high-end joinery and cladding for the Auditorium and luxury custom panelling for the VIP Lounge.", vendorNo: null, featured: true, images: ["/img/projects/neom-1.jpg", "/img/projects/neom-2.jpg", "/img/projects/neom-3.jpg", "/img/projects/neom-4.jpg", "/img/projects/neom-5.jpg", "/img/projects/neom-6.jpg"] },
  { slug: "redsea-amaala", title: "Red Sea Global & AMAALA", client: "Red Sea Global", location: "AMAALA · Triple Bay", scope: "Staff villages, Six Senses, Southern Dunes Hotel", description: "4,758+ doors installed across AMAALA staff villages (Packages 1, Zones 1/2/7), thermowood exterior cladding for secondary infrastructure, and full luxury resort joinery for the Six Senses Resorts at Triple Bay. Registered Vendor No. S10357393.", vendorNo: "S10357393", featured: true, images: ["/img/projects/redsea-amaala-1.jpg", "/img/projects/redsea-amaala-2.jpg", "/img/projects/redsea-amaala-3.jpg", "/img/projects/redsea-amaala-4.jpg", "/img/projects/redsea-amaala-5.jpg", "/img/projects/redsea-amaala-6.jpg", "/img/projects/redsea-amaala-7.jpg", "/img/projects/redsea-amaala-8.jpg", "/img/projects/redsea-amaala-9.jpg", "/img/projects/redsea-amaala-10.jpg"] },
  { slug: "kafd", title: "King Abdullah Financial District", client: "KAFD", location: "Riyadh", scope: "Premium woodworks & joinery", description: "Premium woodworks and joinery custom vanities, cabinetry and architectural millwork delivered for one of Riyadh's landmark financial developments.", vendorNo: null, featured: false, images: ["/img/projects/kafd-1.jpg", "/img/projects/kafd-2.jpg", "/img/projects/kafd-3.jpg"] },
  { slug: "karan", title: "KARAN Group Hotel & Housing", client: "KARAN Group", location: "Al Jubail", scope: "Hotel cladding, bachelor apartments", description: "Cladding for a 5-star hotel's restaurants and function rooms, plus 744 doors and 744 kitchens for bachelor apartments.", vendorNo: null, featured: false, images: ["/img/projects/karan-1.jpg", "/img/projects/karan-2.jpg", "/img/projects/karan-3.jpg"] },
  { slug: "marafiq", title: "MARAFIQ New Head Office", client: "MARAFIQ", location: "Al Jubail", scope: "Office joinery", description: "Complete office joinery for MARAFIQ's new head office custom millwork, reception counters and workspace fit-out.", vendorNo: null, featured: false, images: ["/img/projects/marafiq-1.jpg", "/img/projects/marafiq-2.jpg", "/img/projects/marafiq-3.jpg"] },
  { slug: "ministry-of-defense", title: "Ministry of Defense Supporting Buildings", client: "Ministry of Defense", location: "Al Qassim", scope: "Doors, cladding, ceilings", description: "Doors for 100 flats, 1,500 m² of wall cladding and 250 m² of ceiling works across the Ministry's supporting buildings.", vendorNo: null, featured: true, images: ["/img/projects/ministry-of-defense-1.jpg", "/img/projects/ministry-of-defense-2.jpg", "/img/projects/ministry-of-defense-3.jpg"] },
  { slug: "misk", title: "MISK School Phase 1 & 2", client: "MISK Foundation (Baytur)", location: "Riyadh", scope: "1,500 doors, cladding, ceilings", description: "1,500 doors, 2,000 m² of wall cladding and 700 m² of ceiling works delivered for the MISK Foundation's school campus.", vendorNo: null, featured: false, images: ["/img/projects/misk-1.jpg", "/img/projects/misk-2.jpg", "/img/projects/misk-3.jpg"] },
  { slug: "movenpick", title: "Movenpick 5-Star Hotel", client: "Movenpick", location: "Wa'ad Al Shamal", scope: "850 doors, kitchen joinery, cladding", description: "850 doors, kitchen joinery and 4,850 m² of wall cladding delivered for a 5-star hotel development.", vendorNo: null, featured: false, images: ["/img/projects/movenpick-1.jpg", "/img/projects/movenpick-2.jpg", "/img/projects/movenpick-3.jpg"] },
  { slug: "primer-steak-house", title: "PRIMER Steak House Restaurant & Lounge", client: "PRIMER Steak House", location: "Riyadh", scope: "Full restaurant interior fit-out", description: "Full interior fit-out including dining furniture, bar joinery and bespoke restaurant millwork.", vendorNo: null, featured: false, images: ["/img/projects/primer-steak-house-1.jpg", "/img/projects/primer-steak-house-2.jpg", "/img/projects/primer-steak-house-3.jpg"] },
  { slug: "el-eissa", title: "Al Eissa Compound Project ZAC", client: "Al Eissa Compound", location: "", scope: "Doors, canopies, shade pavilions", description: "External and internal doors, roof canopies and shade pavilions delivered for the Al Eissa Compound development.", vendorNo: null, featured: false, images: ["/img/projects/el-eissa-1.jpg", "/img/projects/el-eissa-2.jpg", "/img/projects/el-eissa-3.jpg"] },
];

const settingsData: { section: string; key: string; label: string; value: string; type?: string }[] = [
  { section: "hero", key: "eyebrow", label: "Hero eyebrow", value: "01 Wooden Doors" },
  { section: "hero", key: "headline", label: "Hero headline", value: "Two decades of mastery in wood." },
  { section: "hero", key: "lede", label: "Hero paragraph", value: "Architectural wood works, interior furnishing and wooden furniture manufacturing, engineered and produced from a 20,000 m² factory in Jubail Industrial City trusted across the Kingdom's most demanding projects since 2004." },
  { section: "stats", key: "doors", label: "Wooden doors installed", value: "237,000+" },
  { section: "stats", key: "kitchens", label: "Kitchens & wardrobes fitted", value: "347,000 m²" },
  { section: "stats", key: "factory", label: "Factory size", value: "20,000 m²" },
  { section: "stats", key: "employees", label: "Production employees", value: "200+" },
  { section: "contact", key: "address", label: "Address", value: "Support Industrial, Jubail Industrial City, KSA" },
  { section: "contact", key: "phone", label: "Phone", value: "+966 13 341 7773" },
  { section: "contact", key: "whatsapp", label: "WhatsApp", value: "+966 56 121 0469" },
  { section: "contact", key: "email", label: "Email", value: "info@arfad.com.sa" },
  { section: "contact", key: "website", label: "Website", value: "www.arfad.com.sa" },
  { section: "about", key: "story", label: "Company story", value: "Established in 2004, ARFAD operates in architectural wood works, interior furnishing and wooden furniture manufacturing from Jubail Industrial City serving residential, hospitality, government, industrial, and mega-project sectors across the Kingdom.", type: "textarea" },
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
