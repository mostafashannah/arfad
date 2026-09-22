import { AreaChart } from "@tremor/react";
import { sqlite } from "@/db/client";
import { PageHeader } from "@/components/admin/page-header";

export const dynamic = "force-dynamic";

type Row = Record<string, unknown>;

function countryName(code: string | null) {
  if (!code) return "Unknown";
  try {
    return new Intl.DisplayNames(["en"], { type: "region" }).of(code) ?? code;
  } catch {
    return code;
  }
}

export default async function AnalyticsPage() {
  const [totalRes, last30Res, dailyRes, countryRes, pathRes] = await Promise.all([
    sqlite.execute(`SELECT COUNT(*) AS n FROM page_views`),
    sqlite.execute(`SELECT COUNT(*) AS n FROM page_views WHERE created_at >= unixepoch('now','-30 days')`),
    sqlite.execute(
      `SELECT date(created_at, 'unixepoch') AS day, COUNT(*) AS n FROM page_views
       WHERE created_at >= unixepoch('now','-30 days')
       GROUP BY day ORDER BY day ASC`
    ),
    sqlite.execute(
      `SELECT country, COUNT(*) AS n FROM page_views
       WHERE created_at >= unixepoch('now','-30 days')
       GROUP BY country ORDER BY n DESC LIMIT 10`
    ),
    sqlite.execute(
      `SELECT path, COUNT(*) AS n FROM page_views
       WHERE created_at >= unixepoch('now','-30 days')
       GROUP BY path ORDER BY n DESC LIMIT 15`
    ),
  ]);

  const total = Number((totalRes.rows[0] as Row)?.n ?? 0);
  const last30 = Number((last30Res.rows[0] as Row)?.n ?? 0);

  const dailyMap = new Map<string, number>();
  for (const r of dailyRes.rows as unknown as Row[]) dailyMap.set(String(r.day), Number(r.n));
  const chartData: { day: string; Views: number }[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setUTCDate(d.getUTCDate() - i);
    const key = d.toISOString().slice(0, 10);
    chartData.push({ day: key.slice(5), Views: dailyMap.get(key) ?? 0 });
  }

  const countries = (countryRes.rows as unknown as Row[]).map((r) => ({
    code: r.country as string | null,
    name: countryName(r.country as string | null),
    n: Number(r.n),
  }));
  const topCountry = countries[0];
  const maxCountryViews = countries[0]?.n ?? 1;

  const paths = (pathRes.rows as unknown as Row[]).map((r) => ({
    path: r.path as string,
    n: Number(r.n),
  }));
  const maxPathViews = paths[0]?.n ?? 1;

  return (
    <div>
      <PageHeader title="Analytics" subtitle="Traffic across the public site — visits, where from, and which pages." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="text-sm text-muted-foreground">All-time pageviews</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight">{total.toLocaleString()}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="text-sm text-muted-foreground">Last 30 days</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight">{last30.toLocaleString()}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="text-sm text-muted-foreground">Top country (30d)</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight">{topCountry ? topCountry.name : "—"}</p>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-border bg-card p-5">
        <p className="font-semibold">Daily traffic — last 30 days</p>
        <AreaChart
          className="mt-4 h-64"
          data={chartData}
          index="day"
          categories={["Views"]}
          colors={["violet"]}
          showAnimation
          showLegend={false}
        />
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="font-semibold">Top countries (30d)</p>
          <p className="mt-1 text-sm text-muted-foreground">Resolved from visitor IP address, offline lookup.</p>
          <div className="mt-4 space-y-3">
            {countries.length === 0 && <p className="py-4 text-sm text-muted-foreground">No traffic recorded yet.</p>}
            {countries.map((c) => (
              <div key={c.code ?? "unknown"}>
                <div className="flex items-center justify-between text-sm">
                  <span className="truncate font-medium">{c.name}</span>
                  <span className="text-muted-foreground">{c.n.toLocaleString()}</span>
                </div>
                <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${Math.max(4, (c.n / maxCountryViews) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="font-semibold">Top pages (30d)</p>
          <p className="mt-1 text-sm text-muted-foreground">Which pages get visited.</p>
          <div className="mt-4 space-y-3">
            {paths.length === 0 && <p className="py-4 text-sm text-muted-foreground">No traffic recorded yet.</p>}
            {paths.map((p) => (
              <div key={p.path}>
                <div className="flex items-center justify-between text-sm">
                  <span className="truncate font-medium">{p.path}</span>
                  <span className="text-muted-foreground">{p.n.toLocaleString()}</span>
                </div>
                <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${Math.max(4, (p.n / maxPathViews) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
