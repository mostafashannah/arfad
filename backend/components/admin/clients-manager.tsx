"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ArrowDown, ArrowUp, Check, Loader2, Pencil, Plus, Trash2, Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";

type Client = { id: string; name: string; slug: string; logoUrl: string | null; active: boolean };

const LOGO_TYPES = ["image/png", "image/jpeg", "image/webp", "image/svg+xml"];
const MAX_LOGO_BYTES = 5 * 1024 * 1024;

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

async function uploadLogo(file: File): Promise<string> {
  if (!LOGO_TYPES.includes(file.type)) throw new Error("Logo must be a PNG, JPG, WebP or SVG image");
  if (file.size > MAX_LOGO_BYTES) throw new Error("Logo is too large (max 5MB)");
  const form = new FormData();
  form.append("file", file);
  form.append("folder", "clients");
  const res = await fetch("/api/media", { method: "POST", body: form });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Upload failed");
  return data.url as string;
}

function ClientRow({
  client,
  first,
  last,
  busy,
  onPatch,
  onMove,
  onDelete,
}: {
  client: Client;
  first: boolean;
  last: boolean;
  busy: boolean;
  onPatch: (id: string, data: Record<string, unknown>) => Promise<void>;
  onMove: (id: string, dir: -1 | 1) => void;
  onDelete: (c: Client) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(client.name);
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setErr(null);
    try {
      await onPatch(client.id, { logoUrl: await uploadLogo(file) });
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function saveName() {
    setErr(null);
    try {
      await onPatch(client.id, { name });
      setEditing(false);
    } catch (e: any) {
      setErr(e.message);
    }
  }

  return (
    <div className={cn("flex flex-wrap items-center gap-4 rounded-xl border p-3", !client.active && "opacity-50")}>
      <div className="flex h-16 w-28 flex-none items-center justify-center rounded-lg bg-white p-2">
        {client.logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={client.logoUrl} alt={client.name} className="max-h-full max-w-full object-contain" />
        ) : (
          <span className="text-xs text-neutral-400">No logo</span>
        )}
      </div>
      <div className="min-w-[12rem] flex-1">
        {editing ? (
          <div className="flex items-center gap-2">
            <Input value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && saveName()} autoFocus />
            <Button size="sm" onClick={saveName} disabled={busy || !name.trim()}>
              <Check className="h-3.5 w-3.5" />
            </Button>
            <Button size="sm" variant="outline" onClick={() => { setEditing(false); setName(client.name); setErr(null); }}>
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>
        ) : (
          <>
            <p className="font-medium">{client.name}</p>
            <p className="text-xs text-muted-foreground">{client.slug}</p>
          </>
        )}
        {err && <p className="mt-1 text-xs text-destructive">{err}</p>}
      </div>
      <label className="flex items-center gap-2 text-sm text-muted-foreground">
        <Switch checked={client.active} disabled={busy} onCheckedChange={(v) => onPatch(client.id, { active: v }).catch((e) => setErr(e.message))} />
        Active
      </label>
      <input ref={fileRef} type="file" accept=".png,.jpg,.jpeg,.webp,.svg,image/png,image/jpeg,image/webp,image/svg+xml" className="hidden" onChange={onFile} />
      <div className="flex items-center gap-1.5">
        <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()} disabled={uploading || busy}>
          {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
          {client.logoUrl ? "Replace logo" : "Upload logo"}
        </Button>
        <Button variant="outline" size="sm" onClick={() => setEditing(true)} disabled={editing} title="Edit name">
          <Pencil className="h-3.5 w-3.5" />
        </Button>
        <Button variant="outline" size="sm" onClick={() => onMove(client.id, -1)} disabled={first || busy} title="Move up">
          <ArrowUp className="h-3.5 w-3.5" />
        </Button>
        <Button variant="outline" size="sm" onClick={() => onMove(client.id, 1)} disabled={last || busy} title="Move down">
          <ArrowDown className="h-3.5 w-3.5" />
        </Button>
        <Button variant="outline" size="sm" onClick={() => onDelete(client)} disabled={busy} title="Delete">
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}

export function ClientsManager({ initial }: { initial: Client[] }) {
  const router = useRouter();
  const [items, setItems] = useState<Client[]>(initial);
  const [busy, setBusy] = useState(false);
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [err, setErr] = useState<string | null>(null);

  async function run<T>(fn: () => Promise<T>): Promise<T> {
    setBusy(true);
    try {
      return await fn();
    } finally {
      setBusy(false);
    }
  }

  async function patch(id: string, data: Record<string, unknown>) {
    await run(async () => {
      const updated = await api(`/api/clients/${id}`, "PATCH", data);
      setItems((prev) => prev.map((c) => (c.id === id ? { ...c, ...updated } : c)));
    });
  }

  async function move(id: string, dir: -1 | 1) {
    const i = items.findIndex((c) => c.id === id);
    const j = i + dir;
    if (i < 0 || j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    const prev = items;
    setItems(next);
    try {
      await run(() => api("/api/clients/reorder", "POST", { ids: next.map((c) => c.id) }));
    } catch (e: any) {
      setItems(prev);
      setErr(e.message);
    }
  }

  async function remove(c: Client) {
    if (!confirm(`Delete "${c.name}"? This removes it from the public site.`)) return;
    try {
      await run(() => api(`/api/clients/${c.id}`, "DELETE"));
      setItems((prev) => prev.filter((x) => x.id !== c.id));
    } catch (e: any) {
      setErr(e.message);
    }
  }

  async function add() {
    setErr(null);
    try {
      const created = await run(() => api("/api/clients", "POST", { name: newName }));
      setItems((prev) => [...prev, created]);
      setNewName("");
      setAdding(false);
      router.refresh();
    } catch (e: any) {
      setErr(e.message);
    }
  }

  return (
    <Card>
      <CardHeader className="flex-row items-start justify-between gap-4 space-y-0">
        <div>
          <CardTitle>All clients</CardTitle>
          <CardDescription>
            {items.length} total. Logos appear on the public site&apos;s Our Clients page, the Trusted By strips and the
            Registered Vendors cards within about a minute of saving.
          </CardDescription>
        </div>
        {!adding && (
          <Button onClick={() => setAdding(true)}>
            <Plus className="h-4 w-4" /> Add client
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        {adding && (
          <div className="flex items-center gap-2 rounded-xl border border-dashed p-3">
            <Input placeholder="Client name" value={newName} onChange={(e) => setNewName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && add()} autoFocus />
            <Button onClick={add} disabled={busy || !newName.trim()}>Add</Button>
            <Button variant="outline" onClick={() => { setAdding(false); setNewName(""); setErr(null); }}>Cancel</Button>
          </div>
        )}
        {err && <p className="text-sm text-destructive">{err}</p>}
        {items.length === 0 && <p className="text-sm text-muted-foreground">No clients yet.</p>}
        {items.map((c, i) => (
          <ClientRow key={c.id} client={c} first={i === 0} last={i === items.length - 1} busy={busy} onPatch={patch} onMove={move} onDelete={remove} />
        ))}
      </CardContent>
    </Card>
  );
}
