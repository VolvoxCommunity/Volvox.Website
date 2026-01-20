"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "@phosphor-icons/react";
import type {
  ProductSortOption,
  ViewMode,
} from "@/components/ui/filter-controls";
import type { ExtendedProduct } from "@/lib/types";
import { resolveProductImagePath } from "@/lib/image-utils";
import { ProductsNavbar } from "@/components/products/products-navbar";
import { AnimatedBackground } from "@/components/animated-background";
import { Footer } from "@/components/footer";
import { Navigation } from "@/components/navigation";

interface ProductsListClientProps {
  products: ExtendedProduct[];
}

const STORAGE_KEY = "volvox-products-view";

/**
 * Client component for the products listing page.
 * Handles search, filtering, sorting, and layout switching with URL persistence.
 */
export function ProductsListClient({ products }: ProductsListClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize state from URL params
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [selectedTech, setSelectedTech] = useState<string[]>(() => {
    const tech = searchParams.get("tech");
    return tech ? tech.split(",").filter(Boolean) : [];
  });
  const [sortOption, setSortOption] = useState<ProductSortOption>(() => {
    const sort = searchParams.get("sort");
    return (sort as ProductSortOption) || "a-z";
  });
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    const view = searchParams.get("view");
    if (view === "grid" || view === "list") return view;
    // Check localStorage only on client
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "grid" || stored === "list") return stored;
    }
    return "grid";
  });

  // Extract all unique tech stack items from products
  const allTechStack = useMemo(() => {
    const techSet = new Set<string>();
    products.forEach((product) =>
      product.techStack.forEach((tech) => techSet.add(tech))
    );
    return Array.from(techSet).sort();
  }, [products]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search filter (name, description, tagline)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query) ||
          product.tagline.toLowerCase().includes(query) ||
          product.techStack.some((tech) => tech.toLowerCase().includes(query))
      );
    }

    // Tech stack filter (OR logic)
    if (selectedTech.length > 0) {
      result = result.filter((product) =>
        selectedTech.some((tech) => product.techStack.includes(tech))
      );
    }

    // Sort
    result.sort((a, b) => {
      switch (sortOption) {
        case "a-z":
          return a.name.localeCompare(b.name);
        case "z-a":
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });

    return result;
  }, [products, searchQuery, selectedTech, sortOption]);

  // Update URL params
  const updateUrl = useCallback(
    (params: {
      q?: string;
      tech?: string[];
      sort?: ProductSortOption;
      view?: ViewMode;
    }) => {
      const newParams = new URLSearchParams(searchParams.toString());

      if (params.q !== undefined) {
        if (params.q) newParams.set("q", params.q);
        else newParams.delete("q");
      }

      if (params.tech !== undefined) {
        if (params.tech.length > 0)
          newParams.set("tech", params.tech.join(","));
        else newParams.delete("tech");
      }

      if (params.sort !== undefined) {
        if (params.sort !== "a-z") newParams.set("sort", params.sort);
        else newParams.delete("sort");
      }

      if (params.view !== undefined) {
        if (params.view !== "grid") newParams.set("view", params.view);
        else newParams.delete("view");
      }

      const queryString = newParams.toString();
      router.replace(queryString ? `?${queryString}` : "/products", {
        scroll: false,
      });
    },
    [router, searchParams]
  );

  // Handlers
  // Note: FilterControls handles debouncing internally, so this is called after debounce
  const handleSearchInput = useCallback(
    (value: string) => {
      setSearchQuery(value);
      updateUrl({ q: value });
    },
    [updateUrl]
  );

  const handleTechToggle = useCallback(
    (tech: string) => {
      setSelectedTech((prev) => {
        const newTech = prev.includes(tech)
          ? prev.filter((t) => t !== tech)
          : [...prev, tech];
        updateUrl({ tech: newTech });
        return newTech;
      });
    },
    [updateUrl]
  );

  const handleClearTech = useCallback(() => {
    setSelectedTech([]);
    updateUrl({ tech: [] });
  }, [updateUrl]);

  const handleSortChange = useCallback(
    (value: ProductSortOption) => {
      setSortOption(value);
      updateUrl({ sort: value });
    },
    [updateUrl]
  );

  const handleViewModeChange = useCallback(
    (value: ViewMode) => {
      setViewMode(value);
      localStorage.setItem(STORAGE_KEY, value);
      updateUrl({ view: value });
    },
    [updateUrl]
  );

  const handleClearAll = useCallback(() => {
    setSearchQuery("");
    setSelectedTech([]);
    setSortOption("a-z");
    router.replace("/products", { scroll: false });
  }, [router]);

  const hasActiveFilters =
    searchQuery || selectedTech.length > 0 || sortOption !== "a-z";

  return (
    <div className="min-h-screen relative flex flex-col">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none z-0" aria-hidden="true">
        <AnimatedBackground />
      </div>

      {/* Main Navigation */}
      <Navigation linkMode />

      {/* Content Layer */}
      <div className="relative z-10 flex-1 pt-20">
        {/* Navbar with Search & Filters */}
        <ProductsNavbar
          searchQuery={searchQuery}
          onSearchChange={handleSearchInput}
          selectedTech={selectedTech}
          allTech={allTechStack}
          onTechToggle={handleTechToggle}
          onClearTech={handleClearTech}
          sortOption={sortOption}
          onSortChange={handleSortChange}
          viewMode={viewMode}
          onViewModeChange={handleViewModeChange}
          resultCount={filteredProducts.length}
        />

        <main
          id="main-content"
          className="container mx-auto px-4 max-w-7xl pt-16 pb-8"
          data-testid="products-section"
          aria-labelledby="products-page-heading"
        >
          {/* Page Header */}
          <header className="text-center mb-12">
            <h1
              id="products-page-heading"
              className="text-4xl md:text-6xl font-[family-name:var(--font-jetbrains-mono)] font-bold mb-4"
            >
              Our Products
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Open-source applications built with care, designed to make a real
              difference.
            </p>
          </header>

          {/* Results Count & Clear (Only show if navbar is collapsed or for extra visibility) */}
          {hasActiveFilters && (
            <div className="flex items-center justify-between mb-6 animate-in fade-in duration-300">
              <p className="text-sm text-muted-foreground">
                Showing {filteredProducts.length}{" "}
                {filteredProducts.length === 1 ? "product" : "products"}
              </p>
              <button
                onClick={handleClearAll}
                className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
              >
                Clear all filters
              </button>
            </div>
          )}

          {/* Products Grid/List */}
          <section aria-label="Products list">
            {filteredProducts.length > 0 ? (
              viewMode === "grid" ? (
                <div className="relative z-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both delay-100">
                  {filteredProducts.map((product, idx) => (
                    <ProductCardGrid
                      key={product.id}
                      product={product}
                      index={idx}
                    />
                  ))}
                </div>
              ) : (
                <div className="relative z-0 flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both delay-100">
                  {filteredProducts.map((product, idx) => (
                    <ProductCardList
                      key={product.id}
                      product={product}
                      index={idx}
                    />
                  ))}
                </div>
              )
            ) : (
              <div className="text-center py-24 bg-muted/20 rounded-[2rem] border border-dashed border-border animate-in zoom-in-95 duration-300">
                <p className="text-lg font-medium mb-2">No products found</p>
                <p className="text-muted-foreground mb-6 text-sm">
                  Try adjusting your search or filters to find what you&apos;re
                  looking for.
                </p>
                <Button
                  onClick={handleClearAll}
                  variant="outline"
                  className="rounded-full"
                >
                  Clear all filters
                </Button>
              </div>
            )}
          </section>
        </main>
      </div>

      {/* Footer */}
      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}

