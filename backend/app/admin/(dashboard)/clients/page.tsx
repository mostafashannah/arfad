import { asc } from "drizzle-orm";
import { db } from "@/db/client";
import { clients } from "@/db/schema";
import { PageHeader } from "@/components/admin/page-header";
import { ClientsManager } from "@/components/admin/clients-manager";

export const dynamic = "force-dynamic";

export default async function ClientsPage() {
  const rows = await db.select().from(clients).orderBy(asc(clients.order)).all();

  return (
    <div>
      <PageHeader
        title="Clients"
        subtitle="Client logos shown on the public website. Add, rename, reorder, hide or replace logos."
      />
      <ClientsManager
        initial={rows.map((c) => ({ id: c.id, name: c.name, slug: c.slug, logoUrl: c.logoUrl, active: c.active }))}
      />
    </div>
  );
}
