"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const [dark, setDark] = useState<boolean | null>(null);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggle() {
    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("admin-theme", next ? "dark" : "light");
    } catch {}
    setDark(next);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle dark mode"
      aria-pressed={dark ?? undefined}
      className="relative inline-flex h-8 w-16 shrink-0 items-center rounded-full border border-border bg-secondary px-1 transition-colors"
    >
      <Sun className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
      <span
        className={cn(
          "absolute left-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground shadow transition-transform",
          dark && "translate-x-8"
        )}
      >
        {dark ? <Moon className="h-3.5 w-3.5" /> : <Sun className="h-3.5 w-3.5" />}
      </span>
      <Moon className="ml-auto h-3.5 w-3.5 shrink-0 text-muted-foreground" />
    </button>
  );
}
