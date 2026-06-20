import type { ExtendedProduct } from "./types";

type ProductSortRecord = Pick<ExtendedProduct, "name" | "updatedAt">;

export function getProductTimestamp(product: ProductSortRecord): number {
  if (!product.updatedAt) return 0;

  const timestamp = Date.parse(product.updatedAt);
  return Number.isFinite(timestamp) ? timestamp : 0;
}

export function sortProductsByNewest(
  productA: ProductSortRecord,
  productB: ProductSortRecord,
): number {
  return (
    getProductTimestamp(productB) - getProductTimestamp(productA) ||
    productA.name.localeCompare(productB.name)
  );
}
