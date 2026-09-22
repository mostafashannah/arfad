"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Check } from "lucide-react";

type Setting = { id: string; section: string; key: string; label: string; value: string; type: string };

export function SettingsForm({
  grouped,
  labels,
}: {
  grouped: Record<string, Setting[]>;
  labels: Record<string, string>;
}) {
  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(Object.values(grouped).flat().map((s) => [s.id, s.value]))
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function onSave() {
    setSaving(true);
    setSaved(false);
    const updates = Object.entries(values).map(([id, value]) => ({ id, value }));
    await fetch("/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ updates }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div className="max-w-2xl space-y-6">
      {Object.entries(grouped).map(([section, items]) => (
        <Card key={section}>
          <CardHeader>
            <CardTitle>{labels[section] ?? section}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {items.map((s) => (
              <div key={s.id} className="space-y-1.5">
                <Label>{s.label}</Label>
                {s.type === "textarea" ? (
                  <Textarea
                    value={values[s.id]}
                    onChange={(e) => setValues((v) => ({ ...v, [s.id]: e.target.value }))}
                    rows={4}
                  />
                ) : (
                  <Input
                    value={values[s.id]}
                    onChange={(e) => setValues((v) => ({ ...v, [s.id]: e.target.value }))}
                  />
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      ))}

      <div className="flex items-center gap-3">
        <Button onClick={onSave} disabled={saving}>
          {saving && <Loader2 className="h-4 w-4 animate-spin" />}
          Save changes
        </Button>
        {saved && (
          <span className="flex items-center gap-1 text-sm text-emerald-600">
            <Check className="h-4 w-4" /> Saved
          </span>
        )}
      </div>
    </div>
  );
}
