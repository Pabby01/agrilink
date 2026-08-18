import { createFileRoute, Link } from "@tanstack/react-router";
import { Page, PageHeader } from "@/components/layout/AppShell";
import { AIAssistant } from "@/components/ai/AIAssistant";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/store";
import { insights } from "@/lib/mock-data";

export const Route = createFileRoute("/insights")({
  head: () => ({
    meta: [
      { title: "Agrolink AI — smarter trading decisions" },
      {
        name: "description",
        content:
          "Ask Agrolink AI about pricing, farmer trust, order risk and delivery priority. Answers are grounded in live marketplace data.",
      },
      { property: "og:title", content: "Agrolink AI" },
      {
        property: "og:description",
        content: "Pricing, trust and logistics guidance grounded in marketplace data.",
      },
    ],
  }),
  component: InsightsPage,
});

function InsightsPage() {
  const { role } = useApp();
  const activeRole = role ?? "buyer";
  const examples = insights.filter((i) => i.role === activeRole);

  return (
    <Page>
      <PageHeader
        title="Agrolink AI"
        subtitle="A decision assistant for every role — pricing help for farmers, supplier vetting for buyers, job prioritisation for transporters and risk review for admins."
      />

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <AIAssistant role={activeRole} />

        <div className="space-y-4">
          {!role && (
            <Card className="gap-0 p-5 shadow-[var(--shadow-card)]">
              <p className="text-sm">
                You are exploring the buyer assistant. Sign in to get answers tailored to your role.
              </p>
              <Button asChild size="sm" className="mt-3 w-fit">
                <Link to="/auth">Choose a role</Link>
              </Button>
            </Card>
          )}
          <Card className="gap-0 p-5 shadow-[var(--shadow-card)]">
            <h2 className="font-display text-lg font-bold">What people ask</h2>
            <ul className="mt-3 space-y-3">
              {examples.map((i) => (
                <li key={i.id} className="rounded-lg border p-3">
                  <p className="text-sm font-semibold">{i.question}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{i.answer}</p>
                </li>
              ))}
            </ul>
          </Card>
          <Card className="gap-0 p-5 shadow-[var(--shadow-card)]">
            <h2 className="font-display text-lg font-bold">How it works</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              In this prototype the assistant reasons over the marketplace state in your browser —
              listings, trust profiles, orders and deliveries. The interface is model-agnostic, so a
              hosted LLM can be swapped in behind the same function without changing the UI.
            </p>
          </Card>
        </div>
      </div>
    </Page>
  );
}
