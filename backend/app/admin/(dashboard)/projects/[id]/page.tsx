import { notFound } from "next/navigation";
import { db } from "@/db/client";
import { projects } from "@/db/schema";
import { eq } from "drizzle-orm";
import { ProjectForm } from "@/components/admin/project-form";

export const dynamic = "force-dynamic";

export default async function EditProjectPage({ params }: { params: { id: string } }) {
  const project = await db.select().from(projects).where(eq(projects.id, params.id)).get();
  if (!project) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Edit project</h1>
        <p className="text-sm text-muted-foreground">{project.title}</p>
      </div>
      <ProjectForm
        initial={{
          id: project.id,
          slug: project.slug,
          title: project.title,
          client: project.client,
          location: project.location,
          scope: project.scope,
          description: project.description,
          vendorNo: project.vendorNo || "",
          featured: project.featured,
          images: JSON.parse(project.images || "[]"),
          published: project.published,
        }}
      />
    </div>
  );
}
