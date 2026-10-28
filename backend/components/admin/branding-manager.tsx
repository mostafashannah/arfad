"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ImagePicker } from "@/components/admin/image-picker";
import { Loader2, Save } from "lucide-react";
import type { Branding } from "@/lib/branding";

export function BrandingManager({ initial }: { initial: Branding }) {
  const [b, setB] = useState<Branding>(initial);
  const [saved, setSaved] = useState<Branding>(initial);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const dirty = JSON.stringify(b) !== JSON.stringify(saved);

  async function save() {
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch("/api/branding", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ branding: b }) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not save");
      setB(data.branding);
      setSaved(data.branding);
      setMsg({ ok: true, text: "Saved. The website shows the new logos within about a minute." });
    } catch (e: any) {
      setMsg({ ok: false, text: e.message });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Header logo</CardTitle>
          <CardDescription>Shown top-left on every page. Use a PNG with a transparent background, about 900 px wide. Remove it to go back to the built-in logo.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full max-w-xs rounded-lg bg-slate-700 p-3">
            <ImagePicker value={b.headerLogo} onChange={(u) => setB({ ...b, headerLogo: u })} folder="branding" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Footer logo</CardTitle>
          <CardDescription>
            Replaces the logo block in the footer (mark, ARFAD lettering and Arabic name). The footer sits on a dark background, so use a light or white logo. Remove it to go back to the built-in block.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full max-w-xs rounded-lg bg-slate-900 p-3">
            <ImagePicker value={b.footerLogo} onChange={(u) => setB({ ...b, footerLogo: u })} folder="branding" />
          </div>
        </CardContent>
      </Card>
      <div className="flex items-center gap-3">
        <Button onClick={save} disabled={!dirty || busy}>
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save logos
        </Button>
        {msg && <p className={msg.ok ? "text-sm text-emerald-600" : "text-sm text-destructive"}>{msg.text}</p>}
      </div>
      <p className="text-sm text-muted-foreground">The footer text, links and contact details are edited in Site Layout &gt; Footer.</p>
    </div>
  );
}
