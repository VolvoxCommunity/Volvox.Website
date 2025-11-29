import { normalizeSlug, slugConstraints } from "../../src/lib/validation";

describe("normalizeSlug", () => {
  it("returns a trimmed slug when valid", () => {
    const result = normalizeSlug("  hello-world  ");
    expect(result).toBe("hello-world");
  });

  it("rejects values with invalid characters", () => {
    const result = normalizeSlug("hello world!");
    expect(result).toBeNull();
  });

  it("rejects values longer than the maximum allowed length", () => {
    const longSlug = "a".repeat(slugConstraints.maxLength + 1);
    const result = normalizeSlug(longSlug);
    expect(result).toBeNull();
  });
});
