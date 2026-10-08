"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Hammer,
  Building2,
  Settings2,
  Images,
  Handshake,
  Users,
  LogOut,
  ExternalLink,
  BarChart3,
  Inbox,
  FileText,
  BadgeCheck,
  Newspaper,
  PanelTop,
  PanelBottom,
  ChevronDown,
  LineChart,
  FileStack,
  LayoutTemplate,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

type Item = { href: string; label: string; icon: LucideIcon };
type Entry = { type: "link"; item: Item } | { type: "group"; id: string; label: string; icon: LucideIcon; items: Item[] };

const nav: Entry[] = [
  { type: "link", item: { href: "/admin", label: "Overview", icon: LayoutDashboard } },
  {
    type: "group",
    id: "insights",
    label: "Insights",
    icon: LineChart,
    items: [
      { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
      { href: "/admin/enquiries", label: "Enquiries", icon: Inbox },
    ],
  },
  {
    type: "group",
    id: "content",
    label: "Website Content",
    icon: FileStack,
    items: [
      { href: "/admin/services", label: "Services", icon: Hammer },
      { href: "/admin/projects", label: "Projects", icon: Building2 },
      { href: "/admin/posts", label: "Posts (Media)", icon: Newspaper },
      { href: "/admin/media", label: "Media Library", icon: Images },
      { href: "/admin/settings", label: "Site Settings", icon: Settings2 },
    ],
  },
  {
    type: "group",
    id: "layout",
    label: "Site Layout",
    icon: LayoutTemplate,
    items: [
      { href: "/admin/menu", label: "Header Menu", icon: PanelTop },
      { href: "/admin/footer", label: "Footer", icon: PanelBottom },
    ],
  },
  {
    type: "group",
    id: "trust",
    label: "Brand & Trust",
    icon: ShieldCheck,
    items: [
      { href: "/admin/clients", label: "Clients", icon: Handshake },
      { href: "/admin/accreditations", label: "Accreditations", icon: BadgeCheck },
      { href: "/admin/profile", label: "Company Profile", icon: FileText },
    ],
  },
  { type: "link", item: { href: "/admin/users", label: "Team", icon: Users } },
];

const isActive = (pathname: string, href: string) => (href === "/admin" ? pathname === "/admin" : pathname.startsWith(href));

const linkClass = (active: boolean) =>
  cn(
    "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
    active ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
  );

export function Sidebar({ role }: { role?: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState<Record<string, boolean>>({});

  useEffect(() => {
    let saved: Record<string, boolean> = {};
    try {
      saved = JSON.parse(localStorage.getItem("admin-nav-open") || "{}");
    } catch {}
    const next: Record<string, boolean> = { ...saved };
    for (const e of nav) if (e.type === "group" && e.items.some((i) => isActive(pathname, i.href))) next[e.id] = true;
    setOpen(next);
  }, [pathname]);

  function toggle(id: string) {
    setOpen((o) => {
      const next = { ...o, [id]: !o[id] };
      try {
        localStorage.setItem("admin-nav-open", JSON.stringify(next));
      } catch {}
      return next;
    });
  }

  return (
    <aside className="flex h-screen w-64 flex-none flex-col overflow-y-auto bg-background px-4 py-6">
      <div className="flex items-center gap-3 px-2 pb-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-foreground">
          A
        </div>
        <div>
          <p className="text-sm font-semibold leading-none">ARFAD Admin</p>
          <p className="mt-1 text-xs text-muted-foreground">Jubail &middot; KSA</p>
        </div>
      </div>
      <nav className="flex-1 space-y-1">
        {nav.map((entry) => {
          if (entry.type === "link") {
            const { href, label, icon: Icon } = entry.item;
            return (
              <Link key={href} href={href} className={linkClass(isActive(pathname, href))}>
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            );
          }
          const Icon = entry.icon;
          const hasActive = entry.items.some((i) => isActive(pathname, i.href));
          const expanded = !!open[entry.id];
          return (
            <div key={entry.id}>
              <button
                type="button"
                onClick={() => toggle(entry.id)}
                aria-expanded={expanded}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  hasActive ? "text-foreground" : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="flex-1 text-left">{entry.label}</span>
                <ChevronDown className={cn("h-4 w-4 transition-transform", expanded && "rotate-180")} />
              </button>
              {expanded && (
                <div className="ml-[1.35rem] mt-1 space-y-0.5 border-l border-border pl-3">
                  {entry.items.map(({ href, label, icon: SubIcon }) => (
                    <Link key={href} href={href} className={cn(linkClass(isActive(pathname, href)), "py-2")}>
                      <SubIcon className="h-3.5 w-3.5" />
                      {label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>
      <div className="space-y-1 pt-4">
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
        >
          <ExternalLink className="h-4 w-4" />
          View public site
        </a>
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
