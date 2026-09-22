import { Search } from "lucide-react";
import { ThemeToggle } from "@/components/admin/theme-toggle";

export function PageHeader({
  title,
  subtitle,
  action,
  avatarInitial = "A",
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  avatarInitial?: string;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3">
        <div className="relative hidden sm:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search..."
            className="h-9 w-56 rounded-full border border-border bg-secondary/60 pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>
        {action}
        <ThemeToggle />
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
          {avatarInitial}
        </div>
      </div>
    </div>
  );
}
