import { useCallback, useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ChevronDown, Banknote, Fingerprint, Headphones, Megaphone, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { TopNav } from "@/components/privacy/TopNav";
import { Card, RiskPill, TagPill } from "@/components/privacy/primitives";
import { cn } from "@/lib/utils";
import {
  fetchProcesses,
  analyzeProcess,
  type ProcessActivity,
  type RiskLevel,
} from "@/lib/privacy-data";

export const Route = createFileRoute("/data-flows")({
  head: () => ({
    meta: [{ title: "Privexa — Data Flows" }],
  }),
  component: DataFlowsPage,
});

const ICON_CYCLE: LucideIcon[] = [Fingerprint, Banknote, Megaphone, Headphones, Users];

const RISK_ORDER: RiskLevel[] = ["high", "medium", "low"];
const RISK_LABEL: Record<RiskLevel, string> = {
  high: "High Risk",
  medium: "Medium Risk",
  low: "Low Risk",
};

function ProcessRow({ p, index }: { p: ProcessActivity; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const Icon = ICON_CYCLE[index % ICON_CYCLE.length];

  return (
    <li className="py-3.5">
      <div className="flex items-start gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-secondary text-muted-foreground">
          <Icon className="h-[18px] w-[18px]" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="truncate text-sm font-semibold">{p.name}</p>
            <RiskPill risk={p.risk} />
          </div>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {p.dataTypes.map((t) => (
              <TagPill key={t}>{t}</TagPill>
            ))}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <span className="text-xs text-muted-foreground">{p.lastScanned}</span>
          <button
            type="button"
            aria-label={`Expand ${p.name}`}
            aria-expanded={expanded}
            onClick={() => setExpanded((v) => !v)}
            className="grid h-7 w-7 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-secondary"
          >
            <ChevronDown className={cn("h-4 w-4 transition-transform", expanded && "rotate-180")} />
          </button>
        </div>
      </div>
      {expanded && (
        <div className="mt-3 rounded-2xl bg-secondary/60 px-4 py-3 text-xs leading-relaxed text-muted-foreground">
          <p>{p.purpose}</p>
          <p className="mt-1.5">
            <span className="font-semibold text-foreground">{p.category}</span> · {p.records}
          </p>
        </div>
      )}
    </li>
  );
}

function DataFlowsPage() {
  const [scanning, setScanning] = useState(false);
  const [processes, setProcesses] = useState<ProcessActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchProcesses()
      .then((data) => {
        setProcesses(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Could not load processes. Backend may be waking up — try again shortly.");
        setLoading(false);
      });
  }, [refreshKey]);

  const handleRescan = useCallback(async () => {
    if (scanning) return;
    setScanning(true);
    try {
      const current = await fetchProcesses();
      for (const p of current) {
        await analyzeProcess({
          id: p.id,
          name: p.name,
          purpose: p.purpose,
          dataTypes: p.dataTypes,
        });
      }
      setRefreshKey((k) => k + 1);
    } catch (err) {
      console.error("Re-scan failed:", err);
    } finally {
      setScanning(false);
    }
  }, [scanning]);

  const neverScanned = processes.filter((p) => p.lastScanned === "Never").length;
  const byRisk = RISK_ORDER.map((risk) => ({
    risk,
    items: processes.filter((p) => p.risk === risk),
  })).filter((g) => g.items.length > 0);

  return (
    <div className="min-h-screen bg-background">
      <TopNav scanning={scanning} onRescan={handleRescan} />
      <main className="mx-auto max-w-[1440px] px-5 py-8 lg:px-8">
        <h1 className="text-2xl font-semibold tracking-tight">Data Processing Activities</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Every process where personal data is collected, used, or shared — grouped by risk tier.
        </p>

        {!loading && !error && (
          <div className="mt-5 flex flex-wrap gap-3">
            <span className="rounded-full bg-secondary px-3.5 py-1.5 text-xs font-semibold text-foreground">
              {processes.length} total processes
            </span>
            <span className="rounded-full bg-risk-high-soft px-3.5 py-1.5 text-xs font-semibold text-risk-high">
              {processes.filter((p) => p.risk === "high").length} high risk
            </span>
            <span className="rounded-full bg-secondary px-3.5 py-1.5 text-xs font-semibold text-muted-foreground">
              {neverScanned} never scanned
            </span>
          </div>
        )}

        {loading && <p className="mt-6 text-sm text-muted-foreground">Loading processes...</p>}
        {error && <p className="mt-6 text-sm text-risk-high">{error}</p>}

        <div className="mt-6 space-y-5">
          {byRisk.map((group) => (
            <Card key={group.risk} className="flex flex-col">
              <h2 className="text-sm font-semibold text-foreground">{RISK_LABEL[group.risk]}</h2>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {group.items.length} process{group.items.length === 1 ? "" : "es"}
              </p>
              <ul className="mt-2 divide-y divide-border/70">
                {group.items.map((p, i) => (
                  <ProcessRow key={p.id} p={p} index={i} />
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
