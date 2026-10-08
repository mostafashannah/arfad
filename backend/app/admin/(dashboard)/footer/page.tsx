import { PageHeader } from "@/components/admin/page-header";
import { FooterManager } from "@/components/admin/footer-manager";
import { getFooter } from "@/lib/site-content";

export const dynamic = "force-dynamic";

export default async function FooterPage() {
  const footer = await getFooter();
  return (
    <div>
      <PageHeader title="Footer" subtitle="Everything shown in the website footer." />
      <FooterManager initial={footer} />
    </div>
  );
}
