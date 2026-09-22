"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ImagePicker } from "@/components/admin/image-picker";
import { Trash2, Plus, Loader2 } from "lucide-react";

type Service = {
  id?: string;
  anchor: string;
  title: string;
  summary: string;
  image: string | null;
  features: string[];
  published: boolean;
};

export function ServiceForm({ initial }: { initial?: Partial<Service> & { id: string } }) {
  const router = useRouter();
  const [service, setService] = useState<Service>({
    anchor: initial?.anchor || "",
    title: initial?.title || "",
    summary: initial?.summary || "",
    image: initial?.image || null,
    features: initial?.features || [""],
    published: initial?.published ?? true,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof Service>(key: K, value: Service[K]) {
    setService((s) => ({ ...s, [key]: value }));
  }

  function setFeature(i: number, v: string) {
    const next = [...service.features];
    next[i] = v;
    set("features", next);
  }

  async function onSave() {
    setSaving(true);
    setError(null);
    const payload = { ...service, features: service.features.filter((f) => f.trim() !== "") };

    try {
      const res = await fetch(initial?.id ? `/api/services/${initial.id}` : "/api/services", {
        method: initial?.id ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Failed to save");
      }
      router.push("/admin/services");
      router.refresh();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  async function onDelete() {
    if (!initial?.id) return;
    if (!confirm(`Delete "${service.title}"? This can't be undone.`)) return;
    await fetch(`/api/services/${initial.id}`, { method: "DELETE" });
    router.push("/admin/services");
    router.refresh();
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>Title</Label>
          <Input value={service.title} onChange={(e) => set("title", e.target.value)} placeholder="Wooden Doors" />
        </div>
        <div className="space-y-1.5">
          <Label>Anchor (URL slug)</Label>
          <Input value={service.anchor} onChange={(e) => set("anchor", e.target.value)} placeholder="doors" />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>Summary</Label>
        <Textarea value={service.summary} onChange={(e) => set("summary", e.target.value)} rows={3} />
      </div>

      <div className="space-y-1.5">
        <Label>Card image</Label>
        <ImagePicker value={service.image} onChange={(url) => set("image", url)} folder="services" />
      </div>

      <div className="space-y-1.5">
        <Label>Key features</Label>
        <div className="space-y-2">
          {service.features.map((f, i) => (
            <div key={i} className="flex gap-2">
              <Input value={f} onChange={(e) => setFeature(i, e.target.value)} />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => set("features", service.features.filter((_, idx) => idx !== i))}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button type="button" variant="outline" size="sm" onClick={() => set("features", [...service.features, ""])}>
            <Plus className="h-3.5 w-3.5" /> Add feature
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Switch checked={service.published} onCheckedChange={(v) => set("published", v)} />
        <Label>Published</Label>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex items-center gap-3 pt-2">
        <Button onClick={onSave} disabled={saving}>
          {saving && <Loader2 className="h-4 w-4 animate-spin" />}
          Save
        </Button>
        {initial?.id && (
          <Button variant="outline" className="text-destructive" onClick={onDelete}>
            Delete service
          </Button>
        )}
      </div>
    </div>
  );
}
