import Link from "next/link";
import { db } from "@/db/client";
import { services } from "@/db/schema";
import { asc } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";

export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  const allServices = await db.select().from(services).orderBy(asc(services.order)).all();

  return (
    <div>
      <PageHeader
        title="Services"
        subtitle="The nine service cards on the Services page."
        action={
          <Button asChild>
            <Link href="/admin/services/new">
              <Plus className="h-4 w-4" /> New service
            </Link>
          </Button>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>All services</CardTitle>
          <CardDescription>{allServices.length} total</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Anchor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {allServices.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="text-muted-foreground">{s.order + 1}</TableCell>
                  <TableCell className="font-medium">{s.title}</TableCell>
                  <TableCell className="text-muted-foreground">/{s.anchor}</TableCell>
                  <TableCell>
                    <Badge variant={s.published ? "success" : "secondary"}>
                      {s.published ? "Published" : "Draft"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/admin/services/${s.id}`}>Edit</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {allServices.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    No services yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
