"use client";

import { AppleLogo, Star, TwitterLogo } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTypewriter } from "react-simple-typewriter";
import { Button } from "@/components/ui/button";
import { MagneticButton } from "@/components/ui/magnetic-button";
import type { HomepageReview, ReviewSource } from "@/lib/types";
import { cn } from "@/lib/utils";

interface HeroSectionProps {
  onNavigate: (section: string) => void;
  reviews?: HomepageReview[];
}

const ROLE_VARIANTS = [
  "Mentee",
  "Mentor",
  "Teacher",
  "Member",
  "Learner",
  "Sponsor",
  "Sponsee",
];

function ProductHuntIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <title>Product Hunt</title>
      <path d="M13.604 8.4h-3.405V12h3.405c.995 0 1.801-.806 1.801-1.801 0-.993-.806-1.799-1.801-1.799zM12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zm1.604 14.4h-3.405V18H7.801V6h5.803c2.2 0 3.989 1.791 3.989 3.99 0 2.208-1.789 4.01-3.989 4.01z" />
    </svg>
  );
}

function SourceIcon({
  source,
  className,
}: {
  source?: ReviewSource;
  className?: string;
}) {
  const cls = className ?? "h-3.5 w-3.5";
  if (source === "x") {
    return <TwitterLogo weight="fill" className={cls} aria-hidden />;
  }
  if (source === "app-store") {
    return <AppleLogo weight="fill" className={cls} aria-hidden />;
  }
  return <ProductHuntIcon className={cls} />;
}

function getInitials(name: string): string {
  const cleaned = name.replace(/^@/, "");
  const parts = cleaned.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase();
  }
  return cleaned.slice(0, 2).toUpperCase();
}

