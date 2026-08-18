import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Sprout,
  Plus,
  Package,
  TrendingUp,
  Clock,
  CheckCircle2,
  DollarSign,
  Eye,
  ToggleLeft,
  ToggleRight,
  ShieldCheck,
  Sparkles,
  MapPin,
} from "lucide-react";
import { Page, PageHeader } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DashboardCard } from "@/components/common/DashboardCard";
import { StatusBadge } from "@/components/common/StatusBadge";
import { TrustScore } from "@/components/trust/TrustScore";
import { ProduceImage } from "@/components/marketplace/ProduceImage";
import { AIAssistant } from "@/components/ai/AIAssistant";
import { useApp, formatNaira, timeAgo } from "@/lib/store";
import type { ProduceCategory } from "@/lib/types";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/farmer")({
  head: () => ({
    meta: [{ title: "Farmer Dashboard — Abdul Farms | Agrolink" }],
  }),
  component: FarmerDashboard,
});

function FarmerDashboard() {
  const { state, currentUser, getTrust, getUser, createListing, toggleListing, setOrderStatus } =
    useApp();

  const farmerId = currentUser?.id ?? "u-farmer-1";
  const farmer = getUser(farmerId) ?? state.users.find((u) => u.id === "u-farmer-1")!;
  const trust = getTrust(farmerId);

  const myListings = state.produce.filter((p) => p.farmerId === farmerId);
  const myOrders = state.orders.filter((o) => o.farmerId === farmerId);

  const pendingOrders = myOrders.filter(
    (o) => o.status === "Pending" || o.status === "Accepted" || o.status === "Awaiting Pickup",
  );
  const completedOrders = myOrders.filter((o) => o.status === "Completed");

  const totalRevenue = completedOrders.reduce((sum, o) => sum + o.totalPrice, 0);

  // New listing dialog state
  const [openNewListing, setOpenNewListing] = useState(false);
  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState<ProduceCategory>("Vegetables");
  const [newQty, setNewQty] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newLocation, setNewLocation] = useState(farmer.location);
  const [newDesc, setNewDesc] = useState("");

  const handleCreateListing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newQty || !newPrice) {
      toast.error("Please fill in all required fields");
      return;
    }

    const created = createListing({
      name: newName,
      category: newCategory,
      quantityKg: Number(newQty),
      pricePerKg: Number(newPrice),
      location: newLocation || farmer.location,
      image: `/images/${newName.toLowerCase().includes("tomato") ? "tomatoes" : newName.toLowerCase().includes("maize") ? "maize" : "cassava"}.jpg`,
      description: newDesc || `Freshly harvested ${newName} from ${farmer.name}.`,
    });

    toast.success(`Published listing for ${created.name}`);
    setOpenNewListing(false);
    setNewName("");
    setNewQty("");
    setNewPrice("");
    setNewDesc("");
  };

  return (
    <Page>
      <PageHeader
        title={`Welcome back, ${farmer.name}`}
        subtitle={`${farmer.location} · Member since ${new Date(farmer.joined).toLocaleDateString("en-NG", { month: "short", year: "numeric" })}`}
        actions={
          <Dialog open={openNewListing} onOpenChange={setOpenNewListing}>
            <DialogTrigger asChild>
              <Button className="font-semibold shadow-xs">
                <Plus className="mr-1.5 size-4" />
                Add New Produce Listing
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="font-display text-xl">Create Produce Listing</DialogTitle>
                <DialogDescription>
                  List fresh harvest on the marketplace. Buyers and haulers can order immediately.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleCreateListing} className="space-y-4 pt-2">
                <div className="space-y-1.5">
                  <Label htmlFor="produceName">Produce Name *</Label>
                  <Input
                    id="produceName"
                    placeholder="e.g. Roma Tomatoes, Yellow Maize"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>Category *</Label>
                    <Select
                      value={newCategory}
                      onValueChange={(v) => setNewCategory(v as ProduceCategory)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Vegetables">Vegetables</SelectItem>
                        <SelectItem value="Grains">Grains</SelectItem>
                        <SelectItem value="Tubers">Tubers</SelectItem>
                        <SelectItem value="Fruits">Fruits</SelectItem>
                        <SelectItem value="Legumes">Legumes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="qty">Quantity (kg) *</Label>
                    <Input
                      id="qty"
                      type="number"
                      placeholder="e.g. 1000"
                      min="10"
                      value={newQty}
                      onChange={(e) => setNewQty(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="price">Price per kg (₦) *</Label>
                    <Input
                      id="price"
                      type="number"
                      placeholder="e.g. 850"
                      min="50"
                      value={newPrice}
                      onChange={(e) => setNewPrice(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="loc">Farm Location *</Label>
                    <Input
                      id="loc"
                      value={newLocation}
                      onChange={(e) => setNewLocation(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="desc">Description & Quality Notes</Label>
                  <Textarea
                    id="desc"
                    placeholder="Describe harvest date, grading, packaging (e.g. 50kg bags)..."
                    rows={3}
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button type="button" variant="outline" onClick={() => setOpenNewListing(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Publish to Marketplace</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      {/* KPI Cards Grid */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {trust && (
          <Card className="flex items-center justify-between gap-0 p-5 shadow-[var(--shadow-card)]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Trust Score
              </p>
              <p className="mt-1 font-display text-3xl font-bold text-success">{trust.score}/100</p>
              <p className="text-xs text-muted-foreground">
                {trust.level} · {trust.rating}★ Rating
              </p>
            </div>
            <TrustScore trust={trust} size="sm" showLabel={false} />
          </Card>
        )}
        <DashboardCard
          label="Active Listings"
          value={myListings.length}
          hint={`${myListings.reduce((sum, p) => sum + p.quantityKg, 0).toLocaleString()}kg total stock`}
          icon={Package}
        />
        <DashboardCard
          label="Pending Orders"
          value={pendingOrders.length}
          hint={`${pendingOrders.reduce((sum, o) => sum + o.quantityKg, 0).toLocaleString()}kg to fulfill`}
          icon={Clock}
        />
        <DashboardCard
          label="Completed Revenue"
          value={formatNaira(totalRevenue)}
          hint={`${completedOrders.length} fulfilled sales`}
          icon={DollarSign}
        />
      </div>

      {/* Main Content Layout */}
      <div className="mt-8 grid gap-8 lg:grid-cols-[1.5fr_1fr]">
        {/* Left Column: Orders & Inventory */}
        <div className="space-y-8">
          {/* Active Orders Queue */}
          <Card className="gap-0 p-5 shadow-[var(--shadow-card)]">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <h2 className="font-display text-xl font-bold">Incoming & Active Orders</h2>
                <p className="text-xs text-muted-foreground">
                  Review buyer trust, accept orders, and mark produce ready for hauler pickup
                </p>
              </div>
              <Badge variant="secondary">{pendingOrders.length} Active</Badge>
            </div>

            {pendingOrders.length === 0 ? (
              <div className="py-10 text-center text-sm text-muted-foreground">
                No active orders at the moment. New buyer orders will appear here automatically.
              </div>
            ) : (
              <div className="divide-y">
                {pendingOrders.map((order) => {
                  const buyer = getUser(order.buyerId);
                  const buyerTrust = getTrust(order.buyerId);
                  const produceItem = state.produce.find((p) => p.id === order.produceId);
                  const delivery = state.deliveries.find((d) => d.id === order.deliveryId);

                  return (
                    <div key={order.id} className="py-4 space-y-3 first:pt-4 last:pb-0">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm">
                              {order.quantityKg}kg of {produceItem?.name ?? "Produce"}
                            </span>
                            <StatusBadge status={order.status} />
                          </div>
                          <p className="mt-1 text-xs text-muted-foreground">
                            Ordered by{" "}
                            <span className="font-semibold text-foreground">
                              {buyer?.name ?? "Buyer"}
                            </span>{" "}
                            ({buyer?.location}) · {timeAgo(order.createdAt)}
                          </p>
                        </div>
                        <span className="font-display text-base font-bold">
                          {formatNaira(order.totalPrice)}
                        </span>
                      </div>

                      {/* Buyer Trust & Delivery Snippet */}
                      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-muted/40 p-3 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">Buyer Trust:</span>
                          {buyerTrust && (
                            <span className="font-semibold text-success flex items-center gap-1">
                              <ShieldCheck className="size-3.5" />
                              {buyerTrust.score} ({buyerTrust.level})
                            </span>
                          )}
                        </div>
                        {delivery && (
                          <div className="text-muted-foreground">
                            Haulage:{" "}
                            <span className="font-medium text-foreground">
                              {delivery.status} ({delivery.distanceKm}km)
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons for Farmer */}
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        {order.status === "Pending" && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => {
                                setOrderStatus(order.id, "Accepted");
                                toast.success(`Order ${order.id} accepted`);
                              }}
                            >
                              Accept Order
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setOrderStatus(order.id, "Cancelled");
                                toast.warning(`Order ${order.id} declined`);
                              }}
                            >
                              Decline
                            </Button>
                          </>
                        )}

                        {order.status === "Accepted" && (
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => {
                              setOrderStatus(order.id, "Awaiting Pickup");
                              toast.success(
                                `Order ${order.id} marked as ready and awaiting hauler pickup`,
                              );
                            }}
                          >
                            Mark Ready for Pickup
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>

          {/* Manage Produce Listings */}
          <Card className="gap-0 p-5 shadow-[var(--shadow-card)]">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <h2 className="font-display text-xl font-bold">My Produce Inventory</h2>
                <p className="text-xs text-muted-foreground">
                  Manage active listings, toggle availability, and check prices
                </p>
              </div>
              <span className="text-xs font-semibold text-muted-foreground">
                {myListings.length} total
              </span>
            </div>

            <div className="mt-4 divide-y">
              {myListings.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
                >
                  <div className="flex items-center gap-3">
                    <ProduceImage
                      name={item.name}
                      category={item.category}
                      src={item.image}
                      className="size-16 rounded-xl shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-base">{item.name}</h3>
                        <Badge
                          variant={item.available ? "secondary" : "outline"}
                          className="text-[11px]"
                        >
                          {item.available ? "Live" : "Inactive"}
                        </Badge>
                      </div>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {item.quantityKg.toLocaleString()}kg remaining · Listed{" "}
                        {timeAgo(item.listedAt)}
                      </p>
                      <p className="mt-1 font-display text-sm font-bold text-primary">
                        {formatNaira(item.pricePerKg)}
                        <span className="text-xs font-normal text-muted-foreground">/kg</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        toggleListing(item.id);
                        toast.info(
                          `${item.name} is now ${item.available ? "hidden" : "visible on marketplace"}`,
                        );
                      }}
                    >
                      {item.available ? (
                        <>
                          <ToggleRight className="mr-1.5 size-4 text-success" />
                          Available
                        </>
                      ) : (
                        <>
                          <ToggleLeft className="mr-1.5 size-4 text-muted-foreground" />
                          Hidden
                        </>
                      )}
                    </Button>
                    <Button asChild size="sm" variant="ghost">
                      <Link to="/marketplace/$produceId" params={{ produceId: item.id }}>
                        <Eye className="size-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column: AI Assistant & Profile Stats */}
        <div className="space-y-6">
          <AIAssistant role="farmer" />

          {/* Quick Profile Summary */}
          <Card className="gap-0 p-5 shadow-[var(--shadow-card)]">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-bold">Farm Details</h3>
              <Button asChild variant="link" size="sm" className="p-0 h-auto">
                <Link to="/profile/$userId" params={{ userId: farmer.id }}>
                  Full Profile
                </Link>
              </Button>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{farmer.bio}</p>
            <div className="mt-4 space-y-2 text-xs border-t pt-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Phone:</span>
                <span className="font-medium">{farmer.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Base Location:</span>
                <span className="font-medium">{farmer.location}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Completed Sales:</span>
                <span className="font-medium">{completedOrders.length} orders</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Page>
  );
}
