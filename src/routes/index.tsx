import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { TopNav } from "@/components/privacy/TopNav";
import { ComplianceScoreCard } from "@/components/privacy/ComplianceScoreCard";
import { ProcessesCard } from "@/components/privacy/ProcessesCard";
import { FindingsCard } from "@/components/privacy/FindingsCard";
import { UrgencyCard } from "@/components/privacy/UrgencyCard";
import { RemediationCard } from "@/components/privacy/RemediationCard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PrivacyAudit AI — DPDP Compliance Dashboard" },
      {
        name: "description",
        content:
          "Track DPDP compliance scores, data processing activities, high-risk findings and remediation progress in one clean audit dashboard.",
      },
      { property: "og:title", content: "PrivacyAudit AI — DPDP Compliance Dashboard" },
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
  const [scanning, setScanning] = useState(false);
  const [lastScan, setLastScan] = useState("Today, 09:42 IST");

  const handleRescan = () => {
    if (scanning) return;
    setScanning(true);
    // Mock scan — swap for a real API call later.
    setTimeout(() => {
      setScanning(false);
      setLastScan("Just now");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background">
      <TopNav scanning={scanning} onRescan={handleRescan} />

      <main className="mx-auto max-w-[1440px] px-5 py-8 lg:px-8">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 sm:flex sm:justify-between">
          <div className="min-w-0">
            <h1 className="truncate text-2xl font-semibold tracking-tight">Fintech App</h1>
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
          <div className="lg:col-span-2">
            <ProcessesCard />
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-10">
          <div className="lg:col-span-4">
            <FindingsCard />
          </div>
          <div className="lg:col-span-2">
            <UrgencyCard />
          </div>
          <div className="lg:col-span-4">
            <RemediationCard />
          </div>
        </div>
      </main>
    </div>
  );
}
