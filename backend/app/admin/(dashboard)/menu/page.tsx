import { PageHeader } from "@/components/admin/page-header";
import { MenuManager } from "@/components/admin/menu-manager";
import { getNavTree } from "@/lib/site-content";

export const dynamic = "force-dynamic";

export default async function MenuPage() {
  const items = await getNavTree();
  return (
    <div>
      <PageHeader title="Menu" subtitle="The website header: top tabs and their dropdown sub tabs." />
      <MenuManager initial={items} />
    </div>
  );
}
