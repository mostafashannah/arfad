"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ArrowDown, ArrowUp, ChevronDown, ChevronRight, Loader2, Plus, RotateCcw, Save, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Sub = { key: string; label: string; href: string; active: boolean };
type Top = Sub & { children: Sub[] };
type ApiItem = { label: string; href: string; active: boolean; children: { label: string; href: string; active: boolean }[] };

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

function Row({
  item,
  first,
  last,
  sub,
  onChange,
  onMove,
  onDelete,
  lead,
}: {
  item: Sub;
  first: boolean;
  last: boolean;
  sub?: boolean;
  onChange: (patch: Partial<Sub>) => void;
  onMove: (dir: -1 | 1) => void;
  onDelete: () => void;
  lead?: React.ReactNode;
}) {
  return (
    <div className={cn("space-y-1", !item.active && "opacity-60")}>
      <div className="flex flex-wrap items-center gap-2">
        {lead}
        <Input className="w-44" placeholder={sub ? "Sub tab label" : "Tab label"} value={item.label} onChange={(e) => onChange({ label: e.target.value })} />
        <Input className="min-w-[10rem] flex-1" placeholder="services.html or https://..." value={item.href} onChange={(e) => onChange({ href: e.target.value })} />
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          <Switch checked={item.active} onCheckedChange={(v) => onChange({ active: v })} />
          Active
        </label>
        <Button variant="outline" size="sm" onClick={() => onMove(-1)} disabled={first} title="Move up">
          <ArrowUp className="h-3.5 w-3.5" />
        </Button>
        <Button variant="outline" size="sm" onClick={() => onMove(1)} disabled={last} title="Move down">
          <ArrowDown className="h-3.5 w-3.5" />
        </Button>
        <Button variant="outline" size="sm" onClick={onDelete} title="Delete">
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
      {(!item.label.trim() || !item.href.trim()) && <p className="text-xs text-destructive">Label and link must not be empty.</p>}
    </div>
  );
}

export function MenuManager({ initial }: { initial: ApiItem[] }) {
  const counter = useRef(0);
  const nk = () => `k${counter.current++}`;
  const load = (items: ApiItem[]): Top[] =>
    items.map((i) => ({ ...i, key: nk(), children: i.children.map((c) => ({ ...c, key: nk() })) }));
  const [items, setItems] = useState<Top[]>(() => load(initial));
  const [saved, setSaved] = useState(() => JSON.stringify(initial.map(strip)));
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  function strip(i: ApiItem | Top) {
    return { label: i.label, href: i.href, active: i.active, children: i.children.map((c) => ({ label: c.label, href: c.href, active: c.active })) };
  }
  const dirty = JSON.stringify(items.map(strip)) !== saved;
  const invalid = items.some((i) => !i.label.trim() || !i.href.trim() || i.children.some((c) => !c.label.trim() || !c.href.trim()));

  const patchTop = (i: number, p: Partial<Top>) => setItems((prev) => prev.map((t, x) => (x === i ? { ...t, ...p } : t)));
  const patchSub = (i: number, j: number, p: Partial<Sub>) =>
    patchTop(i, { children: items[i].children.map((c, y) => (y === j ? { ...c, ...p } : c)) });

  async function run(fn: () => Promise<{ items: ApiItem[] }>, okText: string) {
    setBusy(true);
    setMsg(null);
    try {
      const data = await fn();
      setItems(load(data.items));
      setSaved(JSON.stringify(data.items.map(strip)));
      setMsg({ ok: true, text: okText });
    } catch (e: any) {
      setMsg({ ok: false, text: e.message });
    } finally {
      setBusy(false);
    }
  }

  const save = () => run(() => api("/api/navigation/admin", "PUT", { items: items.map(strip) }), "Menu saved. It will appear on the website within about a minute.");
  const reset = () => {
    if (!confirm("Reset the menu to the default? Your changes will be lost.")) return;
    run(() => api("/api/navigation/admin/reset", "POST"), "Menu reset to default.");
  };

  return (
    <Card>
      <CardHeader className="flex-row items-start justify-between gap-4 space-y-0">
        <div>
          <CardTitle>Header menu</CardTitle>
          <CardDescription>{HINT}</CardDescription>
        </div>
        <Button variant="outline" onClick={reset} disabled={busy}>
          <RotateCcw className="h-4 w-4" /> Reset to default
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.map((t, i) => (
          <div key={t.key} className="space-y-3 rounded-xl border p-3">
            <Row
              item={t}
              first={i === 0}
              last={i === items.length - 1}
              onChange={(p) => patchTop(i, p)}
              onMove={(d) => setItems(move(items, i, d))}
              onDelete={() => confirm(`Delete "${t.label || "this tab"}" and its sub tabs?`) && setItems(items.filter((_, x) => x !== i))}
              lead={
                <Button variant="ghost" size="sm" onClick={() => setOpen({ ...open, [t.key]: !open[t.key] })} title="Sub tabs">
                  {open[t.key] ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  <span className="text-xs">{t.children.length}</span>
                </Button>
              }
            />
            {open[t.key] && (
              <div className="space-y-2 border-l pl-4">
                {t.children.map((c, j) => (
                  <Row
                    key={c.key}
                    sub
                    item={c}
                    first={j === 0}
                    last={j === t.children.length - 1}
                    onChange={(p) => patchSub(i, j, p)}
                    onMove={(d) => patchTop(i, { children: move(t.children, j, d) })}
                    onDelete={() => confirm(`Delete sub tab "${c.label || "this item"}"?`) && patchTop(i, { children: t.children.filter((_, y) => y !== j) })}
                  />
                ))}
                {t.children.length === 0 && <p className="text-xs text-muted-foreground">No sub tabs.</p>}
                <Button variant="outline" size="sm" onClick={() => patchTop(i, { children: [...t.children, { key: nk(), label: "", href: "", active: true }] })}>
                  <Plus className="h-3.5 w-3.5" /> Add sub tab
                </Button>
              </div>
            )}
          </div>
        ))}
        <Button variant="outline" onClick={() => setItems([...items, { key: nk(), label: "", href: "", active: true, children: [] }])}>
          <Plus className="h-4 w-4" /> Add menu tab
        </Button>
        <div className="sticky bottom-0 -mx-6 flex items-center gap-3 border-t bg-card px-6 py-3">
          <Button onClick={save} disabled={!dirty || busy || invalid}>
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save changes
          </Button>
          {msg && <p className={cn("text-sm", msg.ok ? "text-muted-foreground" : "text-destructive")}>{msg.text}</p>}
        </div>
      </CardContent>
    </Card>
  );
}
