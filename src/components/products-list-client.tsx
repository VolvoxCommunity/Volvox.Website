"use client";

import { ArrowUpRight } from "@phosphor-icons/react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { Footer } from "@/components/footer";
import { ProductsNavbar } from "@/components/products/products-navbar";
import { Button } from "@/components/ui/button";
import type { ProductSortOption } from "@/components/ui/filter-controls";
import { resolveProductImagePath } from "@/lib/image-utils";
import { sortProductsByNewest } from "@/lib/product-sorting";
import type { ExtendedProduct } from "@/lib/types";

interface ProductsListClientProps {
  products: ExtendedProduct[];
}

interface ProductSearchParams {
  get(name: string): string | null;
}

interface ProductFilterOptions {
  products: ExtendedProduct[];
  searchQuery: string;
  selectedTech: string[];
  sortOption: ProductSortOption;
}

const DEFAULT_PRODUCT_SORT_OPTION: ProductSortOption = "newest";
const PRODUCT_SORT_OPTIONS: readonly ProductSortOption[] = [
  "newest",
  "a-z",
  "z-a",
];

function isProductSortOption(value: string | null): value is ProductSortOption {
  return PRODUCT_SORT_OPTIONS.includes(value as ProductSortOption);
}

function getInitialSelectedTech(searchParams: ProductSearchParams): string[] {
  const tech = searchParams.get("tech");
  return tech ? tech.split(",").filter(Boolean) : [];
}

function getInitialSortOption(
  searchParams: ProductSearchParams,
): ProductSortOption {
  const sort = searchParams.get("sort");
  return isProductSortOption(sort) ? sort : DEFAULT_PRODUCT_SORT_OPTION;
}

function getAvailableTechStack(products: ExtendedProduct[]): string[] {
  const techSet = new Set<string>();
  products.forEach((product) => {
    product.techStack.forEach((tech) => {
      techSet.add(tech);
    });
  });
  return Array.from(techSet).sort();
}

function productMatchesSearch(
  product: ExtendedProduct,
  normalizedSearchQuery: string,
): boolean {
  if (!normalizedSearchQuery) return true;

  return (
    product.name.toLowerCase().includes(normalizedSearchQuery) ||
    product.description.toLowerCase().includes(normalizedSearchQuery) ||
    product.tagline.toLowerCase().includes(normalizedSearchQuery) ||
    product.techStack.some((tech) =>
      tech.toLowerCase().includes(normalizedSearchQuery),
    )
  );
}

function productMatchesSelectedTech(
  product: ExtendedProduct,
  selectedTech: string[],
): boolean {
  if (selectedTech.length === 0) return true;
  return selectedTech.some((tech) => product.techStack.includes(tech));
}

function sortProducts(
  productA: ExtendedProduct,
  productB: ExtendedProduct,
  sortOption: ProductSortOption,
): number {
  if (sortOption === "newest") {
    return sortProductsByNewest(productA, productB);
  }

  if (sortOption === "z-a") {
    return productB.name.localeCompare(productA.name);
  }

  return productA.name.localeCompare(productB.name);
}

function getFilteredProducts({
  products,
  searchQuery,
  selectedTech,
  sortOption,
}: ProductFilterOptions): ExtendedProduct[] {
  const normalizedSearchQuery = searchQuery.toLowerCase();

  return products
    .filter((product) => productMatchesSearch(product, normalizedSearchQuery))
    .filter((product) => productMatchesSelectedTech(product, selectedTech))
    .sort((productA, productB) => sortProducts(productA, productB, sortOption));
}

/**
 * Client component for the products listing page.
 * Handles search, filtering, sorting, and layout switching with URL persistence.
 */
export function ProductsListClient({ products }: ProductsListClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize state from URL params
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [selectedTech, setSelectedTech] = useState<string[]>(() =>
    getInitialSelectedTech(searchParams),
  );
  const [sortOption, setSortOption] = useState<ProductSortOption>(() =>
    getInitialSortOption(searchParams),
  );

  const allTechStack = useMemo(
    () => getAvailableTechStack(products),
    [products],
  );

  // Filter and sort products
  const filteredProducts = useMemo(
    () =>
      getFilteredProducts({
        products,
        searchQuery,
        selectedTech,
        sortOption,
      }),
    [products, searchQuery, selectedTech, sortOption],
  );

  // Update URL params
  const updateUrl = useCallback(
    (params: { q?: string; tech?: string[]; sort?: ProductSortOption }) => {
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
        if (params.sort !== DEFAULT_PRODUCT_SORT_OPTION)
          newParams.set("sort", params.sort);
        else newParams.delete("sort");
      }

      const queryString = newParams.toString();
      router.replace(queryString ? `?${queryString}` : "/products", {
        scroll: false,
      });
    },
    [router, searchParams],
  );

  // Handlers
  const handleSearchChange = useCallback(
    (query: string) => {
      setSearchQuery(query);
      updateUrl({ q: query });
    },
    [updateUrl],
  );

  const handleSortChange = useCallback(
    (sort: ProductSortOption) => {
      setSortOption(sort);
      updateUrl({ sort });
    },
    [updateUrl],
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
    [updateUrl],
  );

  const handleClearTech = useCallback(() => {
    setSelectedTech([]);
    updateUrl({ tech: [] });
  }, [updateUrl]);

  const handleClearAll = useCallback(() => {
    setSearchQuery("");
    setSelectedTech([]);
    setSortOption(DEFAULT_PRODUCT_SORT_OPTION);
    router.replace("/products", { scroll: false });
  }, [router]);

  const hasActiveFilters =
    searchQuery ||
    selectedTech.length > 0 ||
    sortOption !== DEFAULT_PRODUCT_SORT_OPTION;

  return (
    <div className="min-h-screen relative flex flex-col">
      {/* Content Layer */}
      <div className="relative z-10 flex-1">
        {/* Navbar with Search & Filters */}
        <ProductsNavbar
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          selectedTech={selectedTech}
          allTech={allTechStack}
          onTechToggle={handleTechToggle}
          onClearTech={handleClearTech}
          sortOption={sortOption}
          onSortChange={handleSortChange}
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
              className="text-5xl md:text-7xl font-editorial italic font-medium mb-4 text-balance"
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
                type="button"
                onClick={handleClearAll}
                className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
              >
                Clear all filters
              </button>
            </div>
          )}

          {/* Products Grid */}
          <section aria-label="Products list">
            {filteredProducts.length > 0 ? (
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
              <div className="text-center py-24 bg-muted/20 rounded-[2rem] border border-dashed border-border animate-in zoom-in-95 duration-300">
                <p className="text-lg font-medium mb-2">No products found</p>
                <p className="text-muted-foreground mb-6 text-sm">
                  Try adjusting your search or filters to find what you&apos;re
                  looking for.
                </p>
                <Button onClick={handleClearAll} variant="outline">
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
    </motion.div>
  );
}
