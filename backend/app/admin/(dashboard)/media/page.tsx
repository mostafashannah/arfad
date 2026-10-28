"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Upload, Trash2, Loader2, Copy, Check, FileText, Film } from "lucide-react";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/admin/page-header";

type Asset = { id: string; url: string; filename: string; folder: string; createdAt: string };

type Kind = "image" | "video" | "pdf" | "other";
const KINDS: { id: "all" | Kind; label: string }[] = [
  { id: "all", label: "All" },
  { id: "image", label: "Images" },
  { id: "video", label: "Videos" },
  { id: "pdf", label: "PDFs" },
  { id: "other", label: "Other" },
];

function kindOf(a: Asset): Kind {
  const ext = (a.filename.split(".").pop() || "").toLowerCase();
  if (["jpg", "jpeg", "png", "webp", "gif", "svg", "avif"].includes(ext)) return "image";
  if (["mp4", "webm", "mov", "m4v"].includes(ext)) return "video";
  if (ext === "pdf") return "pdf";
  return "other";
}

export default function MediaPage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [kind, setKind] = useState<"all" | Kind>("all");
  const [folder, setFolder] = useState("all");
  const [q, setQ] = useState("");

  async function load() {
    setLoading(true);
    const res = await fetch("/api/media");
    setAssets(await res.json());
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function onFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setUploading(true);
    for (const file of files) {
      const form = new FormData();
      form.append("file", file);
      form.append("folder", "media-library");
      await fetch("/api/media", { method: "POST", body: form });
    }
    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
    load();
  }

  async function onDelete(id: string) {
    if (!confirm("Delete this file? Pages still referencing it will show a broken image or link.")) return;
    await fetch("/api/media", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    load();
  }

  function copy(asset: Asset) {
    navigator.clipboard.writeText(asset.url);
    setCopiedId(asset.id);
    setTimeout(() => setCopiedId(null), 1500);
  }

  const counts: Record<string, number> = { all: assets.length, image: 0, video: 0, pdf: 0, other: 0 };
  assets.forEach((a) => (counts[kindOf(a)] += 1));
  const folders = Array.from(new Set(assets.map((a) => a.folder))).sort();
  const shown = assets.filter(
    (a) => (kind === "all" || kindOf(a) === kind) && (folder === "all" || a.folder === folder) && (!q.trim() || a.filename.toLowerCase().includes(q.trim().toLowerCase()) || a.url.toLowerCase().includes(q.trim().toLowerCase()))
  );

  return (
    <div>
      <PageHeader
        title="Media Library"
        subtitle="Every image, video and PDF used across the website. Filter by file type or folder."
        action={
          <div>
            <input ref={inputRef} type="file" accept="image/*,video/mp4,video/webm,video/quicktime,application/pdf,.pdf" multiple className="hidden" onChange={onFiles} />
            <Button onClick={() => inputRef.current?.click()} disabled={uploading}>
              {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
              Upload files
            </Button>
          </div>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>All assets</CardTitle>
          <CardDescription>
            {shown.length} of {assets.length} files
          </CardDescription>
          <div className="flex flex-wrap items-center gap-2 pt-2">
            {KINDS.map((k) => (
              <Button key={k.id} size="sm" variant={kind === k.id ? "default" : "outline"} onClick={() => setKind(k.id)} disabled={k.id !== "all" && counts[k.id] === 0}>
                {k.label} <span className="ml-1 opacity-60">{counts[k.id]}</span>
              </Button>
            ))}
            <select value={folder} onChange={(e) => setFolder(e.target.value)} className="h-9 rounded-md border bg-background px-2 text-sm">
              <option value="all">All folders</option>
              {folders.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filter by file name" className="h-9 min-w-[12rem] rounded-md border bg-background px-3 text-sm" />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : assets.length === 0 ? (
            <p className="text-sm text-muted-foreground">No files uploaded yet.</p>
          ) : shown.length === 0 ? (
            <p className="text-sm text-muted-foreground">No files match this filter.</p>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {shown.map((a) => (
                <div key={a.id} className="group relative overflow-hidden rounded-lg border">
                  {kindOf(a) === "image" ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={a.url} alt={a.filename} loading="lazy" className="aspect-square w-full object-cover" />
                  ) : (
                    <a href={a.url} target="_blank" rel="noreferrer" className={cn("flex aspect-square w-full flex-col items-center justify-center gap-2 bg-muted p-3 text-center text-muted-foreground")}>
                      {kindOf(a) === "video" ? <Film className="h-8 w-8" /> : <FileText className="h-8 w-8" />}
                      <span className="line-clamp-3 break-all text-xs">{a.filename}</span>
                      <span className="rounded bg-background px-1.5 text-[10px] font-semibold uppercase">{(a.filename.split(".").pop() || "file").slice(0, 5)}</span>
                    </a>
                  )}
                  <div className="absolute inset-x-0 bottom-0 flex justify-between bg-black/70 px-1.5 py-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <button onClick={() => copy(a)} className="text-white hover:opacity-70" title="Copy URL">
                      {copiedId === a.id ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    </button>
                    <button onClick={() => onDelete(a.id)} className="text-white hover:opacity-70" title="Delete">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
