import { db } from "@/db/client";
import { settings } from "@/db/schema";
import { asc } from "drizzle-orm";
import { SettingsForm } from "@/components/admin/settings-form";
import { PageHeader } from "@/components/admin/page-header";

export const dynamic = "force-dynamic";

const SECTION_LABELS: Record<string, string> = {
  hero: "Homepage Hero",
  stats: "Homepage Stats",
  contact: "Contact Details",
  about: "About / Company Story",
};

export default async function SettingsPage() {
  const all = await db.select().from(settings).orderBy(asc(settings.section), asc(settings.key)).all();

  const grouped = all.reduce<Record<string, typeof all>>((acc, s) => {
    (acc[s.section] ||= []).push(s);
    return acc;
  }, {});

  return (
    <div>
      <PageHeader
        title="Site Settings"
        subtitle="Freeform text used across the site — hero copy, stats, contact info, about section."
      />
      <SettingsForm grouped={grouped} labels={SECTION_LABELS} />
    </div>
  );
}
