import { BadgeCheck, ShieldAlert, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TrustProfile } from "@/lib/types";

export const trustTone = (score: number) =>
  score >= 90
    ? { text: "text-success", ring: "border-success/50", chip: "bg-success/12 text-success" }
    : score >= 75
      ? { text: "text-primary", ring: "border-primary/40", chip: "bg-primary/10 text-primary" }
      : score >= 50
        ? { text: "text-warning", ring: "border-warning/50", chip: "bg-warning/15 text-warning" }
        : { text: "text-destructive", ring: "border-destructive/50", chip: "bg-destructive/12 text-destructive" };

interface Props {
  trust: TrustProfile;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

/** Reusable trust indicator used on cards, profiles, orders and admin tables. */
export function TrustScore({ trust, size = "md", showLabel = true, className }: Props) {
  const tone = trustTone(trust.score);

  if (size === "sm") {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold",
          tone.chip,
          className,
        )}
        title={`Trust score ${trust.score} — ${trust.level}`}
      >
        <ShieldCheck className="size-3" aria-hidden />
        {trust.score}
        {showLabel && <span className="hidden sm:inline font-medium">· {trust.level}</span>}
      </span>
    );
  }

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div
        className={cn(
          "flex flex-col items-center justify-center rounded-full border-2 bg-card",
          tone.ring,
          size === "lg" ? "size-20" : "size-14",
        )}
        role="img"
        aria-label={`Trust score ${trust.score} out of 100, ${trust.level}`}
      >
        <span className={cn("font-display font-bold leading-none", tone.text, size === "lg" ? "text-3xl" : "text-xl")}>
          {trust.score}
        </span>
        <span className="text-[9px] uppercase tracking-widest text-muted-foreground">trust</span>
      </div>
      {showLabel && (
        <div className="min-w-0">
          <p className={cn("font-semibold", tone.text)}>{trust.level}</p>
          <p className="flex items-center gap-1 text-xs text-muted-foreground">
            {trust.verified ? (
              <>
                <BadgeCheck className="size-3.5 text-success" aria-hidden /> Verified identity
              </>
            ) : (
              <>
                <ShieldAlert className="size-3.5 text-warning" aria-hidden /> Unverified
              </>
            )}
          </p>
        </div>
      )}
    </div>
  );
}
