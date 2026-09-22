"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { GalleryPicker } from "@/components/admin/image-picker";
import { Loader2 } from "lucide-react";

type Project = {
  id?: string;
  slug: string;
  title: string;
  client: string;
  location: string;
  scope: string;
  description: string;
  vendorNo: string;
  featured: boolean;
  images: string[];
  published: boolean;
};

export function ProjectForm({ initial }: { initial?: Partial<Project> & { id: string } }) {
  const router = useRouter();
  const [project, setProject] = useState<Project>({
    slug: initial?.slug || "",
    title: initial?.title || "",
    client: initial?.client || "",
    location: initial?.location || "",
    scope: initial?.scope || "",
    description: initial?.description || "",
    vendorNo: initial?.vendorNo || "",
    featured: initial?.featured ?? false,
    images: initial?.images || [],
    published: initial?.published ?? true,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof Project>(key: K, value: Project[K]) {
    setProject((p) => ({ ...p, [key]: value }));
  }

  async function onSave() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(initial?.id ? `/api/projects/${initial.id}` : "/api/projects", {
        method: initial?.id ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(project),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Failed to save");
      }
      router.push("/admin/projects");
      router.refresh();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  async function onDelete() {
    if (!initial?.id) return;
    if (!confirm(`Delete "${project.title}"? This can't be undone.`)) return;
    await fetch(`/api/projects/${initial.id}`, { method: "DELETE" });
    router.push("/admin/projects");
    router.refresh();
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>Title</Label>
          <Input value={project.title} onChange={(e) => set("title", e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label>Slug (URL)</Label>
          <Input value={project.slug} onChange={(e) => set("slug", e.target.value)} placeholder="royal-commission" />
        </div>
        <div className="space-y-1.5">
          <Label>Client</Label>
          <Input value={project.client} onChange={(e) => set("client", e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label>Location</Label>
          <Input value={project.location} onChange={(e) => set("location", e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label>Scope (short)</Label>
          <Input value={project.scope} onChange={(e) => set("scope", e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label>Vendor No. (optional)</Label>
          <Input value={project.vendorNo} onChange={(e) => set("vendorNo", e.target.value)} />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>Description</Label>
        <Textarea value={project.description} onChange={(e) => set("description", e.target.value)} rows={4} />
      </div>

      <div className="space-y-1.5">
        <Label>Project photos</Label>
        <GalleryPicker value={project.images} onChange={(urls) => set("images", urls)} folder="projects" />
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <Switch checked={project.featured} onCheckedChange={(v) => set("featured", v)} />
          <Label>Show in Highlighted Projects grid</Label>
        </div>
        <div className="flex items-center gap-3">
          <Switch checked={project.published} onCheckedChange={(v) => set("published", v)} />
          <Label>Published</Label>
        </div>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex items-center gap-3 pt-2">
        <Button onClick={onSave} disabled={saving}>
          {saving && <Loader2 className="h-4 w-4 animate-spin" />}
          Save
        </Button>
        {initial?.id && (
          <Button variant="outline" className="text-destructive" onClick={onDelete}>
            Delete project
          </Button>
        )}
      </div>
    </div>
  );
}
