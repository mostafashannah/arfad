import { Card, Title, Text, Metric, Grid, AreaChart, List, ListItem, Flex, BadgeDelta } from "@tremor/react";
import { sqlite } from "@/db/client";

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

  const paths = (pathRes.rows as unknown as Row[]).map((r) => ({
    path: r.path as string,
    n: Number(r.n),
  }));
  const maxPathViews = paths[0]?.n ?? 1;

  return (
    <div className="space-y-8">
      <div>
        <Title>Analytics</Title>
        <Text>Traffic across the public site — visits, where from, and which pages.</Text>
      </div>

      <Grid numItemsSm={2} numItemsLg={3} className="gap-4">
        <Card decoration="top" decorationColor="blue">
          <Text>All-time pageviews</Text>
          <Metric>{total.toLocaleString()}</Metric>
        </Card>
        <Card decoration="top" decorationColor="blue">
          <Text>Last 30 days</Text>
          <Metric>{last30.toLocaleString()}</Metric>
        </Card>
        <Card decoration="top" decorationColor="blue">
          <Text>Top country (30d)</Text>
          <Metric>{topCountry ? topCountry.name : "—"}</Metric>
        </Card>
      </Grid>

      <Card>
        <Title>Daily traffic — last 30 days</Title>
        <AreaChart
          className="mt-4 h-64"
          data={chartData}
          index="day"
          categories={["Views"]}
          colors={["blue"]}
          showAnimation
          showLegend={false}
        />
      </Card>

      <Grid numItemsMd={2} className="gap-4">
        <Card>
          <Title>Top countries (30d)</Title>
          <Text className="mt-1">Resolved from visitor IP address, offline lookup.</Text>
          <List className="mt-4">
            {countries.length === 0 && <Text className="py-4">No traffic recorded yet.</Text>}
            {countries.map((c) => (
              <ListItem key={c.code ?? "unknown"}>
                <Flex justifyContent="start" className="gap-2 truncate">
                  <Text className="truncate font-medium text-foreground">{c.name}</Text>
                </Flex>
                <BadgeDelta deltaType="unchanged">{c.n.toLocaleString()} views</BadgeDelta>
              </ListItem>
            ))}
          </List>
        </Card>
        <Card>
          <Title>Top pages (30d)</Title>
          <Text className="mt-1">Which pages get visited.</Text>
          <div className="mt-4 space-y-3">
            {paths.length === 0 && <Text className="py-4">No traffic recorded yet.</Text>}
            {paths.map((p) => (
              <div key={p.path}>
                <Flex>
                  <Text className="truncate font-medium text-foreground">{p.path}</Text>
                  <Text>{p.n.toLocaleString()}</Text>
                </Flex>
                <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-blue-500"
                    style={{ width: `${Math.max(4, (p.n / maxPathViews) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </Grid>
    </div>
  );
}
