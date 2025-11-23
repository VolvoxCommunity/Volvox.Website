import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import postcss from "postcss";
import postcssrc from "postcss-load-config";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, "..");

void describe("PostCSS Configuration", () => {
  void it("loads postcss.config.mjs successfully", async () => {
    const config = await postcssrc({ cwd: projectRoot });

    assert.ok(config, "PostCSS configuration should be loaded");
    assert.ok(config.plugins, "PostCSS configuration should have plugins");
  });

  void it("includes @tailwindcss/postcss plugin", async () => {
    const config = await postcssrc({ cwd: projectRoot });

    assert.ok(config.plugins, "Plugins should be defined");
    assert.ok(
      config.plugins.length > 0,
      "At least one plugin should be loaded"
    );

    // Verify Tailwind CSS plugin works by processing Tailwind directives
    const testInput = `@import "tailwindcss";`;
    const result = await postcss(config.plugins).process(testInput, {
      from: "test.css",
      to: "test.css",
    });

    assert.ok(
      result.css && result.css.length > testInput.length,
      "Tailwind CSS plugin should be loaded and process directives"
    );
  });

  void it("has correct plugin configuration structure", async () => {
    const config = await postcssrc({ cwd: projectRoot });

    assert.ok(Array.isArray(config.plugins), "Plugins should be an array");
    assert.ok(
      config.plugins.length > 0,
      "At least one plugin should be configured"
    );
  });
});

void describe("Tailwind CSS Processing", () => {
  void it("processes Tailwind CSS @import directive", async () => {
    const input = `@import "tailwindcss";`;

    const config = await postcssrc({ cwd: projectRoot });
    const result = await postcss(config.plugins).process(input, {
      from: "test.css",
      to: "test.css",
    });

    assert.ok(result.css, "Should produce CSS output");
    assert.ok(
      result.css.length > input.length,
      "Output should contain processed Tailwind CSS"
    );
  });

  void it("processes Tailwind CSS @layer directive", async () => {
    const input = `
      @import "tailwindcss";
      
      @layer base {
        body {
          margin: 0;
        }
      }
    `;

    const config = await postcssrc({ cwd: projectRoot });
    const result = await postcss(config.plugins).process(input, {
      from: "test.css",
      to: "test.css",
    });

    assert.ok(result.css, "Should produce CSS output");
    assert.ok(
      result.css.includes("margin"),
      "Should include the layer content"
    );
  });

  void it("processes Tailwind CSS @apply directive", async () => {
    const input = `
      @import "tailwindcss";

      .custom-class {
        @apply bg-blue-500 text-gray-900 px-4 py-2;
      }
    `;

    const config = await postcssrc({ cwd: projectRoot });
    const result = await postcss(config.plugins).process(input, {
      from: "test.css",
      to: "test.css",
    });

    assert.ok(result.css, "Should produce CSS output");
    assert.ok(
      result.css.includes("custom-class"),
      "Should include the custom class"
    );
  });

  void it("processes Tailwind CSS utility classes", async () => {
    const input = `
      @import "tailwindcss";
    `;

    const config = await postcssrc({ cwd: projectRoot });
    const result = await postcss(config.plugins).process(input, {
      from: "test.css",
      to: "test.css",
    });

    assert.ok(result.css, "Should produce CSS output");
    assert.ok(
      result.css.length > 0,
      "Should generate Tailwind base styles and utilities"
    );
  });

  void it("processes custom @theme directive", async () => {
    const input = `
      @import "tailwindcss";
      
      @theme {
        --color-custom: #ff0000;
      }
    `;

    const config = await postcssrc({ cwd: projectRoot });
    const result = await postcss(config.plugins).process(input, {
      from: "test.css",
      to: "test.css",
    });

    assert.ok(result.css, "Should produce CSS output");
    assert.ok(
      result.css.includes("--color-custom") || result.css.includes("custom"),
      "Should process custom theme variables"
    );
  });

  void it("processes custom @variant directive", async () => {
    const input = `
      @import "tailwindcss";
      
      @variant dark (&:where(.dark, .dark *));
    `;

    const config = await postcssrc({ cwd: projectRoot });
    const result = await postcss(config.plugins).process(input, {
      from: "test.css",
      to: "test.css",
    });

    assert.ok(result.css, "Should produce CSS output");
    // The variant should be processed without errors
    assert.ok(result.css.length > 0, "Should generate output");
  });

  void it("handles the globals.css file structure", async () => {
    const input = `
      @import "tailwindcss";

      @variant dark (&:where(.dark, .dark *));

      @theme {
        --color-*: initial;
        --color-background: #ffffff;
        --color-foreground: #000000;
        --color-border: #e5e7eb;
      }

      @layer base {
        * {
          @apply border-border;
        }

        body {
          @apply bg-background text-foreground;
        }
      }
    `;

    const config = await postcssrc({ cwd: projectRoot });
    const result = await postcss(config.plugins).process(input, {
      from: "globals.css",
      to: "globals.css",
    });

    assert.ok(result.css, "Should produce CSS output");
    assert.ok(
      result.css.length > input.length,
      "Should expand Tailwind directives"
    );
  });
});

void describe("PostCSS Processing", () => {
  void it("processes valid CSS without errors", async () => {
    const input = `
      @import "tailwindcss";

      .valid-class {
        color: #fff;
        background: #000;
        padding: 1rem;
      }
    `;

    const config = await postcssrc({ cwd: projectRoot });

    // Should not throw any errors
    const result = await postcss(config.plugins).process(input, {
      from: "test.css",
      to: "test.css",
    });

    assert.ok(result.css, "Should produce CSS output");
    assert.ok(
      result.css.includes("valid-class"),
      "Should include the valid class"
    );
  });
});
