"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Hammer,
  Building2,
  Settings2,
  Images,
  Users,
  LogOut,
  ExternalLink,
  BarChart3,
} from "lucide-react";

const links = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/services", label: "Services", icon: Hammer },
  { href: "/admin/projects", label: "Projects", icon: Building2 },
  { href: "/admin/settings", label: "Site Settings", icon: Settings2 },
  { href: "/admin/media", label: "Media Library", icon: Images },
  { href: "/admin/users", label: "Team", icon: Users },
];

export function Sidebar({ role }: { role?: string }) {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-64 flex-none flex-col bg-background px-4 py-6">
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
        {links.map(({ href, label, icon: Icon }) => {
          const active = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
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
