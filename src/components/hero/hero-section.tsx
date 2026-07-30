"use client";

import { AppleLogo, Star, TwitterLogo } from "@phosphor-icons/react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { MagneticButton } from "@/components/ui/magnetic-button";
import type { HomepageReview, ReviewSource } from "@/lib/types";
import { cn } from "@/lib/utils";

interface HeroSectionProps {
  reviews?: HomepageReview[];
}

const PRODUCT_GALLERY = [
  "/images/UI/hero/authfuse.png",
  "/images/UI/hero/decision-jar.png",
  "/images/UI/hero/fith-season.png",
  "/images/UI/hero/sobers.png",
  "/images/UI/hero/volvox.png",
];

const CARD_WIDTH = 440;
const CARD_HEIGHT = 248;

const GALLERY_SLOTS = [
  { x: -600, y: 120, rotate: -13, scale: 0.88, z: 4 },
  { x: -300, y: 42, rotate: -6, scale: 0.94, z: 7 },
  { x: 0, y: 0, rotate: 0, scale: 1, z: 10 },
  { x: 300, y: 42, rotate: 6, scale: 0.94, z: 7 },
  { x: 600, y: 120, rotate: 13, scale: 0.88, z: 4 },
];

const INTRO_DELAY = 0.8;
const INTRO_DUR = 0.72;
const TRAVEL_DUR = 0.6;
const SWEEP_DUR = 1.6;
const SWEEP_START = INTRO_DELAY + INTRO_DUR + TRAVEL_DUR;
const TOTAL_DUR = INTRO_DUR + TRAVEL_DUR + SWEEP_DUR;
const SMOOTH = [0.4, 0, 0.2, 1] as const;

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

