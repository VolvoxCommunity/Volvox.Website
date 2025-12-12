"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AppleLogo, GooglePlayLogo, ArrowRight } from "@phosphor-icons/react";
import type { ExtendedProduct } from "@/lib/types";

interface ProductCardProps {
  product: ExtendedProduct;
  index: number;
}

/**
 * Product card for the products index page.
 * Displays product thumbnail, name, tagline, tech stack badges, and platform icons.
 * Animates in on scroll with staggered delays based on index.
 * Links to the product detail page.
 */
export function ProductCard({ product, index }: ProductCardProps) {
  const heroImage = product.screenshots[0];
  const imagePath = heroImage
    ? `/images/product/${product.slug}/${heroImage}`
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="group hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 border-2 hover:border-primary/30 overflow-hidden h-full flex flex-col">
        {/* Image */}
        <div className="relative aspect-video bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10 overflow-hidden">
          {imagePath ? (
            <Image
              src={imagePath}
              alt={product.name}
              fill
              className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-6xl font-bold text-foreground/10">
                {product.name.charAt(0)}
              </span>
            </div>
          )}
        </div>

        <CardHeader className="pb-2">
          <CardTitle className="text-xl">{product.name}</CardTitle>
          <CardDescription className="text-base">
            {product.tagline}
          </CardDescription>
        </CardHeader>

        <CardContent className="flex-1 space-y-4">
          {/* Tech Stack */}
          {product.techStack.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {product.techStack.slice(0, 4).map((tech) => (
                <Badge key={tech} variant="secondary" className="text-xs">
                  {tech}
                </Badge>
              ))}
            </div>
          )}

          {/* Platform indicators */}
          <div className="flex items-center gap-2">
            {product.links.appStore && (
              <AppleLogo
                weight="fill"
                className="h-5 w-5 text-muted-foreground"
              />
            )}
            {product.links.playStore && (
              <GooglePlayLogo
                weight="fill"
                className="h-5 w-5 text-muted-foreground"
              />
            )}
          </div>
        </CardContent>

        <CardFooter>
          <Button asChild className="w-full gap-2 group/btn">
            <Link href={`/products/${product.slug}`}>
              View Details
              <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
