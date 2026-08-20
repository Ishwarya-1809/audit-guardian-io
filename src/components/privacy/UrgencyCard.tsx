import { useState } from "react";
import { ArrowRight, CalendarClock, X } from "lucide-react";
import {
  getDaysToEnforcement,
  ENFORCEMENT_DATE,
} from "@/lib/privacy-data";

export function UrgencyCard() {
  const daysRemaining = getDaysToEnforcement();
  const [isTimelineOpen, setIsTimelineOpen] = useState(false);

  return (
    <>
      <section
        className="flex flex-col justify-between rounded-3xl p-6 text-primary-foreground shadow-[var(--shadow-lift)]"
        style={{ backgroundImage: "var(--gradient-urgency)" }}
      >
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-foreground/15 px-3 py-1 text-[11px] font-semibold">
            <CalendarClock className="h-3.5 w-3.5" />
            Phase 3
          </span>

          <h2 className="mt-4 text-2xl font-semibold leading-snug tracking-tight">
            {daysRemaining} days to Phase 3 enforcement
          </h2>

          <p className="mt-2 text-sm leading-relaxed text-primary-foreground/80">
            Full DPDP Act enforcement begins {ENFORCEMENT_DATE} — get your
            organization audit-ready
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsTimelineOpen(true)}
          className="mt-6 inline-flex items-center gap-1 self-start text-sm font-semibold text-primary-foreground underline decoration-primary-foreground/60 underline-offset-4 transition-opacity hover:opacity-80"
        >
          View Compliance Timeline
          <ArrowRight className="h-4 w-4" />
        </button>
      </section>

      {isTimelineOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
          onClick={() => setIsTimelineOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-background p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">
                DPDP Compliance Timeline
              </h3>

              <button
                type="button"
                onClick={() => setIsTimelineOpen(false)}
                className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-5 space-y-4">
              <div className="rounded-xl bg-muted/50 p-4">
                <p className="text-sm font-semibold text-foreground">
                  Phase 3 Enforcement
                </p>

                <p className="mt-1 text-sm text-muted-foreground">
                  Full DPDP Act enforcement begins{" "}
                  <span className="font-semibold text-foreground">
                    {ENFORCEMENT_DATE}
                  </span>
                  .
                </p>
              </div>

              <div className="rounded-xl bg-muted/50 p-4">
                <p className="text-sm font-semibold text-foreground">
                  Current Countdown
                </p>

                <p className="mt-1 text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">
                    {daysRemaining} days
                  </span>{" "}
                  remaining until Phase 3 enforcement.
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setIsTimelineOpen(false)}
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