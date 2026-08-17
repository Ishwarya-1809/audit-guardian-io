import { useEffect, useState } from "react";
import { Card, CardHeader } from "./primitives";
import { fetchFindings } from "@/lib/privacy-data";

export function RemediationCard({ refreshKey = 0 }: { refreshKey?: number }) {
  const [identified, setIdentified] = useState(0);
  const [resolved, setResolved] = useState(0);
  const [loading, setLoading] = useState(true);
  const today = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  useEffect(() => {
    setLoading(true);
    fetchFindings()
      .then((findings) => {
        setIdentified(findings.length);
        setResolved(findings.filter((f) => f.status === "resolved").length);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [refreshKey]);

  const open = Math.max(identified - resolved, 0);
  const segments = [
    { label: "Open", value: open, color: "bg-risk-high" },
    { label: "Resolved", value: resolved, color: "bg-risk-low" },
  ];
  const total = segments.reduce((s, x) => s + x.value, 0) || 1;

  return (
    <Card className="flex flex-col">
      <CardHeader
        title="Remediation Progress"
        action={<span className="shrink-0 text-xs text-muted-foreground">{today}</span>}
      />

      {loading && <p className="mt-4 text-xs text-muted-foreground">Loading...</p>}

      {!loading && (
        <>
          <div className="mt-6 grid grid-cols-2 gap-4">
            {[
              { n: identified, l: "Findings identified" },
              { n: resolved, l: "Resolved" },
            ].map((s) => (
              <div key={s.l} className="min-w-0">
                <p className="text-3xl font-semibold tracking-tight sm:text-4xl">{s.n}</p>
                <p className="mt-1 text-xs leading-snug text-muted-foreground">{s.l}</p>
              </div>
            ))}
          </div>

          <div className="mt-7 flex h-3 w-full gap-1 overflow-hidden">
            {segments.map((s) => (
              <div
                key={s.label}
                className={`${s.color} rounded-full`}
                style={{ width: `${(s.value / total) * 100}%` }}
                title={`${s.label}: ${s.value}`}
              />
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
            {segments.map((s) => (
              <span key={s.label} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className={`h-2 w-2 rounded-full ${s.color}`} />
                {s.label}
                <span className="font-semibold text-foreground">{s.value}</span>
              </span>
            ))}
          </div>
        </>
      )}
    </Card>
  );
}
