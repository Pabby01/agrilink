import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Page, PageHeader } from "@/components/layout/AppShell";
import { AIAssistant } from "@/components/ai/AIAssistant";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/store";
import { insights } from "@/lib/mock-data";
import { fadeInUp, staggerContainer } from "@/lib/animations";

export const Route = createFileRoute("/insights")({
  head: () => ({
    meta: [
      { title: "Agrolink AI — Smarter Trading Decisions" },
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

      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]"
      >
        <motion.div variants={fadeInUp}>
          <AIAssistant role={activeRole} />
        </motion.div>

        <motion.div variants={fadeInUp} className="space-y-4">
          {!role && (
            <Card className="gap-0 p-5 shadow-[var(--shadow-card)] border-primary/30 bg-primary/5">
              <p className="text-sm font-medium">
                You are exploring the buyer assistant. Sign in to get answers tailored to your role.
              </p>
              <Button asChild size="sm" className="mt-3 w-fit font-semibold">
                <Link to="/auth">Choose a role</Link>
              </Button>
            </Card>
          )}

          <Card className="gap-0 p-5 shadow-[var(--shadow-card)]">
            <h2 className="font-display text-lg font-bold">
              Frequently Asked Intelligence Queries
            </h2>
            <ul className="mt-3 space-y-3">
              {examples.map((i) => (
                <li
                  key={i.id}
                  className="rounded-xl border bg-muted/40 p-3.5 transition-colors hover:bg-muted/70"
                >
                  <p className="text-sm font-semibold text-foreground">{i.question}</p>
                  <p className="mt-1 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {i.answer}
                  </p>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="gap-0 p-5 shadow-[var(--shadow-card)]">
            <h2 className="font-display text-lg font-bold">How Grounded AI Works</h2>
            <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Agrolink AI reasons over live marketplace state in your browser — listings, trust
              profiles, verified orders, and active highway transit corridors. The architecture is
              model-agnostic, supporting seamless plug-in to Gemini / OpenAI LLMs.
            </p>
          </Card>
        </motion.div>
      </motion.div>
    </Page>
  );
}
