import Link from "next/link";
import { db } from "@/db/client";
import { projects } from "@/db/schema";
import { eq, asc } from "drizzle-orm";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const allProjects = await db
    .select()
    .from(projects)
    .where(eq(projects.published, true))
    .orderBy(asc(projects.order))
    .all();

  return (
    <main className="min-h-screen bg-white px-8 py-16">
      <Link href="/" className="text-sm text-[#b08d57]">
        ← Home
      </Link>
      <h1 className="mt-4 text-3xl font-bold text-[#0a2540]">Projects</h1>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {allProjects.map((p) => {
          const images: string[] = JSON.parse(p.images || "[]");
          return (
            <Link key={p.id} href={`/projects/${p.slug}`} className="group overflow-hidden rounded-xl border">
              {images[0] && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={images[0]} alt={p.title} className="h-44 w-full object-cover transition group-hover:scale-105" />
              )}
              <div className="p-5">
                <p className="text-xs uppercase tracking-wide text-[#b08d57]">{p.client}</p>
                <h3 className="mt-1 font-semibold text-[#0a2540]">{p.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{p.location}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
