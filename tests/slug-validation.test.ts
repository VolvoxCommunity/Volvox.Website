import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { normalizeSlug, slugConstraints } from "../src/lib/validation";

void describe("normalizeSlug", () => {
  void it("returns a trimmed slug when valid", () => {
    const result = normalizeSlug("  hello-world  ");
    assert.equal(result, "hello-world");
  });

  void it("rejects values with invalid characters", () => {
    const result = normalizeSlug("hello world!");
    assert.equal(result, null);
  });

  void it("rejects values longer than the maximum allowed length", () => {
    const longSlug = "a".repeat(slugConstraints.maxLength + 1);
    const result = normalizeSlug(longSlug);
    assert.equal(result, null);
  });
});
