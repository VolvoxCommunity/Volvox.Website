"use client";

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
} from "@phosphor-icons/react";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import type { ExtendedProduct } from "@/lib/types";
import { resolveProductImagePath } from "@/lib/image-utils";
import Image from "next/image";
import Link from "next/link";

interface ProductsProps {
  products: ExtendedProduct[];
}

interface ProductCardProps {
  product: ExtendedProduct;
  index: number;
}

function ProductCard({ product, index }: ProductCardProps) {
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
                      className="inline-flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-black/80 transition-colors"
                    >
                      <AppleLogo weight="fill" className="h-6 w-6" />
                      <div className="text-left">
                        <div className="text-xs leading-none">
                          Download on the
                        </div>
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
                </div>
              )}
              <div className="flex flex-wrap gap-3">
                <Button asChild className="gap-2 group/btn">
                  <Link href={`/products/${product.slug}`}>
                    View Details
                    <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                {product.links?.demo && (
                  <Button
                    variant="accent"
                    asChild
                    className="gap-2 shadow-lg shadow-accent/20"
                  >
                    <a
                      href={product.links.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Visit
                      <ArrowUpRight weight="bold" className="h-4 w-4" />
                    </a>
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
 * Render a "Our Products" section that displays all products as large, detailed cards.
 *
 * Renders responsive cards for each product in `products` including the product name, description, key features, and View Details button. If `products` is empty, renders a centered placeholder message.
 *
 * @param products - Array of ExtendedProduct objects to display.
 * @returns The JSX element for the products section or a fallback placeholder.
 */
export function Products({ products }: ProductsProps) {
  if (products.length === 0) {
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

        <div className="space-y-8">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-10">
          <Button asChild size="lg" variant="outline">
            <Link href="/products">
              View All Products
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
