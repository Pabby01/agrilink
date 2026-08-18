import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { KYBAdminReviewTable } from "@/components/kyb/KYBAdminReviewTable";
import {
  ShieldAlert,
  ShieldCheck,
  Users,
  Activity,
  Package,
  Truck,
  TrendingUp,
  AlertTriangle,
  Flag,
  RotateCcw,
  CheckCircle2,
  Search,
} from "lucide-react";
import { Page, PageHeader } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DashboardCard } from "@/components/common/DashboardCard";
import { TrustScore } from "@/components/trust/TrustScore";
import { AgroMap } from "@/components/map/AgroMap";
import { useApp, formatNaira } from "@/lib/store";
import { IS_DEMO_MODE } from "@/lib/config";
import type { Role } from "@/lib/types";
import { toast } from "sonner";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [{ title: "Admin Operations & Integrity Dashboard | Agrolink" }],
  }),
  component: AdminDashboard,
});

function AdminDashboard() {
  const { state, resetDemo, refreshLiveState, getTrust } = useApp();
  const [roleFilter, setRoleFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const farmers = state.users.filter((u) => u.role === "farmer");
  const buyers = state.users.filter((u) => u.role === "buyer");
  const transporters = state.users.filter((u) => u.role === "transporter");

  const activeOrders = state.orders.filter(
    (o) => o.status !== "Completed" && o.status !== "Cancelled",
  );
  const activeDeliveries = state.deliveries.filter((d) => d.status !== "Delivered");
  const completedOrders = state.orders.filter((o) => o.status === "Completed");

  const gmv = state.orders.reduce((sum, o) => sum + o.totalPrice, 0);
  const avgTrust = Math.round(
    state.trust.reduce((sum, t) => sum + t.score, 0) / Math.max(1, state.trust.length),
  );

  const flaggedUsers = state.users.filter((u) => u.flagged);

  const filteredUsers = state.users
    .filter((u) => (roleFilter === "All" ? true : u.role === roleFilter))
    .filter(
      (u) =>
        !searchQuery ||
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.location.toLowerCase().includes(searchQuery.toLowerCase()),
    );

  return (
    <Page>
      <PageHeader
        title="Operations & Integrity Control"
        subtitle="Live oversight of national agricultural trade, user trust scores, active logistics, and risk management"
        actions={
          IS_DEMO_MODE ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                resetDemo();
                toast.success("All mock data reset to initial seeds");
              }}
            >
              <RotateCcw className="mr-1.5 size-4" />
              Reset State Seed
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                await refreshLiveState();
                toast.success("Live network state synchronized");
              }}
            >
              <Activity className="mr-1.5 size-4" />
              Sync Network State
            </Button>
          )
        }
      />

      {/* KPI Cards */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        <motion.div variants={fadeInUp}>
          <DashboardCard
            label="Marketplace Volume (GMV)"
            value={formatNaira(gmv)}
            hint={`${completedOrders.length} fulfilled contracts`}
            icon={TrendingUp}
          />
        </motion.div>
        <motion.div variants={fadeInUp}>
          <DashboardCard
            label="Average Trust Rating"
            value={`${avgTrust}/100`}
            hint="Calculated across 8 participants"
            icon={ShieldCheck}
          />
        </motion.div>
        <motion.div variants={fadeInUp}>
          <DashboardCard
            label="Active In-Transit Logistics"
            value={activeDeliveries.length}
            hint={`${activeOrders.length} active orders pending`}
            icon={Truck}
          />
        </motion.div>
        <motion.div variants={fadeInUp}>
          <Card className="flex flex-col justify-between gap-0 p-5 shadow-[var(--shadow-card)] transition-all hover:shadow-[var(--shadow-lift)]">
            <div className="flex items-start justify-between">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Risk & Flagged Accounts
              </p>
              <ShieldAlert className="size-4 text-warning" />
            </div>
            <p className="mt-2 font-display text-2xl font-bold sm:text-3xl text-warning">
              {flaggedUsers.length} Flagged
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {flaggedUsers.map((u) => u.name).join(", ") || "No flagged activity"}
            </p>
          </Card>
        </motion.div>
      </motion.div>

      {/* National Corridors Map */}
      <div className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h2 className="font-display text-xl font-bold">National Logistics Corridors</h2>
            <p className="text-xs text-muted-foreground">
              Real-time geographic distribution of supply hubs and transport routes
            </p>
          </div>
        </div>
        <AgroMap />
      </div>

      {/* KYB / KYC Compliance Queue */}
      <div className="mt-10">
        <KYBAdminReviewTable />
      </div>

      {/* User Directory & Trust Table */}
      <div className="mt-10 space-y-4">
        <Card className="gap-0 p-5 shadow-[var(--shadow-card)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
            <div>
              <h2 className="font-display text-xl font-bold">Participant Trust Directory</h2>
              <p className="text-xs text-muted-foreground">
                Inspect identity verification, completion rates, and risk flags
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  className="pl-8 h-9 text-xs w-44"
                  placeholder="Search user..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="h-9 text-xs w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Roles</SelectItem>
                  <SelectItem value="farmer">Farmers</SelectItem>
                  <SelectItem value="buyer">Buyers</SelectItem>
                  <SelectItem value="transporter">Transporters</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-muted/30 text-xs font-semibold text-muted-foreground">
                <tr>
                  <th className="py-3 px-4">Participant</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Trust Metric</th>
                  <th className="py-3 px-4">Fulfilment</th>
                  <th className="py-3 px-4">Risk Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredUsers.map((user) => {
                  const trust = getTrust(user.id);

                  return (
                    <tr key={user.id} className="hover:bg-muted/20">
                      <td className="py-3 px-4">
                        <div className="font-semibold text-foreground">{user.name}</div>
                        <span className="text-xs text-muted-foreground">{user.phone}</span>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="outline" className="capitalize text-xs">
                          {user.role}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-xs text-muted-foreground">{user.location}</td>
                      <td className="py-3 px-4">
                        {trust && <TrustScore trust={trust} size="sm" />}
                      </td>
                      <td className="py-3 px-4 text-xs">
                        {trust ? (
                          <span>
                            {trust.completedTransactions} sales · {trust.fulfilmentRate}%
                          </span>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {user.flagged ? (
                          <Badge
                            variant="destructive"
                            className="flex items-center gap-1 w-fit text-[11px]"
                          >
                            <AlertTriangle className="size-3" /> Flagged
                          </Badge>
                        ) : (
                          <Badge
                            variant="secondary"
                            className="flex items-center gap-1 w-fit text-[11px] text-success"
                          >
                            <CheckCircle2 className="size-3 text-success" /> Clear
                          </Badge>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button asChild variant="ghost" size="sm">
                          <Link to="/profile/$userId" params={{ userId: user.id }}>
                            Inspect
                          </Link>
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </Page>
  );
}
