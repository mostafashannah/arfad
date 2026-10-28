"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ArrowDown, ArrowUp, FileText, Loader2, Plus, RotateCcw, Save, Trash2, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CertItem, CertTab, Certificates } from "@/lib/certificates";

async function upload(file: File, kinds: string[]): Promise<string> {
  if (!kinds.includes(file.type)) throw new Error("Unsupported file type");
  const form = new FormData();
  form.append("file", file);
  form.append("folder", "certificates");
  const res = await fetch("/api/media", { method: "POST", body: form });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Upload failed");
  return data.url as string;
}

const IMG = ["image/png", "image/jpeg", "image/webp", "image/svg+xml"];
const DOC = ["application/pdf", ...IMG];

function UploadButton({ label, accept, kinds, onDone, onError }: { label: string; accept: string; kinds: string[]; onDone: (url: string) => void; onError: (m: string) => void }) {
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  return (
    <>
      <input
        ref={ref}
        type="file"
        accept={accept}
        className="hidden"
        onChange={async (e) => {
          const f = e.target.files?.[0];
          if (!f) return;
          setBusy(true);
          try {
            onDone(await upload(f, kinds));
          } catch (er: any) {
            onError(er.message);
          } finally {
            setBusy(false);
            if (ref.current) ref.current.value = "";
          }
        }}
      />
      <Button type="button" variant="outline" size="sm" onClick={() => ref.current?.click()} disabled={busy}>
        {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />} {label}
      </Button>
    </>
  );
}

