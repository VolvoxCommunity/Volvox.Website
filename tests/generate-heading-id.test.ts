import { describe, it } from "node:test";
import assert from "node:assert";
import { generateHeadingId } from "../src/lib/utils";

void describe("generateHeadingId", () => {
  void describe("Normal ASCII headings", () => {
    void it("converts simple text to lowercase with hyphens", () => {
      assert.strictEqual(generateHeadingId("Hello World"), "hello-world");
    });

    void it("handles API-style text correctly", () => {
      assert.strictEqual(generateHeadingId("API Reference"), "api-reference");
    });

    void it("removes special characters except hyphens and underscores", () => {
      assert.strictEqual(generateHeadingId("Hello! World?"), "hello-world");
    });

    void it("preserves underscores in text", () => {
      assert.strictEqual(
        generateHeadingId("snake_case_example"),
        "snake_case_example"
      );
    });

    void it("collapses multiple spaces into single hyphen", () => {
      assert.strictEqual(
        generateHeadingId("Multiple   Spaces   Here"),
        "multiple-spaces-here"
      );
    });

    void it("trims leading and trailing whitespace", () => {
      assert.strictEqual(generateHeadingId("  Spaced  "), "spaced");
    });

    void it("removes leading and trailing hyphens", () => {
      assert.strictEqual(
        generateHeadingId("-Leading-Trailing-"),
        "leading-trailing"
      );
    });
  });

  void describe("Non-ASCII headings", () => {
    void it("generates hash-based ID for Chinese characters", () => {
      const result = generateHeadingId("こんにちは");
      assert.ok(result.startsWith("heading-"), "Should start with 'heading-'");
      assert.ok(result.length > 8, "Should contain hash number");
      assert.match(
        result,
        /^heading-\d+$/,
        "Should match pattern heading-[number]"
      );
    });

    void it("generates hash-based ID for Arabic characters", () => {
      const result = generateHeadingId("مرحبا");
      assert.ok(result.startsWith("heading-"), "Should start with 'heading-'");
      assert.match(
        result,
        /^heading-\d+$/,
        "Should match pattern heading-[number]"
      );
    });

    void it("generates hash-based ID for emoji-only content", () => {
      const result = generateHeadingId("🎉🎊");
      assert.ok(result.startsWith("heading-"), "Should start with 'heading-'");
      assert.match(
        result,
        /^heading-\d+$/,
        "Should match pattern heading-[number]"
      );
    });

    void it("generates hash-based ID for Cyrillic characters", () => {
      const result = generateHeadingId("Привет");
      assert.ok(result.startsWith("heading-"), "Should start with 'heading-'");
      assert.match(
        result,
        /^heading-\d+$/,
        "Should match pattern heading-[number]"
      );
    });

    void it("generates hash-based ID for Greek characters", () => {
      const result = generateHeadingId("Γεια σου");
      assert.ok(result.startsWith("heading-"), "Should start with 'heading-'");
      assert.match(
        result,
        /^heading-\d+$/,
        "Should match pattern heading-[number]"
      );
    });

    void it("generates consistent hash for same non-ASCII input", () => {
      const text = "こんにちは";
      const result1 = generateHeadingId(text);
      const result2 = generateHeadingId(text);
      assert.strictEqual(
        result1,
        result2,
        "Same input should produce same hash"
      );
    });

    void it("generates different hashes for different non-ASCII inputs", () => {
      const result1 = generateHeadingId("こんにちは");
      const result2 = generateHeadingId("さようなら");
      assert.notStrictEqual(
        result1,
        result2,
        "Different inputs should produce different hashes"
      );
    });
  });

  void describe("Punctuation-only headings", () => {
    void it("generates hash-based ID for punctuation only", () => {
      const result = generateHeadingId("!!!");
      assert.ok(result.startsWith("heading-"), "Should start with 'heading-'");
      assert.match(
        result,
        /^heading-\d+$/,
        "Should match pattern heading-[number]"
      );
    });

    void it("generates hash-based ID for symbols only", () => {
      const result = generateHeadingId("@#$%");
      assert.ok(result.startsWith("heading-"), "Should start with 'heading-'");
      assert.match(
        result,
        /^heading-\d+$/,
        "Should match pattern heading-[number]"
      );
    });

    void it("generates hash-based ID for mixed punctuation and spaces", () => {
      const result = generateHeadingId("* * *");
      assert.ok(result.startsWith("heading-"), "Should start with 'heading-'");
      assert.match(
        result,
        /^heading-\d+$/,
        "Should match pattern heading-[number]"
      );
    });
  });

  void describe("Empty and whitespace handling", () => {
    void it("returns empty string for empty input with no fallback", () => {
      assert.strictEqual(generateHeadingId(""), "");
    });

    void it("returns fallback for empty input when provided", () => {
      assert.strictEqual(
        generateHeadingId("", "custom-fallback"),
        "custom-fallback"
      );
    });

    void it("returns fallback for whitespace-only input when provided", () => {
      assert.strictEqual(
        generateHeadingId("   ", "whitespace-fallback"),
        "whitespace-fallback"
      );
    });

    void it("returns empty string for whitespace-only input with no fallback", () => {
      assert.strictEqual(generateHeadingId("   "), "");
    });
  });

  void describe("Mixed content", () => {
    void it("handles ASCII text with emoji", () => {
      const result = generateHeadingId("Hello 🎉 World");
      // The emoji gets removed, leaving "hello-world"
      assert.strictEqual(result, "hello-world");
    });

    void it("handles mixed ASCII and non-ASCII that results in valid slug", () => {
      const result = generateHeadingId("Hello こんにちは World");
      // Non-ASCII removed, leaving "hello-world"
      assert.strictEqual(result, "hello-world");
    });

    void it("generates hash for mostly non-ASCII with some punctuation", () => {
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

  void describe("Edge cases", () => {
    void it("handles very long headings", () => {
      const longText =
        "This is a very long heading that contains many words and should still be processed correctly";
      const result = generateHeadingId(longText);
      assert.strictEqual(
        result,
        "this-is-a-very-long-heading-that-contains-many-words-and-should-still-be-processed-correctly"
      );
    });

    void it("handles headings with numbers", () => {
      assert.strictEqual(generateHeadingId("Section 123"), "section-123");
    });

    void it("handles headings with hyphens", () => {
      assert.strictEqual(
        generateHeadingId("Pre-existing-hyphens"),
        "pre-existing-hyphens"
      );
    });

    void it("prevents duplicate consecutive hyphens from spaces and punctuation", () => {
      assert.strictEqual(generateHeadingId("Word1  -  Word2"), "word1-word2");
    });
  });

  void describe("Hash stability", () => {
    void it("generates positive hash values", () => {
      const result = generateHeadingId("こんにちは");
      const hashPart = result.replace("heading-", "");
      const hashValue = parseInt(hashPart, 10);
      assert.ok(hashValue > 0, "Hash should be positive");
      assert.ok(!isNaN(hashValue), "Hash should be a valid number");
    });

    void it("generates different hashes for different punctuation patterns", () => {
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
