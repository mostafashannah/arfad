import "dotenv/config";
import bcrypt from "bcryptjs";
import { db } from "./client";
import { users, services, projects, settings } from "./schema";
import { eq, and } from "drizzle-orm";

const servicesData = [
  { anchor: "doors", title: "Wooden Doors", summary: "Fire-rated, non-fire rated, solid, flush, louver, sliding, pocket and X-ray protected doors — Intertek certified up to 120 minutes fire resistance.", features: ["Fire-rated up to 120 minutes, Intertek certified", "Solid, flush, louver and X-ray protected core options", "Sliding and pocket door systems available", "Ironmongery and hardware fitted in-house"] },
  { anchor: "joinery", title: "Joinery", summary: "Custom joints, timber framing, architectural moldings, reception counters, hotel, restaurant, office and retail joinery, built to spec.", features: ["Custom timber framing and architectural moldings", "Reception counters and bespoke millwork", "Hotel, restaurant, office and retail fit-outs", "Built to architect shop drawings and specification"] },
  { anchor: "cabinets", title: "Cabinets & Wardrobes", summary: "Kitchen cabinets, wardrobes, vanities and storage systems manufactured for residential and hospitality scale.", features: ["Kitchen cabinets and fitted wardrobes", "Vanities and bathroom storage systems", "Engineered for residential and hospitality scale", "Soft-close hardware and moisture-resistant finishes"] },
  { anchor: "cladding", title: "Cladding & Ceilings", summary: "Internal and external wooden wall cladding, decorative panels, slatted wood, wooden and slatted ceilings engineered for precision.", features: ["Internal and external wall cladding", "Decorative panels and slatted wood ceilings", "Engineered for precision alignment", "Weather-rated finishes for exterior use"] },
  { anchor: "thermowood", title: "Thermowood", summary: "Exterior cladding, decking, pergolas, louvers, screens and canopies built for durability and dimensional stability outdoors.", features: ["Exterior cladding, decking and pergolas", "Thermally modified for dimensional stability", "Louvers, screens and canopies", "Built to withstand heat and humidity"] },
  { anchor: "furniture", title: "Furniture & Interiors", summary: "Loose, hotel, restaurant and office furniture, custom seating and bespoke pieces for schools, auditoriums, villas and airports.", features: ["Loose furniture for hotels and offices", "Custom seating for schools and auditoriums", "Bespoke pieces for villas and airports", "Finished to match interior design specification"] },
  { anchor: "countertops", title: "Countertops & Surfaces", summary: "Natural stone, engineered stone, quartz, kitchen and vanity tops, fabricated and finished in-house.", features: ["Natural stone and engineered quartz", "Kitchen and vanity tops", "Fabricated and finished in-house", "Precision-cut and polished to order"] },
  { anchor: "traditional", title: "Traditional Woodworks", summary: "Hand-carved panels, geometric mashrabiya screens, Islamic-patterned doors and mosque furniture rooted in Arabic craftsmanship.", features: ["Hand-carved panels and screens", "Geometric mashrabiya patterns", "Islamic-patterned doors and mosque furniture", "Rooted in Arabic craftsmanship traditions"] },
  { anchor: "wpc", title: "WPC Works", summary: "Wood-look decking, wall cladding, pergolas and fencing engineered for weather resistance and low maintenance.", features: ["Wood-look decking and wall cladding", "Pergolas and fencing systems", "Engineered for weather resistance", "Low-maintenance, long-lasting finish"] },
];

