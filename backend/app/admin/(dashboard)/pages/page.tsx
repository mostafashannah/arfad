import { PageHeader } from "@/components/admin/page-header";
import { PagesList } from "@/components/admin/pages-list";
import { CATALOG, countEdited } from "@/lib/page-overrides";

export const dynamic = "force-dynamic";

export default async function PagesAdmin() {
  const edited = await countEdited();
  const pages = Object.entries(CATALOG)
    .map(([file, p]) => ({ file, title: p.title, editable: p.items.length, edited: edited[file] ?? 0 }))
    .sort((a, b) => (a.file === "index.html" ? -1 : b.file === "index.html" ? 1 : a.title.localeCompare(b.title)));
  return (
    <div>
      <PageHeader title="Pages" subtitle="Edit the text and pictures of any page, including the page header slider." />
      <PagesList pages={pages} />
    </div>
  );
}
