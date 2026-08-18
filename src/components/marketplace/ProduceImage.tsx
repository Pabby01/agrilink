import { cn } from "@/lib/utils";
import type { ProduceCategory } from "@/lib/types";

const tone: Record<ProduceCategory, string> = {
  Vegetables: "from-success/35 to-accent/25",
  Grains: "from-gold/45 to-warning/25",
  Tubers: "from-warning/35 to-gold/20",
  Fruits: "from-gold/40 to-success/20",
  Legumes: "from-accent/35 to-primary/20",
};

/**
 * Produce visual. Demo data has no bundled photography, so we render a
 * deterministic branded gradient tile with the produce initials.
 */
export function ProduceImage({
  name,
  category,
  className,
}: {
  name: string;
  category: ProduceCategory;
  className?: string;
}) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      role="img"
      aria-label={`${name} — ${category}`}
      className={cn(
        "relative grid place-items-center overflow-hidden bg-gradient-to-br",
        tone[category],
        className,
      )}
    >
      <span className="font-display text-4xl font-bold text-primary/70">{initials}</span>
      <span className="absolute bottom-2 left-2 rounded-full bg-background/80 px-2 py-0.5 text-[11px] font-semibold">
        {category}
      </span>
    </div>
  );
}
