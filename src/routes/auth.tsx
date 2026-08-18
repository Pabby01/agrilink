import { createFileRoute, useRouter } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Sprout, ShoppingBasket, Truck, ShieldCheck, Leaf, ArrowRight } from "lucide-react";
import { LiquidCard } from "@/components/ui/LiquidCard";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/store";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import type { Role } from "@/lib/types";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Choose Your Role — Agrolink" },
      {
        name: "description",
        content:
          "Sign in to Agrolink as a farmer, buyer, transporter or admin and explore the trusted agriculture marketplace demo.",
      },
      { property: "og:title", content: "Choose Your Role — Agrolink" },
      {
        property: "og:description",
        content: "Farmer, buyer, transporter or admin — pick a role to explore Agrolink.",
      },
    ],
  }),
  component: AuthPage,
});

const roles: {
  role: Role;
  name: string;
  icon: typeof Sprout;
  blurb: string;
  home: string;
  variant: "success" | "primary" | "gold" | "blue";
}[] = [
  {
    role: "farmer",
    name: "Abdul Farms (Kano)",
    icon: Sprout,
    blurb:
      "List produce, accept buyer orders, coordinate pickups, and grow your verified trust score.",
    home: "/dashboard/farmer",
    variant: "success",
  },
  {
    role: "buyer",
    name: "FreshMart Retail (Lagos)",
    icon: ShoppingBasket,
    blurb:
      "Browse verified farmers, order produce, manage cold-chain deliveries, and rate suppliers.",
    home: "/dashboard/buyer",
    variant: "primary",
  },
  {
    role: "transporter",
    name: "SwiftHaul Logistics (Abuja)",
    icon: Truck,
    blurb:
      "Pick up profitable haulage jobs, update live GPS corridor transit status, and build fleet trust.",
    home: "/dashboard/transporter",
    variant: "gold",
  },
  {
    role: "admin",
    name: "Agrolink Operations",
    icon: ShieldCheck,
    blurb:
      "Monitor national supply corridors, platform GMV, trust score integrity, and flagged accounts.",
    home: "/admin",
    variant: "blue",
  },
];

function AuthPage() {
  const { setRole } = useApp();
  const router = useRouter();

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="text-center"
      >
        <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-md">
          <Leaf className="size-6" aria-hidden />
        </span>
        <h1 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Sign In to Agrolink
        </h1>
        <p className="mx-auto mt-2 max-w-xl text-sm sm:text-base text-muted-foreground">
          This prototype uses instant demo accounts — no password required. Choose your supply-chain
          role below and switch freely anytime.
        </p>
      </motion.div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="mt-10 grid gap-5 sm:grid-cols-2"
      >
        {roles.map((r) => (
          <motion.div key={r.role} variants={fadeInUp}>
            <LiquidCard
              variant={r.variant}
              className="flex h-full flex-col justify-between p-6 shadow-[var(--shadow-card)] transition-all hover:shadow-[var(--shadow-lift)]"
            >
              <div>
                <div className="flex items-start justify-between gap-3 border-b pb-3.5">
                  <div className="flex items-center gap-3">
                    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-muted text-foreground">
                      <r.icon className="size-5" aria-hidden />
                    </span>
                    <div>
                      <h2 className="font-display text-lg font-bold capitalize">{r.role}</h2>
                      <p className="text-xs text-muted-foreground">{r.name}</p>
                    </div>
                  </div>
                </div>
                <p className="mt-3.5 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {r.blurb}
                </p>
              </div>

              <Button
                className="mt-6 w-full font-bold shadow-xs transition-transform hover:scale-[1.02]"
                onClick={() => {
                  setRole(r.role);
                  toast.success(`Signed in as ${r.name}`);
                  router.navigate({ to: r.home as never });
                }}
              >
                Continue as {r.role}
                <ArrowRight className="ml-1.5 size-4" />
              </Button>
            </LiquidCard>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
