"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ImagePicker } from "@/components/admin/image-picker";
import { Loader2, ExternalLink } from "lucide-react";

type Post = {
  title: string;
  category: "events" | "exhibitions" | "news";
  publishedAt: string;
  excerpt: string;
  body: string;
  coverUrl: string | null;
  published: boolean;
  slug: string;
};

export function PostForm({ initial }: { initial?: Post & { id: string } }) {
  const router = useRouter();
  const [post, setPost] = useState<Post>({
    title: initial?.title || "",
    category: initial?.category || "news",
    publishedAt: initial?.publishedAt || new Date().toISOString().slice(0, 10),
    excerpt: initial?.excerpt || "",
    body: initial?.body || "",
    coverUrl: initial?.coverUrl || null,
    published: initial?.published ?? true,
    slug: initial?.slug || "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  function set<K extends keyof Post>(key: K, value: Post[K]) {
    setPost((p) => ({ ...p, [key]: value }));
    setSaved(false);
  }

  async function onSave() {
    setSaving(true);
    setError(null);
    setSaved(false);
    const { slug, ...rest } = post;
    const payload = initial ? { ...rest, ...(slug !== initial.slug && { slug }) } : rest;
    try {
      const res = await fetch(initial ? `/api/posts/admin/${initial.id}` : "/api/posts/admin", {
        method: initial ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error || "Failed to save");
      if (initial) {
        setPost((p) => ({ ...p, slug: body.slug }));
        setSaved(true);
        router.refresh();
      } else {
        router.push("/admin/posts");
        router.refresh();
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  async function onDelete() {
    if (!initial) return;
    if (!confirm(`Delete "${post.title}"? This can't be undone.`)) return;
    await fetch(`/api/posts/admin/${initial.id}`, { method: "DELETE" });
    router.push("/admin/posts");
    router.refresh();
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="space-y-1.5">
        <Label htmlFor="post-title">Title</Label>
        <Input id="post-title" value={post.title} maxLength={160} onChange={(e) => set("title", e.target.value)} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="post-category">Category</Label>
          <select
            id="post-category"
            value={post.category}
            onChange={(e) => set("category", e.target.value as Post["category"])}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="news">News</option>
            <option value="events">Events</option>
            <option value="exhibitions">Exhibitions</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="post-date">Date</Label>
          <Input id="post-date" type="date" value={post.publishedAt} onChange={(e) => set("publishedAt", e.target.value)} />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="post-excerpt">Excerpt</Label>
        <Textarea id="post-excerpt" value={post.excerpt} maxLength={400} rows={3} onChange={(e) => set("excerpt", e.target.value)} />
        <p className="text-right text-xs text-muted-foreground">{post.excerpt.length} / 400</p>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="post-body">Body</Label>
        <Textarea id="post-body" value={post.body} maxLength={20000} rows={16} onChange={(e) => set("body", e.target.value)} />
        <p className="text-xs text-muted-foreground">
          Leave a blank line between paragraphs. Start a line with <code>## </code> for a sub-heading.
        </p>
      </div>

      <div className="space-y-1.5">
        <Label>Cover image</Label>
        <ImagePicker value={post.coverUrl} onChange={(url) => set("coverUrl", url)} folder="posts" />
      </div>

      {initial && (
        <div className="space-y-1.5">
          <Label htmlFor="post-slug">Slug (URL)</Label>
          <Input id="post-slug" value={post.slug} onChange={(e) => set("slug", e.target.value)} />
          <p className="text-xs text-muted-foreground">Changing this breaks existing links to the post.</p>
        </div>
      )}

      <div className="flex items-center gap-3">
        <Switch checked={post.published} onCheckedChange={(v) => set("published", v)} />
        <Label>{post.published ? "Published" : "Draft (hidden from the website)"}</Label>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
      {saved && <p className="text-sm text-emerald-500">Saved.</p>}

      <div className="flex flex-wrap items-center gap-3 pt-2">
        <Button onClick={onSave} disabled={saving}>
          {saving && <Loader2 className="h-4 w-4 animate-spin" />}
          {post.published ? "Save" : "Save as draft"}
        </Button>
        {initial && initial.published && post.published && (
          <Button asChild variant="outline">
            <a href={`/post.html?s=${initial.slug}`} target="_blank" rel="noreferrer">
              <ExternalLink className="h-4 w-4" /> View on site
            </a>
          </Button>
        )}
        {initial && (
          <Button variant="outline" className="text-destructive" onClick={onDelete}>
            Delete post
          </Button>
        )}
      </div>
    </div>
  );
}
