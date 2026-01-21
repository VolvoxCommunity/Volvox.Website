"use client";

// Framework
import { useState } from "react";
import Image from "next/image";

// Third-party
import { GithubLogo, ArrowUpRight } from "@phosphor-icons/react";
import { X } from "lucide-react";
import { motion } from "framer-motion";

// Local
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import type { ExtendedProduct } from "@/lib/types";
import { resolveProductImagePath } from "@/lib/image-utils";

interface ProductHeroProps {
  product: ExtendedProduct;
}

/**
 * Hero section for product detail pages.
 * Displays product name, tagline, primary screenshot, and action buttons.
 */
export function ProductHero({ product }: ProductHeroProps) {
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const heroImage = product.screenshots[0];
  const imagePath = resolveProductImagePath(heroImage, product.slug);

  return (
    <section className="py-16 md:py-24 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center md:text-left"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              {product.name}
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8">
              {product.tagline}
            </p>

            {/* Buttons Container */}
            <div className="flex flex-col gap-6 items-center md:items-start">
              {/* App Store Badges */}
              {(product.links.appStore || product.links.playStore) && (
                <div className="flex flex-wrap gap-3 items-center justify-center md:justify-start">
                  {product.links.appStore && (
                    <a
                      href={product.links.appStore}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Download ${product.name} on the App Store`}
                      className="transition-opacity hover:opacity-80"
                    >
                      {/* Light mode: black badge */}
                      <img
                        src="/images/stores/app-store-black.svg"
                        alt="Download on the App Store"
                        width={120}
                        height={40}
                        className="block dark:hidden h-[40px] w-auto"
                      />
                      {/* Dark mode: white badge */}
                      <img
                        src="/images/stores/app-store-white.svg"
                        alt="Download on the App Store"
                        width={120}
                        height={40}
                        className="hidden dark:block h-[40px] w-auto"
                      />
                    </a>
                  )}
                  {product.links.playStore && (
                    <a
                      href={product.links.playStore}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Get ${product.name} on Google Play`}
                      className="transition-opacity hover:opacity-80"
                    >
                      <img
                        src="/images/stores/play-store.svg"
                        alt="Get it on Google Play"
                        width={135}
                        height={40}
                        className="h-[40px] w-auto"
                      />
                    </a>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              {(product.links.demo || product.links.github) && (
                <div className="flex flex-wrap gap-3 items-center justify-center md:justify-start">
                  {product.links.demo && (
                    <Button
                      variant="accent"
                      size="lg"
                      className="gap-2 shadow-lg shadow-accent/20"
                      onClick={() =>
                        window.open(
                          product.links.demo,
                          "_blank",
                          "noopener,noreferrer"
                        )
                      }
                    >
                      Visit
                      <ArrowUpRight weight="bold" className="h-5 w-5" />
                    </Button>
                  )}
                  {product.links.github && (
                    <Button
                      variant="outline"
                      size="lg"
                      className="gap-2"
                      onClick={() =>
                        window.open(
                          product.links.github,
                          "_blank",
                          "noopener,noreferrer"
                        )
                      }
                    >
                      <GithubLogo weight="fill" className="h-5 w-5" />
                      View Source
                    </Button>
                  )}
                </div>
              )}
            </div>
          </motion.div>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative aspect-video md:aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-primary/20 via-accent/15 to-secondary/20"
          >
            {imagePath ? (
              <button
                type="button"
                onClick={() => setIsZoomOpen(true)}
                className="relative w-full h-full cursor-zoom-in"
                aria-label={`Expand image: ${product.name}`}
              >
                <Image
                  src={imagePath}
                  alt={product.name}
                  fill
                  className="object-contain p-4"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              </button>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[120px] font-bold text-foreground/10">
                  {product.name.charAt(0)}
                </span>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Image Zoom Dialog */}
      {imagePath && (
        <Dialog open={isZoomOpen} onOpenChange={setIsZoomOpen}>
          <DialogContent
            className="max-w-7xl w-[95vw] h-[95vh] p-0 bg-background/95 backdrop-blur-lg"
            showCloseButton={false}
            aria-describedby={undefined}
          >
            <DialogTitle className="sr-only">
              {product.name} - Expanded View
            </DialogTitle>
            <button
              type="button"
              onClick={() => setIsZoomOpen(false)}
              className="absolute top-4 right-4 z-50 rounded-full bg-background/80 p-3 border border-border hover:bg-background transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="h-6 w-6" />
            </button>
            <div className="relative flex items-center justify-center w-full h-full p-8">
              <Image
                src={imagePath}
                alt={product.name}
                fill
                className="object-contain"
                sizes="95vw"
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </section>
  );
}
