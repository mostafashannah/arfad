"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X, Loader2 } from "lucide-react";

async function uploadFile(file: File, folder: string): Promise<string> {
  const form = new FormData();
  form.append("file", file);
  form.append("folder", folder);
  const res = await fetch("/api/media", { method: "POST", body: form });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || "Upload failed");
  }
  const asset = await res.json();
  return asset.url as string;
}

/** Single image picker — shows a preview, lets you replace or remove it. */
export function ImagePicker({
  value,
  onChange,
  folder = "uploads",
}: {
  value: string | null;
  onChange: (url: string | null) => void;
  folder?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    setErr(null);
    try {
      const url = await uploadFile(file, folder);
      onChange(url);
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setLoading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-2">
      {value ? (
        <div className="relative w-full max-w-xs overflow-hidden rounded-lg border">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="" className="aspect-video w-full object-cover" />
          <button
            type="button"
            onClick={() => onChange(null)}
            className="absolute right-2 top-2 rounded-full bg-black/60 p-1 text-white hover:bg-black/80"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : (
        <div className="flex aspect-video w-full max-w-xs items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
          No image
        </div>
      )}
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={onFile} />
      <Button type="button" variant="outline" size="sm" onClick={() => inputRef.current?.click()} disabled={loading}>
        {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
        {value ? "Replace image" : "Upload image"}
      </Button>
      {err && <p className="text-xs text-destructive">{err}</p>}
    </div>
  );
}

/** Multi-image gallery picker with add / remove / reorder. */
export function GalleryPicker({
  value,
  onChange,
  folder = "uploads",
}: {
  value: string[];
  onChange: (urls: string[]) => void;
  folder?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setLoading(true);
    setErr(null);
    try {
      const urls = await Promise.all(files.map((f) => uploadFile(f, folder)));
      onChange([...value, ...urls]);
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setLoading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function remove(i: number) {
    onChange(value.filter((_, idx) => idx !== i));
  }
  function move(i: number, dir: -1 | 1) {
    const next = [...value];
    const j = i + dir;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {value.map((url, i) => (
          <div key={url + i} className="relative overflow-hidden rounded-lg border">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt="" className="aspect-square w-full object-cover" />
            <div className="absolute inset-x-0 bottom-0 flex justify-between bg-black/60 px-1.5 py-1">
              <div className="flex gap-1">
                <button type="button" onClick={() => move(i, -1)} className="text-xs text-white hover:opacity-70">
                  ←
                </button>
                <button type="button" onClick={() => move(i, 1)} className="text-xs text-white hover:opacity-70">
                  →
                </button>
              </div>
              <button type="button" onClick={() => remove(i)} className="text-white hover:opacity-70">
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
      <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={onFiles} />
      <Button type="button" variant="outline" size="sm" onClick={() => inputRef.current?.click()} disabled={loading}>
        {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
        Add photos
      </Button>
      {err && <p className="text-xs text-destructive">{err}</p>}
    </div>
  );
}
