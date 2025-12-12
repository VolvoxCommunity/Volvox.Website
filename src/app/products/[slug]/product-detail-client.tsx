"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AnimatedBackground } from "@/components/animated-background";
import { BlogNavigation } from "@/components/blog/blog-navigation";
import { Footer } from "@/components/footer";
import { ProductHero } from "@/components/products/product-hero";
import { ProductToc } from "@/components/products/product-toc";
import { ProductFeatures } from "@/components/products/product-features";
import { ProductFaq } from "@/components/products/product-faq";
import { ProductTestimonials } from "@/components/products/product-testimonials";
import { ProductChangelog } from "@/components/products/product-changelog";
import { ProductScreenshots } from "@/components/products/product-screenshots";
import type { ExtendedProduct } from "@/lib/types";
import { NAV_HEIGHT } from "@/lib/constants";

interface ProductDetailClientProps {
  product: ExtendedProduct;
  changelog: string | null;
}

/**
 * Client component for product detail page.
 * Renders all sections with scroll tracking.
 */
export function ProductDetailClient({
  product,
  changelog,
}: ProductDetailClientProps) {
  // Build TOC sections based on available content
  const tocSections = [
    { id: "overview", label: "Overview" },
    product.screenshots.length > 1 && {
      id: "screenshots",
      label: "Screenshots",
    },
    { id: "features", label: "Features" },
    changelog && { id: "changelog", label: "Changelog" },
    product.faq.length > 0 && { id: "faq", label: "FAQ" },
    product.testimonials.length > 0 && {
      id: "testimonials",
      label: "Testimonials",
    },
  ].filter(Boolean) as { id: string; label: string }[];

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

        {/* Back Navigation */}
        <div
          className="sticky z-30 bg-background/80 backdrop-blur-sm border-b border-border/50 py-3"
          style={{ top: NAV_HEIGHT }}
        >
          <div className="container mx-auto px-4 max-w-6xl">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Back to Products
            </Link>
          </div>
        </div>

        <main>
          {/* Hero Section */}
          <ProductHero product={product} />

          {/* Table of Contents */}
          <ProductToc sections={tocSections} />

          {/* Overview Section */}
          <section id="overview" className="py-16 px-4">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Overview</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {product.longDescription}
              </p>
            </div>
          </section>

          {/* Screenshots */}
          <ProductScreenshots
            slug={product.slug}
            screenshots={product.screenshots}
            productName={product.name}
          />

          {/* Features */}
          <ProductFeatures features={product.features} />

          {/* Changelog */}
          <ProductChangelog content={changelog} />

          {/* FAQ */}
          <ProductFaq faq={product.faq} />

          {/* Testimonials */}
          <ProductTestimonials testimonials={product.testimonials} />
        </main>
      </div>

      {/* Footer */}
      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}
