import { asc } from "drizzle-orm";
import { db } from "@/db/client";
import { accreditations } from "@/db/schema";
import { PageHeader } from "@/components/admin/page-header";
import { AccreditationsManager } from "@/components/admin/accreditations-manager";

export const dynamic = "force-dynamic";

export default async function AccreditationsPage() {
  const rows = await db.select().from(accreditations).orderBy(asc(accreditations.order)).all();

  return (
    <div>
      <PageHeader title="Accreditations" subtitle="Logos in the footer's Accredited By strip." />
      <AccreditationsManager
        initial={rows.map((a) => ({ id: a.id, name: a.name, logoUrl: a.logoUrl, light: a.light, active: a.active }))}
      />
    </div>
  );
}
