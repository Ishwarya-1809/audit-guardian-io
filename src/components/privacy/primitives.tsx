import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { RiskLevel } from "@/lib/privacy-data";

export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <section
      className={cn(
        "rounded-3xl bg-card p-6 shadow-[var(--shadow-soft)] ring-1 ring-border/60",
        className,
      )}
    >
      {children}
    </section>
  );
}

export function CardHeader({
  title,
  action,
  className,
}: {
  title: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 sm:flex sm:justify-between",
        className,
      )}
    >
      <h2 className="min-w-0 truncate text-base font-semibold tracking-tight">{title}</h2>
      {action}
    </div>
  );
}

export function SeeAll() {
  return (
    <button
      type="button"
      className="shrink-0 text-sm font-medium text-primary transition-opacity hover:opacity-70"
    >
      See all
    </button>
  );
}

const riskStyles: Record<RiskLevel, string> = {
  high: "bg-risk-high-soft text-risk-high",
  medium: "bg-risk-medium-soft text-risk-medium",
  low: "bg-risk-low-soft text-risk-low",
};

const riskLabel: Record<RiskLevel, string> = {
  high: "High Risk",
  medium: "Medium Risk",
  low: "Low Risk",
};

export function RiskPill({ risk }: { risk: RiskLevel }) {
  return (
    <span
      className={cn("shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold", riskStyles[risk])}
    >
      {riskLabel[risk]}
    </span>
  );
}

export function TagPill({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full border border-border px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
      {children}
    </span>
  );
}
