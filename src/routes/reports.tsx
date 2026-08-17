import { useCallback, useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ChevronDown, FileText, Loader2, Wrench, CheckCircle2 } from "lucide-react";
import { TopNav } from "@/components/privacy/TopNav";
import { Card } from "@/components/privacy/primitives";
import { cn } from "@/lib/utils";
import {
  fetchFindings,
  fetchProcesses,
  analyzeProcess,
  updateFindingStatus,
  generateReport,
  type Finding,
  type RiskLevel,
} from "@/lib/privacy-data";

export const Route = createFileRoute("/reports")({
  head: () => ({
    meta: [{ title: "Privexa — Reports" }],
  }),
  component: ReportsPage,
});

const dot: Record<RiskLevel, string> = {
  high: "bg-risk-high-soft text-risk-high",
  medium: "bg-risk-medium-soft text-risk-medium",
  low: "bg-risk-low-soft text-risk-low",
};

function FindingRow({
  finding,
  onResolved,
}: {
  finding: Finding;
  onResolved: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [resolving, setResolving] = useState(false);
  const [report, setReport] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

  const resolve = async () => {
    setResolving(true);
    try {
      await updateFindingStatus(finding.id, "resolved");
      onResolved(finding.id);
    } finally {
      setResolving(false);
    }
  };

  const runReport = async () => {
    setGenerating(true);
    try {
      const text = await generateReport(finding.id);
      setReport(text);
    } catch {
      setReport("Could not generate the report. Try again in a moment.");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <li className="py-3.5">
      <button
        type="button"
        aria-expanded={expanded}
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-start gap-3 text-left"
      >
        <span
          className={cn(
            "grid h-9 w-9 shrink-0 place-items-center rounded-full text-[11px] font-bold",
            dot[finding.severity],
          )}
        >
          {finding.severity === "high" ? "H" : finding.severity === "medium" ? "M" : "L"}
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-2">
            <span className="block text-sm font-medium leading-snug">{finding.title}</span>
            {finding.status === "resolved" && (
              <span className="inline-flex items-center gap-1 rounded-full bg-risk-low-soft px-2 py-0.5 text-[10px] font-semibold text-risk-low">
                <CheckCircle2 className="h-3 w-3" /> Resolved
              </span>
            )}
          </span>
          <span className="mt-1 block text-xs text-muted-foreground">{finding.process}</span>
        </span>
        <ChevronDown
          className={cn(
            "mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform",
            expanded && "rotate-180",
          )}
        />
      </button>

      {expanded && (
        <div className="mt-3 pl-12">
          <p className="text-xs leading-relaxed text-muted-foreground">{finding.explanation}</p>
          <p className="mt-2.5 flex items-start gap-2 text-xs leading-relaxed">
            <Wrench className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
            <span>
              <span className="font-semibold">Suggested fix: </span>
              {finding.suggestedFix}
            </span>
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={runReport}
              disabled={generating}
              className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3.5 py-1.5 text-xs font-semibold text-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {generating ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <FileText className="h-3.5 w-3.5" />
              )}
              {generating ? "Generating..." : "Generate Full Report"}
            </button>
            {finding.status !== "resolved" && (
              <button
                type="button"
                onClick={resolve}
                disabled={resolving}
                className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3.5 py-1.5 text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
              >
                {resolving ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <CheckCircle2 className="h-3.5 w-3.5" />
                )}
                {resolving ? "Marking..." : "Mark Resolved"}
              </button>
            )}
          </div>

          {report && (
            <div className="mt-3 whitespace-pre-line rounded-2xl border border-border/70 bg-secondary/40 p-4 text-xs leading-relaxed">
              {report}
            </div>
          )}
        </div>
      )}
    </li>
  );
}

function ReportsPage() {
  const [scanning, setScanning] = useState(false);
  const [findings, setFindings] = useState<Finding[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchFindings()
      .then((data) => {
        setFindings(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Could not load findings. Backend may be waking up — try refreshing shortly.");
        setLoading(false);
      });
  }, [refreshKey]);

  const handleRescan = useCallback(async () => {
    if (scanning) return;
    setScanning(true);
    try {
      const processes = await fetchProcesses();
      for (const p of processes) {
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

  const markResolvedLocally = (id: string) => {
    setFindings((prev) =>
      prev.map((f) => (f.id === id ? { ...f, status: "resolved" as const } : f)),
    );
  };

  const bySection = findings.reduce<Record<string, Finding[]>>((acc, f) => {
    const key = f.section || "Unclassified";
    acc[key] = acc[key] ?? [];
    acc[key].push(f);
    return acc;
  }, {});

  const sections = Object.keys(bySection).sort();

  return (
    <div className="min-h-screen bg-background">
      <TopNav scanning={scanning} onRescan={handleRescan} />
      <main className="mx-auto max-w-[1440px] px-5 py-8 lg:px-8">
        <h1 className="text-2xl font-semibold tracking-tight">Compliance Reports</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Findings grouped by DPDP Act section, with grounded citations and one-click full
          analysis reports.
        </p>

        {loading && <p className="mt-6 text-sm text-muted-foreground">Loading findings...</p>}
        {error && <p className="mt-6 text-sm text-risk-high">{error}</p>}
        {!loading && !error && findings.length === 0 && (
          <p className="mt-6 text-sm text-muted-foreground">
            No findings yet — click Re-scan to generate some.
          </p>
        )}

        <div className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-2">
          {sections.map((section) => (
            <Card key={section} className="flex flex-col">
              <h2 className="text-sm font-semibold text-foreground">{section}</h2>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {bySection[section].length} finding{bySection[section].length === 1 ? "" : "s"}
              </p>
              <ul className="mt-2 divide-y divide-border/70">
                {bySection[section].map((f) => (
                  <FindingRow key={f.id} finding={f} onResolved={markResolvedLocally} />
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
