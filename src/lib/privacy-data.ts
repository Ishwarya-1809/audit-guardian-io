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

export interface Finding {
  id: string;
  title: string;
  severity: RiskLevel;
  section: string;
  process: string;
  explanation: string;
  suggestedFix: string;
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
    { date: "2026-07-27", label: "Jul", score: 78 },
  ],
};

/** Mock data layer - swap these for real API calls later. */
export function getScoreTrend(range: TimeRange): ScorePoint[] {
  return TRENDS[range];
}

export const processes: ProcessActivity[] = [
  {
    id: "p1",
    name: "KYC Onboarding",
    category: "Identity",
    risk: "high",
    dataTypes: ["PAN", "Aadhaar", "Selfie"],
    lastScanned: "2h ago",
    purpose: "Customer identity verification at signup",
    records: "1.2M records",
  },
  {
    id: "p2",
    name: "Loan Underwriting",
    category: "Credit",
    risk: "high",
    dataTypes: ["Bank Statements", "CIBIL", "Salary Slips"],
    lastScanned: "5h ago",
    purpose: "Automated credit-worthiness scoring",
    records: "410K records",
  },
  {
    id: "p3",
    name: "Marketing Campaigns",
    category: "Growth",
    risk: "medium",
    dataTypes: ["Email", "Phone", "App Events"],
    lastScanned: "1d ago",
    purpose: "Segmented promotional outreach",
    records: "3.4M records",
  },
  {
    id: "p4",
    name: "Support Ticketing",
    category: "Service",
    risk: "medium",
    dataTypes: ["Chat Logs", "Phone"],
    lastScanned: "1d ago",
    purpose: "Customer issue resolution and QA review",
    records: "220K records",
  },
  {
    id: "p5",
    name: "Payroll Processing",
    category: "Internal",
    risk: "low",
    dataTypes: ["Employee ID", "Bank A/C"],
    lastScanned: "3d ago",
    purpose: "Monthly employee salary disbursal",
    records: "1.4K records",
  },
];

export const findings: Finding[] = [
  {
    id: "f1",
    title: "No lawful basis for KYC data collection",
    severity: "high",
    section: "Section 4",
    process: "KYC Onboarding",
    explanation:
      "Aadhaar and PAN are collected at signup, but there is no recorded consent artefact or legitimate-use justification tied to the collection event.",
    suggestedFix:
      "Attach a versioned consent notice to the signup flow and log the consent ID with every KYC record.",
  },
  {
    id: "f2",
    title: "Consent notice missing in regional languages",
    severity: "high",
    section: "Section 5(3)",
    process: "KYC Onboarding",
    explanation:
      "The DPDP Act requires the notice in English plus the Eighth Schedule languages. Only English is served today.",
    suggestedFix:
      "Publish the notice in at least Hindi, Tamil, Bengali and Marathi with a language switcher on the consent screen.",
  },
  {
    id: "f3",
    title: "Credit data retained 7 years past account closure",
    severity: "high",
    section: "Section 8(7)",
    process: "Loan Underwriting",
    explanation:
      "Bank statements and CIBIL pulls stay in the warehouse indefinitely after a loan closes, well beyond the stated purpose.",
    suggestedFix:
      "Define a retention clock per loan and auto-purge underwriting artefacts 180 days after closure.",
  },
  {
    id: "f4",
    title: "No opt-out path for marketing profiling",
    severity: "medium",
    section: "Section 6(4)",
    process: "Marketing Campaigns",
    explanation:
      "Users can unsubscribe from email, but behavioural segments continue to be built from app events.",
    suggestedFix:
      "Add a single withdraw-consent control that stops both messaging and downstream profiling jobs.",
  },
  {
    id: "f5",
    title: "Chat logs shared with vendor without DPA clause",
    severity: "medium",
    section: "Section 8(2)",
    process: "Support Ticketing",
    explanation:
      "A third-party QA vendor processes chat transcripts under an MSA that lacks DPDP processor obligations.",
    suggestedFix:
      "Execute a data processing addendum covering purpose limitation, breach notice and deletion.",
  },
  {
    id: "f6",
    title: "Breach notification runbook untested",
    severity: "low",
    section: "Section 8(6)",
    process: "Payroll Processing",
    explanation:
      "A runbook exists but has never been rehearsed, risking a miss on the mandated Data Protection Board notification window.",
    suggestedFix: "Run a tabletop breach drill each quarter and record the timeline evidence.",
  },
];

export const remediation: RemediationStats = {
  identified: 12,
  inProgress: 5,
  resolved: 7,
};

export const ENFORCEMENT_DATE = "May 13, 2027";
export const DAYS_TO_ENFORCEMENT = 298;

/** Mocked assistant reply - replace with a real API call later. */
export function mockAssistantReply(finding: Finding, question: string): string {
  const fix = finding.suggestedFix;
  return `On "${finding.title}" (${finding.section}, ${finding.process}): ${question.trim().replace(/\?$/, "")} - in practice the fastest path is to ${fix.charAt(0).toLowerCase()}${fix.slice(1)} Most teams close this within one sprint once an owner is assigned.`;
}
