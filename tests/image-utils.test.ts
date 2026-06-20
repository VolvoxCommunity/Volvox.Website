import assert from "node:assert/strict";
import test from "node:test";

import { canUseNextImageOptimization } from "../src/lib/image-utils";

test("canUseNextImageOptimization accepts local paths and configured GitHub URLs", () => {
  assert.equal(canUseNextImageOptimization("/images/example.png"), true);
  assert.equal(
    canUseNextImageOptimization("https://github.com/org/repo/image.png"),
    true,
  );
});

test("canUseNextImageOptimization rejects unconfigured external URLs", () => {
  assert.equal(
    canUseNextImageOptimization(
      "https://raw.githubusercontent.com/org/repo/image.png",
    ),
    false,
  );
  assert.equal(
    canUseNextImageOptimization("https://images.example.com/a.png"),
    false,
  );
  assert.equal(canUseNextImageOptimization("relative-image.png"), false);
});
