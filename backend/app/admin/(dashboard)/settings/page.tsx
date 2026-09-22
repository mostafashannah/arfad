import { db } from "@/db/client";
import { settings } from "@/db/schema";
import { asc } from "drizzle-orm";
import { SettingsForm } from "@/components/admin/settings-form";

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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Site Settings</h1>
        <p className="text-sm text-muted-foreground">
          Freeform text used across the site — hero copy, stats, contact info, about section.
        </p>
      </div>

      <SettingsForm grouped={grouped} labels={SECTION_LABELS} />
    </div>
  );
}
