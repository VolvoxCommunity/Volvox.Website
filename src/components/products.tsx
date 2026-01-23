"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowUpRight } from "@phosphor-icons/react";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import type { ExtendedProduct } from "@/lib/types";
import { resolveProductImagePath } from "@/lib/image-utils";
import Image from "next/image";
import Link from "next/link";
import {
  FilterControls,
  type ProductSortOption,
  type ViewMode,
} from "@/components/ui/filter-controls";

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
  index: number;
}

function ProductCard({ product, index }: ProductCardProps) {
  const router = useRouter();
  const heroImage = product.screenshots[0];
  const imagePath = resolveProductImagePath(heroImage, product.slug);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card
        className="group hover:shadow-2xl hover:shadow-secondary/5 transition-[box-shadow,border-color] duration-500 border-2 hover:border-secondary/30 overflow-hidden bg-card/80 backdrop-blur-sm"
        data-testid="product-card"
      >
        <div className="grid md:grid-cols-2 gap-0">
          <Link href={`/products/${product.slug}`} className="block">
            <motion.div
              className="bg-gradient-to-br from-primary/20 via-accent/15 to-secondary/20 relative overflow-hidden flex items-center justify-center p-4 cursor-pointer"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              {imagePath ? (
                <Image
                  src={imagePath}
                  alt={product.name}
                  width={600}
                  height={400}
                  className="w-full h-auto object-contain"
                />
              ) : (
                <div className="aspect-video w-full relative">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.1),rgba(255,255,255,0))]" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      className="text-[120px] md:text-[180px] font-bold text-foreground/5"
                      whileHover={{ scale: 1.05, rotate: 2 }}
                      transition={{ duration: 0.3 }}
                    >
                      {product.name.charAt(0)}
                    </motion.div>
                  </div>
                </div>
              )}
              {/* Gradient accent line */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-secondary" />
            </motion.div>
          </Link>

          <div className="flex flex-col">
            <CardHeader className="pb-4 pt-6 md:pt-8 px-6 md:px-8">
              <CardTitle className="text-2xl md:text-3xl font-bold transition-colors duration-300">
                <Link
                  href={`/products/${product.slug}`}
                  className="hover:text-primary transition-colors"
                >
                  {product.name}
                </Link>
              </CardTitle>
              <CardDescription className="text-base mt-3 leading-relaxed">
                {product.description}
              </CardDescription>
            </CardHeader>

            <CardContent className="flex-1 space-y-7 px-6 md:px-8">
              <div>
                <h4 className="font-semibold mb-4 text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <span className="h-px w-4 bg-primary/50" />
                  Key Features
                </h4>
                <ul className="space-y-3">
                  {product.features.map((feature, idx) => (
                    <motion.li
                      key={`${product.slug}:${feature}:${idx}`}
                      className="flex items-start gap-3 group/item"
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      <CheckCircle
                        weight="fill"
                        className="h-5 w-5 text-primary mt-0.5 flex-shrink-0 group-hover/item:scale-110 transition-transform"
                      />
                      <span className="text-sm leading-relaxed">{feature}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>

              {product.techStack && product.techStack.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-4 text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <span className="h-px w-4 bg-secondary/50" />
                    Tech Stack
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {product.techStack.map((tech) => (
                      <span
                        key={`${product.slug}:tech:${tech}`}
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-secondary/20 text-foreground border border-secondary/30"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>

            <CardFooter className="pt-6 pb-6 md:pb-8 px-6 md:px-8 flex-col items-start gap-4">
              {(product.links?.appStore || product.links?.playStore) && (
                <div className="flex flex-wrap gap-3">
                  {product.links.appStore && (
                    <a
                      href={product.links.appStore}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Download ${product.name} on the App Store`}
                      className="transition-opacity hover:opacity-80"
                    >
                      {/* Light mode: black badge */}
                      <Image
                        src="/images/stores/app-store-black.svg"
                        alt="Download on the App Store"
                        width={120}
                        height={40}
                        className="block dark:hidden h-[40px] w-auto"
                      />
                      {/* Dark mode: white badge */}
                      <Image
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
                      <Image
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
              <div className="flex flex-wrap gap-3">
                <Button
                  className="gap-2 group/btn"
                  onClick={() => router.push(`/products/${product.slug}`)}
                >
                  View Details
                  <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
                {product.links?.demo && (
                  <Button
                    variant="accent"
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
                    <ArrowUpRight weight="bold" className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardFooter>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

/**
 * Render a "Our Products" section with optional filtering, sorting, and view modes.
 *
 * @param products - Array of ExtendedProduct objects to display
 * @param searchQuery - Optional search query to filter products
 * @param onSearchChange - Optional callback when search query changes
 * @param sortOption - Optional sort option (a-z, z-a)
 * @param onSortChange - Optional callback when sort option changes
 * @param viewMode - Optional view mode (grid or list)
 * @param onViewModeChange - Optional callback when view mode changes
 * @param enableFilters - Whether to enable filtering controls
 * @returns The JSX element for the products section
 */
export function Products({
  products: allProducts,
  searchQuery = "",
  onSearchChange,
  sortOption = "a-z",
  onSortChange,
  viewMode = "grid",
  onViewModeChange,
  enableFilters = false,
}: ProductsProps) {
  const router = useRouter();
  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...allProducts];

    // Apply search filter
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

    // Sort products
    result.sort((a, b) => {
      switch (sortOption) {
        case "z-a":
          return b.name.localeCompare(a.name);
        case "a-z":
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return result;
  }, [allProducts, searchQuery, sortOption]);

  const displayProducts = filteredProducts;

  if (allProducts.length === 0) {
    return (
      <section
        id="products"
        className="py-16 md:py-24 px-4"
        data-testid="products-section"
      >
        <div className="container mx-auto max-w-7xl">
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No products available yet. Check back soon!
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="products"
      className="py-16 md:py-24 px-4"
      data-testid="products-section"
    >
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12 md:mb-16">
          <Link href="/products" className="inline-block group">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 group-hover:text-secondary transition-colors">
              Our Products
            </h2>
          </Link>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Open-source applications built with care, designed to make a real
            difference.
          </p>
        </div>

        {/* Filter Controls */}
        {enableFilters &&
          onSearchChange &&
          onSortChange &&
          onViewModeChange && (
            <FilterControls
              variant="homepage-product"
              searchQuery={searchQuery}
              onSearchChange={onSearchChange}
              sortOption={sortOption}
              onSortChange={onSortChange}
              viewMode={viewMode}
              onViewModeChange={onViewModeChange}
              searchPlaceholder="Search products..."
              resultCount={displayProducts.length}
              totalCount={allProducts.length}
            />
          )}

        {/* Empty state for filtered results */}
        {enableFilters && displayProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No products match your filters. Try adjusting your search.
            </p>
          </div>
        )}

        {/* Grid View (default large card layout) */}
        {viewMode === "grid" && (
          <div className="relative z-0 space-y-8">
            {displayProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        )}

        {/* List View (compact horizontal cards) */}
        {viewMode === "list" && (
          <div className="relative z-0 grid grid-cols-1 md:grid-cols-2 gap-6">
            {displayProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <Card
                  className="group hover:shadow-2xl hover:shadow-secondary/5 transition-[box-shadow,border-color] duration-500 border-2 hover:border-secondary/30 overflow-hidden bg-card/80 backdrop-blur-sm h-full"
                  data-testid="product-card"
                >
                  <Link
                    href={`/products/${product.slug}`}
                    className="block h-full"
                  >
                    <div className="flex flex-col h-full">
                      {/* Image */}
                      <div className="aspect-video bg-gradient-to-br from-primary/20 via-accent/15 to-secondary/20 relative overflow-hidden p-4 flex items-center justify-center">
                        {product.screenshots[0] &&
                        resolveProductImagePath(
                          product.screenshots[0],
                          product.slug
                        ) ? (
                          <Image
                            src={
                              resolveProductImagePath(
                                product.screenshots[0],
                                product.slug
                              ) || ""
                            }
                            alt={product.name}
                            width={400}
                            height={225}
                            className="w-full h-auto object-contain max-h-32"
                          />
                        ) : (
                          <div className="text-5xl font-bold text-foreground/5">
                            {product.name.charAt(0)}
                          </div>
                        )}
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-secondary" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 p-4 flex flex-col">
                        <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                          {product.name}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">
                          {product.description}
                        </p>

                        {/* Tech Stack */}
                        {product.techStack && product.techStack.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mb-4">
                            {product.techStack.slice(0, 3).map((tech) => (
                              <span
                                key={`${product.slug}:tech:${tech}`}
                                className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-secondary/20 text-foreground border border-secondary/30"
                              >
                                {tech}
                              </span>
                            ))}
                            {product.techStack.length > 3 && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                                +{product.techStack.length - 3}
                              </span>
                            )}
                          </div>
                        )}

                        {/* Links */}
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1"
                          >
                            Details
                          </Button>
                          {product.links?.demo && (
                            <Button
                              size="sm"
                              variant="accent"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                window.open(
                                  product.links.demo,
                                  "_blank",
                                  "noopener,noreferrer"
                                );
                              }}
                            >
                              Demo
                              <ArrowUpRight
                                weight="bold"
                                className="h-3 w-3 ml-1"
                              />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* View All Button */}
        <div className="text-center mt-10">
          <Button
            size="lg"
            variant="outline"
            onClick={() => router.push("/products")}
          >
            View All Products
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
}
