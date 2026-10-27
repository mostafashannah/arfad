"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ExternalLink, Pencil } from "lucide-react";

type Row = { file: string; title: string; editable: number; edited: number };

export function PagesList({ pages }: { pages: Row[] }) {
  const [q, setQ] = useState("");
  const rows = pages.filter((p) => `${p.title} ${p.file}`.toLowerCase().includes(q.trim().toLowerCase()));
  return (
    <Card>
      <CardHeader>
        <CardTitle>All pages</CardTitle>
        <CardDescription>{rows.length} shown. Pick a page to change its text, pictures or header slider.</CardDescription>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search pages..."
          className="mt-2 h-9 w-full max-w-sm rounded-md border border-input bg-transparent px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
        />
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Page</TableHead>
              <TableHead>File</TableHead>
              <TableHead>Editable items</TableHead>
              <TableHead>Edited</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((p) => (
              <TableRow key={p.file}>
                <TableCell className="font-medium">{p.title}</TableCell>
                <TableCell className="text-muted-foreground">{p.file}</TableCell>
                <TableCell>{p.editable}</TableCell>
                <TableCell>{p.edited ? <Badge variant="success">{p.edited} changed</Badge> : <span className="text-muted-foreground">Original</span>}</TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2">
                    <Button asChild size="sm" variant="outline">
                      <a href={`/${p.file}`} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-3.5 w-3.5" /> View
                      </a>
                    </Button>
                    <Button asChild size="sm">
                      <Link href={`/admin/pages/${encodeURIComponent(p.file)}`}>
                        <Pencil className="h-3.5 w-3.5" /> Edit
                      </Link>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
