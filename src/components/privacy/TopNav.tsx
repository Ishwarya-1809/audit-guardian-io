import { useState } from "react";
import { Bell, Loader2, RefreshCw, Search, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const links = ["Dashboard", "Data Flows", "Reports", "Remediation"];

export function TopNav({
  scanning,
  onRescan,
}: {
  scanning: boolean;
  onRescan: () => void;
}) {
  const [query, setQuery] = useState("");

  return (
    <header className="sticky top-0 z-30 border-b border-border/70 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto grid max-w-[1440px] grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-3.5 lg:flex lg:justify-between lg:px-8">
        <a href="/" className="flex min-w-0 items-center gap-2.5">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground">
            <ShieldCheck className="h-[18px] w-[18px]" />
          </span>
          <span className="truncate text-[15px] font-semibold tracking-tight">PrivacyAudit AI</span>
        </a>

        <nav className="order-3 col-span-2 -mx-1 flex items-center gap-1 overflow-x-auto lg:order-none lg:mx-0 lg:col-auto">
          {links.map((link) => (
            <button
              key={link}
              type="button"
              className={cn(
                "shrink-0 rounded-full px-3.5 py-1.5 text-sm transition-colors",
                link === "Dashboard"
                  ? "bg-secondary font-semibold text-foreground"
                  : "font-medium text-muted-foreground hover:text-foreground",
              )}
            >
              {link}
            </button>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2.5">
          <label className="relative hidden xl:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search processes or findings..."
              className="h-10 w-72 rounded-full bg-secondary pl-9 pr-4 text-sm outline-none ring-primary/40 placeholder:text-muted-foreground focus:ring-2"
            />
          </label>
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-full bg-secondary text-muted-foreground xl:hidden"
            aria-label="Search"
          >
            <Search className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={onRescan}
            disabled={scanning}
            className="inline-flex h-10 shrink-0 items-center gap-2 rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-70"
          >
            {scanning ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            <span className="hidden sm:inline">{scanning ? "Scanning..." : "Re-scan"}</span>
          </button>

          <button
            type="button"
            aria-label="Notifications"
            className="relative grid h-10 w-10 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <Bell className="h-[18px] w-[18px]" />
            <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-risk-high ring-2 ring-background" />
          </button>

          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-accent text-xs font-semibold text-accent-foreground">
            AR
          </span>
        </div>
      </div>
    </header>
  );
}