const projectsData = [
  { slug: "royal-commission", title: "Royal Commission for Jubail & Yanbu", client: "Royal Commission", location: "Al Jubail", scope: "7 housing & school phases", description: "7 housing & school phases across Jubail — 2,500+ doors, kitchens, wardrobes, vanity tops and handrails delivered.", vendorNo: "14902", featured: true, images: ["/uploads/projects/royal-commission-1.jpg"] },
  { slug: "saudi-aramco", title: "Saudi Aramco", client: "Saudi Aramco", location: "Jubail · Dharan · Ras Al Khair", scope: "Home ownership housing, SDHOP, SATORP", description: "Al Mutrafiah Home Ownership Housing, SDHOP, SATORP, King Salman Maritime Complex & Royal Commission mosques.", vendorNo: "10064085", featured: true, images: ["/uploads/projects/saudi-aramco-1.jpg"] },
  { slug: "redsea-amaala", title: "Red Sea Global & AMAALA", client: "Red Sea Global", location: "AMAALA · Triple Bay", scope: "Staff villages, Six Senses, Southern Dunes Hotel", description: "4,758+ doors installed across staff villages, Six Senses Triple Bay resort and Southern Dunes Hotel.", vendorNo: "S10357393", featured: true, images: ["/uploads/projects/redsea-amaala-1.jpg"] },
  { slug: "neom", title: "NEOM — Multipurpose Hall, Auditorium & VIP Lounge", client: "NEOM (BECo)", location: "NEOM", scope: "Multipurpose hall, auditorium, VIP lounge", description: "100 doors, 1,700 m² cladding, bespoke joinery and premium VIP-grade finishes.", vendorNo: null, featured: true, images: ["/uploads/projects/neom-1.jpg"] },
  { slug: "kafd", title: "King Abdullah Financial District", client: "KAFD", location: "Riyadh", scope: "Premium woodworks & joinery", description: "Premium woodworks and joinery — custom vanities, cabinetry and architectural millwork.", vendorNo: null, featured: false, images: ["/uploads/projects/kafd-1.jpg"] },
  { slug: "karan", title: "KARAN Group — Hotel & Housing", client: "KARAN Group", location: "Al Jubail", scope: "Hotel cladding, bachelor apartments", description: "Cladding for a 5-star hotel's restaurants and function rooms, plus 744 doors and 744 kitchens for bachelor apartments.", vendorNo: null, featured: false, images: ["/uploads/projects/karan-1.jpg"] },
  { slug: "marafiq", title: "MARAFIQ — New Head Office", client: "MARAFIQ", location: "Al Jubail", scope: "Office joinery", description: "Complete office joinery for MARAFIQ's new head office.", vendorNo: null, featured: false, images: ["/uploads/projects/marafiq-1.jpg"] },
  { slug: "ministry-of-defense", title: "Ministry of Defense — Supporting Buildings", client: "Ministry of Defense", location: "Al Qassim", scope: "Doors, cladding, ceilings", description: "Doors for 100 flats, 1,500 m² of wall cladding and 250 m² of ceiling works.", vendorNo: null, featured: false, images: ["/uploads/projects/ministry-of-defense-1.jpg"] },
  { slug: "misk", title: "MISK School Phase 1 & 2", client: "MISK Foundation (Baytur)", location: "Riyadh", scope: "1,500 doors, cladding, ceilings", description: "1,500 doors, 2,000 m² of wall cladding and 700 m² of ceiling works.", vendorNo: null, featured: false, images: ["/uploads/projects/misk-1.jpg"] },
  { slug: "movenpick", title: "Movenpick 5-Star Hotel", client: "Movenpick", location: "Wa'ad Al Shamal", scope: "850 doors, kitchen joinery, cladding", description: "850 doors, kitchen joinery and 4,850 m² of wall cladding.", vendorNo: null, featured: false, images: ["/uploads/projects/movenpick-1.jpg"] },
  { slug: "primer-steak-house", title: "PRIMER Steak House", client: "PRIMER Steak House", location: "Riyadh", scope: "Full restaurant interior fit-out", description: "Full interior fit-out including dining furniture, bar joinery and bespoke restaurant millwork.", vendorNo: null, featured: false, images: ["/uploads/projects/primer-steak-house-1.jpg"] },
  { slug: "el-eissa", title: "Al Eissa Compound — Project ZAC", client: "Al Eissa Compound", location: "—", scope: "Doors, canopies, shade pavilions", description: "External and internal doors, roof canopies and shade pavilions.", vendorNo: null, featured: false, images: ["/uploads/projects/el-eissa-1.jpg"] },
];

const settingsData: { section: string; key: string; label: string; value: string; type?: string }[] = [
  { section: "hero", key: "eyebrow", label: "Hero eyebrow", value: "01 — Wooden Doors" },
  { section: "hero", key: "headline", label: "Hero headline", value: "Two decades of mastery in wood." },
  { section: "hero", key: "lede", label: "Hero paragraph", value: "Architectural wood works, interior furnishing and wooden furniture manufacturing, engineered and produced from a 20,000 m² factory in Jubail Industrial City — trusted across the Kingdom's most demanding projects since 2004." },
  { section: "stats", key: "doors", label: "Wooden doors installed", value: "237,000+" },
  { section: "stats", key: "kitchens", label: "Kitchens & wardrobes fitted", value: "347,000 m²" },
  { section: "stats", key: "factory", label: "Factory size", value: "20,000 m²" },
  { section: "stats", key: "employees", label: "Production employees", value: "200+" },
  { section: "contact", key: "address", label: "Address", value: "Support Industrial, Jubail Industrial City, KSA" },
  { section: "contact", key: "phone", label: "Phone", value: "+966 13 341 7773" },
  { section: "contact", key: "whatsapp", label: "WhatsApp", value: "+966 56 121 0469" },
  { section: "contact", key: "email", label: "Email", value: "info@arfad.com.sa" },
  { section: "contact", key: "website", label: "Website", value: "www.arfad.com.sa" },
  { section: "about", key: "story", label: "Company story", value: "Established in 2004, ARFAD operates in architectural wood works, interior furnishing and wooden furniture manufacturing from Jubail Industrial City — serving residential, hospitality, government, industrial, and mega-project sectors across the Kingdom.", type: "textarea" },
];

async function main() {
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

  for (const [i, s] of servicesData.entries()) {
    const existingService = await db.select().from(services).where(eq(services.anchor, s.anchor)).get();
    if (existingService) continue;
    await db
      .insert(services)
      .values({ ...s, order: i, features: JSON.stringify(s.features) })
      .run();
  }
  console.log(`Seeded services`);

  for (const [i, p] of projectsData.entries()) {
    const existingProject = await db.select().from(projects).where(eq(projects.slug, p.slug)).get();
    if (existingProject) continue;
    await db
      .insert(projects)
      .values({ ...p, order: i, images: JSON.stringify(p.images) })
      .run();
  }
  console.log(`Seeded projects`);

  for (const s of settingsData) {
    const existingSetting = await db
      .select()
      .from(settings)
      .where(and(eq(settings.section, s.section), eq(settings.key, s.key)))
      .get();
    if (existingSetting) continue;
    await db
      .insert(settings)
      .values({ ...s, type: s.type || "text" })
      .run();
  }
  console.log(`Seeded settings`);
  console.log("Done.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
