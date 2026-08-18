import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Phone,
  ShieldCheck,
  BadgeCheck,
  Package,
  ShoppingBasket,
  Truck,
  ExternalLink,
} from "lucide-react";
import { Page } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { TrustScore } from "@/components/trust/TrustScore";
import { TrustBreakdown } from "@/components/trust/TrustBreakdown";
import { ProduceCard } from "@/components/marketplace/ProduceCard";
import { useApp, formatNaira, timeAgo } from "@/lib/store";

export const Route = createFileRoute("/profile/$userId")({
  head: ({ params }) => ({
    meta: [
      { title: `User Trust Profile — Agrolink` },
      {
        name: "description",
        content: "View verified user trust metrics and transaction history on Agrolink.",
      },
    ],
  }),
  component: UserProfilePage,
});

function UserProfilePage() {
  const { userId } = Route.useParams();
  const { getUser, getTrust, state } = useApp();

  const user = getUser(userId);
  const trust = getTrust(userId);

  if (!user) {
    return (
      <Page>
        <h1 className="font-display text-2xl font-bold">Profile Not Found</h1>
        <p className="mt-2 text-muted-foreground">The requested user profile does not exist.</p>
        <Button asChild className="mt-4">
          <Link to="/marketplace">Back to Marketplace</Link>
        </Button>
      </Page>
    );
  }

  const farmerListings = state.produce.filter((p) => p.farmerId === user.id);
  const userOrders = state.orders.filter((o) => o.buyerId === user.id || o.farmerId === user.id);
  const userDeliveries = state.deliveries.filter((d) => d.transporterId === user.id);

  return (
    <Page>
      <Link
        to="/marketplace"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden /> Back to marketplace
      </Link>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1.2fr_1.8fr]">
        {/* Left Column: User Bio & Trust Breakdown */}
        <div className="space-y-6">
          <Card className="gap-0 p-6 shadow-[var(--shadow-card)]">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="grid size-14 place-items-center rounded-2xl bg-primary font-display text-xl font-bold text-primary-foreground">
                  {user.avatarInitials}
                </span>
                <div>
                  <h1 className="font-display text-2xl font-bold tracking-tight">{user.name}</h1>
                  <Badge variant="secondary" className="capitalize mt-1">
                    {user.role}
                  </Badge>
                </div>
              </div>
              {trust && <TrustScore trust={trust} size="sm" showLabel={false} />}
            </div>

            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{user.bio}</p>

            <Separator className="my-4" />

            <div className="space-y-2 text-xs text-muted-foreground">
              <p className="flex items-center gap-2">
                <MapPin className="size-3.5 text-primary" />
                <span className="font-medium text-foreground">{user.location}</span>
              </p>
              <p className="flex items-center gap-2">
                <Calendar className="size-3.5 text-primary" />
                <span>
                  Member since{" "}
                  {new Date(user.joined).toLocaleDateString("en-NG", {
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="size-3.5 text-primary" />
                <span>{user.phone}</span>
              </p>
            </div>
          </Card>

          {/* Trust Score Breakdown */}
          {trust && (
            <Card className="gap-0 p-6 shadow-[var(--shadow-card)]">
              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <h2 className="font-display text-lg font-bold">Trust & Credibility</h2>
                  <p className="text-xs text-muted-foreground">Verified performance metrics</p>
                </div>
                <TrustScore trust={trust} size="md" />
              </div>
              <div className="pt-4">
                <TrustBreakdown trust={trust} />
              </div>
            </Card>
          )}
        </div>

        {/* Right Column: Role Specific Activity */}
        <div className="space-y-6">
          {user.role === "farmer" && (
            <Card className="gap-0 p-6 shadow-[var(--shadow-card)]">
              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <h2 className="font-display text-xl font-bold">Active Produce Listings</h2>
                  <p className="text-xs text-muted-foreground">
                    Available harvests directly supplied by {user.name}
                  </p>
                </div>
                <Badge variant="secondary">{farmerListings.length} Listings</Badge>
              </div>

              {farmerListings.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  No active listings currently available from this farm.
                </p>
              ) : (
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {farmerListings.map((produce) => (
                    <ProduceCard key={produce.id} item={produce} />
                  ))}
                </div>
              )}
            </Card>
          )}

          {user.role === "transporter" && (
            <Card className="gap-0 p-6 shadow-[var(--shadow-card)]">
              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <h2 className="font-display text-xl font-bold">
                    Haulage & Logistics Track Record
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Commercial transit reliability and verified corridor deliveries
                  </p>
                </div>
                <Badge variant="secondary">{userDeliveries.length} Records</Badge>
              </div>

              <div className="mt-4 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl border bg-muted/30 p-3 text-center">
                    <p className="font-display text-2xl font-bold text-success">
                      {trust?.successfulDeliveries ?? 0}
                    </p>
                    <p className="text-xs text-muted-foreground">Successful Deliveries</p>
                  </div>
                  <div className="rounded-xl border bg-muted/30 p-3 text-center">
                    <p className="font-display text-2xl font-bold text-primary">
                      {trust?.fulfilmentRate ?? 100}%
                    </p>
                    <p className="text-xs text-muted-foreground">On-Time Fulfilment</p>
                  </div>
                </div>

                <div className="rounded-xl border bg-card p-4">
                  <p className="font-semibold text-sm">Main Service Corridors</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Kano → Lagos, Kano → Abuja, Jos → Lagos, Ibadan → Lagos. Full cold-chain and dry
                    freight coverage.
                  </p>
                </div>
              </div>
            </Card>
          )}

          {user.role === "buyer" && (
            <Card className="gap-0 p-6 shadow-[var(--shadow-card)]">
              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <h2 className="font-display text-xl font-bold">Buyer Fulfilment Track Record</h2>
                  <p className="text-xs text-muted-foreground">
                    Verified prompt payments and contract completion history
                  </p>
                </div>
                <Badge variant="secondary">{userOrders.length} Transactions</Badge>
              </div>

              <div className="mt-4 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl border bg-muted/30 p-3 text-center">
                    <p className="font-display text-2xl font-bold text-success">
                      {trust?.completedTransactions ?? 0}
                    </p>
                    <p className="text-xs text-muted-foreground">Completed Purchases</p>
                  </div>
                  <div className="rounded-xl border bg-muted/30 p-3 text-center">
                    <p className="font-display text-2xl font-bold text-primary">
                      {trust?.rating ?? 5.0}★
                    </p>
                    <p className="text-xs text-muted-foreground">Average Supplier Rating</p>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </Page>
  );
}
