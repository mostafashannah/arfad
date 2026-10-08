"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ArrowDown, ArrowUp, Loader2, Plus, RotateCcw, Save, Trash2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FooterDoc } from "@/lib/site-content";

const HINT =
  "The Request a Quote button is fixed. Changes appear on the website within about a minute. Links are page filenames like services.html or full URLs.";

async function api(url: string, method: string, body?: unknown) {
  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
}

function move<T>(list: T[], i: number, dir: -1 | 1) {
  const j = i + dir;
  if (j < 0 || j >= list.length) return list;
  const next = [...list];
  [next[i], next[j]] = [next[j], next[i]];
  return next;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium">{label}</span>
      {children}
    </label>
  );
}

const lines = (v: string) => v.split("\n");
const clean = (v: string[]) => v.map((s) => s.trim()).filter(Boolean);

export function FooterManager({ initial }: { initial: FooterDoc }) {
  const [f, setF] = useState<FooterDoc>(initial);
  const [addr, setAddr] = useState(initial.contact.addressLines.join("\n"));
  const [cred, setCred] = useState(initial.contact.credentials.join("\n"));
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const setBrand = (p: Partial<FooterDoc["brand"]>) => setF({ ...f, brand: { ...f.brand, ...p } });
  const setContact = (p: Partial<FooterDoc["contact"]>) => setF({ ...f, contact: { ...f.contact, ...p } });
  const setBottom = (p: Partial<FooterDoc["bottom"]>) => setF({ ...f, bottom: { ...f.bottom, ...p } });
  const setCol = (i: number, p: Partial<FooterDoc["columns"][number]>) =>
    setF({ ...f, columns: f.columns.map((c, x) => (x === i ? { ...c, ...p } : c)) });

  function adopt(doc: FooterDoc) {
    setF(doc);
    setAddr(doc.contact.addressLines.join("\n"));
    setCred(doc.contact.credentials.join("\n"));
  }

  async function run(fn: () => Promise<{ footer: FooterDoc }>, okText: string) {
    setBusy(true);
    setMsg(null);
    try {
      adopt((await fn()).footer);
      setMsg({ ok: true, text: okText });
    } catch (e: any) {
      setMsg({ ok: false, text: e.message });
    } finally {
      setBusy(false);
    }
  }

  const save = () =>
    run(
      () =>
        api("/api/footer/admin", "PUT", {
          ...f,
          brand: { ...f.brand, badges: clean(f.brand.badges) },
          contact: { ...f.contact, addressLines: clean(lines(addr)), credentials: clean(lines(cred)) },
        }),
      "Footer saved. It will appear on the website within about a minute."
    );
  const reset = () => {
    if (!confirm("Reset the footer to the default? Your changes will be lost.")) return;
    run(() => api("/api/footer/admin/reset", "POST"), "Footer reset to default.");
  };

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">{HINT}</p>

      <Card>
        <CardHeader><CardTitle>Brand</CardTitle></CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <Field label="Title"><Input value={f.brand.title} onChange={(e) => setBrand({ title: e.target.value })} /></Field>
          <Field label="Arabic name"><Input dir="rtl" value={f.brand.arabicName} onChange={(e) => setBrand({ arabicName: e.target.value })} /></Field>
          <div className="md:col-span-2">
            <Field label="Tagline"><Textarea rows={2} value={f.brand.tagline} onChange={(e) => setBrand({ tagline: e.target.value })} /></Field>
          </div>
          <Field label="Download button label"><Input value={f.brand.downloadLabel} onChange={(e) => setBrand({ downloadLabel: e.target.value })} /></Field>
          <div className="space-y-2">
            <span className="text-sm font-medium">Badges</span>
            {f.brand.badges.map((b, i) => (
              <div key={i} className="flex gap-2">
                <Input value={b} onChange={(e) => setBrand({ badges: f.brand.badges.map((x, y) => (y === i ? e.target.value : x)) })} />
                <Button variant="outline" size="sm" onClick={() => setBrand({ badges: f.brand.badges.filter((_, y) => y !== i) })} title="Remove"><X className="h-3.5 w-3.5" /></Button>
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={() => setBrand({ badges: [...f.brand.badges, ""] })}><Plus className="h-3.5 w-3.5" /> Add badge</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Link columns</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {f.columns.map((col, i) => (
            <div key={i} className="space-y-3 rounded-xl border p-3">
              <div className="flex flex-wrap items-center gap-2">
                <Input className="w-60" placeholder="Column title" value={col.title} onChange={(e) => setCol(i, { title: e.target.value })} />
                <Button variant="outline" size="sm" onClick={() => setF({ ...f, columns: move(f.columns, i, -1) })} disabled={i === 0} title="Move column up"><ArrowUp className="h-3.5 w-3.5" /></Button>
                <Button variant="outline" size="sm" onClick={() => setF({ ...f, columns: move(f.columns, i, 1) })} disabled={i === f.columns.length - 1} title="Move column down"><ArrowDown className="h-3.5 w-3.5" /></Button>
                <Button variant="outline" size="sm" onClick={() => confirm(`Delete column "${col.title}"?`) && setF({ ...f, columns: f.columns.filter((_, x) => x !== i) })} title="Delete column"><Trash2 className="h-3.5 w-3.5" /></Button>
              </div>
              {col.links.map((l, j) => (
                <div key={j} className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Input className="w-48" placeholder="Label" value={l.label} onChange={(e) => setCol(i, { links: col.links.map((x, y) => (y === j ? { ...x, label: e.target.value } : x)) })} />
                    <Input className="min-w-[10rem] flex-1" placeholder="services.html or https://..." value={l.href} onChange={(e) => setCol(i, { links: col.links.map((x, y) => (y === j ? { ...x, href: e.target.value } : x)) })} />
                    <Button variant="outline" size="sm" onClick={() => setCol(i, { links: move(col.links, j, -1) })} disabled={j === 0} title="Move up"><ArrowUp className="h-3.5 w-3.5" /></Button>
                    <Button variant="outline" size="sm" onClick={() => setCol(i, { links: move(col.links, j, 1) })} disabled={j === col.links.length - 1} title="Move down"><ArrowDown className="h-3.5 w-3.5" /></Button>
                    <Button variant="outline" size="sm" onClick={() => setCol(i, { links: col.links.filter((_, y) => y !== j) })} title="Remove link"><Trash2 className="h-3.5 w-3.5" /></Button>
                  </div>
                  {(!l.label.trim() || !l.href.trim()) && <p className="text-xs text-destructive">Label and link must not be empty.</p>}
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={() => setCol(i, { links: [...col.links, { label: "", href: "" }] })}><Plus className="h-3.5 w-3.5" /> Add link</Button>
            </div>
          ))}
          <Button variant="outline" onClick={() => setF({ ...f, columns: [...f.columns, { title: "", links: [] }] })}><Plus className="h-4 w-4" /> Add column</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Contact</CardTitle></CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <Field label="Heading"><Input value={f.contact.title} onChange={(e) => setContact({ title: e.target.value })} /></Field>
          <Field label="Email"><Input value={f.contact.email} onChange={(e) => setContact({ email: e.target.value })} /></Field>
          <Field label="Address lines (one per line)"><Textarea rows={3} value={addr} onChange={(e) => setAddr(e.target.value)} /></Field>
          <div className="space-y-4">
            <Field label="Phone"><Input value={f.contact.phone} onChange={(e) => setContact({ phone: e.target.value })} /></Field>
            <Field label="Mobile (display number)"><Input value={f.contact.mobile} onChange={(e) => setContact({ mobile: e.target.value })} /></Field>
          </div>
          <Field label="WhatsApp number (digits only, e.g. 966569164017)"><Input inputMode="numeric" value={f.contact.mobileWhatsApp} onChange={(e) => setContact({ mobileWhatsApp: e.target.value })} /></Field>
          <Field label="Credentials heading"><Input value={f.contact.credentialsTitle} onChange={(e) => setContact({ credentialsTitle: e.target.value })} /></Field>
          <div className="md:col-span-2">
            <Field label="Credentials (one per line)"><Textarea rows={3} value={cred} onChange={(e) => setCred(e.target.value)} /></Field>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Accreditations and bottom bar</CardTitle></CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <Field label="Accredited By heading"><Input value={f.accreditedLabel} onChange={(e) => setF({ ...f, accreditedLabel: e.target.value })} /></Field>
          </div>
          <Field label="Bottom bar, left text"><Input value={f.bottom.left} onChange={(e) => setBottom({ left: e.target.value })} /></Field>
          <Field label="Bottom bar, right text"><Input value={f.bottom.right} onChange={(e) => setBottom({ right: e.target.value })} /></Field>
        </CardContent>
      </Card>

      <div className="sticky bottom-0 flex items-center gap-3 rounded-xl border bg-card px-4 py-3">
        <Button onClick={save} disabled={busy}>
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save footer
        </Button>
        <Button variant="outline" onClick={reset} disabled={busy}><RotateCcw className="h-4 w-4" /> Reset to default</Button>
        {msg && <p className={cn("text-sm", msg.ok ? "text-muted-foreground" : "text-destructive")}>{msg.text}</p>}
      </div>
    </div>
  );
}
