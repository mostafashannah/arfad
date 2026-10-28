import { PageHeader } from "@/components/admin/page-header";
import { BrandingManager } from "@/components/admin/branding-manager";
import { getBranding } from "@/lib/branding";

export const dynamic = "force-dynamic";

export default async function BrandingPage() {
  return (
    <div>
      <PageHeader title="Logos" subtitle="The logo shown in the website header and the logo block in the footer." />
      <BrandingManager initial={await getBranding()} />
    </div>
  );
}
