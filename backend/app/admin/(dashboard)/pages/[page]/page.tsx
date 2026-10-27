import { notFound } from "next/navigation";
import { PageHeader } from "@/components/admin/page-header";
import { PageEditor } from "@/components/admin/page-editor";
import { CATALOG, getOverrides, isPage } from "@/lib/page-overrides";

export const dynamic = "force-dynamic";

export default async function EditPage({ params }: { params: { page: string } }) {
  const file = decodeURIComponent(params.page);
  if (!isPage(file)) notFound();
  return (
    <div>
      <PageHeader title={CATALOG[file].title} subtitle={`/${file}`} />
      <PageEditor file={file} page={CATALOG[file]} initial={await getOverrides(file)} pageFiles={Object.keys(CATALOG).sort()} />
    </div>
  );
}
