import { Suspense } from "react";
import { Metadata } from "next";
import Script from "next/script";
import { getAllExtendedProducts } from "@/lib/content";
import { ProductsListClient } from "@/components/products-list-client";
import { generateBreadcrumbSchema } from "@/lib/structured-data";
import { safeJsonLdSerialize, SITE_NAME, SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Products",
  description: `Open-source applications built by the ${SITE_NAME} team.`,
  alternates: {
    canonical: "/products",
  },
};

/**
 * Server component for the products listing page.
 * Fetches all products and passes them to the client component for filtering.
 * Wrapped in Suspense because ProductsListClient uses useSearchParams.
 */
export default function ProductsPage() {
  const products = getAllExtendedProducts();

  return (
    <>
      <Script
        id="products-breadcrumb-schema"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: safeJsonLdSerialize(
            generateBreadcrumbSchema([
              { name: "Home", url: SITE_URL },
              { name: "Products", url: `${SITE_URL}/products` },
            ])
          ),
        }}
      />
      <Suspense fallback={null}>
        <ProductsListClient products={products} />
      </Suspense>
    </>
  );
}
