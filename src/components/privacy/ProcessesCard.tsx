import { useEffect, useState } from "react";
import { Banknote, ChevronDown, Fingerprint, Headphones, Megaphone, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Card, CardHeader, RiskPill, SeeAll, TagPill } from "./primitives";
import { fetchProcesses, type ProcessActivity } from "@/lib/privacy-data";
import { cn } from "@/lib/utils";

const ICON_CYCLE: { Icon: LucideIcon; tone: string }[] = [
  { Icon: Fingerprint, tone: "bg-risk-high-soft text-risk-high" },
  { Icon: Banknote, tone: "bg-accent text-accent-foreground" },
  { Icon: Megaphone, tone: "bg-risk-medium-soft text-risk-medium" },
  { Icon: Headphones, tone: "bg-secondary text-secondary-foreground" },
  { Icon: Users, tone: "bg-risk-low-soft text-risk-low" },
];

export function ProcessesCard({ refreshKey = 0 }: { refreshKey?: number }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const [processes, setProcesses] = useState<ProcessActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchProcesses()
      .then((data) => {
        setProcesses(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Could not load processes. Backend may be waking up — try again in a moment.");
        setLoading(false);
      });
  }, [refreshKey]);

  return (
    <Card className="flex flex-col">
      <CardHeader title="Data Processing Activities" action={<SeeAll />} />
      {loading && (
        <p className="mt-3 text-xs text-muted-foreground">Loading processes...</p>
      )}
      {error && <p className="mt-3 text-xs text-risk-high">{error}</p>}
      {!loading && !error && processes.length === 0 && (
        <p className="mt-3 text-xs text-muted-foreground">No processes found.</p>
      )}
      <ul className="mt-3 divide-y divide-border/70">
        {processes.map((p, index) => {
          const { Icon, tone } = ICON_CYCLE[index % ICON_CYCLE.length];
          const expanded = openId === p.id;
          return (
            <li key={p.id} className="py-3.5">
              <div className="flex items-start gap-3">
                <span className={cn("grid h-10 w-10 shrink-0 place-items-center rounded-2xl", tone)}>
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
                    onClick={() => setOpenId(expanded ? null : p.id)}
                    className="grid h-7 w-7 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-secondary"
                  >
                    <ChevronDown
                      className={cn("h-4 w-4 transition-transform", expanded && "rotate-180")}
                    />
                  </button>
                </div>
              </div>
              {expanded && (
                <div className="mt-3 rounded-2xl bg-secondary/60 px-4 py-3 text-xs leading-relaxed text-muted-foreground">
                  <p>{p.purpose}</p>
                  <p className="mt-1.5">
                    <span className="font-semibold text-foreground">{p.category}</span> ·{" "}
                    {p.records}
                  </p>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </Card>
  );
}