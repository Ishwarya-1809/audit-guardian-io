import { useEffect, useState } from "react";
import {
  Banknote,
  ChevronDown,
  Fingerprint,
  Headphones,
  Megaphone,
  Users,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  Card,
  CardHeader,
  RiskPill,
  TagPill,
} from "./primitives";
import {
  fetchProcesses,
  type ProcessActivity,
} from "@/lib/privacy-data";
import { cn } from "@/lib/utils";

const ICON_CYCLE: { Icon: LucideIcon; tone: string }[] = [
  {
    Icon: Fingerprint,
    tone: "bg-risk-high-soft text-risk-high",
  },
  {
    Icon: Banknote,
    tone: "bg-accent text-accent-foreground",
  },
  {
    Icon: Megaphone,
    tone: "bg-risk-medium-soft text-risk-medium",
  },
  {
    Icon: Headphones,
    tone: "bg-secondary text-secondary-foreground",
  },
  {
    Icon: Users,
    tone: "bg-risk-low-soft text-risk-low",
  },
];

function ProcessRow({
  process,
  index,
  expanded,
  onToggle,
}: {
  process: ProcessActivity;
  index: number;
  expanded: boolean;
  onToggle: () => void;
}) {
  const { Icon, tone } =
    ICON_CYCLE[index % ICON_CYCLE.length];

  return (
    <li className="border-b border-border/70 py-3.5 last:border-b-0">
      <div className="flex items-start gap-3">
        <span
          className={cn(
            "grid h-10 w-10 shrink-0 place-items-center rounded-2xl",
            tone,
          )}
        >
          <Icon className="h-[18px] w-[18px]" />
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="truncate text-sm font-semibold">
              {process.name}
            </p>

            <RiskPill risk={process.risk} />
          </div>

          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {process.dataTypes.map((t) => (
              <TagPill key={t}>{t}</TagPill>
            ))}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          <span className="text-xs text-muted-foreground">
            {process.lastScanned}
          </span>

          <button
            type="button"
            aria-label={`Expand ${process.name}`}
            aria-expanded={expanded}
            onClick={onToggle}
            className="grid h-7 w-7 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-secondary"
          >
            <ChevronDown
              className={cn(
                "h-4 w-4 transition-transform",
                expanded && "rotate-180",
              )}
            />
          </button>
        </div>
      </div>

      {expanded && (
        <div className="mt-3 rounded-2xl bg-secondary/60 px-4 py-3 text-xs leading-relaxed text-muted-foreground">
          <p>{process.purpose}</p>

          <p className="mt-1.5">
            <span className="font-semibold text-foreground">
              {process.category}
            </span>{" "}
            · {process.records}
          </p>
        </div>
      )}
    </li>
  );
}

export function ProcessesCard({
  refreshKey = 0,
}: {
  refreshKey?: number;
}) {
  const [openId, setOpenId] = useState<string | null>(null);
  const [processes, setProcesses] = useState<
    ProcessActivity[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(
    null,
  );

  const [showAll, setShowAll] = useState(false);
  const [modalOpenId, setModalOpenId] = useState<
    string | null
  >(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetchProcesses()
      .then((data) => {
        setProcesses(data);
        setLoading(false);
      })
      .catch(() => {
        setError(
          "Could not load processes. Backend may be waking up — try again in a moment.",
        );
        setLoading(false);
      });
  }, [refreshKey]);

  const closeModal = () => {
    setShowAll(false);
    setModalOpenId(null);
  };

  return (
    <>
      <Card className="flex flex-col">
        <CardHeader
          title="Data Processing Activities"
          action={
            <button
              type="button"
              onClick={() => setShowAll(true)}
              className="text-sm font-medium text-primary transition-opacity hover:opacity-70"
            >
              See all
            </button>
          }
        />

        {loading && (
          <p className="mt-3 text-xs text-muted-foreground">
            Loading processes...
          </p>
        )}

        {error && (
          <p className="mt-3 text-xs text-risk-high">
            {error}
          </p>
        )}

        {!loading &&
          !error &&
          processes.length === 0 && (
            <p className="mt-3 text-xs text-muted-foreground">
              No processes found.
            </p>
          )}

        <ul className="mt-3 divide-y divide-border/70">
          {processes.map((p, index) => {
            const expanded = openId === p.id;

            return (
              <ProcessRow
                key={p.id}
                process={p}
                index={index}
                expanded={expanded}
                onToggle={() =>
                  setOpenId(
                    expanded ? null : p.id,
                  )
                }
              />
            );
          })}
        </ul>
      </Card>

      {showAll && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
          onClick={closeModal}
        >
          <div
            className="flex max-h-[85vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl bg-background shadow-2xl ring-1 ring-border"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  All Data Processing Activities
                </h2>

                <p className="mt-1 text-xs text-muted-foreground">
                  {processes.length} process
                  {processes.length === 1 ? "" : "es"} monitored
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                aria-label="Close processing activities"
                className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="overflow-y-auto px-6">
              {processes.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  No processing activities available.
                </p>
              ) : (
                <ul className="divide-y divide-border/70">
                  {processes.map((process, index) => {
                    const expanded =
                      modalOpenId === process.id;

                    return (
                      <ProcessRow
                        key={process.id}
                        process={process}
                        index={index}
                        expanded={expanded}
                        onToggle={() =>
                          setModalOpenId(
                            expanded
                              ? null
                              : process.id,
                          )
                        }
                      />
                    );
                  })}
                </ul>
              )}
            </div>

            <div className="flex justify-end border-t border-border px-6 py-4">
              <button
                type="button"
                onClick={closeModal}
                className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}