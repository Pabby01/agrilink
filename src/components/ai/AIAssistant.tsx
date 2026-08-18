import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Sparkles, Send } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useApp } from "@/lib/store";
import { askAgrolinkAI, suggestedPrompts, type AIReply } from "@/lib/ai-service";
import type { Role } from "@/lib/types";

interface Turn {
  question: string;
  reply: AIReply;
}

export function AIAssistant({ role, compact = false }: { role: Role; compact?: boolean }) {
  const { state } = useApp();
  const [input, setInput] = useState("");
  const [turns, setTurns] = useState<Turn[]>([]);

  const ask = (question: string) => {
    const q = question.trim();
    if (!q) return;
    setTurns((t) => [...t, { question: q, reply: askAgrolinkAI(q, role, state) }]);
    setInput("");
  };

  return (
    <Card className="gap-0 p-4 shadow-[var(--shadow-card)] sm:p-5">
      <div className="flex items-center gap-2">
        <span className="grid size-8 place-items-center rounded-lg bg-gold/30 text-gold-foreground">
          <Sparkles className="size-4" aria-hidden />
        </span>
        <div>
          <h2 className="font-display text-lg font-bold leading-none">Agrolink AI</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Decision support grounded in live marketplace data
          </p>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {turns.length === 0 && (
          <p className="rounded-lg bg-muted/60 p-3 text-sm text-muted-foreground">
            Ask a question below, or tap a suggestion to see how Agrolink AI reasons about trust,
            pricing and logistics.
          </p>
        )}
        {turns.map((t, i) => (
          <div key={i} className="space-y-2">
            <p className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-sm bg-primary px-3 py-2 text-sm text-primary-foreground">
              {t.question}
            </p>
            <div className="w-fit max-w-[92%] rounded-2xl rounded-bl-sm border bg-card p-3">
              <p className="text-sm">{t.reply.answer}</p>
              <p className="mt-2 rounded-lg bg-accent/15 p-2 text-sm">
                <span className="font-semibold">Suggestion: </span>
                {t.reply.suggestion}
              </p>
              {t.reply.action && (
                <Button asChild size="sm" variant="secondary" className="mt-2">
                  <Link to={t.reply.action.to}>{t.reply.action.label}</Link>
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {!compact && (
        <div className="mt-4 flex flex-wrap gap-2">
          {suggestedPrompts[role].map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => ask(p)}
              className="rounded-full border border-border bg-muted/50 px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted"
            >
              {p}
            </button>
          ))}
        </div>
      )}

      <form
        className="mt-4 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          ask(input);
        }}
      >
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Agrolink AI…"
          aria-label="Ask Agrolink AI"
        />
        <Button type="submit" size="icon" aria-label="Send question">
          <Send className="size-4" />
        </Button>
      </form>
    </Card>
  );
}
