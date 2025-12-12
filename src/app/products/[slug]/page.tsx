import { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getAllExtendedProducts,
  getExtendedProductBySlug,
  getProductChangelog,
} from "@/lib/content";
import { ProductDetailClient } from "./product-detail-client";

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

  return {
    title: product.name,
    description: product.tagline,
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
