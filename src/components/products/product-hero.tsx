"use client";

// Framework
import Image from "next/image";

// Third-party
import {
  GithubLogo,
  ArrowUpRight,
  AppleLogo,
  GooglePlayLogo,
} from "@phosphor-icons/react";
import { motion } from "framer-motion";

// Local
import { Button } from "@/components/ui/button";
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
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              {product.name}
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8">
              {product.tagline}
            </p>

            {/* Buttons Container */}
            <div className="grid grid-cols-2 gap-3 max-w-md">
              {/* App Store Badges */}
              {product.links.appStore && (
                <a
                  href={product.links.appStore}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Download ${product.name} on the App Store`}
                  className="inline-flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-black/80 transition-colors"
                >
                  <AppleLogo weight="fill" className="h-6 w-6" />
                  <div className="text-left">
                    <div className="text-xs leading-none">Download on the</div>
                    <div className="text-sm font-semibold">App Store</div>
                  </div>
                </a>
              )}
              {product.links.playStore && (
                <a
                  href={product.links.playStore}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Get ${product.name} on Google Play`}
                  className="inline-flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-black/80 transition-colors"
                >
                  <GooglePlayLogo weight="fill" className="h-6 w-6" />
                  <div className="text-left">
                    <div className="text-xs leading-none">Get it on</div>
                    <div className="text-sm font-semibold">Google Play</div>
                  </div>
                </a>
              )}

              {/* Action Buttons */}
              {product.links.demo && (
                <Button
                  variant="accent"
                  size="lg"
                  asChild
                  className="gap-2 shadow-lg shadow-accent/20"
                >
                  <a
                    href={product.links.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Try Demo
                    <ArrowUpRight weight="bold" className="h-5 w-5" />
                  </a>
                </Button>
              )}
              {product.links.github && (
                <Button variant="outline" size="lg" asChild className="gap-2">
                  <a
                    href={product.links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <GithubLogo weight="fill" className="h-5 w-5" />
                    View Source
                  </a>
                </Button>
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
              <Image
                src={imagePath}
                alt={product.name}
                fill
                className="object-contain p-4"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
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
    </section>
  );
}
