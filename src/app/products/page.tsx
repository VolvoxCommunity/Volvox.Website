import { Suspense } from "react";
import { Metadata } from "next";
import { getAllExtendedProducts } from "@/lib/content";
import { ProductsListClient } from "@/components/products-list-client";
import { SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Products",
  description: `Open-source applications built by the ${SITE_NAME} team.`,
};

/**
 * Server component for the products listing page.
 * Fetches all products and passes them to the client component for filtering.
 * Wrapped in Suspense because ProductsListClient uses useSearchParams.
 */
export default function ProductsPage() {
  const products = getAllExtendedProducts();

  return (
    <Suspense fallback={null}>
      <ProductsListClient products={products} />
    </Suspense>
  );
}
