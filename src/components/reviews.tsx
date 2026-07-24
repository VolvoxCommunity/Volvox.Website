"use client";

import {
  AppleLogo,
  CaretLeft,
  CaretRight,
  Quotes,
  Star,
  TwitterLogo,
} from "@phosphor-icons/react";
import { motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useId, useState } from "react";
import { Button } from "@/components/ui/button";
import type {
  HomepageReview,
  ReviewSource,
  ReviewsContent,
  ReviewTrustBadge,
} from "@/lib/types";
import { cn } from "@/lib/utils";

const SQRT_5000 = Math.sqrt(5000);

const SOURCE_LABEL: Record<ReviewSource, string> = {
  "product-hunt": "Product Hunt",
  "app-store": "App Store",
  x: "X",
};

/** Official Product Hunt mark. */
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

function getInitials(name: string): string {
  const cleaned = name.replace(/^@/, "");
  const parts = cleaned.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase();
  }
  return cleaned.slice(0, 2).toUpperCase();
}

/**
 * Build initial reviews list ordered so the featured review sits in the center slot.
 */
const EMPTY_REVIEWS: HomepageReview[] = [];

function buildInitialReviews(
  reviews: HomepageReview[],
): (HomepageReview & { tempId: string })[] {
  const n = reviews.length;
  if (n === 0) return [];
  const featuredIdx = reviews.findIndex((r) => r.featured);
  const start = featuredIdx >= 0 ? featuredIdx : 0;
  const center = Math.floor(n / 2);
  return Array.from({ length: n }, (_, slot) => {
    const idx = (start - center + slot + n) % n;
    return { ...reviews[idx], tempId: reviews[idx].id };
  });
}

function SourceIcon({
  source,
  className,
}: {
  source: ReviewSource;
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

function StarRating({
  rating,
  inverted,
}: {
  rating: number;
  inverted?: boolean;
}) {
  return (
    <div className="flex items-center gap-0.5" role="img">
      <span className="sr-only">{`${rating} out of 5 stars`}</span>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          // biome-ignore lint/suspicious/noArrayIndexKey: fixed star row
          key={i}
          weight="fill"
          className={cn(
            "h-3.5 w-3.5",
            i < rating
              ? "text-accent"
              : inverted
                ? "text-primary-foreground/25"
                : "text-muted-foreground/30",
          )}
          aria-hidden
        />
      ))}
    </div>
  );
}

interface ReviewCardProps {
  position: number;
  review: HomepageReview;
  cardSize: number;
  onMove: (steps: number) => void;
  reducedMotion: boolean;
}

