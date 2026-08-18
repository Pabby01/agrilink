import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Page, PageHeader } from "@/components/layout/AppShell";
import { AIAssistant } from "@/components/ai/AIAssistant";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useApp } from "@/lib/store";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import {
  Sprout,
  ShoppingBasket,
  Truck,
  ShieldCheck,
  Database,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import type { Role } from "@/lib/types";

export const Route = createFileRoute("/insights")({
  head: () => ({
    meta: [
      { title: "Agrolink AI — Live Agricultural Intelligence" },
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

const ROLE_PREVIEWS: { role: Role; label: string; icon: typeof Sprout; desc: string }[] = [
  {
    role: "buyer",
    label: "Buyer Perspective",
    icon: ShoppingBasket,
    desc: "Supplier trust vetting, price comparisons, and escrow payment security.",
  },
  {
    role: "farmer",
    label: "Farmer Perspective",
    icon: Sprout,
    desc: "Harvest pricing optimization, buyer demand trends, and trust score growth.",
  },
  {
    role: "transporter",
    label: "Transporter Perspective",
    icon: Truck,
    desc: "High-yield freight routes, corridor status, and cold-chain logging.",
  },
  {
    role: "admin",
    label: "Admin Perspective",
    icon: ShieldCheck,
    desc: "Risk monitoring, compliance KYB backlog, and platform GMV clearance.",
  },
];

const INTELLIGENCE_HIGHLIGHTS: Record<Role, { q: string; a: string; tag: string }[]> = {
  buyer: [
    {
      q: "Where can I get the best wholesale price for fresh Roma tomatoes?",
      a: "Agrolink scans live listings across Kano and Kaduna clusters, comparing price-per-kg against supplier trust scores and cold-chain freight rates.",
      tag: "Live Price Parity",
    },
    {
      q: "How does Agrolink Escrow eliminate advance payment risk?",
      a: "Buyer funds are held in secure escrow. Payout is released to the farmer and transporter only after successful delivery and physical quality acceptance.",
      tag: "100% Escrow Protection",
    },
  ],
  farmer: [
    {
      q: "What price should I set for my harvest stock this week?",
      a: "AI benchmarks your crop grade against current wholesale clearance velocities in major urban food hubs (Mile 12 Lagos, Dawanau Kano).",
      tag: "Dynamic Pricing",
    },
    {
      q: "How do I upgrade my account to Tier-2 Verified status?",
      a: "Submit your CAC registration or cooperative credentials in the dashboard for admin compliance review to unlock bulk institutional purchase orders.",
      tag: "Trust Acceleration",
    },
  ],
  transporter: [
    {
      q: "Which haulage corridors are generating the highest freight earnings?",
      a: "Northern agrarian interstate routes (Kano/Kaduna to Abuja/Lagos) offer verified return loads with guaranteed escrow freight settlements.",
      tag: "Corridor Optimization",
    },
    {
      q: "How do temperature logs boost my fleet trust score?",
      a: "Logging GPS and cargo temperature readings verifies cold-chain integrity, giving you top priority on high-value perishable produce contracts.",
      tag: "Cold-Chain Telemetry",
    },
  ],
  admin: [
    {
      q: "How is platform integrity and dispute frequency monitored?",
      a: "Every transaction, KYB document review, escrow lock, and delivery milestone is logged to an immutable audit trail with automated anomaly alerts.",
      tag: "Governance Oversight",
    },
    {
      q: "What is the average fulfilment clearance rate across active corridors?",
      a: "AI analyzes order-to-delivery lifecycle metrics to detect bottleneck corridors and maintain platform-wide 97%+ completion rates.",
      tag: "Network Health",
    },
  ],
};

function InsightsPage() {
  const { role, state } = useApp();
  const [selectedRole, setSelectedRole] = useState<Role>(role || "buyer");

  const highlights = INTELLIGENCE_HIGHLIGHTS[selectedRole] || INTELLIGENCE_HIGHLIGHTS.buyer;

  return (
    <Page>
      <PageHeader
        title="Agrolink AI Decision Assistant"
        subtitle="Grounded decision intelligence for farmers, buyers, transporters, and governance operations — powered by live marketplace data."
      />

      {/* Interactive Role Perspective Switcher */}
      <div className="mt-6 flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground mr-1">
          Active AI Persona:
        </span>
        {ROLE_PREVIEWS.map((r) => {
          const isActive = selectedRole === r.role;
          const Icon = r.icon;
          return (
            <button
              key={r.role}
              type="button"
              onClick={() => setSelectedRole(r.role)}
              className={`flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-bold transition-all cursor-pointer ${
                isActive
                  ? "border-primary bg-primary text-primary-foreground shadow-xs scale-105"
                  : "border-border bg-card text-foreground hover:bg-muted"
              }`}
            >
              <Icon className="size-4" />
              {r.label}
            </button>
          );
        })}
      </div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]"
      >
        {/* Main AI Interaction Panel */}
        <motion.div variants={fadeInUp}>
          <AIAssistant role={selectedRole} />
        </motion.div>

        {/* Live Grounding & Intelligence Insights */}
        <motion.div variants={fadeInUp} className="space-y-4">
          {/* Live Data Telemetry Card */}
          <Card className="gap-0 p-5 shadow-[var(--shadow-card)] border-primary/25 bg-primary/5">
            <div className="flex items-center gap-2">
              <Database className="size-4 text-primary" />
              <h2 className="font-display text-sm font-bold text-foreground">
                Live Grounded Data Stream
              </h2>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Agrolink AI runs continuous reasoning over the active database state:
            </p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <div className="rounded-xl border bg-background/80 p-2.5 text-center">
                <p className="text-[10px] uppercase font-bold text-muted-foreground">
                  Live Produce
                </p>
                <p className="text-sm font-extrabold text-foreground mt-0.5">
                  {state.produce.length} Listings
                </p>
              </div>
              <div className="rounded-xl border bg-background/80 p-2.5 text-center">
                <p className="text-[10px] uppercase font-bold text-muted-foreground">
                  Active Orders
                </p>
                <p className="text-sm font-extrabold text-foreground mt-0.5">
                  {state.orders.length} Contracts
                </p>
              </div>
              <div className="rounded-xl border bg-background/80 p-2.5 text-center">
                <p className="text-[10px] uppercase font-bold text-muted-foreground">Deliveries</p>
                <p className="text-sm font-extrabold text-foreground mt-0.5">
                  {state.deliveries.length} Shipments
                </p>
              </div>
              <div className="rounded-xl border bg-background/80 p-2.5 text-center">
                <p className="text-[10px] uppercase font-bold text-muted-foreground">
                  Trust Records
                </p>
                <p className="text-sm font-extrabold text-foreground mt-0.5">
                  {state.trust.length} Profiles
                </p>
              </div>
            </div>
          </Card>

          {/* Frequently Asked Strategic Inquiries */}
          <Card className="gap-0 p-5 shadow-[var(--shadow-card)]">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="size-4 text-gold" />
              <h2 className="font-display text-base font-bold">
                Strategic Market Inquiries ({selectedRole})
              </h2>
            </div>
            <ul className="space-y-3">
              {highlights.map((h, idx) => (
                <li
                  key={idx}
                  className="rounded-xl border bg-muted/30 p-3.5 transition-colors hover:bg-muted/60"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs sm:text-sm font-bold text-foreground">{h.q}</p>
                    <Badge
                      variant="outline"
                      className="text-[10px] shrink-0 font-semibold bg-background"
                    >
                      {h.tag}
                    </Badge>
                  </div>
                  <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">{h.a}</p>
                </li>
              ))}
            </ul>
          </Card>

          {/* Architecture Explainer */}
          <Card className="gap-0 p-5 shadow-[var(--shadow-card)]">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-emerald-600" />
              <h2 className="font-display text-base font-bold">Enterprise AI Architecture</h2>
            </div>
            <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
              Agrolink AI features a dual-engine architecture: an on-chain/real-time heuristic
              knowledge synthesis engine coupled with optional plug-and-play Gemini 2.5 Flash API
              integration for conversational supply-chain logistics.
            </p>
            <div className="mt-3 flex items-center justify-between border-t pt-3 text-xs">
              <span className="text-muted-foreground">Status: Active & Grounded</span>
              <Button asChild variant="outline" size="sm" className="text-xs font-semibold">
                <Link to="/marketplace">View Marketplace</Link>
              </Button>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </Page>
  );
}
