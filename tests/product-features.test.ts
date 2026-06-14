import assert from "node:assert/strict";
import test from "node:test";
import { buildFeatureItems } from "@/components/products/product-features";

test("buildFeatureItems creates unique keys for duplicate feature text", () => {
  const items = buildFeatureItems([
    "AI suggestions",
    "AI suggestions",
    "History",
  ]);

  assert.deepEqual(
    items.map((item) => item.feature),
    ["AI suggestions", "AI suggestions", "History"],
  );
  assert.equal(new Set(items.map((item) => item.key)).size, items.length);
});
