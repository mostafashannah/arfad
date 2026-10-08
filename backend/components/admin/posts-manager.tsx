"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

type Row = { id: string; title: string; category: string; publishedAt: string; published: boolean; coverUrl: string | null };

const FILTERS = [
  { value: "all", label: "All" },
  { value: "news", label: "News" },
  { value: "events", label: "Events" },
  { value: "exhibitions", label: "Exhibitions" },
];

export function PostsManager({ posts }: { posts: Row[] }) {
  const router = useRouter();
  const [filter, setFilter] = useState("all");
  const [error, setError] = useState<string | null>(null);
  const rows = filter === "all" ? posts : posts.filter((p) => p.category === filter);

  async function onDelete(p: Row) {
    if (!confirm(`Delete "${p.title}"? This can't be undone.`)) return;
    const res = await fetch(`/api/posts/admin/${p.id}`, { method: "DELETE" });
    if (!res.ok) return setError("Failed to delete");
    setError(null);
    router.refresh();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>All posts</CardTitle>
        <CardDescription>{rows.length} shown</CardDescription>
        <div className="flex flex-wrap gap-2 pt-2">
          {FILTERS.map((f) => (
            <Button key={f.value} size="sm" variant={filter === f.value ? "default" : "outline"} onClick={() => setFilter(f.value)}>
              {f.label}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        {error && <p className="pb-3 text-sm text-destructive">{error}</p>}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead />
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((p) => (
              <TableRow key={p.id}>
                <TableCell>
                  {p.coverUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.coverUrl} alt="" className="h-10 w-16 rounded object-cover" />
                  ) : (
                    <div className="h-10 w-16 rounded border border-dashed" />
                  )}
                </TableCell>
                <TableCell className="font-medium">{p.title}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="capitalize">{p.category}</Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{p.publishedAt}</TableCell>
                <TableCell>
                  <Badge variant={p.published ? "success" : "secondary"}>{p.published ? "Published" : "Draft"}</Badge>
                </TableCell>
                <TableCell className="space-x-2 text-right">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/admin/posts/${p.id}`}>Edit</Link>
                  </Button>
                  <Button variant="outline" size="sm" className="text-destructive" onClick={() => onDelete(p)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  No posts yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