export function HeroSection({ onNavigate, reviews = [] }: HeroSectionProps) {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  const handleImageError = (id: string) => {
    setFailedImages((prev) => ({ ...prev, [id]: true }));
  };

  // Auto-cycle reviews every 5 seconds if not paused and reviews exist
  useEffect(() => {
    if (reviews.length <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % reviews.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [reviews.length, isPaused]);

  // Typewriter effect with automatic cycling
  const [role, { isType, isDelete }] = useTypewriter({
    words: ROLE_VARIANTS,
    loop: 0,
    typeSpeed: 40,
    deleteSpeed: 30,
    delaySpeed: 3000,
  });

  const isAnimating = isType || isDelete;
  const displayedText = `Join as a ${role}`;

  return (
    <section
      aria-label="Hero"
      data-testid="hero-section"
      className="hero-section relative min-h-screen pt-24 md:pt-32 pb-8 md:pb-12 flex flex-col items-center justify-between overflow-hidden"
    >
      {/* Hero Content */}
      <div className="hero-content text-center max-w-[1100px] px-4 z-[2] mt-4 md:mt-8 mb-auto">
        <div className="hero-badge inline-flex items-center text-primary text-[10px] sm:text-xs font-semibold mb-4 tracking-wider uppercase">
          Building the future of software development
        </div>

        <h1 className="hero-headline text-4xl md:text-5xl lg:text-6xl leading-[1.08] font-bold tracking-tight mb-5 text-foreground font-editorial text-balance">
          Building products. <br />
          <span className="text-aurora tracking-tight whitespace-nowrap italic font-medium">
            Empowering builders.
          </span>
        </h1>

        <p className="hero-subheadline text-xs md:text-sm lg:text-base text-foreground/70 leading-relaxed mb-6 max-w-2xl mx-auto text-pretty">
          A software development company and open-source learning community. We
          build exceptional products while mentoring the next generation of
          developers.
        </p>

        <div className="hero-cta-group flex flex-row items-center gap-3 sm:gap-4 justify-center w-full sm:w-auto">
          <MagneticButton>
            <Button
              onClick={() => router.push("/products")}
              size="default"
              className="text-xs sm:text-base px-4 sm:px-6"
            >
              Explore Products
            </Button>
          </MagneticButton>
          <MagneticButton>
            <Button
              variant="accent"
              onClick={() => onNavigate("mentorship")}
              size="default"
              className="text-xs sm:text-base px-4 sm:px-6"
              data-testid="join-button"
              aria-labelledby="join-button-live"
            >
              <span
                className="inline-flex items-center"
                aria-hidden="true"
                data-testid="typewriter-text"
              >
                <span>Join as a&nbsp;</span>
                <span>{role}</span>
                <span
                  className={cn(
                    "ml-0.5 w-[2px] h-[1.1em] bg-current inline-block",
                    isAnimating ? "animate-pulse" : "opacity-0",
                  )}
                  aria-hidden="true"
                />
              </span>
            </Button>
          </MagneticButton>
          {/* ARIA live region for screen reader announcements of dynamic button text */}
          <output
            id="join-button-live"
            aria-live="polite"
            aria-atomic="true"
            className="sr-only"
          >
            {displayedText}
          </output>
        </div>
      </div>

      {/* Reviews Avatar Bar & Anchored Tooltip (at bottom of screen) */}
      {reviews.length > 0 && (
        <div
          className="hero-reviews-widget z-[2] w-full max-w-2xl px-4 mt-auto pt-6"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Avatar Row with negative spacing */}
          <div className="relative flex items-center justify-center -space-x-2.5 sm:-space-x-3">
            {reviews.map((review, idx) => {
              const isActive = idx === activeIndex;
              const hasError = failedImages[review.id];

              return (
                <div key={review.id} className="relative">
                  {/* Tooltip anchored directly to active PFP */}
                  {isActive && (
                    <motion.div
                      layoutId="hero-review-tooltip"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 28,
                      }}
                      className="absolute bottom-full mb-[21px] left-1/2 -translate-x-1/2 w-[280px] sm:w-[340px] md:w-[380px] bg-card shadow-2xl rounded-2xl p-4 text-left pointer-events-auto z-30"
                    >
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={review.id}
                          initial={{ opacity: 0, y: 4, filter: "blur(2px)" }}
                          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                          exit={{ opacity: 0, y: -4, filter: "blur(2px)" }}
                          transition={{ duration: 0.15, ease: "easeOut" }}
                        >
                          <div className="flex items-center justify-between mb-2 gap-2">
                            <div className="flex items-center gap-1.5 min-w-0">
                              <span className="text-xs sm:text-sm font-bold truncate text-foreground">
                                {review.name}
                              </span>
                              <span className="text-[10px] sm:text-xs text-muted-foreground truncate">
                                · {review.role}
                              </span>
                            </div>
                            <div className="flex items-center gap-0.5 shrink-0">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  // biome-ignore lint/suspicious/noArrayIndexKey: fixed star count
                                  key={i}
                                  weight="fill"
                                  className={cn(
                                    "h-3 w-3 sm:h-3.5 sm:w-3.5",
                                    i < review.rating
                                      ? "text-accent"
                                      : "text-muted-foreground/30",
                                  )}
                                />
                              ))}
                            </div>
                          </div>

                          <p className="text-xs sm:text-sm text-foreground/90 font-medium leading-relaxed line-clamp-2 italic">
                            &ldquo;{review.quote}&rdquo;
                          </p>
                        </motion.div>
                      </AnimatePresence>

                      {/* Caret pointing down to active avatar (solid, no transparency, no border) */}
                      <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-card rotate-45" />
                    </motion.div>
                  )}

                  <motion.button
                    type="button"
                    aria-pressed={isActive}
                    aria-label={`View review by ${review.name}`}
                    onClick={() => setActiveIndex(idx)}
                    animate={{
                      y: isActive ? -12 : 0,
                      scale: isActive ? 1.12 : 1,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 25,
                    }}
                    className={cn(
                      "relative rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 active:scale-[0.96]",
                      isActive ? "z-20 shadow-lg" : "z-10",
                    )}
                  >
                    {review.profilePicUrl && !hasError ? (
                      <img
                        src={review.profilePicUrl}
                        alt={review.name}
                        onError={() => handleImageError(review.id)}
                        className={cn(
                          "h-10 w-10 sm:h-12 sm:w-12 rounded-full object-cover object-top ring-2 transition-all duration-200",
                          isActive
                            ? "ring-primary"
                            : "ring-background hover:ring-primary/50",
                        )}
                      />
                    ) : (
                      <div
                        className={cn(
                          "h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-muted text-foreground font-bold text-xs flex items-center justify-center ring-2 transition-all duration-200",
                          isActive
                            ? "ring-primary"
                            : "ring-background hover:ring-primary/50",
                        )}
                      >
                        {review.source ? (
                          <SourceIcon
                            source={review.source}
                            className="h-4 w-4"
                          />
                        ) : (
                          getInitials(review.name)
                        )}
                      </div>
                    )}
                  </motion.button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
