"use client";

import { ArrowRight, ArrowUpRight } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";
import { type JSX, useEffect, useMemo, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  type BlogSortOption,
  FilterControls,
  type ProductSortOption,
} from "@/components/ui/filter-controls";
import { resolveProductImagePath } from "@/lib/image-utils";
import { sortProductsByNewest } from "@/lib/product-sorting";
import type { ExtendedProduct } from "@/lib/types";

gsap.registerPlugin(ScrollTrigger);

interface ProductsProps {
  products: ExtendedProduct[];
  searchQuery?: string;
  onSearchChange?: (value: string) => void;
  sortOption?: ProductSortOption;
  onSortChange?: (value: ProductSortOption | BlogSortOption) => void;
  enableFilters?: boolean;
  /** Maximum number of products to display (defaults to 3 on homepage) */
  limit?: number;
}

interface ProductCardProps {
  product: ExtendedProduct;
}

function ProductCard({ product }: ProductCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const heroImage = product.screenshots[0];
  const imagePath = resolveProductImagePath(heroImage, product.slug);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Scroll reveal for the card
      gsap.fromTo(
        cardRef.current,
        {
          y: 40,
          opacity: 0,
          filter: "blur(8px)",
        },
        {
          scrollTrigger: {
            trigger: cardRef.current,
            start: "top 90%",
            once: true,
          },
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 0.7,
          ease: "power3.out",
        },
      );
    });

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <div ref={cardRef} className="group h-full">
      <Link
        href={`/products/${product.slug}`}
        className="block h-full outline-none"
      >
        {/* Double-Bezel Card Container */}
        <div className="h-full rounded-[2rem] bg-card-deep/20 border border-border/30 p-1.5 transition-all duration-300 hover:border-border/60 hover:shadow-2xl hover:shadow-primary/5">
          <div className="w-full h-full rounded-[calc(2rem-0.375rem)] bg-card border border-border/10 p-3 flex flex-col shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
            {/* Image Container with Overlaid Pills */}
            <div className="relative overflow-hidden bg-muted/30 mb-3 rounded-2xl aspect-[16/10] w-full shrink-0">
              <div className="w-full h-full relative overflow-hidden">
                {imagePath ? (
                  <motion.div
                    className="w-full h-full relative"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
                  >
                    <Image
                      src={imagePath}
                      alt={product.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover"
                    />
                  </motion.div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-secondary/5">
                    <span className="text-6xl font-editorial font-medium text-muted-foreground/10 select-none">
                      {product.name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>

              {/* Bottom-left: Product Type Pill */}
              <div className="absolute bottom-2.5 left-2.5 z-10">
                <div className="rounded-full bg-background/90 backdrop-blur-md border border-border/40 px-2.5 py-1 text-[9px] font-mono font-bold uppercase tracking-wider text-foreground shadow-sm">
                  {product.type || "Software"}
                </div>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex flex-col flex-1 min-w-0 px-1 py-1">
              {/* Single line title with Arrow */}
              <div className="flex justify-between items-center gap-2 mb-1">
                <h3 className="text-base font-bold tracking-tight text-foreground group-hover:text-primary transition-colors truncate">
                  {product.name}
                </h3>
                <div className="text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300 flex-shrink-0">
                  <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={2.5} />
                </div>
              </div>

              {/* Subtitle / Tagline */}
              {product.tagline && (
                <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-primary/70 mb-1.5 truncate">
                  {product.tagline}
                </p>
              )}

              {/* Description */}
              <p className="text-muted-foreground text-xs leading-relaxed text-pretty line-clamp-2">
                {product.description}
              </p>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

export function Products({
  products: allProducts,
  searchQuery = "",
  onSearchChange,
  sortOption = "newest",
  onSortChange,
  enableFilters = false,
  limit = 3,
}: ProductsProps): JSX.Element | null {
  const sectionRef = useRef<HTMLElement>(null);
  const glow1Ref = useRef<HTMLDivElement>(null);
  const glow2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Trance Background Animation
      gsap.to(glow1Ref.current, {
        x: "30%",
        y: "20%",
        duration: 15,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
      gsap.to(glow2Ref.current, {
        x: "-20%",
        y: "-30%",
        duration: 20,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, []);

  const filteredProducts = useMemo(() => {
    let result = [...allProducts].sort(sortProductsByNewest);

    if (limit && !enableFilters && !searchQuery) {
      result = result.slice(0, limit);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query) ||
          product.tagline?.toLowerCase().includes(query) ||
          product.techStack?.some((tech) => tech.toLowerCase().includes(query)),
      );
    }

    if (enableFilters) {
      if (sortOption === "z-a") {
        result.sort((a, b) => b.name.localeCompare(a.name));
      } else if (sortOption === "a-z") {
        result.sort((a, b) => a.name.localeCompare(b.name));
      }
    }

    return result;
  }, [allProducts, searchQuery, sortOption, limit, enableFilters]);

  if (allProducts.length === 0) return null;

  return (
    <section
      ref={sectionRef}
      id="products"
      className="py-24 md:py-32 px-4 relative overflow-hidden bg-background"
      data-testid="products-section"
    >
      {/* Dynamic Trance Backgrounds */}
      <div
        ref={glow1Ref}
        className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-primary/10 blur-[150px] rounded-full -z-10 mix-blend-soft-light pointer-events-none"
      />
      <div
        ref={glow2Ref}
        className="absolute bottom-1/4 right-0 w-[600px] h-[600px] bg-secondary/10 blur-[180px] rounded-full -z-10 mix-blend-soft-light pointer-events-none"
      />
      <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.03] pointer-events-none -z-10" />

      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 md:mb-16 gap-6">
          <h2 className="text-4xl md:text-5xl font-editorial italic font-medium tracking-tight text-foreground text-balance leading-tight">
            Our Products
          </h2>

          {!enableFilters && (
            <Button variant="ghost" asChild className="group">
              <Link href="/products">
                View Products
                <ArrowRight
                  className="w-4 h-4 group-hover:translate-x-0.5 transition-transform ml-1"
                  weight="bold"
                />
              </Link>
            </Button>
          )}
        </div>

        {/* Filter Controls (for product catalog page) */}
        {enableFilters && onSearchChange && onSortChange && (
          <div className="mb-16">
            <FilterControls
              variant="homepage-product"
              searchQuery={searchQuery}
              onSearchChange={onSearchChange}
              sortOption={sortOption}
              onSortChange={onSortChange}
              searchPlaceholder="Search innovation..."
              resultCount={filteredProducts.length}
              totalCount={allProducts.length}
            />
          </div>
        )}

        {/* Products Grid */}
        <AnimatePresence mode="wait">
          {filteredProducts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-32 bg-muted/10 rounded-[3rem] border border-dashed border-border/40"
            >
              <p className="text-muted-foreground text-xl font-medium">
                No projects match your current exploration.
              </p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
