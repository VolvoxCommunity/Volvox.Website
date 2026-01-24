"use client";

import { useMemo, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  ArrowUpRight,
  ArrowRight,
  Globe,
  Tag,
} from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { ExtendedProduct } from "@/lib/types";
import { resolveProductImagePath } from "@/lib/image-utils";
import Image from "next/image";
import Link from "next/link";
import {
  FilterControls,
  type ProductSortOption,
  type ViewMode,
} from "@/components/ui/filter-controls";

gsap.registerPlugin(ScrollTrigger);

interface ProductsProps {
  products: ExtendedProduct[];
  searchQuery?: string;
  onSearchChange?: (value: string) => void;
  sortOption?: ProductSortOption;
  onSortChange?: (
    value: ProductSortOption | "newest" | "oldest" | "views"
  ) => void;
  viewMode?: ViewMode;
  onViewModeChange?: (value: ViewMode) => void;
  enableFilters?: boolean;
}

interface ProductCardProps {
  product: ExtendedProduct;
}

function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const cardRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  const heroImage = product.screenshots[0];
  const imagePath = resolveProductImagePath(heroImage, product.slug);

  useEffect(() => {
    // Scroll reveal for the card
    gsap.fromTo(
      cardRef.current,
      {
        y: 100,
        opacity: 0,
        scale: 0.95,
        filter: "blur(10px)",
      },
      {
        scrollTrigger: {
          trigger: cardRef.current,
          start: "top 90%",
          end: "top 60%",
          scrub: 1,
        },
        y: 0,
        opacity: 1,
        scale: 1,
        filter: "blur(0px)",
        ease: "power2.out",
      }
    );

    // Parallax effect for the image
    gsap.to(imageRef.current, {
      scrollTrigger: {
        trigger: cardRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
      y: -30,
      ease: "none",
    });
  }, []);

  return (
    <div ref={cardRef} className="group relative">
      <div className="relative h-full bg-card/60 backdrop-blur-xl rounded-[2.5rem] border border-border/40 p-3 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:border-primary/30">
        <div className="flex flex-col lg:flex-row h-full gap-6">
          {/* Image Sidebar */}
          <div className="relative w-full lg:w-[45%] aspect-[16/10] lg:aspect-auto min-h-[350px] rounded-[2.2rem] overflow-hidden bg-muted/30">
            <Link
              href={`/products/${product.slug}`}
              className="block h-full relative cursor-pointer group/image"
            >
              <div
                ref={imageRef}
                className="absolute inset-0 w-full h-[120%] -top-[10%]"
              >
                {imagePath ? (
                  <Image
                    src={imagePath}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-1000 group-hover/image:scale-110"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10">
                    <span className="text-8xl font-bold text-foreground/5">
                      {product.name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>

              {/* Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/image:opacity-100 transition-opacity duration-500" />

              {/* Floating Badge */}
              <div className="absolute top-6 left-6 z-10">
                <Badge
                  variant="secondary"
                  className="bg-background/90 backdrop-blur-md border-border/50 text-[10px] uppercase tracking-widest font-black py-1.5 px-3"
                >
                  {product.type || "Software"}
                </Badge>
              </div>

              {/* View Indicator */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/image:opacity-100 transition-all duration-500 transform translate-y-4 group-hover/image:translate-y-0">
                <div className="bg-background/20 backdrop-blur-sm border border-white/20 rounded-full px-6 py-2 text-white font-bold text-sm tracking-wide">
                  Explore Project
                </div>
              </div>
            </Link>
          </div>

          {/* Content Area */}
          <div className="flex-1 flex flex-col p-4 md:p-6 lg:py-10 lg:pr-10">
            <div className="flex justify-between items-start mb-6">
              <div>
                <Link
                  href={`/products/${product.slug}`}
                  className="inline-block group/title"
                >
                  <h3 className="text-4xl md:text-5xl font-black tracking-tighter text-foreground group-hover/title:text-primary transition-colors duration-300">
                    {product.name}
                  </h3>
                </Link>
                <div className="flex items-center gap-2 mt-2">
                  <div className="h-1 w-8 bg-primary rounded-full" />
                  <p className="text-primary/90 font-bold text-sm md:text-md tracking-tight uppercase">
                    {product.tagline}
                  </p>
                </div>
              </div>
              <motion.div
                whileHover={{ rotate: 45, scale: 1.2 }}
                className="p-3 rounded-full bg-primary/10 text-primary border border-primary/20"
              >
                <ArrowUpRight weight="bold" className="w-6 h-6" />
              </motion.div>
            </div>

            <p className="text-muted-foreground leading-relaxed mb-10 text-lg line-clamp-3">
              {product.description}
            </p>

            {/* Features Preview - Custom Trance Hover */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10">
              {product.features.slice(0, 4).map((feature, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * idx }}
                  className="flex items-center gap-3 text-sm font-medium text-foreground/70 hover:text-primary transition-colors group/feat"
                >
                  <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover/feat:bg-primary group-hover/feat:scale-110 transition-all">
                    <CheckCircle
                      weight="fill"
                      className="w-4 h-4 text-primary group-hover/feat:text-white"
                    />
                  </div>
                  <span className="truncate">{feature}</span>
                </motion.div>
              ))}
            </div>

            <div className="mt-auto flex flex-col md:flex-row items-center gap-6 pt-8 border-t border-border/20">
              {/* Tech Stack */}
              <div className="flex flex-wrap gap-2 flex-1 w-full">
                {product.techStack?.slice(0, 4).map((tech) => (
                  <Badge
                    key={tech}
                    variant="outline"
                    className="rounded-xl px-3 py-1.5 text-[11px] font-bold bg-secondary/5 border-secondary/20 text-secondary-foreground hover:bg-secondary/10 transition-colors"
                  >
                    {tech}
                  </Badge>
                ))}
                {(product.techStack?.length || 0) > 4 && (
                  <div className="text-[11px] text-muted-foreground font-bold flex items-center ml-1">
                    +{(product.techStack?.length || 0) - 4} MORE
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-4 w-full md:w-auto">
                <Button
                  variant="ghost"
                  className="rounded-full px-8 h-12 font-black text-xs uppercase tracking-widest border border-border hover:bg-muted"
                  onClick={() => router.push(`/products/${product.slug}`)}
                >
                  Overview
                </Button>
                {product.links?.demo && (
                  <Button
                    variant="default"
                    className="rounded-full px-8 h-12 font-black text-xs uppercase tracking-widest gap-2 shadow-[0_15px_30px_-5px_oklch(from_var(--primary)_l_c_h_/_0.3)] hover:scale-105 active:scale-95 transition-all"
                    onClick={() =>
                      window.open(
                        product.links.demo,
                        "_blank",
                        "noopener,noreferrer"
                      )
                    }
                  >
                    Launch <Globe weight="bold" className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Products({
  products: allProducts,
  searchQuery = "",
  onSearchChange,
  sortOption = "a-z",
  onSortChange,
  viewMode = "grid",
  onViewModeChange,
  enableFilters = false,
  limit = 3,
}: ProductsProps & { limit?: number }) {
  const router = useRouter();
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const glow1Ref = useRef<HTMLDivElement>(null);
  const glow2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

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

    // Header reveal
    gsap.fromTo(
      headerRef.current,
      { y: 50, opacity: 0, filter: "blur(20px)" },
      {
        scrollTrigger: {
          trigger: headerRef.current,
          start: "top 90%",
          end: "top 60%",
          scrub: 1,
        },
        y: 0,
        opacity: 1,
        filter: "blur(0px)",
        ease: "power3.out",
      }
    );
  }, []);

  const filteredProducts = useMemo(() => {
    // First sort by updatedAt (latest first) to get "latest"
    let result = [...allProducts].sort((a, b) => {
      const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
      const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
      return dateB - dateA;
    });

    // Apply limit if provided (for homepage)
    if (limit) {
      result = result.slice(0, limit);
    }

    // Then apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query) ||
          product.tagline.toLowerCase().includes(query) ||
          product.techStack?.some((tech) => tech.toLowerCase().includes(query))
      );
    }

    // Finally apply explicit sort option
    if (sortOption === "z-a") {
      result.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sortOption === "a-z") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [allProducts, searchQuery, sortOption, limit]);

  if (allProducts.length === 0) return null;

  return (
    <section
      ref={sectionRef}
      id="products"
      className="py-32 md:py-48 px-4 relative overflow-hidden bg-background"
      data-testid="products-section"
    >
      {/* Dynamic Trance Backgrounds */}
      <div
        ref={glow1Ref}
        className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-primary/10 blur-[150px] rounded-full -z-10 mix-blend-soft-light"
      />
      <div
        ref={glow2Ref}
        className="absolute bottom-1/4 right-0 w-[600px] h-[600px] bg-secondary/10 blur-[180px] rounded-full -z-10 mix-blend-soft-light"
      />
      <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.03] pointer-events-none -z-10" />

      <div className="container mx-auto max-w-7xl">
        <div
          ref={headerRef}
          className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-10"
        >
          <div className="max-w-3xl">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-primary/5 text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-6 border border-primary/10 backdrop-blur-sm"
            >
              <Tag weight="bold" className="w-3.5 h-3.5" />
              Innovation Pipeline
            </motion.div>
            <h2 className="text-6xl md:text-8xl font-black tracking-tighter text-foreground mb-8 leading-[0.9]">
              Crafting Digital <br />
              <span className="text-primary italic">Excellence.</span>
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-2xl">
              We engineer scalable, high-impact solutions that redefine the
              boundaries of modern technology.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest text-center md:text-right mb-2">
              Explore Our Full Catalog
            </p>
            <Button
              variant="outline"
              size="lg"
              className="rounded-full h-16 px-10 border-foreground/10 hover:border-primary/50 hover:bg-primary/5 transition-all group overflow-hidden relative"
              onClick={() => router.push("/products")}
            >
              <span className="relative z-10 font-black text-sm uppercase tracking-widest flex items-center">
                Marketplace
                <ArrowRight
                  weight="bold"
                  className="ml-3 w-5 h-5 group-hover:translate-x-2 transition-transform duration-500"
                />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </Button>
          </div>
        </div>

        {/* Filter Controls */}
        {enableFilters &&
          onSearchChange &&
          onSortChange &&
          onViewModeChange && (
            <div className="mb-16">
              <FilterControls
                variant="homepage-product"
                searchQuery={searchQuery}
                onSearchChange={onSearchChange}
                sortOption={sortOption}
                onSortChange={onSortChange}
                viewMode={viewMode}
                onViewModeChange={onViewModeChange}
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
            <div className="space-y-20 md:space-y-32">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </AnimatePresence>

        {/* Footer CTA */}
        <div className="mt-32 p-12 md:p-20 rounded-[4rem] bg-gradient-to-br from-primary/5 via-background to-secondary/5 border border-primary/10 flex flex-col items-center text-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] rounded-full -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          <h3 className="text-3xl md:text-5xl font-black tracking-tight mb-6">
            Want to see more?
          </h3>
          <p className="text-muted-foreground text-lg mb-10 max-w-xl">
            Our ecosystem is constantly evolving. Visit the products page for
            detailed documentation and open-source contributions.
          </p>
          <Button
            variant="default"
            size="lg"
            className="rounded-full h-14 px-12 font-bold text-sm tracking-widest uppercase hover:scale-105 transition-transform"
            onClick={() => router.push("/products")}
          >
            All Products
          </Button>
        </div>
      </div>
    </section>
  );
}
