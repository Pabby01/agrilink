import { Link } from "@tanstack/react-router";
import { MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrustScore } from "@/components/trust/TrustScore";
import { ProduceImage } from "./ProduceImage";
import { formatNaira, timeAgo, useApp } from "@/lib/store";
import type { Produce } from "@/lib/types";

export function ProduceCard({ item }: { item: Produce }) {
  const { getUser, getTrust } = useApp();
  const farmer = getUser(item.farmerId);
  const trust = getTrust(item.farmerId);

  return (
    <Card className="group gap-0 overflow-hidden p-0 shadow-[var(--shadow-card)] transition-shadow hover:shadow-[var(--shadow-lift)]">
      <ProduceImage name={item.name} category={item.category} className="h-36 w-full" />
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-lg font-bold leading-tight">{item.name}</h3>
          {!item.available && <Badge variant="outline">Unavailable</Badge>}
        </div>
        <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="size-3" aria-hidden /> {item.location} · listed {timeAgo(item.listedAt)}
        </p>

        <div className="mt-3 flex items-baseline gap-2">
          <span className="font-display text-xl font-bold">{formatNaira(item.pricePerKg)}</span>
          <span className="text-xs text-muted-foreground">/kg</span>
          <span className="ml-auto text-xs text-muted-foreground">
            {item.quantityKg.toLocaleString()}kg available
          </span>
        </div>

        <div className="mt-3 flex items-center justify-between gap-2 border-t pt-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{farmer?.name}</p>
            {trust && <TrustScore trust={trust} size="sm" />}
          </div>
          <Button asChild size="sm">
            <Link to="/marketplace/$produceId" params={{ produceId: item.id }}>
              View
            </Link>
          </Button>
        </div>
      </div>
    </Card>
  );
}
