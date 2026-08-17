import { useCallback, useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { TopNav } from "@/components/privacy/TopNav";
import { ComplianceScoreCard } from "@/components/privacy/ComplianceScoreCard";
import { ProcessesCard } from "@/components/privacy/ProcessesCard";
import { FindingsCard } from "@/components/privacy/FindingsCard";
import { UrgencyCard } from "@/components/privacy/UrgencyCard";
import { RemediationCard } from "@/components/privacy/RemediationCard";
import { fetchProcesses, analyzeProcess } from "@/lib/privacy-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Privexa — DPDP Compliance Dashboard" },
      {
        name: "description",
        content:
          "Track DPDP compliance scores, data processing activities, high-risk findings and remediation progress in one clean audit dashboard.",
      },
      { property: "og:title", content: "Privexa — DPDP Compliance Dashboard" },
      {
        property: "og:description",
        content:
          "Monitor compliance posture, flagged findings and remediation progress for your organization.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const navigate = useNavigate();

  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [scanning, setScanning] = useState(false);
  const [lastScan, setLastScan] = useState("Today, 09:42 IST");
  const [refreshKey, setRefreshKey] = useState(0);

  // Check login status on the client.
  useEffect(() => {
    const isAuthenticated =
      localStorage.getItem("privexa_authenticated") === "true";

    if (!isAuthenticated) {
      navigate({
        to: "/login",
        replace: true,
      });
      return;
    }

    setAuthenticated(true);
  }, [navigate]);

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

      setLastScan("Just now");
      setRefreshKey((k) => k + 1);
    } catch (err) {
      console.error("Re-scan failed:", err);
    } finally {
      setScanning(false);
    }
  }, [scanning]);

  // Avoid showing the dashboard before authentication is checked.
  if (authenticated === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-sm text-muted-foreground">
          Checking authentication...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <TopNav scanning={scanning} onRescan={handleRescan} />

      <main className="mx-auto max-w-[1440px] px-5 py-8 lg:px-8">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 sm:flex sm:justify-between">
          <div className="min-w-0">
            <h1 className="truncate text-2xl font-semibold tracking-tight">
              Fintech App
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              DPDP audit workspace · Last full scan {lastScan}
            </p>
          </div>

          <span className="shrink-0 rounded-full bg-risk-low-soft px-3 py-1.5 text-xs font-semibold text-risk-low">
            5 processes monitored
          </span>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <ComplianceScoreCard />
          </div>

          <div id="data-flows" className="lg:col-span-2">
            <ProcessesCard refreshKey={refreshKey} />
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-10">
          <div id="reports" className="lg:col-span-4">
            <FindingsCard refreshKey={refreshKey} />
          </div>

          <div className="lg:col-span-2">
            <UrgencyCard />
          </div>

          <div id="remediation" className="lg:col-span-4">
            <RemediationCard refreshKey={refreshKey} />
          </div>
        </div>
      </main>
    </div>
  );
}