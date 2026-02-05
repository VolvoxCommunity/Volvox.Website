"use client";

// Framework
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

// Third-party
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

// Local
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { resolveProductImagePath } from "@/lib/image-utils";
import { cn } from "@/lib/utils";

interface ProductScreenshotsProps {
  slug: string;
  screenshots: string[];
  productName: string;
}

const AUTO_ROTATE_INTERVAL = 5000; // 5 seconds

/**
 * Screenshot carousel with auto-rotation and lightbox functionality.
 */
export function ProductScreenshots({
  slug,
  screenshots,
  productName,
}: ProductScreenshotsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState(0);

  const galleryImages = screenshots;

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % galleryImages.length);
  }, [galleryImages.length]);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrentIndex(
      (prev) => (prev - 1 + galleryImages.length) % galleryImages.length
    );
  }, [galleryImages.length]);

  const goToSlide = useCallback(
    (index: number) => {
      setDirection(index > currentIndex ? 1 : -1);
      setCurrentIndex(index);
    },
    [currentIndex]
  );

  // Auto-rotation
  useEffect(() => {
    if (isPaused || galleryImages.length <= 1) return;

    const interval = setInterval(nextSlide, AUTO_ROTATE_INTERVAL);
    return () => clearInterval(interval);
  }, [isPaused, nextSlide, galleryImages.length]);

  if (galleryImages.length === 0) {
    return null;
  }

  const currentImage = resolveProductImagePath(
    galleryImages[currentIndex],
    slug
  );

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  return (
    <section id="screenshots" className="py-16 px-4 scroll-mt-32">
      <div className="container mx-auto max-w-4xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-8">Screenshots</h2>

        {/* Carousel Container */}
        <div
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Main Carousel */}
          <div className="relative aspect-[16/10] rounded-2xl overflow-hidden">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              {currentImage && (
                <motion.button
                  key={currentIndex}
                  type="button"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 },
                  }}
                  onClick={() => setSelectedImage(currentImage)}
                  className="absolute inset-0 cursor-zoom-in"
                  aria-label={`View ${productName} screenshot ${currentIndex + 1} fullscreen`}
                >
                  <Image
                    src={currentImage}
                    alt={`${productName} screenshot ${currentIndex + 1}`}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, 896px"
                    priority={currentIndex === 0}
                  />
                </motion.button>
              )}
            </AnimatePresence>

            {/* Navigation Arrows */}
            {galleryImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    prevSlide();
                  }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-background/80 backdrop-blur-sm border border-border/50 hover:bg-background hover:border-border transition-colors"
                  aria-label="Previous screenshot"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    nextSlide();
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-background/80 backdrop-blur-sm border border-border/50 hover:bg-background hover:border-border transition-colors"
                  aria-label="Next screenshot"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}

            {/* Progress Bar - inside carousel */}
            {galleryImages.length > 1 && !isPaused && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-border/50 overflow-hidden z-10">
                <motion.div
                  key={currentIndex}
                  className="h-full bg-primary"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{
                    duration: AUTO_ROTATE_INTERVAL / 1000,
                    ease: "linear",
                  }}
                />
              </div>
            )}
          </div>

          {/* Dot Indicators */}
          {galleryImages.length > 1 && (
            <div className="flex justify-center gap-2 mt-4">
              {galleryImages.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => goToSlide(idx)}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all duration-300",
                    idx === currentIndex
                      ? "bg-primary w-6"
                      : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                  )}
                  aria-label={`Go to screenshot ${idx + 1}`}
                  aria-current={idx === currentIndex ? "true" : undefined}
                />
              ))}
            </div>
          )}
        </div>

        {/* Thumbnail Strip */}
        {galleryImages.length > 1 && (
          <div className="flex gap-2 mt-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
            {galleryImages.map((screenshot, idx) => {
              const thumbPath = resolveProductImagePath(screenshot, slug);
              if (!thumbPath) return null;
              return (
                <button
                  key={screenshot}
                  type="button"
                  onClick={() => goToSlide(idx)}
                  className={cn(
                    "relative flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all duration-200",
                    idx === currentIndex
                      ? "border-primary ring-2 ring-primary/20"
                      : "border-transparent hover:border-border opacity-60 hover:opacity-100"
                  )}
                  aria-label={`View screenshot ${idx + 1}`}
                  aria-current={idx === currentIndex ? "true" : undefined}
                >
                  <Image
                    src={thumbPath}
                    alt={`${productName} thumbnail ${idx + 1}`}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </button>
              );
            })}
          </div>
        )}

        {/* Lightbox */}
        <Dialog
          open={!!selectedImage}
          onOpenChange={() => setSelectedImage(null)}
        >
          <DialogContent
            className="max-w-[90vw] max-h-[90vh] w-auto h-auto p-0 bg-transparent border-none"
            showCloseButton={false}
          >
            <VisuallyHidden>
              <DialogTitle>Screenshot Preview</DialogTitle>
              <DialogDescription>
                Full size screenshot of {productName}
              </DialogDescription>
            </VisuallyHidden>
            <button
              type="button"
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              aria-label="Close"
            >
              <X className="h-6 w-6 text-white" />
            </button>
            {selectedImage && (
              <div className="relative flex items-center justify-center">
                <Image
                  src={selectedImage}
                  alt="Screenshot preview"
                  width={800}
                  height={1200}
                  className="max-h-[85vh] w-auto h-auto object-contain rounded-lg"
                  sizes="90vw"
                  priority
                />
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}
