import { createFileRoute, useRouter } from "@tanstack/react-router";
import { Sprout, ShoppingBasket, Truck, ShieldCheck, Leaf } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/store";
import type { Role } from "@/lib/types";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Choose your role — Agrolink" },
      {
        name: "description",
        content:
          "Sign in to Agrolink as a farmer, buyer, transporter or admin and explore the trusted agriculture marketplace demo.",
      },
      { property: "og:title", content: "Choose your role — Agrolink" },
      {
        property: "og:description",
        content: "Farmer, buyer, transporter or admin — pick a role to explore Agrolink.",
      },
    ],
  }),
  component: AuthPage,
});

const roles: { role: Role; name: string; icon: typeof Sprout; blurb: string; home: string }[] = [
  {
    role: "farmer",
    name: "Abdul Farms",
    icon: Sprout,
    blurb: "List produce, accept orders and grow your trust score.",
    home: "/dashboard/farmer",
  },
  {
    role: "buyer",
    name: "FreshMart Retail",
    icon: ShoppingBasket,
    blurb: "Browse verified farmers, order produce and track delivery.",
    home: "/dashboard/buyer",
  },
  {
    role: "transporter",
    name: "SwiftHaul Logistics",
    icon: Truck,
    blurb: "Pick up delivery jobs and update transit status.",
    home: "/dashboard/transporter",
  },
  {
    role: "admin",
    name: "Agrolink Operations",
    icon: ShieldCheck,
    blurb: "Monitor marketplace health, trust and flagged accounts.",
    home: "/admin",
  },
];

function AuthPage() {
  const { setRole } = useApp();
  const router = useRouter();

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6">
      <div className="text-center">
        <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-primary text-primary-foreground">
          <Leaf className="size-6" aria-hidden />
        </span>
        <h1 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Sign in to Agrolink
        </h1>
        <p className="mx-auto mt-2 max-w-xl text-muted-foreground">
          This prototype uses demo accounts — no password required. Choose the role you want to
          experience and you can switch at any time from the header.
        </p>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {roles.map((r) => (
          <Card key={r.role} className="gap-0 p-5 shadow-[var(--shadow-card)]">
            <div className="flex items-start gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-secondary text-secondary-foreground">
                <r.icon className="size-5" aria-hidden />
              </span>
              <div>
                <h2 className="font-display text-lg font-bold capitalize">{r.role}</h2>
                <p className="text-sm text-muted-foreground">{r.name}</p>
              </div>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">{r.blurb}</p>
            <Button
              className="mt-4 w-full"
              onClick={() => {
                setRole(r.role);
                toast.success(`Signed in as ${r.name}`);
                router.navigate({ to: r.home as never });
              }}
            >
              Continue as {r.role}
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
