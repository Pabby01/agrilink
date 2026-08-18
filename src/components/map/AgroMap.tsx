import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { MapPin, Navigation, ShieldCheck, Truck, Package, ArrowUpRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

interface Hub {
  id: string;
  name: string;
  region: string;
  role: "Farmer Hub" | "Buyer Hub" | "Logistics Hub" | "HQ";
  x: number; // Percentage on SVG canvas (0-100)
  y: number;
  description: string;
  activeUsers: string[];
}

const hubs: Hub[] = [
  {
    id: "kano",
    name: "Kano Agricultural Belt",
    region: "Northern Region",
    role: "Farmer Hub",
    x: 65,
    y: 18,
    description: "Major northern harvest zone for Roma tomatoes, grains, and root crops.",
    activeUsers: ["Abdul Farms"],
  },
  {
    id: "jos",
    name: "Jos Plateau Highland",
    region: "North Central",
    role: "Farmer Hub",
    x: 68,
    y: 38,
    description: "Cool highland region producing bell peppers, Irish potatoes, and legumes.",
    activeUsers: ["Greenvale Cooperative"],
  },
  {
    id: "abuja",
    name: "Abuja Trade Gateway",
    region: "Federal Capital Territory",
    role: "Logistics Hub",
    x: 52,
    y: 44,
    description: "Central aggregation hub, processing centers, and heavy haulage fleet base.",
    activeUsers: ["SwiftHaul Logistics", "Sahel Foods Processing"],
  },
  {
    id: "ibadan",
    name: "Ibadan Processing Corridor",
    region: "South West",
    role: "Farmer Hub",
    x: 24,
    y: 62,
    description: "Southern cassava, plantain, and yam farming with regional haulage depot.",
    activeUsers: ["Oyelaran Agro", "Kola Movers"],
  },
  {
    id: "lagos",
    name: "Lagos Megacity & Ports",
    region: "Commercial Hub",
    role: "Buyer Hub",
    x: 18,
    y: 76,
    description: "Highest retail and wholesale demand market for fresh food across Nigeria.",
    activeUsers: ["FreshMart Retail", "Agrolink Operations"],
  },
];

interface RouteCorridor {
  id: string;
  from: string;
  to: string;
  status: "In Transit" | "Pending" | "Completed";
  produce: string;
  carrier: string;
}

const corridors: RouteCorridor[] = [
  {
    id: "c-1",
    from: "kano",
    to: "lagos",
    status: "In Transit",
    produce: "300kg Roma Tomatoes",
    carrier: "SwiftHaul Logistics",
  },
  {
    id: "c-2",
    from: "kano",
    to: "abuja",
    status: "Pending",
    produce: "1,000kg Yellow Maize",
    carrier: "Available Job",
  },
  {
    id: "c-3",
    from: "jos",
    to: "lagos",
    status: "Pending",
    produce: "500kg Irish Potatoes",
    carrier: "Available Job",
  },
  {
    id: "c-4",
    from: "ibadan",
    to: "lagos",
    status: "Completed",
    produce: "800kg Fresh Cassava",
    carrier: "SwiftHaul Logistics",
  },
];

export function AgroMap({
  interactive = true,
  className,
  highlightHubId,
}: {
  interactive?: boolean;
  className?: string;
  highlightHubId?: string;
}) {
  const { state } = useApp();
  const [selectedHub, setSelectedHub] = useState<Hub>(
    () => hubs.find((h) => h.id === highlightHubId) ?? hubs[0],
  );

  const hubMap = new Map(hubs.map((h) => [h.id, h]));

  return (
    <div className={cn("grid gap-4 lg:grid-cols-[1.6fr_1fr]", className)}>
      {/* Map SVG Canvas */}
      <Card className="relative flex flex-col items-center justify-center overflow-hidden border-border/80 bg-gradient-to-b from-card to-muted/30 p-4 shadow-[var(--shadow-card)] sm:p-6">
        <div className="absolute left-4 top-4 z-10 flex items-center gap-2">
          <Badge variant="outline" className="bg-background/90 backdrop-blur-xs font-semibold">
            <span className="mr-1.5 size-2 animate-pulse rounded-full bg-success" />
            Live National Trade Map
          </Badge>
        </div>

        <div className="relative mt-8 aspect-4/3 w-full max-w-lg">
          <svg
            viewBox="0 0 100 90"
            className="h-full w-full select-none"
            aria-label="Interactive Map of Nigeria Agricultural Trade Corridors"
          >
            <defs>
              {/* Corridor Gradient */}
              <linearGradient id="corridorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.8" />
                <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.9" />
              </linearGradient>
              <linearGradient id="activeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="var(--gold)" stopOpacity="1" />
                <stop offset="100%" stopColor="var(--success)" stopOpacity="1" />
              </linearGradient>
            </defs>

            {/* Stylized Nigeria land outline background */}
            <path
              d="M 12 60 Q 15 40 30 35 Q 45 20 65 15 Q 85 10 92 30 Q 88 55 80 65 Q 65 80 40 85 Q 20 85 10 75 Z"
              fill="currentColor"
              className="text-muted/40 transition-colors"
            />

            {/* Logistics Corridors (Lines) */}
            {corridors.map((c) => {
              const from = hubMap.get(c.from);
              const to = hubMap.get(c.to);
              if (!from || !to) return null;

              const isLive = c.status === "In Transit";

              return (
                <g key={c.id} className="cursor-pointer group">
                  {/* Outer glow */}
                  <line
                    x1={from.x}
                    y1={from.y}
                    x2={to.x}
                    y2={to.y}
                    stroke={isLive ? "var(--color-gold)" : "var(--color-border)"}
                    strokeWidth={isLive ? 1.8 : 1}
                    strokeDasharray={isLive ? "2,2" : "3,3"}
                    strokeOpacity={isLive ? 0.9 : 0.6}
                  />
                  {/* Transit animation pulse dot */}
                  {isLive && (
                    <circle
                      r="1.6"
                      fill="var(--color-gold)"
                      className="animate-ping"
                      cx={(from.x + to.x) / 2}
                      cy={(from.y + to.y) / 2}
                    />
                  )}
                </g>
              );
            })}

            {/* Hub Nodes */}
            {hubs.map((h) => {
              const isSelected = selectedHub.id === h.id;

              return (
                <g
                  key={h.id}
                  transform={`translate(${h.x}, ${h.y})`}
                  onClick={() => interactive && setSelectedHub(h)}
                  className="cursor-pointer transition-transform duration-200 hover:scale-125"
                >
                  {/* Ping effect for selected or farmer nodes */}
                  {isSelected && (
                    <circle
                      r="6"
                      fill="var(--color-accent)"
                      fillOpacity="0.25"
                      className="animate-ping"
                    />
                  )}

                  {/* Node Circle */}
                  <circle
                    r={isSelected ? "3.6" : "2.8"}
                    fill={
                      isSelected
                        ? "var(--color-primary)"
                        : h.role === "Farmer Hub"
                          ? "var(--color-success)"
                          : h.role === "Logistics Hub"
                            ? "var(--color-gold)"
                            : "var(--color-accent)"
                    }
                    stroke="var(--color-background)"
                    strokeWidth="1.2"
                  />

                  {/* Hub Label */}
                  <text
                    y="6"
                    textAnchor="middle"
                    className={cn(
                      "text-[3.2px] font-bold fill-foreground drop-shadow-xs pointer-events-none select-none",
                      isSelected && "fill-primary font-extrabold text-[3.6px]",
                    )}
                  >
                    {h.name.split(" ")[0]}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className="size-2.5 rounded-full bg-success" /> Farmers (Kano, Jos, Ibadan)
          </span>
          <span className="flex items-center gap-1">
            <span className="size-2.5 rounded-full bg-accent" /> Buyers (Lagos)
          </span>
          <span className="flex items-center gap-1">
            <span className="size-2.5 rounded-full bg-gold" /> Transporters (Abuja)
          </span>
        </div>
      </Card>

      {/* Selected Hub Inspector Card */}
      <Card className="flex flex-col justify-between gap-0 p-5 shadow-[var(--shadow-card)]">
        <div>
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {selectedHub.region}
              </span>
              <h3 className="font-display text-2xl font-bold tracking-tight text-foreground">
                {selectedHub.name}
              </h3>
            </div>
            <Badge
              variant={
                selectedHub.role === "Farmer Hub"
                  ? "secondary"
                  : selectedHub.role === "Logistics Hub"
                    ? "default"
                    : "outline"
              }
            >
              {selectedHub.role}
            </Badge>
          </div>

          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {selectedHub.description}
          </p>

          <div className="mt-5 space-y-3 rounded-lg border bg-muted/40 p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Marketplace Participants
            </p>
            <div className="space-y-2">
              {selectedHub.activeUsers.map((name) => {
                const user = state.users.find((u) => u.name === name);
                const trust = user ? state.trust.find((t) => t.userId === user.id) : null;

                return (
                  <div
                    key={name}
                    className="flex items-center justify-between gap-2 rounded-md bg-card p-2 text-sm shadow-xs"
                  >
                    <div className="min-w-0">
                      <p className="font-semibold truncate">{name}</p>
                      <p className="text-xs capitalize text-muted-foreground">{user?.role}</p>
                    </div>
                    {trust && (
                      <span className="flex shrink-0 items-center gap-1 rounded-full bg-success/15 px-2 py-0.5 text-xs font-bold text-success">
                        <ShieldCheck className="size-3" />
                        {trust.score} Trust
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-6 border-t pt-4">
          <Button asChild className="w-full" size="sm">
            <Link to="/marketplace">
              Explore Produce in this Region
              <ArrowUpRight className="ml-1 size-4" />
            </Link>
          </Button>
        </div>
      </Card>
    </div>
  );
}
