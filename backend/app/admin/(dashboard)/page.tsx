import { Card, Title, Text, Metric, Grid, Flex, BadgeDelta, List, ListItem } from "@tremor/react";
import { db } from "@/db/client";
import { services, projects, mediaAssets, settings } from "@/db/schema";
import { count, desc } from "drizzle-orm";
import Link from "next/link";

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
    <div className="space-y-8">
      <div>
        <Title>Overview</Title>
        <Text>Everything editable on arfad.com.sa, in one place.</Text>
      </div>

      <Grid numItemsSm={2} numItemsLg={4} className="gap-4">
        {stats.map((s) => (
          <Link key={s.title} href={s.href}>
            <Card decoration="top" decorationColor="blue" className="cursor-pointer transition hover:shadow-md">
              <Text>{s.title}</Text>
              <Metric>{s.value}</Metric>
            </Card>
          </Link>
        ))}
      </Grid>

      <Grid numItemsMd={2} className="gap-4">
        <Card>
          <Title>Recently updated projects</Title>
          <List className="mt-4">
            {recentProjects.length === 0 && <Text className="py-4">No projects yet.</Text>}
            {recentProjects.map((p) => (
              <ListItem key={p.id}>
                <Flex justifyContent="start" className="gap-2 truncate">
                  <Text className="truncate font-medium text-foreground">{p.title}</Text>
                </Flex>
                <BadgeDelta deltaType={p.published ? "increase" : "moderateDecrease"}>
                  {p.published ? "Published" : "Draft"}
                </BadgeDelta>
              </ListItem>
            ))}
          </List>
        </Card>
        <Card>
          <Title>Recently updated services</Title>
          <List className="mt-4">
            {recentServices.length === 0 && <Text className="py-4">No services yet.</Text>}
            {recentServices.map((s) => (
              <ListItem key={s.id}>
                <Text className="font-medium text-foreground">{s.title}</Text>
                <BadgeDelta deltaType={s.published ? "increase" : "moderateDecrease"}>
                  {s.published ? "Published" : "Draft"}
                </BadgeDelta>
              </ListItem>
            ))}
          </List>
        </Card>
      </Grid>
    </div>
  );
}
