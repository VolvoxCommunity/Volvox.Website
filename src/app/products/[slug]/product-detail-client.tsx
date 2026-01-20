"use client";

import { Navigation } from "@/components/navigation";
import { AnimatedBackground } from "@/components/animated-background";
import { ProductPostNavbar } from "@/components/products/product-post-navbar";
import { Footer } from "@/components/footer";
import { ProductHero } from "@/components/products/product-hero";
import { ProductToc } from "@/components/products/product-toc";
import { ProductFeatures } from "@/components/products/product-features";
import { ProductFaq } from "@/components/products/product-faq";
import { ProductTestimonials } from "@/components/products/product-testimonials";
import { ProductScreenshots } from "@/components/products/product-screenshots";
import type { ExtendedProduct } from "@/lib/types";

interface ProductDetailClientProps {
  product: ExtendedProduct;
}

/**
 * Client component for product detail page.
 * Renders all sections with scroll tracking.
 */
export function ProductDetailClient({ product }: ProductDetailClientProps) {
  // Build TOC sections based on available content
  const tocSections = [
    { id: "overview", label: "Overview" },
    ...(product.screenshots.length > 1
      ? [{ id: "screenshots", label: "Screenshots" }]
      : []),
    { id: "features", label: "Features" },
    ...(product.faq.length > 0 ? [{ id: "faq", label: "FAQ" }] : []),
    ...(product.testimonials.length > 0
      ? [{ id: "testimonials", label: "Testimonials" }]
      : []),
  ];

  return (
    <div className="min-h-screen relative flex flex-col">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <AnimatedBackground />
      </div>

      {/* Site Navigation Header */}
      <Navigation linkMode={true} />

      {/* Back Navbar */}
      <div className="pt-16 md:pt-24">
        <ProductPostNavbar />
      </div>

      {/* Sidebar Table of Contents */}
      <ProductToc sections={tocSections} />

      {/* Content Layer */}
      <div className="relative z-10 flex-1">
        <main id="main-content">
          {/* Hero Section */}
          <ProductHero product={product} />

          {/* Overview Section */}
          <section id="overview" className="py-16 px-4 scroll-mt-32">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Overview</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {product.longDescription}
              </p>

              {/* Tech Stack */}
              {product.techStack && product.techStack.length > 0 && (
                <div className="mt-8">
                  <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">
                    Tech Stack
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {product.techStack.map((tech) => (
                      <span
                        key={`${product.slug}:tech:${tech}`}
                        className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-secondary/20 text-foreground border border-secondary/30"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}
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

          {/* FAQ */}
          <ProductFaq faq={product.faq} />

          {/* Testimonials */}
          <ProductTestimonials testimonials={product.testimonials} />
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
