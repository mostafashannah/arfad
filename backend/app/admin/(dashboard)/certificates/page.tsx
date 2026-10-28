import { PageHeader } from "@/components/admin/page-header";
import { CertificatesManager } from "@/components/admin/certificates-manager";
import { defaultCertificates, getSavedCertificates } from "@/lib/certificates";

export const dynamic = "force-dynamic";

export default async function CertificatesPage() {
  const saved = await getSavedCertificates();
  return (
    <div>
      <PageHeader title="Certificates" subtitle="Every certificate on Factory > Certificates & Awards: tabs, titles, files, logos and order." />
      <CertificatesManager initial={saved ?? defaultCertificates()} edited={!!saved} />
    </div>
  );
}
