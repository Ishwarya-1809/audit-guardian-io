import { useMemo, useState } from "react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import { Card, CardHeader } from "./primitives";
import {
  getScoreTrend,
  TIME_RANGES,
  type TimeRange,
} from "@/lib/privacy-data";
import { cn } from "@/lib/utils";

const W = 640;
const H = 200;
const PAD_X = 18;
const PAD_Y = 24;

export function ComplianceScoreCard() {
  const [range, setRange] = useState<TimeRange>("month");
  const [open, setOpen] = useState(false);

  const points = getScoreTrend(range);

  const [active, setActive] = useState(points.length - 1);

  const index = Math.min(active, points.length - 1);

  const geometry = useMemo(() => {
    const scores = points.map((p) => p.score);

    const min = Math.min(...scores) - 6;
    const max = Math.max(...scores) + 6;

    const coords = points.map((p, i) => ({
      x:
        PAD_X +
        (i * (W - PAD_X * 2)) /
          Math.max(points.length - 1, 1),

      y:
        PAD_Y +
        (1 - (p.score - min) / (max - min)) *
          (H - PAD_Y * 2),
    }));

    const line = coords
      .map(
        (c, i) =>
          `${i === 0 ? "M" : "L"}${c.x} ${c.y}`,
      )
      .join(" ");

    const area = `${line} L${coords[coords.length - 1].x} ${H} L${coords[0].x} ${H} Z`;

    return {
      coords,
      line,
      area,
    };
  }, [points]);

  const delta =
    points[points.length - 1].score -
    points[0].score;

  const activePoint = points[index];
  const activeCoord = geometry.coords[index];

  const goPrevious = () => {
    setActive((current) => Math.max(current - 1, 0));
  };

  const goNext = () => {
    setActive((current) =>
      Math.min(current + 1, points.length - 1),
    );
  };

  return (
    <Card className="flex flex-col">
      <CardHeader
        title="Compliance Score Tracker"
        action={
          <div className="relative shrink-0">
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3.5 py-1.5 text-xs font-medium text-foreground"
            >
              {
                TIME_RANGES.find(
                  (r) => r.value === range,
                )?.label
              }

              <ChevronDown
                className={cn(
                  "h-3.5 w-3.5 transition-transform",
                  open && "rotate-180",
                )}
              />
            </button>

            {open && (
              <div className="absolute right-0 z-20 mt-2 w-40 overflow-hidden rounded-2xl bg-popover p-1.5 shadow-[var(--shadow-lift)] ring-1 ring-border">
                {TIME_RANGES.map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => {
                      setRange(r.value);

                      setActive(
                        getScoreTrend(r.value).length - 1,
                      );

                      setOpen(false);
                    }}
                    className={cn(
                      "block w-full rounded-xl px-3 py-2 text-left text-xs font-medium transition-colors hover:bg-secondary",
                      r.value === range &&
                        "text-primary",
                    )}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        }
      />

      <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-muted-foreground">
        Track how your organization&apos;s DPDP compliance posture
        changes as processes are scanned and remediated
      </p>

      <div className="relative mt-6">
        {/* Left navigation arrow */}
        <button
          type="button"
          onClick={goPrevious}
          disabled={index === 0}
          aria-label="Previous compliance score"
          className={cn(
            "absolute left-1 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-background/90 shadow-sm ring-1 ring-border transition-all",
            index === 0
              ? "cursor-not-allowed opacity-30"
              : "hover:bg-secondary hover:shadow-md",
          )}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {/* Right navigation arrow */}
        <button
          type="button"
          onClick={goNext}
          disabled={index === points.length - 1}
          aria-label="Next compliance score"
          className={cn(
            "absolute right-1 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-background/90 shadow-sm ring-1 ring-border transition-all",
            index === points.length - 1
              ? "cursor-not-allowed opacity-30"
              : "hover:bg-secondary hover:shadow-md",
          )}
        >
          <ChevronRight className="h-4 w-4" />
        </button>

        <svg
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="none"
          className="h-48 w-full sm:h-56"
          role="img"
          aria-label="Compliance score trend"
        >
          <defs>
            <linearGradient
              id="scoreFill"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="0%"
                stopColor="var(--primary)"
                stopOpacity="0.22"
              />

              <stop
                offset="100%"
                stopColor="var(--primary)"
                stopOpacity="0"
              />
            </linearGradient>
          </defs>

          <path
            d={geometry.area}
            fill="url(#scoreFill)"
          />

          <path
            d={geometry.line}
            fill="none"
            stroke="var(--primary)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />

          {geometry.coords.map((c, i) => (
            <circle
              key={points[i].date}
              cx={c.x}
              cy={c.y}
              r={i === index ? 5 : 3}
              fill={
                i === index
                  ? "var(--primary)"
                  : "var(--card)"
              }
              stroke="var(--primary)"
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
              className="cursor-pointer"
              onClick={() => setActive(i)}
            />
          ))}
        </svg>

        <div
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-full"
          style={{
            left: `${(activeCoord.x / W) * 100}%`,
            top: `${(activeCoord.y / H) * 100 - 6}%`,
          }}
        >
          <div className="rounded-xl bg-foreground px-2.5 py-1 text-[11px] font-semibold text-background shadow-[var(--shadow-lift)]">
            {activePoint.score}%

            <span className="ml-1.5 font-normal opacity-70">
              {activePoint.label}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4 border-t border-border/70 pt-5 sm:flex sm:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-4xl font-semibold tracking-tight text-primary">
              {delta >= 0 ? "+" : ""}
              {delta}%
            </span>

            <TrendingUp className="h-5 w-5 shrink-0 text-risk-low" />
          </div>

          <p className="mt-1 text-sm text-muted-foreground">
            Compliance score improved since last scan
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {points.map((p, i) => (
            <button
              key={p.date}
              type="button"
              aria-label={`Jump to ${p.label}`}
              onClick={() => setActive(i)}
              className={cn(
                "h-2.5 rounded-full transition-all",
                i === index
                  ? "w-6 bg-primary"
                  : "w-2.5 bg-border hover:bg-primary/40",
              )}
            />
          ))}
        </div>
      </div>
    </Card>
  );
}