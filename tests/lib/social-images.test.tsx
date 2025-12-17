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
    global.fetch = jest.fn((url) => {
      // Mock CSS fetch - check hostname to ensure it's actually fonts.googleapis.com
      if (typeof url === 'string') {
        try {
          const parsedUrl = new URL(url);
          if (parsedUrl.hostname === 'fonts.googleapis.com') {
            return Promise.resolve({
              text: () => Promise.resolve("css content src: url(http://font.ttf)"),
              ok: true,
            });
          }
        } catch {
          // Invalid URL, fall through to font file mock
        }
      }
      // Mock Font file fetch (or any other fetch)
      return Promise.resolve({
        arrayBuffer: () => Promise.resolve(new ArrayBuffer(10)),
        ok: true,
      });
    }) as jest.Mock;

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
      // Return a real Buffer (which is a Uint8Array subclass)
      (fs.readFileSync as jest.Mock).mockReturnValue(Buffer.from([0x89, 0x50, 0x4e, 0x47]));
      const data = getLogoData();
      expect(data).toBeTruthy();
      expect(data).toBeInstanceOf(ArrayBuffer);
      expect(new Uint8Array(data!)[0]).toBe(0x89); // Verify PNG magic byte is preserved
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
      // Return a real Buffer (which is a Uint8Array subclass)
      (fs.readFileSync as jest.Mock).mockReturnValue(Buffer.from([0x89, 0x50, 0x4e, 0x47]));
      const data = getProductScreenshotData("slug", "shot.png");
      expect(data).toBeTruthy();
      expect(data).toBeInstanceOf(ArrayBuffer);
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
      // Return a real Buffer (which is a Uint8Array subclass)
      (fs.readFileSync as jest.Mock).mockReturnValue(Buffer.from([0x89, 0x50, 0x4e, 0x47]));
      const data = getBlogBannerData("/images/banner.png");
      expect(data).toBeTruthy();
      expect(data).toBeInstanceOf(ArrayBuffer);
      expect(fs.readFileSync).toHaveBeenCalledWith(
        "/app/public/images/banner.png"
      );
    });

    it("handles paths without leading slash", () => {
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      // Return a real Buffer (which is a Uint8Array subclass)
      (fs.readFileSync as jest.Mock).mockReturnValue(Buffer.from([0x89, 0x50, 0x4e, 0x47]));
      const data = getBlogBannerData("images/banner.png");
      expect(data).toBeTruthy();
      expect(data).toBeInstanceOf(ArrayBuffer);
      expect(fs.readFileSync).toHaveBeenCalledWith(
        "/app/public/images/banner.png"
      );
    });

    it("returns null when file does not exist", () => {
      (fs.existsSync as jest.Mock).mockReturnValue(false);
      const data = getBlogBannerData("banner.png");
      expect(data).toBeNull();
    });

    it("returns null on error", () => {
      (fs.existsSync as jest.Mock).mockImplementation(() => {
        throw new Error("FS Error");
      });
      const data = getBlogBannerData("banner.png");
      expect(data).toBeNull();
    });
  });

  describe("detectImageMimeType and toBase64DataUrl", () => {
    it("detects JPEG correctly", () => {
       const jpegBytes = new Uint8Array([0xff, 0xd8, 0xff, 0x00]);
       const logoData = jpegBytes.buffer;
       const element = createFallbackImage(logoData);
       expect(JSON.stringify(element)).toContain("data:image/jpeg");
    });

    it("detects PNG correctly", () => {
       const pngBytes = new Uint8Array([0x89, 0x50, 0x4e, 0x47]);
       const logoData = pngBytes.buffer;
       const element = createFallbackImage(logoData);
       expect(JSON.stringify(element)).toContain("data:image/png");
    });

    it("detects WebP correctly", () => {
       const webpBytes = new Uint8Array([0x52, 0x49, 0x46, 0x46, 0,0,0,0, 0x57, 0x45, 0x42, 0x50]);
       const logoData = webpBytes.buffer;
       const element = createFallbackImage(logoData);
       expect(JSON.stringify(element)).toContain("data:image/webp");
    });

    it("detects GIF correctly", () => {
       const gifBytes = new Uint8Array([0x47, 0x49, 0x46, 0x38]);
       const logoData = gifBytes.buffer;
       const element = createFallbackImage(logoData);
       expect(JSON.stringify(element)).toContain("data:image/gif");
    });

    it("defaults to PNG for unknown types", () => {
       const unknownBytes = new Uint8Array([0x00, 0x00, 0x00, 0x00]);
       const logoData = unknownBytes.buffer;
       const element = createFallbackImage(logoData);
       expect(JSON.stringify(element)).toContain("data:image/png");
    });
  });

  describe("fetchJetBrainsMonoFont", () => {
    it("fetches font successfully", async () => {
      const config = { title: "Title" };
      await generateSocialImage(config, null);
      // It should call fetch for CSS, then parse it to find url(), then fetch that URL.
      expect(global.fetch).toHaveBeenCalledTimes(2);
    });

    it("handles fetch failure gracefully", async () => {
      (global.fetch as jest.Mock).mockRejectedValue(new Error("Font fetch failed"));
      const config = { title: "Title" };
      await generateSocialImage(config, null);
      expect(ImageResponse).toHaveBeenCalled();
    });

    it("handles CSS parsing failure (no src url)", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        text: () => Promise.resolve("invalid css"),
      });
      const config = { title: "Title" };
      await generateSocialImage(config, null);
      expect(ImageResponse).toHaveBeenCalled();
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
        titleSize: 80,
      };

      const response = await generateSocialImage(config, logoData);
      expect(ImageResponse).toHaveBeenCalled();
      expect(response).toEqual({ type: "ImageResponse" });
    });

    it("generates image without badges", async () => {
      const config = {
        title: "Title",
      };
      const response = await generateSocialImage(config, logoData);
      expect(ImageResponse).toHaveBeenCalled();
    });

    it("throws and uses fallback if config is missing", async () => {
      const response = await generateSocialImage(null, logoData);
      expect(ImageResponse).toHaveBeenCalled();
    });

    it("handles generation error gracefully", async () => {
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
