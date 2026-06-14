import { sortProductsByNewest } from "../src/lib/product-sorting";
import { describe, expect, it } from "./setup-globals";

interface ProductSortFixture {
  name: string;
  updatedAt?: string;
}

describe("sortProductsByNewest", () => {
  it("sorts products by newest update date first", () => {
    const products: ProductSortFixture[] = [
      { name: "Older", updatedAt: "2024-01-01" },
      { name: "Newest", updatedAt: "2026-01-01" },
      { name: "Middle", updatedAt: "2025-01-01" },
    ];

    expect(
      products.sort(sortProductsByNewest).map((product) => product.name),
    ).toEqual(["Newest", "Middle", "Older"]);
  });

  it("uses product name as a deterministic tie-breaker", () => {
    const products: ProductSortFixture[] = [
      { name: "Zulu", updatedAt: "2026-01-01" },
      { name: "Alpha", updatedAt: "2026-01-01" },
    ];

    expect(
      products.sort(sortProductsByNewest).map((product) => product.name),
    ).toEqual(["Alpha", "Zulu"]);
  });

  it("treats missing or invalid dates as oldest", () => {
    const products: ProductSortFixture[] = [
      { name: "Missing" },
      { name: "Valid", updatedAt: "2026-01-01" },
      { name: "Invalid", updatedAt: "not-a-date" },
    ];

    expect(
      products.sort(sortProductsByNewest).map((product) => product.name),
    ).toEqual(["Valid", "Invalid", "Missing"]);
  });
});
