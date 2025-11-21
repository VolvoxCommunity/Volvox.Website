import { describe, it } from "node:test";
import assert from "node:assert";
import { generateHeadingId } from "../src/lib/utils";

describe("generateHeadingId", () => {
  describe("Normal ASCII headings", () => {
    it("converts simple text to lowercase with hyphens", () => {
      assert.strictEqual(generateHeadingId("Hello World"), "hello-world");
    });

    it("handles API-style text correctly", () => {
      assert.strictEqual(generateHeadingId("API Reference"), "api-reference");
    });

    it("removes special characters except hyphens and underscores", () => {
      assert.strictEqual(generateHeadingId("Hello! World?"), "hello-world");
    });

    it("preserves underscores in text", () => {
      assert.strictEqual(
        generateHeadingId("snake_case_example"),
        "snake_case_example"
      );
    });

    it("collapses multiple spaces into single hyphen", () => {
      assert.strictEqual(
        generateHeadingId("Multiple   Spaces   Here"),
        "multiple-spaces-here"
      );
    });

    it("trims leading and trailing whitespace", () => {
      assert.strictEqual(generateHeadingId("  Spaced  "), "spaced");
    });

    it("removes leading and trailing hyphens", () => {
      assert.strictEqual(
        generateHeadingId("-Leading-Trailing-"),
        "leading-trailing"
      );
    });
  });

  describe("Non-ASCII headings", () => {
    it("generates hash-based ID for Chinese characters", () => {
      const result = generateHeadingId("こんにちは");
      assert.ok(result.startsWith("heading-"), "Should start with 'heading-'");
      assert.ok(result.length > 8, "Should contain hash number");
      assert.match(
        result,
        /^heading-\d+$/,
        "Should match pattern heading-[number]"
      );
    });

    it("generates hash-based ID for Arabic characters", () => {
      const result = generateHeadingId("مرحبا");
      assert.ok(result.startsWith("heading-"), "Should start with 'heading-'");
      assert.match(
        result,
        /^heading-\d+$/,
        "Should match pattern heading-[number]"
      );
    });

    it("generates hash-based ID for emoji-only content", () => {
      const result = generateHeadingId("🎉🎊");
      assert.ok(result.startsWith("heading-"), "Should start with 'heading-'");
      assert.match(
        result,
        /^heading-\d+$/,
        "Should match pattern heading-[number]"
      );
    });

    it("generates hash-based ID for Cyrillic characters", () => {
      const result = generateHeadingId("Привет");
      assert.ok(result.startsWith("heading-"), "Should start with 'heading-'");
      assert.match(
        result,
        /^heading-\d+$/,
        "Should match pattern heading-[number]"
      );
    });

    it("generates hash-based ID for Greek characters", () => {
      const result = generateHeadingId("Γεια σου");
      assert.ok(result.startsWith("heading-"), "Should start with 'heading-'");
      assert.match(
        result,
        /^heading-\d+$/,
        "Should match pattern heading-[number]"
      );
    });

    it("generates consistent hash for same non-ASCII input", () => {
      const text = "こんにちは";
      const result1 = generateHeadingId(text);
      const result2 = generateHeadingId(text);
      assert.strictEqual(
        result1,
        result2,
        "Same input should produce same hash"
      );
    });

    it("generates different hashes for different non-ASCII inputs", () => {
      const result1 = generateHeadingId("こんにちは");
      const result2 = generateHeadingId("さようなら");
      assert.notStrictEqual(
        result1,
        result2,
        "Different inputs should produce different hashes"
      );
    });
  });

  describe("Punctuation-only headings", () => {
    it("generates hash-based ID for punctuation only", () => {
      const result = generateHeadingId("!!!");
      assert.ok(result.startsWith("heading-"), "Should start with 'heading-'");
      assert.match(
        result,
        /^heading-\d+$/,
        "Should match pattern heading-[number]"
      );
    });

    it("generates hash-based ID for symbols only", () => {
      const result = generateHeadingId("@#$%");
      assert.ok(result.startsWith("heading-"), "Should start with 'heading-'");
      assert.match(
        result,
        /^heading-\d+$/,
        "Should match pattern heading-[number]"
      );
    });

    it("generates hash-based ID for mixed punctuation and spaces", () => {
      const result = generateHeadingId("* * *");
      assert.ok(result.startsWith("heading-"), "Should start with 'heading-'");
      assert.match(
        result,
        /^heading-\d+$/,
        "Should match pattern heading-[number]"
      );
    });
  });

  describe("Empty and whitespace handling", () => {
    it("returns empty string for empty input with no fallback", () => {
      assert.strictEqual(generateHeadingId(""), "");
    });

    it("returns fallback for empty input when provided", () => {
      assert.strictEqual(
        generateHeadingId("", "custom-fallback"),
        "custom-fallback"
      );
    });

    it("returns fallback for whitespace-only input when provided", () => {
      assert.strictEqual(
        generateHeadingId("   ", "whitespace-fallback"),
        "whitespace-fallback"
      );
    });

    it("returns empty string for whitespace-only input with no fallback", () => {
      assert.strictEqual(generateHeadingId("   "), "");
    });
  });

  describe("Mixed content", () => {
    it("handles ASCII text with emoji", () => {
      const result = generateHeadingId("Hello 🎉 World");
      // The emoji gets removed, leaving "hello-world"
      assert.strictEqual(result, "hello-world");
    });

    it("handles mixed ASCII and non-ASCII that results in valid slug", () => {
      const result = generateHeadingId("Hello こんにちは World");
      // Non-ASCII removed, leaving "hello-world"
      assert.strictEqual(result, "hello-world");
    });

    it("generates hash for mostly non-ASCII with some punctuation", () => {
      const result = generateHeadingId("こんにちは!");
      // Punctuation removed, only non-ASCII remains -> hash-based ID
      assert.ok(result.startsWith("heading-"), "Should start with 'heading-'");
      assert.match(
        result,
        /^heading-\d+$/,
        "Should match pattern heading-[number]"
      );
    });
  });

  describe("Edge cases", () => {
    it("handles very long headings", () => {
      const longText =
        "This is a very long heading that contains many words and should still be processed correctly";
      const result = generateHeadingId(longText);
      assert.strictEqual(
        result,
        "this-is-a-very-long-heading-that-contains-many-words-and-should-still-be-processed-correctly"
      );
    });

    it("handles headings with numbers", () => {
      assert.strictEqual(generateHeadingId("Section 123"), "section-123");
    });

    it("handles headings with hyphens", () => {
      assert.strictEqual(
        generateHeadingId("Pre-existing-hyphens"),
        "pre-existing-hyphens"
      );
    });

    it("prevents duplicate consecutive hyphens from spaces and punctuation", () => {
      assert.strictEqual(generateHeadingId("Word1  -  Word2"), "word1-word2");
    });
  });

  describe("Hash stability", () => {
    it("generates positive hash values", () => {
      const result = generateHeadingId("こんにちは");
      const hashPart = result.replace("heading-", "");
      const hashValue = parseInt(hashPart, 10);
      assert.ok(hashValue > 0, "Hash should be positive");
      assert.ok(!isNaN(hashValue), "Hash should be a valid number");
    });

    it("generates different hashes for different punctuation patterns", () => {
      const result1 = generateHeadingId("!!!");
      const result2 = generateHeadingId("???");
      assert.notStrictEqual(
        result1,
        result2,
        "Different punctuation should produce different hashes"
      );
    });
  });
});
