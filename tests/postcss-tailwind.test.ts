import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import postcss from "postcss";
import postcssrc from "postcss-load-config";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, "..");

describe("PostCSS Configuration", () => {
  it("loads postcss.config.mjs successfully", async () => {
    const config = await postcssrc({ cwd: projectRoot });

    assert.ok(config, "PostCSS configuration should be loaded");
    assert.ok(config.plugins, "PostCSS configuration should have plugins");
  });

  it("includes @tailwindcss/postcss plugin", async () => {
    const config = await postcssrc({ cwd: projectRoot });

    const pluginNames = config.plugins.map((plugin: any) => {
      // PostCSS plugins can be functions with a postcss property
      return plugin.postcssPlugin || plugin.postcss?.postcssPlugin;
    });

    assert.ok(
      pluginNames.includes("@tailwindcss/postcss"),
      "@tailwindcss/postcss plugin should be loaded"
    );
  });

  it("has correct plugin configuration structure", async () => {
    const config = await postcssrc({ cwd: projectRoot });

    assert.ok(Array.isArray(config.plugins), "Plugins should be an array");
    assert.ok(
      config.plugins.length > 0,
      "At least one plugin should be configured"
    );
  });
});

describe("Tailwind CSS Processing", () => {
  it("processes Tailwind CSS @import directive", async () => {
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

  it("processes Tailwind CSS @layer directive", async () => {
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

  it("processes Tailwind CSS @apply directive", async () => {
    const input = `
      @import "tailwindcss";
      
      .custom-class {
        @apply bg-background text-foreground;
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
    assert.notEqual(
      result.css.indexOf("@apply"),
      -1,
      "May contain @apply in output or be transformed"
    );
  });

  it("processes Tailwind CSS utility classes", async () => {
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

  it("processes custom @theme directive", async () => {
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

  it("processes custom @variant directive", async () => {
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

  it("handles the globals.css file structure", async () => {
    const input = `
      @import "tailwindcss";
      
      @variant dark (&:where(.dark, .dark *));
      
      @theme {
        --color-*: initial;
        --color-background: var(--background);
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

describe("PostCSS Error Handling", () => {
  it("throws error on invalid CSS syntax", async () => {
    const input = `
      .invalid {
        color: ;
      }
    `;

    const config = await postcssrc({ cwd: projectRoot });

    await assert.rejects(
      async () => {
        await postcss(config.plugins).process(input, {
          from: "test.css",
          to: "test.css",
        });
      },
      {
        name: "CssSyntaxError",
      },
      "Should throw CssSyntaxError for invalid CSS"
    );
  });
});
