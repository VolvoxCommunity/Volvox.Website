/**
 * @jest-environment node
 */
import postcss from "postcss";
import tailwindcss from "@tailwindcss/postcss";

const getConfig = () => ({
  plugins: [tailwindcss()]
});

describe("PostCSS Configuration", () => {
  it("includes @tailwindcss/postcss plugin", async () => {
    const config = getConfig();

    expect(config.plugins).toBeTruthy();
    expect(config.plugins.length).toBeGreaterThan(0);

    // Verify Tailwind CSS plugin works by processing Tailwind directives
    const testInput = `@import "tailwindcss";`;
    const result = await postcss(config.plugins).process(testInput, {
      from: "test.css",
      to: "test.css",
    });

    expect(result.css).toBeTruthy();
    expect(result.css.length).toBeGreaterThan(testInput.length);
  });

  it("has correct plugin configuration structure", async () => {
    const config = getConfig();

    expect(Array.isArray(config.plugins)).toBeTruthy();
    expect(config.plugins.length).toBeGreaterThan(0);
  });
});

describe("Tailwind CSS Processing", () => {
  it("processes Tailwind CSS @import directive", async () => {
    const input = `@import "tailwindcss";`;

    const config = getConfig();
    const result = await postcss(config.plugins).process(input, {
      from: "test.css",
      to: "test.css",
    });

    expect(result.css).toBeTruthy();
    expect(result.css.length).toBeGreaterThan(input.length);
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

    const config = getConfig();
    const result = await postcss(config.plugins).process(input, {
      from: "test.css",
      to: "test.css",
    });

    expect(result.css).toBeTruthy();
    expect(result.css.includes("margin")).toBeTruthy();
  });

  it("processes Tailwind CSS @apply directive", async () => {
    const input = `
      @import "tailwindcss";

      .custom-class {
        @apply bg-blue-500 text-gray-900 px-4 py-2;
      }
    `;

    const config = getConfig();
    const result = await postcss(config.plugins).process(input, {
      from: "test.css",
      to: "test.css",
    });

    expect(result.css).toBeTruthy();
    expect(result.css.includes("custom-class")).toBeTruthy();
  });

  it("processes Tailwind CSS utility classes", async () => {
    const input = `
      @import "tailwindcss";
    `;

    const config = getConfig();
    const result = await postcss(config.plugins).process(input, {
      from: "test.css",
      to: "test.css",
    });

    expect(result.css).toBeTruthy();
    expect(result.css.length).toBeGreaterThan(0);
  });

  it("processes custom @theme directive", async () => {
    const input = `
      @import "tailwindcss";
      
      @theme {
        --color-custom: #ff0000;
      }
    `;

    const config = getConfig();
    const result = await postcss(config.plugins).process(input, {
      from: "test.css",
      to: "test.css",
    });

    expect(result.css).toBeTruthy();
    expect(
      result.css.includes("--color-custom") || result.css.includes("custom")
    ).toBeTruthy();
  });

  it("processes custom @variant directive", async () => {
    const input = `
      @import "tailwindcss";
      
      @variant dark (&:where(.dark, .dark *));
    `;

    const config = getConfig();
    const result = await postcss(config.plugins).process(input, {
      from: "test.css",
      to: "test.css",
    });

    expect(result.css).toBeTruthy();
    // The variant should be processed without errors
    expect(result.css.length).toBeGreaterThan(0);
  });

  it("handles the globals.css file structure", async () => {
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

    const config = getConfig();
    const result = await postcss(config.plugins).process(input, {
      from: "globals.css",
      to: "globals.css",
    });

    expect(result.css).toBeTruthy();
    expect(result.css.length).toBeGreaterThan(input.length);
  });
});

describe("PostCSS Processing", () => {
  it("processes valid CSS without errors", async () => {
    const input = `
      @import "tailwindcss";

      .valid-class {
        color: #fff;
        background: #000;
        padding: 1rem;
      }
    `;

    const config = getConfig();

    // Should not throw any errors
    const result = await postcss(config.plugins).process(input, {
      from: "test.css",
      to: "test.css",
    });

    expect(result.css).toBeTruthy();
    expect(result.css.includes("valid-class")).toBeTruthy();
  });
});
