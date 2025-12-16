import { redirect } from "next/navigation";

/**
 * Redirects /products to homepage products section.
 */
export default function ProductsPage() {
  redirect("/#products");
}