export function HeroSection({ reviews = [] }: HeroSectionProps) {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});
  const [selectedImage, setSelectedImage] = useState<{
    src: string;
    rect: DOMRect;
  } | null>(null);

  const handleImageClick = (
    e: React.MouseEvent<HTMLButtonElement>,
    src: string,
  ) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setSelectedImage({ src, rect });
  };

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

  const { scrollY } = useScroll();
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkWidth = () => setIsDesktop(window.innerWidth >= 768);
    checkWidth();
    window.addEventListener("resize", checkWidth);
    return () => window.removeEventListener("resize", checkWidth);
  }, []);

  const [windowSize, setWindowSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const handle = () =>
      setWindowSize({ w: window.innerWidth, h: window.innerHeight });
    handle();
    window.addEventListener("resize", handle);
    return () => window.removeEventListener("resize", handle);
  }, []);

  const overlayRef = useRef<HTMLDivElement>(null);

  const handleOverlayClose = useCallback(() => setSelectedImage(null), []);

  useEffect(() => {
    if (!selectedImage) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedImage(null);
    };
    document.addEventListener("keydown", onKey);
    overlayRef.current?.focus();
    return () => document.removeEventListener("keydown", onKey);
  }, [selectedImage]);

  // Scroll-driven transforms only apply on desktop
  const yScrollTransform = useTransform(
    scrollY,
    [0, 800],
    [0, isDesktop ? -150 : 0],
  );
  const opacityScrollTransform = useTransform(
    scrollY,
    [0, 400],
    [1, isDesktop ? 0 : 1],
  );
  const blurScrollTransform = useTransform(
    scrollY,
    [0, 400],
    ["blur(0px)", isDesktop ? "blur(12px)" : "blur(0px)"],
  );

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.15 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, filter: "blur(12px)", scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      scale: 1,
      transition: { duration: 0.8, ease: [0.2, 0.8, 0.2, 1] as const },
    },
  };

  return (
    <>
      <motion.section
        aria-label="Hero"
        data-testid="hero-section"
        className="hero-section relative min-h-screen pt-16 md:pt-20 pb-0 md:pb-1 flex flex-col items-center justify-between overflow-hidden"
        style={{
          y: yScrollTransform,
          opacity: opacityScrollTransform,
          filter: blurScrollTransform,
        }}
      >
        {/* Hero Content */}
        <motion.div
          className="hero-content text-center max-w-[850px] px-4 z-[2] mt-0 md:mt-4 mb-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            variants={itemVariants}
            className="hero-badge inline-flex items-center text-primary text-[0.5rem] sm:text-[0.59375rem] font-semibold mb-3 tracking-widest uppercase"
          >
            Building the future of software development
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="hero-headline text-[2rem] md:text-4xl lg:text-5xl leading-[1.1] font-bold tracking-tight mb-4 text-foreground font-editorial text-balance"
          >
            Building products. <br />
            <span className="text-aurora tracking-tight whitespace-nowrap italic font-medium">
              Empowering builders.
            </span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="hero-subheadline text-[10px] md:text-[13px] text-foreground/70 leading-relaxed mb-6 max-w-[540px] mx-auto text-pretty"
          >
            A software development company and open-source learning community.
            We build exceptional products while mentoring the next generation of
            developers.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="hero-cta-group flex flex-row items-center gap-3 sm:gap-4 justify-center w-full sm:w-auto"
          >
            <MagneticButton>
              <Button
                onClick={() => router.push("/bookameeting")}
                size="default"
                variant="accent"
                className="text-xs sm:text-sm px-4 sm:px-5"
                data-testid="hero-book-meeting-cta"
              >
                Book a Meeting
              </Button>
            </MagneticButton>
            <MagneticButton>
              <Button
                asChild
                variant="default"
                size="default"
                className="text-xs sm:text-sm px-4 sm:px-5"
                data-testid="hero-mail-us-cta"
              >
                <a href="mailto:bill@volvox.dev">Mail Us</a>
              </Button>
            </MagneticButton>
          </motion.div>
        </motion.div>

        {/* Product Showcase Arc Gallery (Desktop) */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="hero-gallery z-[2] hidden md:flex items-center justify-center w-full -mt-16"
        >
          <HeroGallery onImageClick={handleImageClick} />
        </motion.div>

        {/* Product Showcase Marquee (Mobile) */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="z-[2] flex md:hidden w-full mt-4 mb-auto"
        >
          <MobileGalleryMarquee onImageClick={handleImageClick} />
        </motion.div>

        {/* Reviews Avatar Bar & Tooltip - hidden on mobile */}
        {reviews.length > 0 && (
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="hero-reviews-widget z-[2] w-full max-w-xl px-4 mt-auto pt-6 pb-0"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div className="relative flex items-center justify-center -space-x-2">
              {reviews.map((review, idx) => {
                const isActive = idx === activeIndex;
                const hasError = failedImages[review.id];

                return (
                  <div key={review.id} className="relative">
                    {isActive && (
                      <motion.div
                        layoutId="hero-review-tooltip"
                        transition={{
                          type: "spring",
                          stiffness: 380,
                          damping: 28,
                        }}
                        className="absolute bottom-full mb-4 left-1/2 -translate-x-1/2 w-[260px] sm:w-[300px] bg-card shadow-2xl rounded-2xl p-3 text-left pointer-events-auto z-30"
                      >
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={review.id}
                            initial={{ opacity: 0, y: 4, filter: "blur(2px)" }}
                            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                            exit={{ opacity: 0, y: -4, filter: "blur(2px)" }}
                            transition={{ duration: 0.15, ease: "easeOut" }}
                          >
                            <div className="flex items-center justify-between mb-1.5 gap-2">
                              <div className="flex items-center gap-1.5 min-w-0">
                                <span className="text-[10px] sm:text-xs font-bold truncate text-foreground">
                                  {review.name}
                                </span>
                                <span className="text-[9px] sm:text-[10px] text-muted-foreground truncate">
                                  · {review.role}
                                </span>
                              </div>
                              <div className="flex items-center gap-0.5 shrink-0">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star
                                    key={i}
                                    weight="fill"
                                    className={cn(
                                      "h-2.5 w-2.5 sm:h-3 sm:w-3",
                                      i < review.rating
                                        ? "text-accent"
                                        : "text-muted-foreground/30",
                                    )}
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="text-[10px] sm:text-xs text-foreground/90 font-medium leading-relaxed line-clamp-2 italic">
                              &ldquo;{review.quote}&rdquo;
                            </p>
                          </motion.div>
                        </AnimatePresence>
                        <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-card rotate-45" />
                      </motion.div>
                    )}

                    <motion.button
                      type="button"
                      aria-pressed={isActive}
                      aria-label={`View review by ${review.name}`}
                      onClick={() => setActiveIndex(idx)}
                      animate={{
                        y: isActive ? -8 : 0,
                        scale: isActive ? 1.1 : 1,
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
                            "h-8 w-8 sm:h-9 sm:w-9 rounded-full object-cover object-top ring-2 transition-all duration-200",
                            isActive
                              ? "ring-primary"
                              : "ring-background hover:ring-primary/50",
                          )}
                        />
                      ) : (
                        <div
                          className={cn(
                            "h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-muted text-foreground font-bold text-[10px] flex items-center justify-center ring-2 transition-all duration-200",
                            isActive
                              ? "ring-primary"
                              : "ring-background hover:ring-primary/50",
                          )}
                        >
                          {review.source ? (
                            <SourceIcon
                              source={review.source}
                              className="h-3 w-3"
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
          </motion.div>
        )}
      </motion.section>

      {/* Image Fly-out Overlay — outside section to avoid transform clipping */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            key="image-overlay"
            ref={overlayRef}
            role="dialog"
            aria-modal="true"
            aria-label="Enlarged product showcase"
            tabIndex={-1}
            className="fixed inset-0 z-[200] flex items-center justify-center cursor-zoom-out"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleOverlayClose}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.img
              src={selectedImage.src}
              alt="Product showcase enlarged"
              className="relative z-10 object-contain pointer-events-none"
              style={{
                position: "fixed",
                top: selectedImage.rect.top,
                left: selectedImage.rect.left,
                width: selectedImage.rect.width,
                height: selectedImage.rect.height,
              }}
              initial={{ scale: 1, x: 0, y: 0, borderRadius: 18 }}
              animate={{
                scale: Math.max(
                  (windowSize.w * 0.85) / selectedImage.rect.width,
                  (windowSize.h * 0.85) / selectedImage.rect.height,
                ),
                x:
                  windowSize.w / 2 -
                  selectedImage.rect.left -
                  selectedImage.rect.width / 2,
                y:
                  windowSize.h / 2 -
                  selectedImage.rect.top -
                  selectedImage.rect.height / 2,
                borderRadius: 12,
              }}
              exit={{ scale: 1, x: 0, y: 0, borderRadius: 18 }}
              transition={{ type: "spring", stiffness: 200, damping: 25 }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function GalleryCard({
  src,
  z,
  hovered,
  onClick,
}: {
  src: string;
  z: number;
  hovered: boolean;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-[18px] md:cursor-pointer"
      style={{
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        borderRadius: 18,
        overflow: "hidden",
        boxShadow: "0 16px 50px rgba(0,0,0,0.18)",
        zIndex: hovered ? 30 : z,
        position: "relative",
        transition: "z-index 0.15s ease",
        border: "none",
        padding: 0,
        background: "transparent",
        display: "block",
      }}
    >
      <img
        src={src}
        alt="Product showcase"
        draggable={false}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    </button>
  );
}

function HeroGallery({
  onImageClick,
}: {
  onImageClick: (e: React.MouseEvent<HTMLButtonElement>, src: string) => void;
}) {
  const prefersReducedMotion = useReducedMotion();
  const [hovered, setHovered] = useState<number | null>(null);
  const s0 = GALLERY_SLOTS[0];
  const s4 = GALLERY_SLOTS[4];

  const revealDelays = GALLERY_SLOTS.map((slot, i) => {
    if (i === 0) return 0;
    const p = (slot.x - s4.x) / (s0.x - s4.x);
    return SWEEP_START + p * SWEEP_DUR;
  });

  return (
    <div className="relative w-full" style={{ height: 320 }}>
      {/* Lead card (index 0) — drops in, travels right, sweeps left */}
      {prefersReducedMotion ? (
        <div
          className="absolute"
          style={{
            top: `calc(50% + ${s0.y}px)`,
            left: `calc(50% + ${s0.x}px)`,
            transform: "translate(-50%, -50%)",
          }}
        >
          <GalleryCard
            src={PRODUCT_GALLERY[0]}
            z={s0.z}
            hovered={false}
            onClick={(e) => onImageClick(e, PRODUCT_GALLERY[0])}
          />
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{
            x: [0, 0, s4.x, s0.x],
            y: [160, 0, s4.y, s0.y],
            rotate: [0, 0, s4.rotate, s0.rotate],
            scale: [0.3, 1, s4.scale, s0.scale],
            opacity: [0, 1, 1, 1],
          }}
          transition={{
            duration: TOTAL_DUR,
            delay: INTRO_DELAY,
            times: [
              0,
              INTRO_DUR / TOTAL_DUR,
              (INTRO_DUR + TRAVEL_DUR) / TOTAL_DUR,
              1,
            ],
            ease: SMOOTH,
          }}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            translateX: "-50%",
            translateY: "-50%",
          }}
          onMouseEnter={() => setHovered(0)}
          onMouseLeave={() => setHovered(null)}
        >
          <GalleryCard
            src={PRODUCT_GALLERY[0]}
            z={s0.z}
            hovered={hovered === 0}
            onClick={(e) => onImageClick(e, PRODUCT_GALLERY[0])}
          />
        </motion.div>
      )}

      {/* Cards 1-4 — fade in at their arc positions during the sweep */}
      {GALLERY_SLOTS.slice(1).map((slot, idx) => {
        const i = idx + 1;
        return prefersReducedMotion ? (
          <div
            key={i}
            role="presentation"
            className="absolute"
            style={{
              top: `calc(50% + ${slot.y}px)`,
              left: `calc(50% + ${slot.x}px)`,
              transform: `translate(-50%, -50%) rotate(${slot.rotate}deg) scale(${slot.scale})`,
              opacity: 1,
            }}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          >
            <GalleryCard
              src={PRODUCT_GALLERY[i]}
              z={slot.z}
              hovered={hovered === i}
              onClick={(e) => onImageClick(e, PRODUCT_GALLERY[i])}
            />
          </div>
        ) : (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              x: slot.x,
              y: slot.y,
              rotate: slot.rotate,
              scale: slot.scale,
            }}
            transition={{
              opacity: {
                duration: 0.15,
                delay: revealDelays[i],
                ease: "easeOut",
              },
              x: { duration: 0 },
              y: { duration: 0 },
              rotate: { duration: 0 },
              scale: { duration: 0 },
            }}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              translateX: "-50%",
              translateY: "-50%",
            }}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          >
            <GalleryCard
              src={PRODUCT_GALLERY[i]}
              z={slot.z}
              hovered={hovered === i}
              onClick={(e) => onImageClick(e, PRODUCT_GALLERY[i])}
            />
          </motion.div>
        );
      })}
    </div>
  );
}

function MobileGalleryMarquee({
  onImageClick,
}: {
  onImageClick: (e: React.MouseEvent<HTMLButtonElement>, src: string) => void;
}) {
  const prefersReducedMotion = useReducedMotion();
  const galleryItems = prefersReducedMotion
    ? PRODUCT_GALLERY
    : [...PRODUCT_GALLERY, ...PRODUCT_GALLERY];
  return (
    <div className="w-full overflow-hidden flex items-center relative py-2">
      <motion.div
        className="flex gap-3 px-3 w-max"
        animate={prefersReducedMotion ? undefined : { x: ["0%", "-50%"] }}
        transition={
          prefersReducedMotion
            ? undefined
            : {
                repeat: Infinity,
                ease: "linear",
                duration: 25,
              }
        }
      >
        {galleryItems.map((src, idx) => (
          <button
            key={idx}
            type="button"
            onClick={(e) => onImageClick(e, src)}
            className="shrink-0 w-[380px] h-[214px] rounded-xl overflow-hidden shadow-lg ring-1 ring-border/20 relative cursor-pointer border-none p-0 bg-transparent block"
          >
            <img
              src={src}
              alt="Showcase"
              draggable={false}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </motion.div>
      <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
    </div>
  );
}
