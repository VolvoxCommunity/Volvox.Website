import { resolveProductImagePath } from "@/lib/image-utils";

describe("image-utils", () => {
  describe("resolveProductImagePath", () => {
    it("returns null if screenshot is undefined", () => {
      expect(resolveProductImagePath(undefined, "slug")).toBeNull();
    });

    it("returns external URLs as-is", () => {
      expect(
        resolveProductImagePath("https://example.com/image.png", "slug")
      ).toBe("https://example.com/image.png");
      expect(
        resolveProductImagePath("http://example.com/image.png", "slug")
      ).toBe("http://example.com/image.png");
    });

    it("returns absolute paths as-is", () => {
      expect(resolveProductImagePath("/images/custom.png", "slug")).toBe(
        "/images/custom.png"
      );
    });

    it("resolves bare filenames relative to product directory", () => {
      expect(resolveProductImagePath("screenshot.png", "my-product")).toBe(
        "/images/product/my-product/screenshot.png"
      );
    });
  });
});