/**
 * Grid view card component for products.
 */
function ProductCardGrid({
  product,
  index,
}: {
  product: ExtendedProduct;
  index: number;
}) {
  const heroImage = product.screenshots[0];
  const imagePath = resolveProductImagePath(heroImage, product.slug);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover="hover"
      className="group h-full"
    >
      <Link
        href={`/products/${product.slug}`}
        className="block h-full outline-none"
      >
        <div className="h-full bg-card backdrop-blur-sm rounded-[2rem] p-4 transition-all duration-300 border border-border/40 hover:border-border/80 shadow-sm hover:shadow-xl hover:shadow-primary/5 flex flex-col">
          {/* Image Container */}
          <div className="relative overflow-hidden bg-muted/50 mb-4 aspect-[4/3] w-full rounded-lg md:rounded-[2rem] group-hover:rounded-lg transition-[border-radius] duration-500">
            <div className="w-full h-full relative overflow-hidden">
              {imagePath ? (
                <motion.div
                  className="w-full h-full"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.6 }}
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
                  <span className="text-6xl font-bold text-muted-foreground/10 select-none">
                    {product.name.charAt(0)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="px-1 flex flex-col flex-1">
            {/* Title with Arrow */}
            <div className="flex justify-between items-start gap-4 mb-2">
              <div>
                <h3 className="text-xl font-bold leading-tight text-foreground group-hover:text-primary transition-colors line-clamp-1">
                  {product.name}
                </h3>
                <p className="text-xs font-medium text-muted-foreground mt-1 line-clamp-1">
                  {product.tagline}
                </p>
              </div>
              <div className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300 flex-shrink-0 mt-1">
                <ArrowUpRight weight="bold" className="w-5 h-5" />
              </div>
            </div>

            <p className="text-muted-foreground/80 text-sm line-clamp-2 leading-relaxed mb-4 flex-1">
              {product.description}
            </p>

            {/* Tech Stack Pills */}
            <div className="flex flex-wrap gap-1.5 mt-auto">
              {product.techStack.slice(0, 3).map((tech) => (
                <span
                  key={`${product.slug}:tech:${tech}`}
                  className="inline-flex items-center px-2 py-0.5 rounded-lg bg-secondary/10 text-secondary-foreground text-[10px] font-medium border border-transparent group-hover:border-secondary/20 transition-colors"
                >
                  {tech}
                </span>
              ))}
              {product.techStack.length > 3 && (
                <span className="text-[10px] text-muted-foreground py-0.5 px-1">
                  +{product.techStack.length - 3}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

/**
 * List view card component for products.
 */
function ProductCardList({
  product,
  index,
}: {
  product: ExtendedProduct;
  index: number;
}) {
  const heroImage = product.screenshots[0];
  const imagePath = resolveProductImagePath(heroImage, product.slug);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover="hover"
      className="group"
    >
      <Link href={`/products/${product.slug}`} className="block outline-none">
        <div className="bg-card backdrop-blur-sm rounded-[2rem] p-4 transition-all duration-300 border border-border/40 hover:border-border/80 shadow-sm hover:shadow-xl hover:shadow-primary/5 flex flex-col md:flex-row gap-6 items-center">
          {/* Image Container */}
          <div className="relative overflow-hidden bg-muted/50 w-full md:w-72 aspect-video md:aspect-[4/3] flex-shrink-0 rounded-lg md:rounded-[2rem] group-hover:rounded-lg transition-[border-radius] duration-500">
            <div className="w-full h-full relative overflow-hidden">
              {imagePath ? (
                <motion.div
                  className="w-full h-full"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.6 }}
                >
                  <Image
                    src={imagePath}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 300px"
                    className="object-cover"
                  />
                </motion.div>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-secondary/5">
                  <span className="text-6xl font-bold text-muted-foreground/10 select-none">
                    {product.name.charAt(0)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-col flex-1 w-full text-left">
            <div className="flex justify-between items-start gap-4 mb-2">
              <div>
                <h3 className="text-2xl font-bold leading-tight text-foreground group-hover:text-primary transition-colors">
                  {product.name}
                </h3>
                <p className="text-sm font-medium text-muted-foreground mt-1">
                  {product.tagline}
                </p>
              </div>
              <div className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300 flex-shrink-0 mt-1">
                <ArrowUpRight weight="bold" className="w-6 h-6" />
              </div>
            </div>

            <p className="text-muted-foreground/80 text-base line-clamp-2 leading-relaxed mb-6">
              {product.description}
            </p>

            {/* Tech Stack & Features */}
            <div className="flex flex-wrap items-center justify-between gap-4 mt-auto">
              <div className="flex flex-wrap gap-2">
                {product.techStack.map((tech) => (
                  <span
                    key={`${product.slug}:tech:${tech}`}
                    className="inline-flex items-center px-2.5 py-1 rounded-lg bg-secondary/10 text-secondary-foreground text-xs font-medium"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
