import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/db/client";
import { projects } from "@/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export default async function ProjectDetailPage({ params }: { params: { slug: string } }) {
  const project = await db.select().from(projects).where(eq(projects.slug, params.slug)).get();
  if (!project || !project.published) notFound();

  const images: string[] = JSON.parse(project.images || "[]");

  return (
    <main className="min-h-screen bg-white px-8 py-16">
      <Link href="/projects" className="text-sm text-[#b08d57]">
        ← All projects
      </Link>
      <p className="mt-4 text-xs uppercase tracking-wide text-[#b08d57]">{project.client}</p>
      <h1 className="mt-1 text-3xl font-bold text-[#0a2540]">{project.title}</h1>
      <p className="mt-2 text-muted-foreground">
        {project.location}
        {project.vendorNo && ` · Vendor No. ${project.vendorNo}`}
      </p>
      <p className="mt-6 max-w-2xl text-[#0a2540]/80">{project.description}</p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((url) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={url} src={url} alt={project.title} className="aspect-[4/3] w-full rounded-lg object-cover" />
        ))}
        {images.length === 0 && <p className="text-muted-foreground">No photos yet.</p>}
      </div>
    </main>
  );
}
