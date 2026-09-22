import { db } from "@/db/client";
import { services, projects, mediaAssets, settings } from "@/db/schema";
import { count, desc } from "drizzle-orm";
import Link from "next/link";
import { PageHeader } from "@/components/admin/page-header";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminOverview() {
  const [[{ n: serviceCount }], [{ n: projectCount }], [{ n: mediaCount }], [{ n: settingCount }], recentProjects, recentServices] =
    await Promise.all([
      db.select({ n: count() }).from(services).all(),
      db.select({ n: count() }).from(projects).all(),
      db.select({ n: count() }).from(mediaAssets).all(),
      db.select({ n: count() }).from(settings).all(),
      db.select().from(projects).orderBy(desc(projects.updatedAt)).limit(5).all(),
      db.select().from(services).orderBy(desc(services.updatedAt)).limit(5).all(),
    ]);

  const stats = [
    { title: "Services", value: serviceCount, href: "/admin/services" },
    { title: "Projects", value: projectCount, href: "/admin/projects" },
    { title: "Media assets", value: mediaCount, href: "/admin/media" },
    { title: "Site text fields", value: settingCount, href: "/admin/settings" },
  ];

  return (
    <div>
      <PageHeader title="Content overview" subtitle="Everything editable on arfad.com.sa, in one place." />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <Link
            key={s.title}
            href={s.href}
            className="rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/40"
          >
            <p className="text-sm text-muted-foreground">{s.title}</p>
            <p className="mt-2 text-3xl font-semibold tracking-tight">{s.value}</p>
          </Link>
        ))}
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="font-semibold">Recently updated projects</p>
          <div className="mt-4 space-y-1">
            {recentProjects.length === 0 && <p className="py-4 text-sm text-muted-foreground">No projects yet.</p>}
            {recentProjects.map((p) => (
              <div key={p.id} className="flex items-center justify-between gap-3 rounded-xl px-2 py-2.5 hover:bg-secondary/50">
                <span className="truncate text-sm font-medium">{p.title}</span>
                <StatusBadge published={!!p.published} />
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="font-semibold">Recently updated services</p>
          <div className="mt-4 space-y-1">
            {recentServices.length === 0 && <p className="py-4 text-sm text-muted-foreground">No services yet.</p>}
            {recentServices.map((s) => (
              <div key={s.id} className="flex items-center justify-between gap-3 rounded-xl px-2 py-2.5 hover:bg-secondary/50">
                <span className="truncate text-sm font-medium">{s.title}</span>
                <StatusBadge published={!!s.published} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ published }: { published: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
        published
          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-500"
          : "border-amber-500/30 bg-amber-500/10 text-amber-500"
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", published ? "bg-emerald-500" : "bg-amber-500")} />
      {published ? "Published" : "Draft"}
    </span>
  );
}
