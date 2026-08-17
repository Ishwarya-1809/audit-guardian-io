import { useCallback, useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, ListChecks } from "lucide-react";
import { TopNav } from "@/components/privacy/TopNav";
import { Card } from "@/components/privacy/primitives";
import {
  fetchFindings,
  fetchProcesses,
  analyzeProcess,
  type Finding,
} from "@/lib/privacy-data";

export const Route = createFileRoute("/remediation")({
  head: () => ({
    meta: [{ title: "Privexa — Remediation" }],
  }),
  component: RemediationPage,
});

function RemediationPage() {
  const [scanning, setScanning] = useState(false);
  const [findings, setFindings] = useState<Finding[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const today = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  useEffect(() => {
    setLoading(true);
    fetchFindings()
      .then((data) => {
        setFindings(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
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

  const resolved = findings.filter((f) => f.status === "resolved");
  const open = findings.filter((f) => f.status !== "resolved");
  const total = findings.length || 1;
  const resolvedPct = Math.round((resolved.length / total) * 100);

  const bySeverity = (list: Finding[], severity: Finding["severity"]) =>
    list.filter((f) => f.severity === severity).length;

  return (
    <div className="min-h-screen bg-background">
      <TopNav scanning={scanning} onRescan={handleRescan} />
      <main className="mx-auto max-w-[1440px] px-5 py-8 lg:px-8">
        <h1 className="text-2xl font-semibold tracking-tight">Remediation Progress</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Real-time status of every finding — mark items resolved from the Reports page and track
          progress here.
        </p>

        {loading ? (
          <p className="mt-6 text-sm text-muted-foreground">Loading...</p>
        ) : (
          <>
            <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-3">
              <Card>
                <p className="text-4xl font-semibold tracking-tight">{findings.length}</p>
                <p className="mt-1 text-xs text-muted-foreground">Total findings identified</p>
              </Card>
              <Card>
                <p className="text-4xl font-semibold tracking-tight text-risk-high">{open.length}</p>
                <p className="mt-1 text-xs text-muted-foreground">Still open</p>
              </Card>
              <Card>
                <p className="text-4xl font-semibold tracking-tight text-risk-low">{resolved.length}</p>
                <p className="mt-1 text-xs text-muted-foreground">Resolved · {today}</p>
              </Card>
            </div>

            <Card className="mt-5">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-muted-foreground">Overall resolution rate</span>
                <span className="font-semibold">{resolvedPct}%</span>
              </div>
              <div className="mt-2 h-3 w-full overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full rounded-full bg-risk-low transition-all"
                  style={{ width: `${resolvedPct}%` }}
                />
              </div>
            </Card>

            <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
              <Card>
                <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <ListChecks className="h-4 w-4 text-risk-high" /> Open, by severity
                </h2>
                <ul className="mt-3 space-y-2 text-xs text-muted-foreground">
                  <li className="flex justify-between">
                    <span>Critical / High</span>
                    <span className="font-semibold text-foreground">{bySeverity(open, "high")}</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Medium</span>
                    <span className="font-semibold text-foreground">{bySeverity(open, "medium")}</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Low</span>
                    <span className="font-semibold text-foreground">{bySeverity(open, "low")}</span>
                  </li>
                </ul>
              </Card>
              <Card>
                <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <CheckCircle2 className="h-4 w-4 text-risk-low" /> Resolved, by severity
                </h2>
                <ul className="mt-3 space-y-2 text-xs text-muted-foreground">
                  <li className="flex justify-between">
                    <span>Critical / High</span>
                    <span className="font-semibold text-foreground">{bySeverity(resolved, "high")}</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Medium</span>
                    <span className="font-semibold text-foreground">{bySeverity(resolved, "medium")}</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Low</span>
                    <span className="font-semibold text-foreground">{bySeverity(resolved, "low")}</span>
                  </li>
                </ul>
              </Card>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
