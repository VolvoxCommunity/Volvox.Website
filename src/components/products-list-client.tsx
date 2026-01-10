"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  AppleLogo,
  GooglePlayLogo,
  ArrowUpRight,
  MagnifyingGlass,
  X,
  List,
  SquaresFour,
  CaretDown,
  SortAscending,
  ArrowLeft,
} from "@phosphor-icons/react";
import { ArrowRight } from "lucide-react";
import type { ExtendedProduct } from "@/lib/types";
import { resolveProductImagePath } from "@/lib/image-utils";
import { BlogNavigation } from "@/components/blog/blog-navigation";
import { AnimatedBackground } from "@/components/animated-background";
import { Footer } from "@/components/footer";
import { NAV_HEIGHT } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface ProductsListClientProps {
  products: ExtendedProduct[];
}

type SortOption = "a-z" | "z-a";
type ViewMode = "grid" | "list";

const STORAGE_KEY = "volvox-products-view";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "a-z", label: "Name (A-Z)" },
  { value: "z-a", label: "Name (Z-A)" },
];

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
  const [sortOption, setSortOption] = useState<SortOption>(() => {
    const sort = searchParams.get("sort");
    return (sort as SortOption) || "a-z";
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

  // UI state for dropdowns
  const [sortOpen, setSortOpen] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);

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
      sort?: SortOption;
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
  const handleSearchInput = useCallback(
    (value: string) => {
      setDebouncedQuery(value);
      // Debounce the actual search
      const timeout = setTimeout(() => {
        setSearchQuery(value);
        updateUrl({ q: value });
      }, 300);
      return () => clearTimeout(timeout);
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
    (value: SortOption) => {
      setSortOption(value);
      updateUrl({ sort: value });
      setSortOpen(false);
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
    setDebouncedQuery("");
    setSelectedTech([]);
    setSortOption("a-z");
    router.replace("/products", { scroll: false });
  }, [router]);

  const hasActiveFilters =
    searchQuery || selectedTech.length > 0 || sortOption !== "a-z";

  const currentSortLabel =
    SORT_OPTIONS.find((opt) => opt.value === sortOption)?.label || "Sort";

  return (
    <div className="min-h-screen relative flex flex-col">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <AnimatedBackground />
      </div>

      {/* Content Layer */}
      <div className="relative z-10 flex-1">
        {/* Header Navigation */}
        <BlogNavigation />

        {/* Spacer for fixed navigation */}
        <div style={{ height: NAV_HEIGHT }} />

        {/* Back Navigation */}
        <div
          className="sticky z-30 bg-background/80 backdrop-blur-sm border-b border-border/50 py-3"
          style={{ top: NAV_HEIGHT }}
        >
          <div className="container mx-auto px-4 max-w-7xl">
            <Link
              href="/#products"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Back to Home
            </Link>
          </div>
        </div>

        <main
          id="main-content"
          className="container mx-auto px-4 max-w-7xl py-8"
          data-testid="products-section"
        >
          {/* Page Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">Products</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Open-source applications built with care, designed to make a real
              difference.
            </p>
          </div>

          {/* Controls */}
          <div className="space-y-4 mb-6">
            {/* Search Input */}
            <div className="relative">
              <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search products..."
                value={debouncedQuery}
                onChange={(e) => handleSearchInput(e.target.value)}
                aria-label="Search products"
                autoComplete="off"
                className="w-full pl-10 pr-10 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-colors"
              />
              {debouncedQuery && (
                <button
                  onClick={() => {
                    setDebouncedQuery("");
                    setSearchQuery("");
                    updateUrl({ q: "" });
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Tech Stack and Controls Row */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              {/* Tech Stack Filter */}
              {allTechStack.length > 0 && (
                <div className="flex-1 flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
                  <span className="text-sm text-muted-foreground shrink-0">
                    Tech:
                  </span>
                  <button
                    onClick={handleClearTech}
                    className={cn(
                      "px-3 py-1 text-xs rounded-full border transition-colors shrink-0",
                      selectedTech.length === 0
                        ? "bg-secondary text-secondary-foreground border-secondary"
                        : "bg-transparent text-muted-foreground border-border hover:border-secondary/50"
                    )}
                  >
                    All
                  </button>
                  {allTechStack.map((tech) => (
                    <button
                      key={tech}
                      onClick={() => handleTechToggle(tech)}
                      className={cn(
                        "px-3 py-1 text-xs rounded-full border transition-colors shrink-0",
                        selectedTech.includes(tech)
                          ? "bg-secondary text-secondary-foreground border-secondary"
                          : "bg-transparent text-muted-foreground border-border hover:border-secondary/50"
                      )}
                    >
                      {tech}
                    </button>
                  ))}
                </div>
              )}

              {/* Sort and View Controls */}
              <div className="flex items-center gap-2 shrink-0">
                {/* Sort Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setSortOpen(!sortOpen)}
                    className="flex items-center gap-2 px-3 py-2 text-sm border border-border rounded-lg hover:border-secondary/50 transition-colors bg-background"
                    aria-expanded={sortOpen}
                    aria-haspopup="listbox"
                  >
                    <SortAscending className="h-4 w-4" />
                    <span className="hidden sm:inline">{currentSortLabel}</span>
                    <CaretDown
                      className={cn(
                        "h-3 w-3 transition-transform",
                        sortOpen && "rotate-180"
                      )}
                    />
                  </button>

                  {sortOpen && (
                    <div className="absolute right-0 top-full mt-1 bg-background border border-border rounded-lg shadow-lg z-50 min-w-[150px]">
                      {SORT_OPTIONS.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => handleSortChange(option.value)}
                          className={cn(
                            "w-full px-3 py-2 text-sm text-left hover:bg-muted transition-colors first:rounded-t-lg last:rounded-b-lg",
                            sortOption === option.value &&
                              "bg-secondary/10 text-secondary"
                          )}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* View Mode Toggle */}
                <div className="hidden sm:flex items-center border border-border rounded-lg overflow-hidden">
                  <button
                    onClick={() => handleViewModeChange("grid")}
                    className={cn(
                      "p-2 transition-colors",
                      viewMode === "grid"
                        ? "bg-secondary text-secondary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    )}
                    aria-label="Grid view"
                    aria-pressed={viewMode === "grid"}
                  >
                    <SquaresFour className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleViewModeChange("list")}
                    className={cn(
                      "p-2 transition-colors",
                      viewMode === "list"
                        ? "bg-secondary text-secondary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    )}
                    aria-label="List view"
                    aria-pressed={viewMode === "list"}
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Results Count & Clear */}
          {hasActiveFilters && (
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-muted-foreground">
                {filteredProducts.length}{" "}
                {filteredProducts.length === 1 ? "product" : "products"} found
              </p>
              <button
                onClick={handleClearAll}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Clear all filters
              </button>
            </div>
          )}

          {/* Products Grid/List */}
          {filteredProducts.length > 0 ? (
            viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product, idx) => (
                  <ProductCardGrid
                    key={product.id}
                    product={product}
                    index={idx}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-6">
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
            <div className="text-center py-16">
              <p className="text-muted-foreground mb-4">
                No products found. Try adjusting your search or filters.
              </p>
              <button
                onClick={handleClearAll}
                className="text-secondary hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
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
    >
      <Link href={`/products/${product.slug}`} className="block h-full">
        <Card
          className="group cursor-pointer hover:shadow-xl transition-shadow duration-300 overflow-hidden h-full flex flex-col"
          data-testid="product-card"
        >
          <motion.div
            className="aspect-video bg-gradient-to-br from-primary/10 via-background to-secondary/10 relative overflow-hidden border-b border-border"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            {imagePath ? (
              <Image
                src={imagePath}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-5xl font-bold text-foreground/5">
                  {product.name.charAt(0)}
                </div>
              </div>
            )}
          </motion.div>

          <CardHeader>
            <CardTitle className="text-lg line-clamp-1 group-hover:text-secondary transition-colors">
              {product.name}
            </CardTitle>
            <CardDescription className="text-sm line-clamp-1">
              {product.tagline}
            </CardDescription>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col">
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
              {product.description}
            </p>

            {/* Features Preview */}
            <ul className="space-y-1 mb-4">
              {product.features.slice(0, 2).map((feature, idx) => (
                <li
                  key={`${product.slug}:${feature}:${idx}`}
                  className="flex items-start gap-2 text-xs text-muted-foreground"
                >
                  <CheckCircle
                    weight="fill"
                    className="h-3 w-3 text-primary mt-0.5 flex-shrink-0"
                  />
                  <span className="line-clamp-1">{feature}</span>
                </li>
              ))}
              {product.features.length > 2 && (
                <li className="text-xs text-muted-foreground pl-5">
                  +{product.features.length - 2} more
                </li>
              )}
            </ul>

            {/* Tech Stack */}
            {product.techStack.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-auto">
                {product.techStack.slice(0, 3).map((tech) => (
                  <span
                    key={`${product.slug}:tech:${tech}`}
                    className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-secondary/20 text-foreground border border-secondary/30"
                  >
                    {tech}
                  </span>
                ))}
                {product.techStack.length > 3 && (
                  <span className="text-xs text-muted-foreground">
                    +{product.techStack.length - 3}
                  </span>
                )}
              </div>
            )}
          </CardContent>
        </Card>
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
    >
      <Card
        className="group hover:shadow-xl transition-shadow duration-300 overflow-hidden"
        data-testid="product-card"
      >
        <div className="grid md:grid-cols-3 gap-0">
          <Link
            href={`/products/${product.slug}`}
            className="block md:col-span-1"
          >
            <motion.div
              className="aspect-video md:aspect-auto md:h-full bg-gradient-to-br from-primary/10 via-background to-secondary/10 relative overflow-hidden border-b md:border-b-0 md:border-r border-border"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              {imagePath ? (
                <Image
                  src={imagePath}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-6xl font-bold text-foreground/5">
                    {product.name.charAt(0)}
                  </div>
                </div>
              )}
            </motion.div>
          </Link>

          <div className="md:col-span-2 flex flex-col">
            <CardHeader>
              <Link href={`/products/${product.slug}`}>
                <CardTitle className="text-xl group-hover:text-secondary transition-colors">
                  {product.name}
                </CardTitle>
              </Link>
              <CardDescription>{product.tagline}</CardDescription>
            </CardHeader>

            <CardContent className="flex-1">
              <p className="text-sm text-muted-foreground mb-4">
                {product.description}
              </p>

              {/* Features */}
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                {product.features.slice(0, 4).map((feature, idx) => (
                  <li
                    key={`${product.slug}:${feature}:${idx}`}
                    className="flex items-start gap-2 text-sm"
                  >
                    <CheckCircle
                      weight="fill"
                      className="h-4 w-4 text-primary mt-0.5 flex-shrink-0"
                    />
                    <span className="line-clamp-1">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Tech Stack */}
              {product.techStack.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {product.techStack.map((tech) => (
                    <span
                      key={`${product.slug}:tech:${tech}`}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-secondary/20 text-foreground border border-secondary/30"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </CardContent>

            <CardFooter className="flex flex-wrap gap-3 pt-0">
              <Button asChild className="gap-2 group/btn">
                <Link href={`/products/${product.slug}`}>
                  View Details
                  <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </Button>
              {(product.links?.appStore || product.links?.playStore) && (
                <div className="flex gap-2">
                  {product.links.appStore && (
                    <a
                      href={product.links.appStore}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Download ${product.name} on the App Store`}
                      className="inline-flex items-center gap-1 bg-black text-white px-3 py-1.5 rounded-lg hover:bg-black/80 transition-colors text-xs"
                    >
                      <AppleLogo weight="fill" className="h-4 w-4" />
                      <span>App Store</span>
                    </a>
                  )}
                  {product.links.playStore && (
                    <a
                      href={product.links.playStore}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Get ${product.name} on Google Play`}
                      className="inline-flex items-center gap-1 bg-black text-white px-3 py-1.5 rounded-lg hover:bg-black/80 transition-colors text-xs"
                    >
                      <GooglePlayLogo weight="fill" className="h-4 w-4" />
                      <span>Play Store</span>
                    </a>
                  )}
                </div>
              )}
              {product.links?.demo && (
                <Button
                  variant="accent"
                  asChild
                  size="sm"
                  className="gap-2 shadow-lg shadow-accent/20"
                >
                  <a
                    href={product.links.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Visit
                    <ArrowUpRight weight="bold" className="h-3 w-3" />
                  </a>
                </Button>
              )}
            </CardFooter>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
