"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GalleryPicker, ImagePicker } from "@/components/admin/image-picker";
import { ArrowLeft, ExternalLink, Loader2, RotateCcw, Save } from "lucide-react";
import type { CatalogItem, CatalogPage, Overrides } from "@/lib/page-overrides";

const TAG_LABEL: Record<string, string> = { h1: "Main heading", h2: "Heading", h3: "Sub-heading", h4: "Sub-heading", p: "Paragraph", li: "List item", a: "Button", span: "Label", figcaption: "Caption" };

// the site stores picture paths like "img/x.jpg"; the admin needs a root-relative URL to preview them
const abs = (u: string) => (/^(https?:)?\/\//.test(u) || u.startsWith("/") ? u : `/${u}`);
const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);

export function PageEditor({ file, page, initial, pageFiles = [] }: { file: string; page: CatalogPage; initial: Overrides; pageFiles?: string[] }) {
  const [values, setValues] = useState<Overrides>(initial);
  const [saved, setSaved] = useState<Overrides>(initial);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const groups = useMemo(() => {
    const order: string[] = [];
    const map: Record<string, CatalogItem[]> = {};
    for (const it of page.items) {
      if (!map[it.group]) {
        map[it.group] = [];
        order.push(it.group);
      }
      map[it.group].push(it);
    }
    // page header first, and its pictures before its texts
    order.sort((a, b) => (a === "Page header" ? -1 : b === "Page header" ? 1 : 0));
    return order.map((g) => ({ name: g, items: [...map[g]].sort((a, b) => Number(b.kind === "hero") - Number(a.kind === "hero")) }));
  }, [page]);

  const dirty = !same(values, saved);
  const changed = Object.keys(values).length;

  function setValue(key: string, v: string | string[] | null) {
    setValues((cur) => {
      const next = { ...cur };
      if (v == null || (Array.isArray(v) && v.length === 0) || v === "") delete next[key];
      else next[key] = v;
      return next;
    });
    setMsg(null);
  }

  async function save() {
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch(`/api/pages/admin/${encodeURIComponent(file)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ overrides: values }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not save");
      setValues(data.overrides);
      setSaved(data.overrides);
      setMsg({ ok: true, text: "Saved. The page shows the changes within about a minute." });
    } catch (e: any) {
      setMsg({ ok: false, text: e.message });
    } finally {
      setBusy(false);
    }
  }

  function resetAll() {
    if (!confirm("Put every item on this page back to its original text and pictures?")) return;
    setValues({});
    setMsg(null);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button asChild variant="ghost" size="sm">
          <Link href="/admin/pages">
            <ArrowLeft className="h-4 w-4" /> All pages
          </Link>
        </Button>
        <div className="flex flex-wrap items-center gap-2">
          <Button asChild variant="outline" size="sm">
            <a href={`/${file}`} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-3.5 w-3.5" /> View page
            </a>
          </Button>
          <Button variant="outline" size="sm" onClick={resetAll} disabled={changed === 0 || busy}>
            <RotateCcw className="h-3.5 w-3.5" /> Reset page
          </Button>
          <Button size="sm" onClick={save} disabled={!dirty || busy}>
            {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />} Save changes
          </Button>
        </div>
      </div>
      <datalist id="site-pages">
        {pageFiles.map((f) => (
          <option key={f} value={f} />
        ))}
      </datalist>
      {msg && <p className={msg.ok ? "text-sm text-emerald-600" : "text-sm text-destructive"}>{msg.text}</p>}

      {groups.map((g) => (
        <Card key={g.name}>
          <CardHeader>
            <CardTitle className="text-base">{g.name}</CardTitle>
            <CardDescription>{g.items.length} editable item{g.items.length === 1 ? "" : "s"}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {g.items.map((it) => {
              const edited = it.key in values;
              return (
                <div key={it.key} className="space-y-2 border-b pb-5 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{it.kind === "hero" ? "Header slider" : it.kind === "link" ? `Button link: ${it.text ?? ""}` : it.kind === "image" ? "Picture" : TAG_LABEL[it.tag] || "Text"}</Badge>
                      {edited && <Badge variant="success">Edited</Badge>}
                    </div>
                    {edited && (
                      <Button type="button" variant="ghost" size="sm" onClick={() => setValue(it.key, null)}>
                        <RotateCcw className="h-3.5 w-3.5" /> Original
                      </Button>
                    )}
                  </div>

                  {it.kind === "text" &&
                    (((values[it.key] as string) ?? it.text ?? "").length > 70 || (it.text ?? "").includes("\n") ? (
                      <Textarea
                        rows={Math.min(10, Math.max(3, Math.ceil(((values[it.key] as string) ?? it.text ?? "").length / 90)))}
                        value={(values[it.key] as string) ?? it.text ?? ""}
                        onChange={(e) => setValue(it.key, e.target.value === it.text ? null : e.target.value)}
                      />
                    ) : (
                      <Input value={(values[it.key] as string) ?? it.text ?? ""} onChange={(e) => setValue(it.key, e.target.value === it.text ? null : e.target.value)} />
                    ))}

                  {it.kind === "link" && (
                    <div className="space-y-1">
                      <Input
                        list="site-pages"
                        placeholder="contact.html, projects.html, https://..., mailto:..."
                        value={(values[it.key] as string) ?? it.url ?? ""}
                        onChange={(e) => setValue(it.key, e.target.value === it.url ? null : e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">Where this button leads. Use a page file name from the list, a full web address, or mailto: / tel:.</p>
                    </div>
                  )}

                  {it.kind === "image" && (
                    <ImagePicker
                      value={(values[it.key] as string) ?? it.url ? abs(((values[it.key] as string) ?? it.url) as string) : null}
                      onChange={(url) => setValue(it.key, url && abs(url) !== abs(it.url ?? "") ? url : null)}
                    />
                  )}

                  {it.kind === "hero" && (
                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground">
                        One picture shows as a fixed header. Add two or more pictures or videos (MP4, up to 40 MB) and the header becomes a slider that changes every few seconds. Use the arrows to set the order.
                      </p>
                      <GalleryPicker
                        allowVideo
                        value={((values[it.key] as string[]) ?? it.images ?? []).map(abs)}
                        onChange={(urls) => setValue(it.key, same(urls, (it.images ?? []).map(abs)) ? null : urls)}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
