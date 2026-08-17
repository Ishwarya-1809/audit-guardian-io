import { useEffect, useState } from "react";
import { ChevronDown, Send, Wrench } from "lucide-react";
import { Card, CardHeader, SeeAll } from "./primitives";
import { fetchFindings, sendChatMessage, type Finding, type RiskLevel } from "@/lib/privacy-data";
import { cn } from "@/lib/utils";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
}

const dot: Record<RiskLevel, string> = {
  high: "bg-risk-high-soft text-risk-high",
  medium: "bg-risk-medium-soft text-risk-medium",
  low: "bg-risk-low-soft text-risk-low",
};

function FindingChat({ finding }: { finding: Finding }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    const q = draft.trim();
    if (!q || sending) return;
    const stamp = Date.now();
    setMessages((m) => [...m, { id: `u${stamp}`, role: "user", text: q }]);
    setDraft("");
    setSending(true);
    try {
      const reply = await sendChatMessage(finding.id, q);
      setMessages((m) => [...m, { id: `a${stamp}`, role: "assistant", text: reply }]);
    } catch {
      setMessages((m) => [
        ...m,
        { id: `a${stamp}`, role: "assistant", text: "Sorry, I couldn't reach the server. Try again in a moment." },
      ]);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="mt-4 rounded-2xl bg-secondary/50 p-3">
      <p className="px-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
        Ask about this finding
      </p>
      <div className="mt-2 max-h-56 space-y-2.5 overflow-y-auto px-1">
        {messages.length === 0 ? (
          <p className="py-4 text-center text-xs text-muted-foreground">
            Ask a follow-up about this finding
          </p>
        ) : (
          messages.map((m) => (
            <div key={m.id} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
              <p
                className={cn(
                  "max-w-[85%] text-xs leading-relaxed",
                  m.role === "user"
                    ? "rounded-2xl bg-accent px-3 py-2 text-accent-foreground"
                    : "text-foreground",
                )}
              >
                {m.text}
              </p>
            </div>
          ))
        )}
        {sending && <p className="text-xs italic text-muted-foreground">Thinking...</p>}
      </div>
      <form onSubmit={send} className="mt-2 flex items-center gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Type your question..."
          disabled={sending}
          className="h-9 min-w-0 flex-1 rounded-full bg-card px-3.5 text-xs outline-none ring-primary/40 placeholder:text-muted-foreground focus:ring-2 disabled:opacity-60"
        />
        <button
          type="submit"
          aria-label="Send"
          disabled={sending}
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}

export function FindingsCard({ refreshKey = 0 }: { refreshKey?: number }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const [findings, setFindings] = useState<Finding[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchFindings()
      .then((data) => {
        setFindings(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Could not load findings. Backend may be waking up — try refreshing shortly.");
        setLoading(false);
      });
  }, [refreshKey]);

  return (
    <Card className="flex flex-col">
      <CardHeader title="High-Risk Findings" action={<SeeAll />} />
      {loading && <p className="mt-3 text-xs text-muted-foreground">Loading findings...</p>}
      {error && <p className="mt-3 text-xs text-risk-high">{error}</p>}
      {!loading && !error && findings.length === 0 && (
        <p className="mt-3 text-xs text-muted-foreground">
          No findings yet — run a re-scan to generate some.
        </p>
      )}
      <ul className="mt-3 divide-y divide-border/70">
        {findings.map((f) => {
          const expanded = openId === f.id;
          return (
            <li key={f.id} className="py-3.5">
              <button
                type="button"
                aria-expanded={expanded}
                onClick={() => setOpenId(expanded ? null : f.id)}
                className="flex w-full items-start gap-3 text-left"
              >
                <span
                  className={cn(
                    "grid h-9 w-9 shrink-0 place-items-center rounded-full text-[11px] font-bold",
                    dot[f.severity],
                  )}
                >
                  {f.severity === "high" ? "H" : f.severity === "medium" ? "M" : "L"}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium leading-snug">{f.title}</span>
                  <span className="mt-1 block text-xs text-muted-foreground">
                    {f.section} · {f.process}
                  </span>
                </span>
                <ChevronDown
                  className={cn(
                    "mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform",
                    expanded && "rotate-180",
                  )}
                />
              </button>

              {expanded && (
                <div className="mt-3 pl-12">
                  <p className="text-xs leading-relaxed text-muted-foreground">{f.explanation}</p>
                  <p className="mt-2.5 flex items-start gap-2 text-xs leading-relaxed">
                    <Wrench className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                    <span>
                      <span className="font-semibold">Suggested fix: </span>
                      {f.suggestedFix}
                    </span>
                  </p>
                  <FindingChat finding={f} />
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </Card>
  );
}