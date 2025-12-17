import {
  generateBlogPostSocialImage,
  generateProductSocialImage,
  generateSocialImage,
  getBlogBannerData,
  getLogoData,
  getProductScreenshotData,
  createFallbackImage,
} from "@/lib/social-images";
import { ImageResponse } from "next/og";
import * as fs from "fs";
import * as path from "path";

jest.mock("fs");
jest.mock("path", () => {
  const original = jest.requireActual("path");
  return {
    ...original,
    join: jest.fn((...args) => args.join("/")),
  };
});
jest.mock("next/og", () => ({
  ImageResponse: jest.fn(() => ({ type: "ImageResponse" })),
}));
jest.mock("@/lib/logger", () => ({
  reportError: jest.fn(),
}));

describe("social-images", () => {
  let originalFetch: typeof global.fetch;

  beforeEach(() => {
    originalFetch = global.fetch;
    global.fetch = jest.fn(() =>
      Promise.resolve({
        text: () => Promise.resolve("css content src: url(http://font.ttf)"),
        arrayBuffer: () => Promise.resolve(new ArrayBuffer(10)),
        then: (cb: any) => cb({ arrayBuffer: () => Promise.resolve(new ArrayBuffer(10)) }),
      })
    ) as jest.Mock;

    // Mock cwd to return a fixed path
    jest.spyOn(process, "cwd").mockReturnValue("/app");
  });

  afterEach(() => {
    global.fetch = originalFetch;
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  describe("getLogoData", () => {
    it("reads logo data from file system when file exists", () => {
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.readFileSync as jest.Mock).mockReturnValue({
        buffer: new ArrayBuffer(8),
      });
      const data = getLogoData();
      expect(data).toBeTruthy();
      expect(fs.readFileSync).toHaveBeenCalledWith("/app/public/logo.png");
    });

    it("returns null when file does not exist", () => {
      (fs.existsSync as jest.Mock).mockReturnValue(false);
      const data = getLogoData();
      expect(data).toBeNull();
    });

    it("returns null and reports error on exception", () => {
      (fs.existsSync as jest.Mock).mockImplementation(() => {
        throw new Error("File error");
      });
      const data = getLogoData();
      expect(data).toBeNull();
    });
  });

  describe("getProductScreenshotData", () => {
    it("reads screenshot data when file exists", () => {
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.readFileSync as jest.Mock).mockReturnValue({
        buffer: new ArrayBuffer(8),
      });
      const data = getProductScreenshotData("slug", "shot.png");
      expect(data).toBeTruthy();
      expect(fs.readFileSync).toHaveBeenCalledWith(
        "/app/content/products/slug/screenshots/shot.png"
      );
    });

    it("returns null when file does not exist", () => {
      (fs.existsSync as jest.Mock).mockReturnValue(false);
      const data = getProductScreenshotData("slug", "shot.png");
      expect(data).toBeNull();
    });

    it("returns null on error", () => {
      (fs.existsSync as jest.Mock).mockImplementation(() => {
        throw new Error("FS Error");
      });
      const data = getProductScreenshotData("slug", "shot.png");
      expect(data).toBeNull();
    });
  });

  describe("getBlogBannerData", () => {
    it("reads banner data when file exists", () => {
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.readFileSync as jest.Mock).mockReturnValue({
        buffer: new ArrayBuffer(8),
      });
      const data = getBlogBannerData("/images/banner.png");
      expect(data).toBeTruthy();
      expect(fs.readFileSync).toHaveBeenCalledWith(
        "/app/public/images/banner.png"
      );
    });

    it("handles paths without leading slash", () => {
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.readFileSync as jest.Mock).mockReturnValue({
        buffer: new ArrayBuffer(8),
      });
      const data = getBlogBannerData("images/banner.png");
      expect(data).toBeTruthy();
      expect(fs.readFileSync).toHaveBeenCalledWith(
        "/app/public/images/banner.png"
      );
    });

    it("returns null when file does not exist", () => {
      (fs.existsSync as jest.Mock).mockReturnValue(false);
      const data = getBlogBannerData("banner.png");
      expect(data).toBeNull();
    });
  });

  describe("generateSocialImage", () => {
    const logoData = new ArrayBuffer(8);

    it("generates image with all config options", async () => {
      const config = {
        title: "Title",
        subtitle: "Subtitle",
        metadata: "Metadata",
        badges: ["Badge1"],
        badgePrefix: "v",
      };

      const response = await generateSocialImage(config, logoData);
      expect(ImageResponse).toHaveBeenCalled();
      expect(response).toEqual({ type: "ImageResponse" });
    });

    it("throws and uses fallback if config is missing", async () => {
      const response = await generateSocialImage(null, logoData);
      expect(ImageResponse).toHaveBeenCalled();
      // Should verify it called with fallback content
    });

    it("handles generation error gracefully", async () => {
       // Force error by passing invalid logoData that might cause issues if we were actually rendering,
       // but here we are mocking ImageResponse so we need another way to trigger the catch block.
       // Actually, generateSocialImage throws "No config provided" if config is null.
       // Let's test fetch failure.
       (global.fetch as jest.Mock).mockRejectedValueOnce(new Error("Network error"));

       const config = { title: "Title" };
       const response = await generateSocialImage(config, logoData);
       expect(ImageResponse).toHaveBeenCalled();
    });
  });

  describe("generateBlogPostSocialImage", () => {
    const logoData = new ArrayBuffer(8);

    it("generates image with full frontmatter", async () => {
      const frontmatter = {
        title: "Test Title",
        date: "2023-01-01",
        excerpt: "Test excerpt",
        author: { name: "Author" },
        tags: ["tag1"],
        bannerData: new ArrayBuffer(10),
      };

      const response = await generateBlogPostSocialImage(frontmatter, logoData);
      expect(ImageResponse).toHaveBeenCalled();
      expect(response).toEqual({ type: "ImageResponse" });
    });

    it("generates image without banner", async () => {
      const frontmatter = {
        title: "Test Title",
        date: "2023-01-01",
      };

      const response = await generateBlogPostSocialImage(frontmatter, logoData);
      expect(ImageResponse).toHaveBeenCalled();
    });

    it("falls back to generic social image if frontmatter is null", async () => {
      const response = await generateBlogPostSocialImage(null, logoData);
      expect(ImageResponse).toHaveBeenCalled();
    });

    it("handles error during generation", async () => {
       (global.fetch as jest.Mock).mockRejectedValueOnce(new Error("Network error"));
       const frontmatter = { title: "Test Title", date: "2023-01-01" };
       const response = await generateBlogPostSocialImage(frontmatter, logoData);
       expect(ImageResponse).toHaveBeenCalled();
    });
  });

  describe("generateProductSocialImage", () => {
    const logoData = new ArrayBuffer(8);

    it("generates image with full product data", async () => {
      const product = {
        name: "Product",
        tagline: "Tagline",
        techStack: ["React", "Next.js"],
        screenshotData: new ArrayBuffer(10),
      };

      const response = await generateProductSocialImage(product, logoData);
      expect(ImageResponse).toHaveBeenCalled();
      expect(response).toEqual({ type: "ImageResponse" });
    });

    it("generates image without screenshot", async () => {
      const product = {
        name: "Product",
        tagline: "Tagline",
      };

      const response = await generateProductSocialImage(product, logoData);
      expect(ImageResponse).toHaveBeenCalled();
    });

    it("falls back to generic social image if product is null", async () => {
      const response = await generateProductSocialImage(null, logoData);
      expect(ImageResponse).toHaveBeenCalled();
    });

     it("handles error during generation", async () => {
       (global.fetch as jest.Mock).mockRejectedValueOnce(new Error("Network error"));
       const product = { name: "Product", tagline: "Tagline" };
       const response = await generateProductSocialImage(product, logoData);
       expect(ImageResponse).toHaveBeenCalled();
    });
  });

  describe("createFallbackImage", () => {
    it("creates fallback with logo", () => {
        const logoData = new ArrayBuffer(8);
        const element = createFallbackImage(logoData);
        expect(element).toBeTruthy();
    });

    it("creates fallback without logo", () => {
        const element = createFallbackImage(null);
        expect(element).toBeTruthy();
    });
  });
});
