import { notFound } from "next/navigation";
import { db } from "@/db/client";
import { services } from "@/db/schema";
import { eq } from "drizzle-orm";
import { ServiceForm } from "@/components/admin/service-form";

export const dynamic = "force-dynamic";

export default async function EditServicePage({ params }: { params: { id: string } }) {
  const service = await db.select().from(services).where(eq(services.id, params.id)).get();
  if (!service) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Edit service</h1>
        <p className="text-sm text-muted-foreground">{service.title}</p>
      </div>
      <ServiceForm
        initial={{
          id: service.id,
          anchor: service.anchor,
          title: service.title,
          summary: service.summary,
          image: service.image,
          features: JSON.parse(service.features || "[]"),
          published: service.published,
        }}
      />
    </div>
  );
}
