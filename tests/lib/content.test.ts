import {
  getAllAuthors,
  getAuthorById,
  getAllProducts,
  getAllMentors,
  getAllMentees,
  getAllExtendedProducts,
  getExtendedProductBySlug,
  getProductChangelog,
  isValidSlug,
} from "@/lib/content";
import * as fs from "fs";
import { reportError } from "@/lib/logger";

jest.mock("fs");
jest.mock("@/lib/logger", () => ({ reportError: jest.fn() }));

describe("content lib", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe("getAllAuthors", () => {
    it("returns parsed authors", () => {
      const mockAuthors = [
        { id: "1", name: "Author 1", avatar: "/img1", role: "Role" },
      ];
      (fs.readFileSync as jest.Mock).mockReturnValue(
        JSON.stringify(mockAuthors)
      );

      const result = getAllAuthors();
      expect(result).toEqual(mockAuthors);
    });

    it("handles file read errors", () => {
      (fs.readFileSync as jest.Mock).mockImplementation(() => {
        throw new Error("File read error");
      });
      const result = getAllAuthors();
      expect(result).toEqual([]);
      expect(reportError).toHaveBeenCalled();
    });

    it("handles invalid JSON data (Zod validation failure)", () => {
      // Missing required 'role' field should fail Zod validation
      const invalidAuthors = [{ id: "1", name: "Author 1", avatar: "/img1" }];
      (fs.readFileSync as jest.Mock).mockReturnValue(
        JSON.stringify(invalidAuthors)
      );

      const result = getAllAuthors();
      expect(result).toEqual([]);
      expect(reportError).toHaveBeenCalled();
    });

    it("handles malformed JSON", () => {
      (fs.readFileSync as jest.Mock).mockReturnValue("not valid json");

      const result = getAllAuthors();
      expect(result).toEqual([]);
      expect(reportError).toHaveBeenCalled();
    });
  });

  describe("getAuthorById", () => {
    it("returns author if found", () => {
      const mockAuthors = [
        { id: "1", name: "Author 1", avatar: "/img1", role: "Role" },
      ];
      (fs.readFileSync as jest.Mock).mockReturnValue(
        JSON.stringify(mockAuthors)
      );

      const result = getAuthorById("1");
      expect(result).toEqual(mockAuthors[0]);
    });

    it("returns null if not found", () => {
      const mockAuthors = [
        { id: "1", name: "Author 1", avatar: "/img1", role: "Role" },
      ];
      (fs.readFileSync as jest.Mock).mockReturnValue(
        JSON.stringify(mockAuthors)
      );

      const result = getAuthorById("2");
      expect(result).toBeNull();
    });
  });

  describe("getAllProducts", () => {
    it("returns products", () => {
      const mock = [
        {
          id: "1",
          name: "P1",
          description: "D1",
          longDescription: "LD1",
          features: ["F1"],
          image: "I1",
        },
      ];
      (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(mock));
      expect(getAllProducts()).toEqual(mock);
    });

    it("handles file read errors", () => {
      (fs.readFileSync as jest.Mock).mockImplementation(() => {
        throw new Error("File read error");
      });
      const result = getAllProducts();
      expect(result).toEqual([]);
      expect(reportError).toHaveBeenCalled();
    });
  });

  describe("getAllMentors", () => {
    it("returns mentors", () => {
      const mock = [
        {
          id: "1",
          name: "M1",
          role: "R1",
          avatar: "I1",
          expertise: ["E1"],
          bio: "B1",
        },
      ];
      (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(mock));
      expect(getAllMentors()).toEqual(mock);
    });

    it("handles file read errors", () => {
      (fs.readFileSync as jest.Mock).mockImplementation(() => {
        throw new Error("File read error");
      });
      const result = getAllMentors();
      expect(result).toEqual([]);
      expect(reportError).toHaveBeenCalled();
    });
  });

  describe("getAllMentees", () => {
    it("returns mentees", () => {
      const mock = [
        { id: "1", name: "M1", avatar: "I1", goals: "G1", progress: "P1" },
      ];
      (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(mock));
      expect(getAllMentees()).toEqual(mock);
    });

    it("handles file read errors", () => {
      (fs.readFileSync as jest.Mock).mockImplementation(() => {
        throw new Error("File read error");
      });
      const result = getAllMentees();
      expect(result).toEqual([]);
      expect(reportError).toHaveBeenCalled();
    });
  });

  describe("Extended Product Content", () => {
    describe("getAllExtendedProducts", () => {
      it("returns array of extended products", () => {
        (fs.existsSync as jest.Mock).mockReturnValue(true);
        (fs.readdirSync as jest.Mock).mockReturnValue([
          { name: "sobriety-waypoint", isDirectory: () => true },
        ]);
        const mockProduct = {
          id: "ee7a459b-9319-4568-8c70-a9842e3c3558",
          name: "Sobriety Waypoint",
          slug: "sobriety-waypoint",
          tagline: "Recovery made simple",
          description: "A comprehensive accountability app",
          longDescription:
            "Sobriety Waypoint transforms the sponsor-sponsee relationship",
          features: ["Feature 1"],
          techStack: ["React Native"],
          links: {},
          screenshots: [],
          faq: [],
          testimonials: [],
        };
        (fs.readFileSync as jest.Mock).mockReturnValue(
          JSON.stringify(mockProduct)
        );

        const products = getAllExtendedProducts();
        expect(Array.isArray(products)).toBe(true);
      });

      it("returns products with required fields", () => {
        (fs.existsSync as jest.Mock).mockReturnValue(true);
        (fs.readdirSync as jest.Mock).mockReturnValue([
          { name: "sobriety-waypoint", isDirectory: () => true },
        ]);
        const mockProduct = {
          id: "ee7a459b-9319-4568-8c70-a9842e3c3558",
          name: "Sobriety Waypoint",
          slug: "sobriety-waypoint",
          tagline: "Recovery made simple",
          description: "A comprehensive accountability app",
          longDescription:
            "Sobriety Waypoint transforms the sponsor-sponsee relationship",
          features: ["Feature 1"],
          techStack: ["React Native"],
          links: {},
          screenshots: [],
          faq: [],
          testimonials: [],
        };
        (fs.readFileSync as jest.Mock).mockReturnValue(
          JSON.stringify(mockProduct)
        );

        const products = getAllExtendedProducts();
        if (products.length > 0) {
          const product = products[0];
          expect(product).toHaveProperty("id");
          expect(product).toHaveProperty("slug");
          expect(product).toHaveProperty("tagline");
          expect(product).toHaveProperty("links");
          expect(product).toHaveProperty("faq");
        }
      });
    });

    describe("getExtendedProductBySlug", () => {
      it("returns product for valid slug", () => {
        (fs.existsSync as jest.Mock).mockReturnValue(true);
        const mockProduct = {
          id: "ee7a459b-9319-4568-8c70-a9842e3c3558",
          name: "Sobriety Waypoint",
          slug: "sobriety-waypoint",
          tagline: "Recovery made simple",
          description: "A comprehensive accountability app",
          longDescription:
            "Sobriety Waypoint transforms the sponsor-sponsee relationship",
          features: ["Feature 1"],
          techStack: ["React Native"],
          links: {},
          screenshots: [],
          faq: [],
          testimonials: [],
        };
        (fs.readFileSync as jest.Mock).mockReturnValue(
          JSON.stringify(mockProduct)
        );

        const product = getExtendedProductBySlug("sobriety-waypoint");
        expect(product).not.toBeNull();
        expect(product?.slug).toBe("sobriety-waypoint");
      });

      it("returns null for invalid slug", () => {
        (fs.existsSync as jest.Mock).mockReturnValue(false);
        const product = getExtendedProductBySlug("nonexistent-product");
        expect(product).toBeNull();
      });
    });

    describe("getProductChangelog", () => {
      it("returns changelog content for valid slug", () => {
        (fs.existsSync as jest.Mock).mockReturnValue(true);
        (fs.readFileSync as jest.Mock).mockReturnValue(
          "# Changelog\n\nAll notable changes"
        );

        const changelog = getProductChangelog("sobriety-waypoint");
        expect(changelog).not.toBeNull();
        expect(changelog).toContain("Changelog");
      });

      it("returns null for invalid slug", () => {
        (fs.existsSync as jest.Mock).mockReturnValue(false);
        const changelog = getProductChangelog("nonexistent-product");
        expect(changelog).toBeNull();
      });
    });
  });

  describe("Path Traversal Prevention", () => {
    describe("isValidSlug", () => {
      it("accepts valid lowercase slugs", () => {
        expect(isValidSlug("sobriety-waypoint")).toBe(true);
        expect(isValidSlug("product-1")).toBe(true);
        expect(isValidSlug("my-app")).toBe(true);
        expect(isValidSlug("test123")).toBe(true);
        // Numeric-only slugs should also be valid
        expect(isValidSlug("123")).toBe(true);
        expect(isValidSlug("456789")).toBe(true);
      });

      it("rejects uppercase slugs", () => {
        expect(isValidSlug("UPPERCASE")).toBe(false);
        expect(isValidSlug("MixedCase-123")).toBe(false);
        expect(isValidSlug("Product-Name")).toBe(false);
      });

      it("rejects path traversal attempts", () => {
        expect(isValidSlug("../etc/passwd")).toBe(false);
        expect(isValidSlug("..")).toBe(false);
        expect(isValidSlug("../")).toBe(false);
        expect(isValidSlug("foo/../bar")).toBe(false);
        expect(isValidSlug("foo/bar")).toBe(false);
        expect(isValidSlug("/etc/passwd")).toBe(false);
      });

      it("rejects slugs with special characters", () => {
        expect(isValidSlug("foo bar")).toBe(false);
        expect(isValidSlug("foo_bar")).toBe(false);
        expect(isValidSlug("foo.bar")).toBe(false);
        expect(isValidSlug("")).toBe(false);
      });
    });

    describe("getExtendedProductBySlug path traversal", () => {
      beforeEach(() => {
        (fs.existsSync as jest.Mock).mockClear();
      });

      it("returns null for path traversal attempts", () => {
        // These should NOT trigger any file system access
        expect(getExtendedProductBySlug("../etc/passwd")).toBeNull();
        expect(getExtendedProductBySlug("..")).toBeNull();
        expect(getExtendedProductBySlug("foo/../bar")).toBeNull();
        expect(getExtendedProductBySlug("/etc/passwd")).toBeNull();

        // Verify fs.existsSync was NOT called (validation blocked before fs access)
        expect(fs.existsSync).not.toHaveBeenCalled();
      });
    });

    describe("getProductChangelog path traversal", () => {
      beforeEach(() => {
        (fs.existsSync as jest.Mock).mockClear();
      });

      it("returns null for path traversal attempts", () => {
        // These should NOT trigger any file system access
        expect(getProductChangelog("../etc/passwd")).toBeNull();
        expect(getProductChangelog("..")).toBeNull();
        expect(getProductChangelog("foo/../bar")).toBeNull();
        expect(getProductChangelog("/etc/passwd")).toBeNull();

        // Verify fs.existsSync was NOT called (validation blocked before fs access)
        expect(fs.existsSync).not.toHaveBeenCalled();
      });
    });
  });
});
