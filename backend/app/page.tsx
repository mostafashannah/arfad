import Link from "next/link";
import { db } from "@/db/client";
import { settings, services, projects } from "@/db/schema";
import { eq, and, asc } from "drizzle-orm";

export const dynamic = "force-dynamic";

async function getSetting(section: string, key: string, fallback = "") {
  const s = await db
    .select()
    .from(settings)
    .where(and(eq(settings.section, section), eq(settings.key, key)))
    .get();
  return s?.value ?? fallback;
}

export default async function HomePage() {
  const [eyebrow, headline, lede, doors, kitchens, factory, employees, allServices, featuredProjects] =
    await Promise.all([
      getSetting("hero", "eyebrow"),
      getSetting("hero", "headline"),
      getSetting("hero", "lede"),
      getSetting("stats", "doors"),
      getSetting("stats", "kitchens"),
      getSetting("stats", "factory"),
      getSetting("stats", "employees"),
      db.select().from(services).where(eq(services.published, true)).orderBy(asc(services.order)).all(),
      db
        .select()
        .from(projects)
        .where(and(eq(projects.published, true), eq(projects.featured, true)))
        .orderBy(asc(projects.order))
        .all(),
    ]);

  return (
    <main className="min-h-screen bg-white">
      <header className="flex items-center justify-between border-b px-8 py-5">
        <span className="text-lg font-bold tracking-tight text-[#0a2540]">ARFAD</span>
        <nav className="flex gap-6 text-sm font-medium text-[#0a2540]">
          <Link href="/services">Services</Link>
          <Link href="/projects">Projects</Link>
          <Link href="/admin" className="text-[#b08d57]">
            Admin
          </Link>
        </nav>
      </header>

      <section className="bg-[#0a2540] px-8 py-24 text-white">
        <p className="text-xs uppercase tracking-widest text-[#b08d57]">{eyebrow}</p>
        <h1 className="mt-3 max-w-2xl text-4xl font-bold leading-tight sm:text-5xl">{headline}</h1>
        <p className="mt-5 max-w-xl text-white/70">{lede}</p>
        <div className="mt-10 grid max-w-2xl grid-cols-2 gap-6 sm:grid-cols-4">
          {[
            { label: "Wooden doors installed", value: doors },
            { label: "Kitchens & wardrobes fitted", value: kitchens },
            { label: "Factory in Jubail", value: factory },
            { label: "Production employees", value: employees },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="mt-1 text-xs text-white/60">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-8 py-16">
        <h2 className="text-2xl font-semibold text-[#0a2540]">What we deliver</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {allServices.map((s) => (
            <div key={s.id} className="overflow-hidden rounded-xl border">
              {s.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={s.image} alt={s.title} className="h-40 w-full object-cover" />
              )}
              <div className="p-5">
                <h3 className="font-semibold text-[#0a2540]">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.summary}</p>
              </div>
            </div>
          ))}
          {allServices.length === 0 && <p className="text-muted-foreground">No services published yet.</p>}
        </div>
      </section>

      <section className="bg-muted/30 px-8 py-16">
        <h2 className="text-2xl font-semibold text-[#0a2540]">Highlighted projects</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredProjects.map((p) => {
            const images: string[] = JSON.parse(p.images || "[]");
            return (
              <Link
                key={p.id}
                href={`/projects/${p.slug}`}
                className="group overflow-hidden rounded-xl border bg-white"
              >
                {images[0] && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={images[0]} alt={p.title} className="h-40 w-full object-cover transition group-hover:scale-105" />
                )}
                <div className="p-5">
                  <p className="text-xs uppercase tracking-wide text-[#b08d57]">{p.client}</p>
                  <h3 className="mt-1 font-semibold text-[#0a2540]">{p.title}</h3>
                </div>
              </Link>
            );
          })}
          {featuredProjects.length === 0 && <p className="text-muted-foreground">No featured projects yet.</p>}
        </div>
      </section>
    </main>
  );
}
