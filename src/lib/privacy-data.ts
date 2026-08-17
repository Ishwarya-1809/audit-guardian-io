export type RiskLevel = "high" | "medium" | "low";

export interface ScorePoint {
  date: string;
  label: string;
  score: number;
}

export interface ProcessActivity {
  id: string;
  name: string;
  category: string;
  risk: RiskLevel;
  dataTypes: string[];
  lastScanned: string;
  purpose: string;
  records: string;
}

export type FindingStatus = "open" | "resolved";

export interface Finding {
  id: string;
  title: string;
  severity: RiskLevel;
  section: string;
  process: string;
  explanation: string;
  suggestedFix: string;
  status: FindingStatus;
}

export interface RemediationStats {
  identified: number;
  inProgress: number;
  resolved: number;
}

export type TimeRange = "week" | "month" | "quarter" | "year";

export const TIME_RANGES: { value: TimeRange; label: string }[] = [
  { value: "week", label: "This Week" },
  { value: "month", label: "This Month" },
  { value: "quarter", label: "This Quarter" },
  { value: "year", label: "This Year" },
];

const TRENDS: Record<TimeRange, ScorePoint[]> = {
  week: [
    { date: "2026-07-21", label: "Jul 21", score: 71 },
    { date: "2026-07-22", label: "Jul 22", score: 72 },
    { date: "2026-07-23", label: "Jul 23", score: 74 },
    { date: "2026-07-24", label: "Jul 24", score: 75 },
    { date: "2026-07-25", label: "Jul 25", score: 76 },
    { date: "2026-07-26", label: "Jul 26", score: 78 },
  ],

  month: [
    { date: "2026-07-01", label: "Jul 1", score: 66 },
    { date: "2026-07-05", label: "Jul 5", score: 68 },
    { date: "2026-07-10", label: "Jul 10", score: 67 },
    { date: "2026-07-14", label: "Jul 14", score: 71 },
    { date: "2026-07-18", label: "Jul 18", score: 73 },
    { date: "2026-07-21", label: "Jul 21", score: 74 },
    { date: "2026-07-24", label: "Jul 24", score: 76 },
    { date: "2026-07-27", label: "Jul 27", score: 78 },
  ],

  quarter: [
    { date: "2026-05-05", label: "May 5", score: 54 },
    { date: "2026-05-22", label: "May 22", score: 58 },
    { date: "2026-06-08", label: "Jun 8", score: 61 },
    { date: "2026-06-24", label: "Jun 24", score: 65 },
    { date: "2026-07-10", label: "Jul 10", score: 67 },
    { date: "2026-07-27", label: "Jul 27", score: 78 },
  ],

  year: [
    { date: "2025-10-01", label: "Oct", score: 38 },
    { date: "2025-12-01", label: "Dec", score: 45 },
    { date: "2026-02-01", label: "Feb", score: 50 },
    { date: "2026-04-01", label: "Apr", score: 57 },
    { date: "2026-06-01", label: "Jun", score: 64 },
    { date: "2026-07-27", label: "Jul 27", score: 78 },
  ],
};

/** Mock data layer - swap these for real API calls later. */
export function getScoreTrend(range: TimeRange): ScorePoint[] {
  return TRENDS[range];
}

// ---------------------------------------------------------------------------
// DPDP Phase 3 Enforcement Countdown
// ---------------------------------------------------------------------------

export const ENFORCEMENT_DATE = "May 13, 2027";

/**
 * Returns the number of days remaining until
 * full DPDP Act enforcement begins on May 13, 2027.
 *
 * The value is calculated dynamically whenever
 * this function is called.
 */
export function getDaysToEnforcement(): number {
  const enforcementDate = new Date("2027-05-13T00:00:00");
  const today = new Date();

  const diffTime = enforcementDate.getTime() - today.getTime();

  const diffDays = Math.ceil(
    diffTime / (1000 * 60 * 60 * 24),
  );

  // Prevent negative countdown after the enforcement date.
  return Math.max(0, diffDays);
}

// ---------------------------------------------------------------------------
// Real backend integration
// ---------------------------------------------------------------------------

const API_BASE = "https://privacyaudit-backend.onrender.com";

function mapRiskTier(tier: string): RiskLevel {
  if (
    tier === "high" ||
    tier === "medium" ||
    tier === "low"
  ) {
    return tier;
  }

  return "low";
}

function mapStatus(status: string): FindingStatus {
  return status === "resolved" ? "resolved" : "open";
}

export async function fetchProcesses(): Promise<ProcessActivity[]> {
  const res = await fetch(`${API_BASE}/api/processes`);

  const data = await res.json();

  return data.map((p: any) => ({
    id: p._id,
    name: p.name,
    category: p.category ?? "General",
    risk: mapRiskTier(p.risk_tier ?? "low"),
    dataTypes: p.data_collected ?? [],
    lastScanned: p.last_analyzed_at
      ? new Date(p.last_analyzed_at).toLocaleString()
      : "Never",
    purpose: p.purpose ?? "",
    records: p.records ?? "—",
  }));
}

export async function fetchFindings(): Promise<Finding[]> {
  const res = await fetch(`${API_BASE}/api/findings`);

  const data = await res.json();

  return data.map((f: any) => ({
    id: f._id,
    title: f.finding_text,
    severity: mapRiskTier(
      f.severity === "critical" ? "high" : f.severity,
    ),
    section: f.section_reference,
    process: f.process_id,
    explanation: f.explanation,
    suggestedFix: f.suggested_fix,
    status: mapStatus(f.status ?? "open"),
  }));
}

export async function analyzeProcess(process: {
  id: string;
  name: string;
  purpose: string;
  dataTypes: string[];
}): Promise<Finding[]> {
  const res = await fetch(`${API_BASE}/api/analyze`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      process_id: process.id,
      name: process.name,
      purpose: process.purpose,
      data_collected: process.dataTypes,
      storage_location: "AWS Mumbai",
    }),
  });

  const data = await res.json();

  return (data.findings ?? []).map((f: any) => ({
    id: f._id,
    title: f.finding_text,
    severity: mapRiskTier(
      f.severity === "critical" ? "high" : f.severity,
    ),
    section: f.section_reference,
    process: f.process_id,
    explanation: f.explanation,
    suggestedFix: f.suggested_fix,
    status: mapStatus(f.status ?? "open"),
  }));
}

export async function sendChatMessage(
  findingId: string,
  message: string,
): Promise<string> {
  const res = await fetch(`${API_BASE}/api/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      finding_id: findingId,
      message,
    }),
  });

  const data = await res.json();

  return data.reply;
}

export async function updateFindingStatus(
  findingId: string,
  status: FindingStatus,
): Promise<void> {
  await fetch(`${API_BASE}/api/findings/${findingId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      status,
    }),
  });
}

const REPORT_PROMPT = `Generate a formal compliance analysis report for this finding. Structure it with these exact headers, each on its own line:

Risk Summary
Legal Basis
Business Impact
Remediation Plan
Priority Timeline

Under "Legal Basis", cite the exact DPDP section this finding relates to. Under "Remediation Plan", give numbered, actionable steps. Keep the whole report concise — a paragraph or short list per section, not an essay. Do not use markdown bold/asterisks, just plain text with the headers as shown.`;

export async function generateReport(
  findingId: string,
): Promise<string> {
  return sendChatMessage(findingId, REPORT_PROMPT);
}