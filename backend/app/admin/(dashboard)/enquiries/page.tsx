import { desc } from "drizzle-orm";
import { db } from "@/db/client";
import { enquiries } from "@/db/schema";
import { PageHeader } from "@/components/admin/page-header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

const STATUS_STYLES: Record<string, string> = {
  sent: "border-emerald-500/30 bg-emerald-500/10 text-emerald-500",
  failed: "border-red-500/30 bg-red-500/10 text-red-500",
  not_configured: "border-amber-500/30 bg-amber-500/10 text-amber-500",
  pending: "border-border bg-secondary text-muted-foreground",
};

const STATUS_LABELS: Record<string, string> = {
  sent: "Sent",
  failed: "Failed",
  not_configured: "Not configured",
  pending: "Pending",
};

export default async function EnquiriesPage() {
  const rows = await db.select().from(enquiries).orderBy(desc(enquiries.createdAt), desc(enquiries.id)).limit(200).all();
  const hasUnconfigured = rows.some((r) => r.emailStatus === "not_configured");

  return (
    <div>
      <PageHeader title="Enquiries" subtitle="Messages sent through the website enquiry form." />

      {hasUnconfigured && (
        <Card className="mb-6 border-amber-500/30">
          <CardHeader>
            <CardTitle>Email delivery is not configured</CardTitle>
            <CardDescription>
              Set the SMTP environment variables (SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, MAIL_FROM, MAIL_TO) on the
              server for enquiry emails to be delivered. Until then, enquiries are still being stored here.
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Latest enquiries</CardTitle>
          <CardDescription>{rows.length} shown (newest first, up to 200)</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>CV</TableHead>
                <TableHead>Email status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} className="text-center text-muted-foreground">
                    No enquiries yet.
                  </TableCell>
                </TableRow>
              )}
              {rows.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="whitespace-nowrap text-muted-foreground">
                    {r.createdAt.toISOString().slice(0, 16).replace("T", " ")}
                  </TableCell>
                  <TableCell className="font-medium">{r.name}</TableCell>
                  <TableCell>
                    <a href={`mailto:${r.email}`} className="underline-offset-2 hover:underline">
                      {r.email}
                    </a>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">{r.phone || "-"}</TableCell>
                  <TableCell>{r.enquiryType || "-"}</TableCell>
                  <TableCell>{r.subject || "-"}</TableCell>
                  <TableCell className="max-w-xs" title={r.message}>
                    {r.message.length > 120 ? `${r.message.slice(0, 120)}…` : r.message}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {r.cvFile ? (
                      <a href={`/api/enquiries/${r.id}/cv`} className="underline-offset-2 hover:underline" title={r.cvName ?? "CV"}>
                        Download CV
                      </a>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span
                      title={r.emailError ?? undefined}
                      className={cn(
                        "inline-flex whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-medium",
                        STATUS_STYLES[r.emailStatus]
                      )}
                    >
                      {STATUS_LABELS[r.emailStatus]}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