export function CertificatesManager({ initial, edited }: { initial: Certificates; edited: boolean }) {
  const [tabs, setTabs] = useState<CertTab[]>(initial.tabs);
  const [sel, setSel] = useState(0);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [custom, setCustom] = useState(edited);
  const tab = tabs[Math.min(sel, tabs.length - 1)];
  const ti = Math.min(sel, tabs.length - 1);

  function setTab(patch: Partial<CertTab>) {
    setTabs((p) => p.map((t, i) => (i === ti ? { ...t, ...patch } : t)));
    setDirty(true);
  }
  function setItem(n: number, patch: Partial<CertItem>) {
    setTab({ items: tab.items.map((it, i) => (i === n ? { ...it, ...patch } : it)) });
  }
  function moveItem(n: number, dir: -1 | 1) {
    const items = [...tab.items];
    const j = n + dir;
    if (j < 0 || j >= items.length) return;
    [items[n], items[j]] = [items[j], items[n]];
    setTab({ items });
  }
  function moveTab(dir: -1 | 1) {
    const j = ti + dir;
    if (j < 0 || j >= tabs.length) return;
    const next = [...tabs];
    [next[ti], next[j]] = [next[j], next[ti]];
    setTabs(next);
    setSel(j);
    setDirty(true);
  }
  function addTab() {
    setTabs((p) => [...p, { id: `tab-${Date.now().toString(36)}`, label: "New category", heading: "New category", lede: "", items: [] }]);
    setSel(tabs.length);
    setDirty(true);
  }
  function removeTab() {
    if (!confirm(`Delete the "${tab.label}" tab and its ${tab.items.length} certificates from the website?`)) return;
    setTabs((p) => p.filter((_, i) => i !== ti));
    setSel(0);
    setDirty(true);
  }

  async function save() {
    setSaving(true);
    setMsg(null);
    try {
      const res = await fetch("/api/certificates", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ certificates: { tabs } }) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Save failed");
      setTabs(data.certificates.tabs);
      setDirty(false);
      setCustom(true);
      setMsg({ ok: true, text: "Saved. The website updates within about a minute." });
    } catch (e: any) {
      setMsg({ ok: false, text: e.message });
    } finally {
      setSaving(false);
    }
  }

  async function reset() {
    if (!confirm("Discard all edits and go back to the built-in certificates?")) return;
    const res = await fetch("/api/certificates", { method: "DELETE" });
    if (res.ok) location.reload();
    else setMsg({ ok: false, text: "Reset failed" });
  }

  const err = (text: string) => setMsg({ ok: false, text });
  const folders = new Set(tab?.items.map((i) => i.group).filter(Boolean)).size > 1;

  return (
    <div className="space-y-4">
      <div className="sticky top-0 z-10 flex flex-wrap items-center gap-3 rounded-xl border bg-background/95 p-3 backdrop-blur">
        <Button onClick={save} disabled={saving || !dirty}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save changes
        </Button>
        {custom && (
          <Button variant="outline" onClick={reset}>
            <RotateCcw className="h-4 w-4" /> Reset to built-in
          </Button>
        )}
        <span className="text-sm text-muted-foreground">{dirty ? "Unsaved changes" : custom ? "Using your saved list" : "Showing the built-in list. Edit and save to take over."}</span>
        {msg && <span className={cn("text-sm", msg.ok ? "text-green-600" : "text-destructive")}>{msg.text}</span>}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {tabs.map((t, i) => (
          <Button key={t.id} variant={i === ti ? "default" : "outline"} size="sm" onClick={() => setSel(i)}>
            {t.label} <span className="ml-1 opacity-60">{t.items.length}</span>
          </Button>
        ))}
        <Button variant="outline" size="sm" onClick={addTab}>
          <Plus className="h-3.5 w-3.5" /> Add category
        </Button>
      </div>

      {tab && (
        <Card>
          <CardHeader className="space-y-3">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <CardTitle>{tab.label}</CardTitle>
                <CardDescription>
                  Tab name, page heading and intro text.{folders ? " Certificates with a Folder name are grouped into folders on the website." : ""}
                </CardDescription>
              </div>
              <div className="flex gap-1.5">
                <Button variant="outline" size="sm" onClick={() => moveTab(-1)} disabled={ti === 0} title="Move tab left"><ArrowUp className="h-3.5 w-3.5" /></Button>
                <Button variant="outline" size="sm" onClick={() => moveTab(1)} disabled={ti === tabs.length - 1} title="Move tab right"><ArrowDown className="h-3.5 w-3.5" /></Button>
                <Button variant="outline" size="sm" onClick={removeTab} title="Delete tab"><Trash2 className="h-3.5 w-3.5" /></Button>
              </div>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              <Input value={tab.label} placeholder="Tab name" onChange={(e) => setTab({ label: e.target.value })} />
              <Input value={tab.heading} placeholder="Page heading" onChange={(e) => setTab({ heading: e.target.value })} />
            </div>
            <textarea
              value={tab.lede}
              placeholder="Intro text"
              rows={3}
              onChange={(e) => setTab({ lede: e.target.value })}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            />
          </CardHeader>
          <CardContent className="space-y-3">
            {tab.items.length === 0 && <p className="text-sm text-muted-foreground">No certificates in this category yet.</p>}
            {tab.items.map((it, n) => (
              <div key={n} className="flex flex-wrap items-start gap-3 rounded-xl border p-3">
                <div className="flex h-16 w-28 flex-none items-center justify-center rounded-lg border bg-white p-2">
                  {it.logo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={it.logo} alt="" className="max-h-full max-w-full object-contain" />
                  ) : (
                    <FileText className="h-6 w-6 text-neutral-400" />
                  )}
                </div>
                <div className="min-w-[16rem] flex-1 space-y-2">
                  <Input value={it.title} placeholder="Title" onChange={(e) => setItem(n, { title: e.target.value })} />
                  <Input value={it.sub} placeholder="Subtitle (issuer, number, validity)" onChange={(e) => setItem(n, { sub: e.target.value })} />
                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <Input value={it.group} placeholder="Folder name (optional)" className="h-8 w-48" onChange={(e) => setItem(n, { group: e.target.value })} />
                    {it.file ? (
                      <a href={it.file} target="_blank" rel="noreferrer" className="underline">{it.file.split("/").pop()}</a>
                    ) : (
                      <span>No file: shown as &ldquo;Document to be provided&rdquo;</span>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  <UploadButton label={it.file ? "Replace file" : "Upload file"} accept=".pdf,.png,.jpg,.jpeg,.webp,application/pdf,image/*" kinds={DOC} onDone={(u) => setItem(n, { file: u })} onError={err} />
                  <UploadButton label={it.logo ? "Replace logo" : "Upload logo"} accept=".png,.jpg,.jpeg,.webp,.svg,image/*" kinds={IMG} onDone={(u) => setItem(n, { logo: u })} onError={err} />
                  {it.logo && (
                    <Button variant="outline" size="sm" onClick={() => setItem(n, { logo: "" })} title="Remove logo">Clear logo</Button>
                  )}
                  <Button variant="outline" size="sm" onClick={() => moveItem(n, -1)} disabled={n === 0} title="Move up"><ArrowUp className="h-3.5 w-3.5" /></Button>
                  <Button variant="outline" size="sm" onClick={() => moveItem(n, 1)} disabled={n === tab.items.length - 1} title="Move down"><ArrowDown className="h-3.5 w-3.5" /></Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => confirm(`Delete "${it.title}"?`) && setTab({ items: tab.items.filter((_, i) => i !== n) })}
                    title="Delete"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
            <Button variant="outline" onClick={() => setTab({ items: [...tab.items, { title: "New certificate", sub: "", file: "", logo: "", group: folders ? tab.items[tab.items.length - 1]?.group ?? "" : "" }] })}>
              <Plus className="h-4 w-4" /> Add certificate
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
