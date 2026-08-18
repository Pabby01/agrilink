import { useState } from "react";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { ArrowLeft, MapPin, Package } from "lucide-react";
import { Page } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { TrustScore } from "@/components/trust/TrustScore";
import { TrustBreakdown } from "@/components/trust/TrustBreakdown";
import { ProduceImage } from "@/components/marketplace/ProduceImage";
import { formatNaira, timeAgo, useApp } from "@/lib/store";
import type { Delivery } from "@/lib/types";
import { toast } from "sonner";

export const Route = createFileRoute("/marketplace/$produceId")({
  head: () => ({
    meta: [
      { title: "Produce details — Agrolink Marketplace" },
      {
        name: "description",
        content:
          "See pricing, available quantity, farmer trust breakdown and place an order with delivery in one step.",
      },
      { property: "og:title", content: "Produce details — Agrolink" },
      {
        property: "og:description",
        content: "Farmer trust breakdown, pricing and one-step ordering.",
      },
    ],
  }),
  component: ProduceDetail,
});

function ProduceDetail() {
  const { produceId } = Route.useParams();
  const { getProduce, getUser, getTrust, placeOrder, role } = useApp();
  const router = useRouter();
  const item = getProduce(produceId);
  const [quantity, setQuantity] = useState(100);
  const [urgency, setUrgency] = useState<Delivery["urgency"]>("Standard");

  if (!item) {
    return (
      <Page>
        <h1 className="font-display text-2xl font-bold">Listing not found</h1>
        <p className="mt-2 text-muted-foreground">
          This listing may have been removed or the demo data was reset.
        </p>
        <Button asChild className="mt-4">
          <Link to="/marketplace">Back to marketplace</Link>
        </Button>
      </Page>
    );
  }

  const farmer = getUser(item.farmerId);
  const trust = getTrust(item.farmerId);
  const qty = Number.isFinite(quantity) ? Math.max(1, Math.min(quantity, item.quantityKg)) : 1;
  const subtotal = qty * item.pricePerKg;
  const deliveryFee = Math.round(qty * 40 + (urgency === "Urgent" ? 25_000 : 0));

  const submit = () => {
    const order = placeOrder({ produceId: item.id, quantityKg: qty, urgency });
    if (!order) {
      toast.error("Could not place that order");
      return;
    }
    toast.success(`Order placed — ${qty}kg of ${item.name}`);
    router.navigate({ to: "/dashboard/buyer" });
  };

  return (
    <Page>
      <Link
        to="/marketplace"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden /> Back to marketplace
      </Link>

      <div className="mt-4 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-6">
          <Card className="gap-0 overflow-hidden p-0 shadow-[var(--shadow-card)]">
            <ProduceImage name={item.name} category={item.category} className="h-56 w-full" />
            <div className="p-5">
              <h1 className="font-display text-3xl font-bold tracking-tight">{item.name}</h1>
              <p className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="size-3.5" aria-hidden /> {item.location}
                </span>
                <span className="flex items-center gap-1">
                  <Package className="size-3.5" aria-hidden />{" "}
                  {item.quantityKg.toLocaleString()}kg available
                </span>
                <span>Listed {timeAgo(item.listedAt)}</span>
              </p>
              <p className="mt-4 text-sm leading-relaxed">{item.description}</p>
              <Separator className="my-4" />
              <p className="font-display text-2xl font-bold">
                {formatNaira(item.pricePerKg)}
                <span className="ml-1 text-sm font-medium text-muted-foreground">per kg</span>
              </p>
            </div>
          </Card>

          {trust && farmer && (
            <Card className="gap-0 p-5 shadow-[var(--shadow-card)]">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="font-display text-xl font-bold">{farmer.name}</h2>
                  <p className="text-sm text-muted-foreground">{farmer.bio}</p>
                </div>
                <TrustScore trust={trust} />
              </div>
              <Separator className="my-4" />
              <TrustBreakdown trust={trust} />
              <Button asChild variant="outline" className="mt-4 w-fit">
                <Link to="/profile/$userId" params={{ userId: farmer.id }}>
                  View full profile
                </Link>
              </Button>
            </Card>
          )}
        </div>

        <Card className="h-fit gap-0 p-5 shadow-[var(--shadow-card)] lg:sticky lg:top-24">
          <h2 className="font-display text-xl font-bold">Place an order</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Delivery is requested automatically and offered to available transporters.
          </p>

          <div className="mt-4 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="qty">Quantity (kg)</Label>
              <Input
                id="qty"
                type="number"
                min={1}
                max={item.quantityKg}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
              />
              <p className="text-xs text-muted-foreground">Maximum {item.quantityKg.toLocaleString()}kg</p>
            </div>

            <div className="space-y-2">
              <Label>Delivery urgency</Label>
              <RadioGroup
                value={urgency}
                onValueChange={(v) => setUrgency(v as Delivery["urgency"])}
                className="gap-2"
              >
                <label className="flex cursor-pointer items-center gap-2 rounded-lg border p-3 text-sm">
                  <RadioGroupItem value="Standard" id="u-standard" />
                  <span>Standard — 2 to 3 days</span>
                </label>
                <label className="flex cursor-pointer items-center gap-2 rounded-lg border p-3 text-sm">
                  <RadioGroupItem value="Urgent" id="u-urgent" />
                  <span>Urgent — next day (+{formatNaira(25_000)})</span>
                </label>
              </RadioGroup>
            </div>

            <div className="rounded-lg bg-muted/60 p-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Produce subtotal</span>
                <span className="font-medium">{formatNaira(subtotal)}</span>
              </div>
              <div className="mt-1 flex justify-between">
                <span className="text-muted-foreground">Estimated delivery</span>
                <span className="font-medium">{formatNaira(deliveryFee)}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between font-display text-base font-bold">
                <span>Total</span>
                <span>{formatNaira(subtotal + deliveryFee)}</span>
              </div>
            </div>

            {role && role !== "buyer" && (
              <p className="rounded-lg bg-warning/15 p-2.5 text-xs">
                You are viewing as {role}. Ordering here will be recorded against the demo buyer
                account, FreshMart Retail.
              </p>
            )}

            <Button className="w-full" size="lg" onClick={submit} disabled={!item.available}>
              {item.available ? "Confirm order" : "Currently unavailable"}
            </Button>
            {!role && (
              <p className="text-center text-xs text-muted-foreground">
                <Link to="/auth" className="underline">
                  Sign in
                </Link>{" "}
                to track this order on your dashboard.
              </p>
            )}
          </div>
        </Card>
      </div>
    </Page>
  );
}
