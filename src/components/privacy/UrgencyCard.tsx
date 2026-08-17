import { ArrowRight, CalendarClock } from "lucide-react";
import {
  getDaysToEnforcement,
  ENFORCEMENT_DATE,
} from "@/lib/privacy-data";

export function UrgencyCard() {
  const daysRemaining = getDaysToEnforcement();

  return (
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
        className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-primary-foreground px-4 py-2.5 text-sm font-semibold text-primary transition-opacity hover:opacity-90"
      >
        View Compliance Timeline
        <ArrowRight className="h-4 w-4" />
      </button>
    </section>
  );
}