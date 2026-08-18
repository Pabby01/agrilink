import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ShieldCheck,
  Sprout,
  ShoppingBasket,
  Truck,
  Sparkles,
  ArrowRight,
  TrendingUp,
  MapPin,
  CheckCircle2,
  Lock,
  ArrowUpRight,
  BarChart3,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProduceCard } from "@/components/marketplace/ProduceCard";
import { TrustScore } from "@/components/trust/TrustScore";
import { TrustBreakdown } from "@/components/trust/TrustBreakdown";
import { AgroMap } from "@/components/map/AgroMap";
import { useApp, formatNaira } from "@/lib/store";

export const Route = createFileRoute("/")({
  component: LandingPage,
});

function LandingPage() {
  const { state, setRole, getTrust } = useApp();

  const sampleFarmerTrust = state.trust.find((t) => t.userId === "u-farmer-1") ?? state.trust[0];
  const featuredProduce = state.produce.slice(0, 4);

  return (
    <div className="flex flex-col gap-16 pb-20 sm:gap-24">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border/70 bg-gradient-to-b from-primary/8 via-accent/5 to-background py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid items-center gap-10 lg:grid-cols-[1.2fr_1fr]">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
                <span className="size-2 rounded-full bg-primary animate-pulse" />
                Thrive in Tech Hackathon MVP · Nigeria Digital Agri-Trade
              </div>

              <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-balance">
                Connecting agriculture through{" "}
                <span className="text-primary underline decoration-gold decoration-wavy decoration-2">
                  trust
                </span>
                .
              </h1>

              <p className="max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                Agrolink eliminates middlemen risk by directly linking Nigerian farmers, commercial
                buyers, and verified transporters through transparent ratings, guaranteed haulage,
                and live market intelligence.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Button
                  asChild
                  size="lg"
                  className="rounded-xl px-6 font-semibold shadow-[var(--shadow-lift)]"
                >
                  <Link to="/marketplace">
                    Explore Marketplace
                    <ArrowRight className="ml-2 size-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="rounded-xl px-6 font-semibold"
                >
                  <Link to="/auth">Select Demo Role</Link>
                </Button>
              </div>

              {/* Hero KPI Bar */}
              <div className="grid grid-cols-3 gap-4 border-t pt-6 sm:max-w-md">
                <div>
                  <p className="font-display text-2xl font-bold sm:text-3xl">97%</p>
                  <p className="text-xs text-muted-foreground">Fulfilment Rate</p>
                </div>
                <div>
                  <p className="font-display text-2xl font-bold sm:text-3xl">100%</p>
                  <p className="text-xs text-muted-foreground">Verified Profiles</p>
                </div>
                <div>
                  <p className="font-display text-2xl font-bold sm:text-3xl">₦0</p>
                  <p className="text-xs text-muted-foreground">Upfront Commission</p>
                </div>
              </div>
            </div>

            {/* Hero Interactive Card Preview */}
            <div className="relative">
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-tr from-primary/30 via-gold/30 to-accent/30 opacity-70 blur-xl" />
              <Card className="relative space-y-5 rounded-2xl border-border/80 bg-card/95 p-6 shadow-[var(--shadow-lift)] backdrop-blur">
                <div className="flex items-center justify-between border-b pb-4">
                  <div className="flex items-center gap-3">
                    <span className="grid size-11 place-items-center rounded-xl bg-primary text-primary-foreground font-display font-bold">
                      AF
                    </span>
                    <div>
                      <h3 className="font-display text-lg font-bold">Abdul Farms</h3>
                      <p className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="size-3 text-primary" /> Kano, Northern Region
                      </p>
                    </div>
                  </div>
                  {sampleFarmerTrust && <TrustScore trust={sampleFarmerTrust} size="md" />}
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Active Listing Preview</span>
                    <Badge variant="secondary" className="font-medium">
                      Live Order Stream
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-muted/60 p-3">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-lg bg-success/20 grid place-items-center text-success font-bold text-xs">
                        RT
                      </div>
                      <div>
                        <p className="font-semibold text-sm">Roma Tomatoes</p>
                        <p className="text-xs text-muted-foreground">1,200kg available</p>
                      </div>
                    </div>
                    <span className="font-display font-bold text-primary">
                      ₦850<span className="text-xs font-normal text-muted-foreground">/kg</span>
                    </span>
                  </div>
                </div>

                <div className="rounded-xl border border-success/30 bg-success/10 p-3 text-xs text-foreground">
                  <div className="flex items-center gap-1.5 font-semibold text-success">
                    <ShieldCheck className="size-4 shrink-0" />
                    Guaranteed Counterparty Protection
                  </div>
                  <p className="mt-1 text-muted-foreground leading-relaxed">
                    SwiftHaul Logistics is currently hauling 300kg to FreshMart Lagos with full
                    transit insurance.
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Pillars / Roles Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center">
          <Badge variant="secondary" className="mb-2 uppercase tracking-wider font-semibold">
            One Unified Platform
          </Badge>
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl text-balance">
            Empowering every stakeholder in agricultural trade
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-muted-foreground text-sm sm:text-base">
            Whether you grow produce, purchase commercial volume, or haul food across state lines,
            Agrolink provides the tools and trust score to scale your business.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {/* Farmer Card */}
          <Card className="flex flex-col justify-between gap-0 p-6 shadow-[var(--shadow-card)] transition-all hover:shadow-[var(--shadow-lift)]">
            <div className="space-y-4">
              <span className="grid size-12 place-items-center rounded-2xl bg-success/15 text-success">
                <Sprout className="size-6" />
              </span>
              <div>
                <h3 className="font-display text-xl font-bold">For Farmers</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  List your produce in kilograms with transparent prices. Receive immediate buyer
                  orders, get automated transporter pickups, and build a verifiable credit/trust
                  history.
                </p>
              </div>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-3.5 text-success shrink-0" /> Instant produce
                  listing & price guidance
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-3.5 text-success shrink-0" /> Automated hauler
                  dispatch to your farm gate
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-3.5 text-success shrink-0" /> Fast payouts directly
                  upon delivery confirmation
                </li>
              </ul>
            </div>

            <Button
              asChild
              className="mt-6 w-full"
              variant="outline"
              onClick={() => setRole("farmer")}
            >
              <Link to="/dashboard/farmer">
                Demo as Farmer
                <ArrowRight className="ml-1.5 size-4" />
              </Link>
            </Button>
          </Card>

          {/* Buyer Card */}
          <Card className="flex flex-col justify-between gap-0 p-6 shadow-[var(--shadow-card)] transition-all hover:shadow-[var(--shadow-lift)] border-primary/40">
            <div className="space-y-4">
              <span className="grid size-12 place-items-center rounded-2xl bg-primary text-primary-foreground">
                <ShoppingBasket className="size-6" />
              </span>
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-xl font-bold">For Buyers</h3>
                  <Badge variant="default" className="text-[10px]">
                    Popular
                  </Badge>
                </div>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  Source directly from high-trust Nigerian farmers without brokers. Compare prices,
                  track your delivery in transit, and pay only for graded, delivered volume.
                </p>
              </div>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-3.5 text-primary shrink-0" /> Transparent per-kg
                  pricing & inventory
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-3.5 text-primary shrink-0" /> Comprehensive farmer
                  trust breakdowns
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-3.5 text-primary shrink-0" /> Live GPS transit
                  milestone updates
                </li>
              </ul>
            </div>

            <Button asChild className="mt-6 w-full" onClick={() => setRole("buyer")}>
              <Link to="/dashboard/buyer">
                Demo as Buyer
                <ArrowRight className="ml-1.5 size-4" />
              </Link>
            </Button>
          </Card>

          {/* Transporter Card */}
          <Card className="flex flex-col justify-between gap-0 p-6 shadow-[var(--shadow-card)] transition-all hover:shadow-[var(--shadow-lift)]">
            <div className="space-y-4">
              <span className="grid size-12 place-items-center rounded-2xl bg-gold/30 text-gold-foreground">
                <Truck className="size-6" />
              </span>
              <div>
                <h3 className="font-display text-xl font-bold">For Transporters</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  Find guaranteed delivery jobs on major transit corridors. Eliminate empty return
                  hauls, get clear pickup coordinates, and earn premium rates for urgent runs.
                </p>
              </div>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-3.5 text-gold-foreground shrink-0" /> High-margin
                  urgent and standard loads
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-3.5 text-gold-foreground shrink-0" /> Farm gate to
                  warehouse routing
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-3.5 text-gold-foreground shrink-0" /> Reputation
                  builds priority load access
                </li>
              </ul>
            </div>

            <Button
              asChild
              className="mt-6 w-full"
              variant="outline"
              onClick={() => setRole("transporter")}
            >
              <Link to="/dashboard/transporter">
                Demo as Transporter
                <ArrowRight className="ml-1.5 size-4" />
              </Link>
            </Button>
          </Card>
        </div>
      </section>

      {/* Trust System Explainer Section */}
      <section className="border-y border-border/70 bg-card/60 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="space-y-6">
              <Badge variant="outline" className="font-semibold text-primary">
                The Core Differentiator
              </Badge>
              <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
                A 360° Trust Rating System that cuts across every transaction
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                In unorganized agriculture, trust is opaque. Agrolink establishes verifiable
                reputation calculated across identity checks, fulfilled contract percentages,
                on-time delivery rates, and mutual post-trade ratings.
              </p>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border bg-background p-4">
                  <p className="font-semibold text-sm text-foreground">Multi-Party Evaluation</p>
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                    Buyers rate farmers on crop quality; farmers rate buyers on payment speed; both
                    evaluate transporter timeliness.
                  </p>
                </div>
                <div className="rounded-xl border bg-background p-4">
                  <p className="font-semibold text-sm text-foreground">Anti-Fraud Protection</p>
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                    Automated flags for repeated cancellations or delayed handovers protect
                    marketplace integrity.
                  </p>
                </div>
              </div>

              <Button asChild size="lg" className="rounded-xl font-semibold">
                <Link to="/marketplace">Browse Verified Suppliers</Link>
              </Button>
            </div>

            <div>
              {sampleFarmerTrust && (
                <Card className="gap-0 p-6 shadow-[var(--shadow-lift)]">
                  <div className="flex items-center justify-between border-b pb-4">
                    <div>
                      <h3 className="font-display text-xl font-bold">Trust Metric Breakdown</h3>
                      <p className="text-xs text-muted-foreground">Live composite rating engine</p>
                    </div>
                    <TrustScore trust={sampleFarmerTrust} size="md" />
                  </div>
                  <div className="pt-4">
                    <TrustBreakdown trust={sampleFarmerTrust} />
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Produce Showcase */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <Badge variant="secondary" className="mb-2 font-semibold">
              Live Harvest
            </Badge>
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Fresh produce available today
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Direct from verified farms in Kano, Jos, and Ibadan.
            </p>
          </div>
          <Button asChild variant="outline">
            <Link to="/marketplace">
              View all {state.produce.length} listings
              <ArrowRight className="ml-1.5 size-4" />
            </Link>
          </Button>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featuredProduce.map((p) => (
            <ProduceCard key={p.id} item={p} />
          ))}
        </div>
      </section>

      {/* AI Decision Engine Spotlight */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <Card className="relative overflow-hidden border-primary/30 bg-gradient-to-br from-primary/10 via-card to-background p-8 shadow-[var(--shadow-lift)] sm:p-12">
          <div className="grid items-center gap-8 lg:grid-cols-[1.3fr_1fr]">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-gold/25 px-3 py-1 text-xs font-semibold text-gold-foreground">
                <Sparkles className="size-3.5" />
                Agrolink AI Decision Assistant
              </div>
              <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
                Actionable intelligence for pricing, vetting, and logistics
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                Our embedded AI evaluates live market supplies and regional demand. It tells farmers
                when to adjust prices, helps buyers pick the safest supplier, and optimizes delivery
                routes for haulers.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <Button asChild size="lg" className="rounded-xl font-semibold">
                  <Link to="/insights">
                    Try Agrolink AI
                    <ArrowRight className="ml-2 size-4" />
                  </Link>
                </Button>
              </div>
            </div>

            <div className="space-y-3 rounded-xl border bg-card/90 p-5 shadow-xs">
              <p className="text-xs font-semibold text-primary uppercase tracking-wide">
                Recent AI Recommendation
              </p>
              <p className="text-sm font-semibold">
                "Abdul Farms has the highest trust score (92) with 48 completed transactions and a
                97% fulfilment rate."
              </p>
              <div className="rounded-lg bg-muted/60 p-3 text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">Suggested Action: </span>
                Order Roma Tomatoes now and enable urgent delivery to ensure delivery before weekend
                market rush.
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* Nationwide Logistics Map Preview */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center">
          <Badge variant="secondary" className="mb-2 font-semibold">
            Nationwide Coverage
          </Badge>
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Active trade corridors across Nigeria
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
            Connecting northern grain and vegetable belts with southern processing and retail
            markets.
          </p>
        </div>

        <div className="mt-8">
          <AgroMap />
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border/70 bg-primary text-primary-foreground py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6">
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to experience frictionless agricultural trade?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm text-primary-foreground/80 sm:text-base leading-relaxed">
            Jump directly into any of our simulated roles or browse available harvest lots on the
            marketplace.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="rounded-xl font-bold text-primary"
            >
              <Link to="/auth">
                Launch Role Dashboard
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              className="rounded-xl border border-primary-foreground/30 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20 font-semibold"
            >
              <Link to="/marketplace">Browse Marketplace</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