function ReviewCard({
  position,
  review,
  cardSize,
  onMove,
  reducedMotion,
}: ReviewCardProps) {
  const isCenter = position === 0;
  const cardHeight = Math.round(cardSize * 1.12);

  const x = (cardSize / 1.5) * position;
  const y = isCenter ? -56 : position % 2 ? 14 : -14;
  const rotate = isCenter ? 0 : position % 2 ? 2.5 : -2.5;
  const scale = isCenter ? 1 : 0.94;
  const sourceLabel = SOURCE_LABEL[review.source];

  return (
    <motion.button
      type="button"
      onClick={() => onMove(position)}
      aria-current={isCenter ? "true" : undefined}
      aria-label={`${isCenter ? "Current review" : "Show review"} from ${review.name}`}
      initial={false}
      animate={{
        x,
        y,
        rotate,
        scale,
        zIndex: isCenter ? 10 : Math.max(0, 5 - Math.abs(position)),
      }}
      transition={
        reducedMotion
          ? { duration: 0 }
          : {
              type: "spring",
              stiffness: 280,
              damping: 30,
              mass: 0.85,
            }
      }
      className={cn(
        "absolute left-1/2 top-1/2 cursor-pointer border p-5 sm:p-7 text-left overflow-hidden",
        // Origin at card center (matches original translate -50% -50%)
        "-translate-x-1/2 -translate-y-1/2",
        isCenter
          ? "bg-primary text-primary-foreground border-primary shadow-[0_8px_0_4px_oklch(from_var(--border)_l_c_h_/_0.55)]"
          : "bg-card text-card-foreground border-border hover:border-primary/50",
      )}
      style={{
        width: cardSize,
        height: cardHeight,
        clipPath: `polygon(50px 0%, calc(100% - 50px) 0%, 100% 50px, 100% 100%, calc(100% - 50px) 100%, 50px 100%, 0 100%, 0 0)`,
      }}
    >
      {/* Fold crease */}
      <span
        className={cn(
          "absolute block origin-top-right rotate-45",
          isCenter ? "bg-primary-foreground/35" : "bg-border",
        )}
        style={{
          right: -2,
          top: 48,
          width: SQRT_5000,
          height: 2,
        }}
        aria-hidden
      />

      <div className="flex h-full flex-col">
        <div className="mb-3 flex items-start justify-between gap-3">
          {review.profilePicUrl ? (
            <img
              src={review.profilePicUrl}
              alt={review.name}
              className={cn(
                "h-12 w-11 shrink-0 object-cover object-top",
                isCenter
                  ? "ring-2 ring-primary-foreground/40"
                  : "ring-1 ring-border",
              )}
              style={{
                boxShadow: isCenter
                  ? "3px 3px 0px oklch(from var(--primary-foreground) l c h / 0.2)"
                  : "3px 3px 0px oklch(from var(--background) l c h / 0.9)",
              }}
            />
          ) : (
            <div
              className={cn(
                "flex h-12 w-11 shrink-0 items-center justify-center",
                isCenter
                  ? "bg-primary-foreground/15 text-primary-foreground"
                  : "bg-muted text-foreground",
              )}
              style={{
                boxShadow: isCenter
                  ? "3px 3px 0px oklch(from var(--primary-foreground) l c h / 0.2)"
                  : "3px 3px 0px oklch(from var(--background) l c h / 0.9)",
              }}
            >
              {review.source ? (
                <SourceIcon source={review.source} className="h-5 w-5" />
              ) : (
                <span className="text-sm font-bold">
                  {getInitials(review.name)}
                </span>
              )}
            </div>
          )}

          <div className="flex flex-col items-end gap-1.5">
            <StarRating rating={review.rating} inverted={isCenter} />
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                isCenter
                  ? "bg-primary-foreground/15 text-primary-foreground/90"
                  : "bg-muted text-muted-foreground",
              )}
            >
              <SourceIcon source={review.source} />
              {sourceLabel}
            </span>
          </div>
        </div>

        <Quotes
          weight="fill"
          className={cn(
            "mb-2 h-5 w-5 shrink-0",
            isCenter ? "text-primary-foreground/35" : "text-primary/30",
          )}
          aria-hidden
        />

        <p
          className={cn(
            "min-h-0 flex-1 text-xs sm:text-sm font-medium leading-relaxed text-pretty",
            isCenter
              ? "line-clamp-6 sm:line-clamp-[8] text-primary-foreground font-editorial italic text-base sm:text-lg"
              : "line-clamp-4 text-foreground",
          )}
        >
          &ldquo;{review.quote}&rdquo;
        </p>

        <div className="mt-3">
          <p
            className={cn(
              "text-sm font-bold truncate",
              isCenter ? "text-primary-foreground" : "text-foreground",
            )}
          >
            {review.name}
          </p>
          <p
            className={cn(
              "text-xs truncate mt-0.5 italic",
              isCenter ? "text-primary-foreground/80" : "text-muted-foreground",
            )}
          >
            {review.role}
            {review.product ? ` · ${review.product}` : null}
          </p>
        </div>
      </div>
    </motion.button>
  );
}

function TrustBadge({ badge }: { badge: ReviewTrustBadge }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-border/50 bg-card/60 px-3 py-1.5 text-xs font-semibold">
      {badge.source === "product-hunt" ? (
        <ProductHuntIcon className="h-4 w-4 text-[#da552f]" />
      ) : badge.source === "app-store" ? (
        <AppleLogo weight="fill" className="h-4 w-4 text-foreground" />
      ) : (
        <SourceIcon source={badge.source} className="h-4 w-4" />
      )}
      <span className="text-foreground">{badge.label}</span>
      <span className="text-muted-foreground">{badge.rating}</span>
    </div>
  );
}

interface ReviewsProps {
  content: ReviewsContent | null;
}

/**
 * Homepage reviews: staggered card deck (OG interaction, stable keys + wrap teleport).
 */
