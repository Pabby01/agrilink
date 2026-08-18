import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { Page, PageHeader } from "@/components/layout/AppShell";
import { ProduceCard } from "@/components/marketplace/ProduceCard";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useApp } from "@/lib/store";
import type { ProduceCategory } from "@/lib/types";

export const Route = createFileRoute("/marketplace/")({
  head: () => ({
    meta: [
      { title: "Marketplace — buy verified Nigerian produce | Agrolink" },
      {
        name: "description",
        content:
          "Browse tomatoes, maize, cassava, yam and more from trust-scored Nigerian farmers, with transparent pricing per kilogram.",
      },
      { property: "og:title", content: "Agrolink Marketplace" },
      {
        property: "og:description",
        content: "Verified produce from trust-scored Nigerian farmers.",
      },
    ],
  }),
  component: MarketplacePage,
});

const categories: (ProduceCategory | "All")[] = [
  "All",
  "Vegetables",
  "Grains",
  "Tubers",
  "Fruits",
  "Legumes",
];

function MarketplacePage() {
  const { state, getTrust } = useApp();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("All");
  const [sort, setSort] = useState("trust");
  const [availability, setAvailability] = useState("available");

  const items = useMemo(() => {
    const q = query.trim().toLowerCase();
    return state.produce
      .filter((p) => (availability === "available" ? p.available : true))
      .filter((p) => (category === "All" ? true : p.category === category))
      .filter(
        (p) =>
          !q ||
          p.name.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q),
      )
      .sort((a, b) => {
        if (sort === "price-asc") return a.pricePerKg - b.pricePerKg;
        if (sort === "price-desc") return b.pricePerKg - a.pricePerKg;
        if (sort === "newest") return +new Date(b.listedAt) - +new Date(a.listedAt);
        return (getTrust(b.farmerId)?.score ?? 0) - (getTrust(a.farmerId)?.score ?? 0);
      });
  }, [state.produce, query, category, sort, availability, getTrust]);

  return (
    <Page>
      <PageHeader
        title="Marketplace"
        subtitle="Every listing shows the farmer's trust score so you know exactly who you are buying from."
      />

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="relative sm:col-span-2 lg:col-span-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            className="pl-9"
            placeholder="Search produce or location"
            aria-label="Search produce"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger aria-label="Filter by category">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((c) => (
              <SelectItem key={c} value={c}>
                {c === "All" ? "All categories" : c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger aria-label="Sort listings">
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="trust">Highest trust first</SelectItem>
            <SelectItem value="price-asc">Price: low to high</SelectItem>
            <SelectItem value="price-desc">Price: high to low</SelectItem>
            <SelectItem value="newest">Newest listings</SelectItem>
          </SelectContent>
        </Select>
        <Select value={availability} onValueChange={setAvailability}>
          <SelectTrigger aria-label="Filter by availability">
            <SelectValue placeholder="Availability" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="available">Available now</SelectItem>
            <SelectItem value="all">Include unavailable</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <p className="mt-4 text-sm text-muted-foreground">
        {items.length} listing{items.length === 1 ? "" : "s"}
      </p>

      {items.length === 0 ? (
        <div className="mt-10 rounded-xl border border-dashed p-10 text-center">
          <p className="font-medium">No produce matches your filters.</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Try clearing the search or choosing a different category.
          </p>
        </div>
      ) : (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item) => (
            <ProduceCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </Page>
  );
}
