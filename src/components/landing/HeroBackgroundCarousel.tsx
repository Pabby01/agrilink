import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Pause, Play, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CarouselSlide {
  id: string;
  url: string;
  title: string;
  location: string;
  category: string;
}

export const HERO_AGRICULTURAL_SLIDES: CarouselSlide[] = [
  {
    id: "slide-1",
    url: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=1920&auto=format&fit=crop&q=80",
    title: "Vine-Ripened Roma Tomatoes",
    location: "Kano Agricultural Cluster",
    category: "Fresh Produce Harvest",
  },
  {
    id: "slide-2",
    url: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1920&auto=format&fit=crop&q=80",
    title: "Golden Grain & Maize Belts",
    location: "Kaduna Savannah Farmlands",
    category: "Cereal Grain Production",
  },
  {
    id: "slide-3",
    url: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=1920&auto=format&fit=crop&q=80",
    title: "Cold-Chain Fleet Logistics",
    location: "Abuja-Lagos National Corridor",
    category: "Insulated Haulage",
  },
  {
    id: "slide-4",
    url: "https://images.unsplash.com/photo-1596483785714-386d34b22c2a?w=1920&auto=format&fit=crop&q=80",
    title: "Export-Grade White Yams",
    location: "Zaki Biam, Benue State",
    category: "Tuber Aggregation Gate",
  },
  {
    id: "slide-5",
    url: "https://images.unsplash.com/photo-1508747703725-719777637510?w=1920&auto=format&fit=crop&q=80",
    title: "Cured Red Dry Onions",
    location: "Sokoto Rima River Basin",
    category: "High-Shelf-Life Storage",
  },
  {
    id: "slide-6",
    url: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=1920&auto=format&fit=crop&q=80",
    title: "Urban Wholesale Food Terminal",
    location: "Mile 12 Commercial Hub, Lagos",
    category: "Wholesale Market Liquidity",
  },
  {
    id: "slide-7",
    url: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1920&auto=format&fit=crop&q=80",
    title: "Smart Farm Irrigation",
    location: "Hadejia Valley Agricultural Basin",
    category: "Precision Agriculture",
  },
  {
    id: "slide-8",
    url: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=1920&auto=format&fit=crop&q=80",
    title: "Soybeans & Legume Cultivation",
    location: "Niger State Agricultural Zone",
    category: "Legume Supply Chain",
  },
  {
    id: "slide-9",
    url: "https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=1920&auto=format&fit=crop&q=80",
    title: "Certified Produce Packaging",
    location: "Ibadan Central Food Sorting Center",
    category: "Quality Grading & Sortation",
  },
  {
    id: "slide-10",
    url: "https://images.unsplash.com/photo-1615811361523-6bd03d7748e7?w=1920&auto=format&fit=crop&q=80",
    title: "Bulk Haulage Dispatch Hub",
    location: "Lokoja Transit Confluence",
    category: "Interstate Transit Network",
  },
];

export function HeroBackgroundCarousel({
  className,
  autoPlayInterval = 5500,
}: {
  className?: string;
  autoPlayInterval?: number;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % HERO_AGRICULTURAL_SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentIndex(
      (prev) => (prev - 1 + HERO_AGRICULTURAL_SLIDES.length) % HERO_AGRICULTURAL_SLIDES.length,
    );
  }, []);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      nextSlide();
    }, autoPlayInterval);

    return () => clearInterval(timer);
  }, [isPlaying, autoPlayInterval, nextSlide]);

  const currentSlide = HERO_AGRICULTURAL_SLIDES[currentIndex];

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 -z-10 overflow-hidden select-none",
        className,
      )}
    >
      {/* Background Image Cross-Fade & Smooth Ken Burns Zoom */}
      <AnimatePresence initial={false} mode="sync">
        {currentSlide && (
          <motion.div
            key={currentSlide.id}
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              opacity: { duration: 1.6, ease: "easeInOut" },
              scale: { duration: 7, ease: "easeOut" },
            }}
            className="absolute inset-0 h-full w-full bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${currentSlide.url})`,
            }}
          />
        )}
      </AnimatePresence>

      {/* Multi-layered Glassmorphism & High-Contrast Readability Gradient Mask */}
      <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/88 to-background/75 dark:from-background/96 dark:via-background/90 dark:to-background/80" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
      <div className="absolute inset-0 bg-radial-[circle_at_top_left] from-primary/15 via-transparent to-transparent" />

      {/* Subtle Pattern Grid Overlay */}
      <div
        className="absolute inset-0 bg-[radial-gradient(#16a34a_1px,transparent_1px)] [background-size:24px_24px] opacity-15 mix-blend-overlay"
        aria-hidden="true"
      />

      {/* Interactive Carousel Bar (Pointer Events Enabled for Controls) */}
      <div className="pointer-events-auto absolute bottom-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 sm:bottom-6 sm:left-8 sm:right-8">
        {/* Active Scene Badge */}
        <motion.div
          key={currentSlide?.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="hidden sm:flex items-center gap-2 rounded-full border border-white/20 bg-card/85 px-3 py-1.5 text-xs shadow-md backdrop-blur-md"
        >
          <Sparkles className="size-3.5 text-gold" />
          <span className="font-semibold text-foreground">{currentSlide?.title}</span>
          <span className="text-muted-foreground">·</span>
          <span className="text-xs text-muted-foreground">{currentSlide?.location}</span>
        </motion.div>

        {/* Slide Controls & Indicator Pills */}
        <div className="flex items-center gap-2 rounded-full border border-white/20 bg-card/80 p-1.5 shadow-md backdrop-blur-md">
          {/* Previous Button */}
          <button
            type="button"
            onClick={prevSlide}
            aria-label="Previous slide"
            className="flex size-7 items-center justify-center rounded-full text-foreground/80 hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
          >
            <ChevronLeft className="size-4" />
          </button>

          {/* Indicators Dots */}
          <div className="flex items-center gap-1.5 px-1">
            {HERO_AGRICULTURAL_SLIDES.map((slide, idx) => {
              const isActive = idx === currentIndex;
              return (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => goToSlide(idx)}
                  aria-label={`Go to slide ${idx + 1}: ${slide.title}`}
                  className={cn(
                    "h-2 rounded-full transition-all duration-300 cursor-pointer",
                    isActive
                      ? "w-6 bg-primary"
                      : "w-2 bg-muted-foreground/40 hover:bg-foreground/60",
                  )}
                />
              );
            })}
          </div>

          {/* Next Button */}
          <button
            type="button"
            onClick={nextSlide}
            aria-label="Next slide"
            className="flex size-7 items-center justify-center rounded-full text-foreground/80 hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
          >
            <ChevronRight className="size-4" />
          </button>

          {/* Pause / Resume Button */}
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            aria-label={isPlaying ? "Pause carousel" : "Play carousel"}
            className="flex size-7 items-center justify-center rounded-full text-foreground/80 hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
          >
            {isPlaying ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
          </button>
        </div>
      </div>
    </div>
  );
}