export function Reviews({ content }: ReviewsProps) {
  const headingId = useId();
  const reducedMotion = useReducedMotion() ?? false;
  const [cardSize, setCardSize] = useState(340);
  const reviews = content?.reviews ?? EMPTY_REVIEWS;
  const [orderedReviews, setOrderedReviews] = useState<
    (HomepageReview & { tempId: string })[]
  >(() => buildInitialReviews(reviews));

  const trustBadges = content?.trustBadges ?? [];
  const headline =
    content?.headline ?? "What people say after actually using what we build.";
  const eyebrow = content?.eyebrow ?? "Loved by our community";

  // Sync order when content loads / changes
  useEffect(() => {
    setOrderedReviews(buildInitialReviews(reviews));
  }, [reviews]);

  useEffect(() => {
    const updateSize = () => {
      const width = window.innerWidth;
      if (width < 480) setCardSize(270);
      else if (width < 640) setCardSize(300);
      else if (width < 1024) setCardSize(330);
      else setCardSize(365);
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const handleMove = useCallback((steps: number) => {
    if (steps === 0) return;
    setOrderedReviews((prev) => {
      if (prev.length === 0) return prev;
      const next = [...prev];
      if (steps > 0) {
        for (let i = 0; i < steps; i++) {
          const item = next.shift();
          if (item === undefined) return prev;
          next.push({ ...item, tempId: Math.random().toString() });
        }
      } else {
        for (let i = 0; i > steps; i--) {
          const item = next.pop();
          if (item === undefined) return prev;
          next.unshift({ ...item, tempId: Math.random().toString() });
        }
      }
      return next;
    });
  }, []);

  if (!content || reviews.length === 0 || orderedReviews.length === 0) {
    return null;
  }

  const n = orderedReviews.length;
  const centerSlot = Math.floor(n / 2);
  const centerReview = orderedReviews[centerSlot];
  const deckHeight = Math.round(cardSize * 1.55);

  return (
    <section
      id="reviews"
      aria-labelledby={headingId}
      data-testid="reviews-section"
      className="py-24 md:py-32 px-4 relative overflow-hidden bg-background"
    >
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-1/4 -left-48 w-[480px] h-[480px] bg-primary/5 rounded-full blur-[140px]" />
        <div className="absolute bottom-1/4 -right-48 w-[520px] h-[520px] bg-secondary/5 rounded-full blur-[160px]" />
      </div>

      <div className="container mx-auto max-w-7xl relative z-10">
        <motion.h2
          id={headingId}
          initial={{ opacity: 0, y: 24, filter: "blur(12px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
          className="text-3xl md:text-4xl lg:text-5xl font-editorial italic font-medium tracking-tight text-foreground text-balance leading-tight mb-6 md:mb-8 max-w-2xl"
        >
          {headline}
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 36, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.7, delay: 0.06, ease: [0.25, 1, 0.5, 1] }}
        >
          {/* Stagger deck — bordered container, no rounding */}
          <div
            className="relative w-full overflow-hidden border border-border rounded-none"
            style={{ height: deckHeight }}
          >
            {orderedReviews.map((review, slotIndex) => {
              const position = slotIndex - centerSlot;
              if (!review) return null;

              return (
                <ReviewCard
                  key={review.tempId}
                  review={review}
                  position={position}
                  cardSize={cardSize}
                  onMove={handleMove}
                  reducedMotion={reducedMotion}
                />
              );
            })}

            <div className="absolute bottom-2 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => handleMove(-1)}
                aria-label="Previous review"
              >
                <CaretLeft weight="bold" className="h-5 w-5" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => handleMove(1)}
                aria-label="Next review"
              >
                <CaretRight weight="bold" className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.5, delay: 0.12, ease: [0.25, 1, 0.5, 1] }}
          className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex flex-wrap items-center gap-3">
            {trustBadges.map((badge) => (
              <TrustBadge key={badge.id} badge={badge} />
            ))}
          </div>
          <p className="text-xs sm:text-sm font-medium tracking-wide text-muted-foreground sm:text-right text-pretty">
            {eyebrow}
          </p>
        </motion.div>

        <output className="sr-only" aria-live="polite">
          {centerReview
            ? `Review from ${centerReview.name}: ${centerReview.quote}`
            : null}
        </output>
      </div>
    </section>
  );
}
