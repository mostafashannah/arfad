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
            {!b.headerLogo && (
              <div className="mb-3">
                <p className="mb-2 text-xs text-slate-300">Current logo (built-in)</p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/img/logo-full.png" alt="Current header logo" className="h-16 w-auto" style={{ filter: "drop-shadow(0 0 1.5px rgba(255,255,255,.95)) drop-shadow(0 0 7px rgba(255,255,255,.55))" }} />
              </div>
            )}
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
            {!b.footerLogo && (
              <div className="mb-3">
                <p className="mb-2 text-xs text-slate-300">Current logo block (built-in)</p>
                <div className="flex items-end gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/img/logo.png" alt="" className="h-14 w-auto" style={{ filter: "brightness(0) invert(1)" }} />
                  <div className="space-y-1">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/img/wordmark.png" alt="ARFAD" className="h-5 w-auto" />
                    <p dir="rtl" lang="ar" className="text-base font-bold text-sky-300">شركة أرفاد الدولية للصناعة</p>
                  </div>
                </div>
              </div>
            )}
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
