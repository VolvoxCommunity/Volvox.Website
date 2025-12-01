import { cn, generateHeadingId } from "../../src/lib/utils";

describe("cn", () => {
  it("merges class names", () => {
    expect(cn("a", "b")).toBe("a b");
  });

  it("handles conditional classes", () => {
    expect(cn("a", true && "b", false && "c")).toBe("a b");
  });

  it("handles arrays", () => {
    expect(cn(["a", "b"])).toBe("a b");
  });

  it("merges tailwind classes", () => {
    expect(cn("p-4", "p-2")).toBe("p-2");
  });
});

describe("generateHeadingId", () => {
  describe("Normal ASCII headings", () => {
    it("converts simple text to lowercase with hyphens", () => {
      expect(generateHeadingId("Hello World")).toBe("hello-world");
    });

    it("handles API-style text correctly", () => {
      expect(generateHeadingId("API Reference")).toBe("api-reference");
    });

    it("removes special characters except hyphens and underscores", () => {
      expect(generateHeadingId("Hello! World?")).toBe("hello-world");
    });

    it("preserves underscores in text", () => {
      expect(generateHeadingId("snake_case_example")).toBe(
        "snake_case_example"
      );
    });

    it("collapses multiple spaces into single hyphen", () => {
      expect(generateHeadingId("Multiple   Spaces   Here")).toBe(
        "multiple-spaces-here"
      );
    });

    it("trims leading and trailing whitespace", () => {
      expect(generateHeadingId("  Spaced  ")).toBe("spaced");
    });

    it("removes leading and trailing hyphens", () => {
      expect(generateHeadingId("-Leading-Trailing-")).toBe("leading-trailing");
    });
  });

  describe("Non-ASCII headings", () => {
    it("generates hash-based ID for Chinese characters", () => {
      const result = generateHeadingId("こんにちは");
      expect(result.startsWith("heading-")).toBeTruthy();
      expect(result.length > 8).toBeTruthy();
      expect(result).toMatch(/^heading-\d+$/);
    });

    it("generates hash-based ID for Arabic characters", () => {
      const result = generateHeadingId("مرحبا");
      expect(result.startsWith("heading-")).toBeTruthy();
      expect(result).toMatch(/^heading-\d+$/);
    });

    it("generates hash-based ID for emoji-only content", () => {
      const result = generateHeadingId("🎉🎊");
      expect(result.startsWith("heading-")).toBeTruthy();
      expect(result).toMatch(/^heading-\d+$/);
    });

    it("generates hash-based ID for Cyrillic characters", () => {
      const result = generateHeadingId("Привет");
      expect(result.startsWith("heading-")).toBeTruthy();
      expect(result).toMatch(/^heading-\d+$/);
    });

    it("generates hash-based ID for Greek characters", () => {
      const result = generateHeadingId("Γεια σου");
      expect(result.startsWith("heading-")).toBeTruthy();
      expect(result).toMatch(/^heading-\d+$/);
    });

    it("generates consistent hash for same non-ASCII input", () => {
      const text = "こんにちは";
      const result1 = generateHeadingId(text);
      const result2 = generateHeadingId(text);
      expect(result1).toBe(result2);
    });

    it("generates different hashes for different non-ASCII inputs", () => {
      const result1 = generateHeadingId("こんにちは");
      const result2 = generateHeadingId("さようなら");
      expect(result1).not.toBe(result2);
    });
  });

  describe("Punctuation-only headings", () => {
    it("generates hash-based ID for punctuation only", () => {
      const result = generateHeadingId("!!!");
      expect(result.startsWith("heading-")).toBeTruthy();
      expect(result).toMatch(/^heading-\d+$/);
    });

    it("generates hash-based ID for symbols only", () => {
      const result = generateHeadingId("@#$%");
      expect(result.startsWith("heading-")).toBeTruthy();
      expect(result).toMatch(/^heading-\d+$/);
    });

    it("generates hash-based ID for mixed punctuation and spaces", () => {
      const result = generateHeadingId("* * *");
      expect(result.startsWith("heading-")).toBeTruthy();
      expect(result).toMatch(/^heading-\d+$/);
    });
  });

  describe("Empty and whitespace handling", () => {
    it("returns empty string for empty input with no fallback", () => {
      expect(generateHeadingId("")).toBe("");
    });

    it("returns fallback for empty input when provided", () => {
      expect(generateHeadingId("", "custom-fallback")).toBe("custom-fallback");
    });

    it("returns fallback for whitespace-only input when provided", () => {
      expect(generateHeadingId("   ", "whitespace-fallback")).toBe(
        "whitespace-fallback"
      );
    });

    it("returns empty string for whitespace-only input with no fallback", () => {
      expect(generateHeadingId("   ")).toBe("");
    });
  });

  describe("Mixed content", () => {
    it("handles ASCII text with emoji", () => {
      const result = generateHeadingId("Hello 🎉 World");
      // The emoji gets removed, leaving "hello-world"
      expect(result).toBe("hello-world");
    });

    it("handles mixed ASCII and non-ASCII that results in valid slug", () => {
      const result = generateHeadingId("Hello こんにちは World");
      // Non-ASCII removed, leaving "hello-world"
      expect(result).toBe("hello-world");
    });

    it("generates hash for mostly non-ASCII with some punctuation", () => {
      const result = generateHeadingId("こんにちは!");
      // Punctuation removed, only non-ASCII remains -> hash-based ID
      expect(result.startsWith("heading-")).toBeTruthy();
      expect(result).toMatch(/^heading-\d+$/);
    });
  });

  describe("Edge cases", () => {
    it("handles very long headings", () => {
      const longText =
        "This is a very long heading that contains many words and should still be processed correctly";
      const result = generateHeadingId(longText);
      expect(result).toBe(
        "this-is-a-very-long-heading-that-contains-many-words-and-should-still-be-processed-correctly"
      );
    });

    it("handles headings with numbers", () => {
      expect(generateHeadingId("Section 123")).toBe("section-123");
    });

    it("handles headings with hyphens", () => {
      expect(generateHeadingId("Pre-existing-hyphens")).toBe(
        "pre-existing-hyphens"
      );
    });

    it("prevents duplicate consecutive hyphens from spaces and punctuation", () => {
      expect(generateHeadingId("Word1  -  Word2")).toBe("word1-word2");
    });
  });

  describe("Hash stability", () => {
    it("generates positive hash values", () => {
      const result = generateHeadingId("こんにちは");
      const hashPart = result.replace("heading-", "");
      const hashValue = parseInt(hashPart, 10);
      expect(hashValue > 0).toBeTruthy();
      expect(!isNaN(hashValue)).toBeTruthy();
    });

    it("generates different hashes for different punctuation patterns", () => {
      const result1 = generateHeadingId("!!!");
      const result2 = generateHeadingId("???");
      expect(result1).not.toBe(result2);
    });
  });
});
