import { Metadata } from "next";
import { getAllExtendedProducts } from "@/lib/content";
import { ProductsIndexClient } from "./products-index-client";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Explore our open-source products and applications built to make a difference.",
  openGraph: {
    title: "Products | Volvox",
    description:
      "Explore our open-source products and applications built to make a difference.",
    type: "website",
  },
};

/**
 * Products index page server component.
 */
export default function ProductsPage() {
  const products = getAllExtendedProducts();

  return <ProductsIndexClient products={products} />;
}
