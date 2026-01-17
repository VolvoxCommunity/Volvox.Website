import { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getAllExtendedProducts,
  getExtendedProductBySlug,
  getProductChangelog,
} from "@/lib/content";
import { ProductDetailClient } from "./product-detail-client";

/**
 * Disable dynamic params to only allow known product slugs.
 */
export const dynamicParams = false;

/**
 * Generates static params for all product pages.
 */
export function generateStaticParams() {
  const products = getAllExtendedProducts();
  return products.map((product) => ({
    slug: product.slug,
  }));
}

/**
 * Generates metadata for product pages.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getExtendedProductBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found",
      description: "The requested product could not be found.",
    };
  }

  // Note: openGraph.images and twitter.images are NOT specified here.
  // Next.js auto-discovers the opengraph-image.tsx file in this directory
  // and generates the correct URL. Explicitly setting relative URLs would
  // resolve them against metadataBase (production URL), breaking local dev.
  return {
    title: product.name,
    description: product.tagline,
    alternates: {
      canonical: `/products/${slug}`,
    },
    openGraph: {
      title: product.name,
      description: product.tagline,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: product.tagline,
    },
  };
}

/**
 * Product detail page server component.
 */
export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getExtendedProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const changelog = getProductChangelog(slug);

  return <ProductDetailClient product={product} changelog={changelog} />;
}
