import { Card, CardHeader } from "./primitives";
import { remediation } from "@/lib/privacy-data";

const today = "Jul 27, 2026";

export function RemediationCard() {
  const open = remediation.identified - remediation.inProgress - remediation.resolved;
  const segments = [
    { label: "Open", value: Math.max(open, 0), color: "bg-risk-high" },
    { label: "In Progress", value: remediation.inProgress, color: "bg-risk-medium" },
    { label: "Resolved", value: remediation.resolved, color: "bg-risk-low" },
  ];
  const total = segments.reduce((s, x) => s + x.value, 0) || 1;

  return (
    <Card className="flex flex-col">
      <CardHeader
        title="Remediation Progress"
        action={<span className="shrink-0 text-xs text-muted-foreground">{today}</span>}
      />

      <div className="mt-6 grid grid-cols-3 gap-4">
        {[
          { n: remediation.identified, l: "Findings identified" },
          { n: remediation.inProgress, l: "In Progress" },
          { n: remediation.resolved, l: "Resolved" },
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
    </Card>
  );
}
