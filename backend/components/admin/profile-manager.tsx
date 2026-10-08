"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { FileText, Loader2, RotateCcw, Upload } from "lucide-react";

type Info = { custom: boolean; size: number; updatedAt: string | null };

const MAX = 100 * 1024 * 1024;

function mb(n: number) {
  return `${(n / 1024 / 1024).toFixed(1)} MB`;
}

export function ProfileManager({ initial }: { initial: Info }) {
  const [info, setInfo] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const input = useRef<HTMLInputElement>(null);

  async function upload(file: File) {
    setMsg(null);
    if (!file.name.toLowerCase().endsWith(".pdf")) return setMsg({ ok: false, text: "The profile must be a PDF file." });
    if (file.size > MAX) return setMsg({ ok: false, text: "File is too large (max 100 MB)." });
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/profile", { method: "POST", body: fd });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Upload failed");
      setInfo({ custom: data.custom, size: data.size, updatedAt: data.updatedAt });
      setMsg({ ok: true, text: "Profile updated. The website button now downloads this file." });
    } catch (e) {
      setMsg({ ok: false, text: e instanceof Error ? e.message : "Upload failed" });
    } finally {
      setBusy(false);
      if (input.current) input.current.value = "";
    }
  }

  async function restore() {
    if (!confirm("Remove the uploaded profile and go back to the original file that shipped with the site?")) return;
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch("/api/profile", { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Request failed");
      setInfo({ custom: data.custom, size: data.size, updatedAt: data.updatedAt });
      setMsg({ ok: true, text: "Restored the original profile." });
    } catch (e) {
      setMsg({ ok: false, text: e instanceof Error ? e.message : "Request failed" });
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Current file</CardTitle>
        <CardDescription>This is what visitors get when they click Download Profile.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-4 rounded-2xl border border-border bg-secondary/40 p-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-primary">
            <FileText className="h-6 w-6" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-medium">ARFAD-Company-Profile.pdf</p>
            <p className="text-sm text-muted-foreground">
              {info.custom ? "Uploaded from the admin" : "Original file that shipped with the site"}
              {info.size ? ` · ${mb(info.size)}` : ""}
              {info.updatedAt ? ` · updated ${info.updatedAt.slice(0, 16).replace("T", " ")}` : ""}
            </p>
          </div>
          <a href="/download/company-profile" target="_blank" rel="noopener" className="text-sm underline-offset-2 hover:underline">
            Preview download
          </a>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <input
            ref={input}
            type="file"
            accept="application/pdf,.pdf"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])}
          />
          <Button onClick={() => input.current?.click()} disabled={busy}>
            {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
            Upload new profile (PDF)
          </Button>
          {info.custom && (
            <Button variant="outline" onClick={restore} disabled={busy}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Restore original
            </Button>
          )}
        </div>
        {msg && <p className={msg.ok ? "text-sm text-emerald-500" : "text-sm text-red-500"}>{msg.text}</p>}
        <p className="text-xs text-muted-foreground">
          PDF only, up to 100 MB. Changes show on the website within about 5 minutes (browsers may cache the previous file briefly).
        </p>
      </CardContent>
    </Card>
  );
}
