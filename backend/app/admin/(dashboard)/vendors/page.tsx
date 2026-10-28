import { asc } from "drizzle-orm";
import { db } from "@/db/client";
import { vendors } from "@/db/schema";
import { PageHeader } from "@/components/admin/page-header";
import { VendorsManager } from "@/components/admin/vendors-manager";

export const dynamic = "force-dynamic";

export default async function VendorsPage() {
  const rows = await db.select().from(vendors).orderBy(asc(vendors.order)).all();
  return (
    <div>
      <PageHeader title="Vendors" subtitle="Registered vendor cards on the Factory > Registered Vendors page. Add, rename, change the vendor ID, replace logos, reorder or hide." />
      <VendorsManager initial={rows.map((v) => ({ id: v.id, name: v.name, vendorNo: v.vendorNo, logoUrl: v.logoUrl, active: v.active }))} />
    </div>
  );
}
