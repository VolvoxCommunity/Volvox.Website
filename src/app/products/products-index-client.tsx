"use client";

import { motion } from "framer-motion";
import { AnimatedBackground } from "@/components/animated-background";
import { BlogNavigation } from "@/components/blog/blog-navigation";
import { Footer } from "@/components/footer";
import { ProductCard } from "@/components/products/product-card";
import type { ExtendedProduct } from "@/lib/types";
import { NAV_HEIGHT } from "@/lib/constants";

interface ProductsIndexClientProps {
  products: ExtendedProduct[];
}

/**
 * Client component for products index page.
 */
export function ProductsIndexClient({ products }: ProductsIndexClientProps) {
  return (
    <div className="min-h-screen relative flex flex-col">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <AnimatedBackground />
      </div>

      {/* Content Layer */}
      <div className="relative z-10 flex-1">
        {/* Navigation */}
        <BlogNavigation />

        {/* Spacer for fixed navigation */}
        <div style={{ height: NAV_HEIGHT }} />

        <main className="py-16 md:py-24 px-4">
          <div className="container mx-auto max-w-6xl">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12 md:mb-16"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                Our Products
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                Open-source applications built with care, designed to make a
                real difference.
              </p>
            </motion.div>

            {/* Products Grid */}
            {products.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    index={index}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-muted-foreground text-lg">
                  Products coming soon. Check back later!
                </p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Footer */}
      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}
