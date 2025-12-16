import { test, expect } from "./fixtures/base.fixture";

const pages = [
  { name: "Homepage", path: "/" },
  { name: "Blog Post", path: "/blog/announcing-volvox" },
  { name: "Products", path: "/products" },
  { name: "Product Detail", path: "/products/sobriety-waypoint" },
  { name: "Privacy", path: "/privacy" },
  { name: "Terms", path: "/terms" },
];

test.describe("Performance", () => {
  test.describe("Page Load Times", () => {
    for (const { name, path } of pages) {
      test(`${name} loads within 3 seconds`, async ({ page }) => {
        const start = Date.now();
        await page.goto(path, { waitUntil: "domcontentloaded" });
        const loadTime = Date.now() - start;

        expect(loadTime, `${name} took ${loadTime}ms`).toBeLessThan(3000);
      });
    }
  });

  test.describe("No Console Errors", () => {
    for (const { name, path } of pages) {
      test(`${name} has no console errors`, async ({
        page,
        assertNoConsoleErrors,
      }) => {
        await page.goto(path);
        await page.waitForLoadState("networkidle");
        await assertNoConsoleErrors();
      });
    }
  });

  test.describe("No Failed Network Requests", () => {
    for (const { name, path } of pages) {
      test(`${name} has no failed requests`, async ({
        page,
        assertNoFailedRequests,
      }) => {
        await page.goto(path);
        await page.waitForLoadState("networkidle");
        await assertNoFailedRequests();
      });
    }
  });

  test.describe("Critical Resources", () => {
    test("fonts load correctly", async ({ page }) => {
      const fontRequests: string[] = [];
      page.on("response", (res) => {
        if (
          res.url().includes("fonts") ||
          res.headers()["content-type"]?.includes("font")
        ) {
          fontRequests.push(res.url());
        }
      });

      await page.goto("/");
      await page.waitForLoadState("networkidle");

      expect(fontRequests.length).toBeGreaterThan(0);
    });

    test("critical images load", async ({ page }) => {
      const failedImages: string[] = [];

      await page.goto("/");
      await page.waitForLoadState("networkidle");

      // Wait for all images to complete loading
      await page.evaluate(async () => {
        const images = Array.from(document.querySelectorAll("img"));
        await Promise.all(
          images.map((img) => {
            if (img.complete) return Promise.resolve();
            return new Promise((resolve) => {
              img.addEventListener("load", resolve);
              img.addEventListener("error", resolve);
              // Timeout after 5 seconds per image
              setTimeout(resolve, 5000);
            });
          })
        );
      });

      const images = page.locator("img");
      const count = await images.count();

      for (let i = 0; i < count; i++) {
        const img = images.nth(i);
        const naturalWidth = await img.evaluate(
          (el: HTMLImageElement) => el.naturalWidth
        );
        if (naturalWidth === 0) {
          const src = await img.getAttribute("src");
          // Ignore placeholder/lazy-loaded images with data URIs or empty src
          if (src && !src.startsWith("data:") && src !== "") {
            failedImages.push(src);
          }
        }
      }

      expect(failedImages, `Failed images: ${failedImages.join(", ")}`).toEqual(
        []
      );
    });

    test("JavaScript bundles load without errors", async ({ page }) => {
      const jsErrors: string[] = [];

      page.on("pageerror", (err) => {
        jsErrors.push(err.message);
      });

      page.on("response", (res) => {
        const url = res.url();
        // Match .js, .mjs files and bundled chunks with query strings
        const isJsFile =
          /\.(js|mjs)(\?|$)/.test(url) || url.includes("/_next/static/chunks/");
        if (isJsFile && res.status() >= 400) {
          jsErrors.push(`Failed to load: ${url}`);
        }
      });

      await page.goto("/");
      await page.waitForLoadState("networkidle");

      expect(jsErrors).toEqual([]);
    });
  });

  test.describe("Interaction Responsiveness", () => {
    test("theme toggle responds within 500ms", async ({ page }) => {
      // Set initial theme to light so clicking toggle produces dark mode
      await page.addInitScript(() => {
        localStorage.setItem("volvox-theme", "light");
      });
      await page.goto("/");
      await page.waitForSelector("html.light");

      const toggle = page.locator('[data-testid="theme-toggle"]');
      await expect(toggle).toBeVisible();

      const start = Date.now();
      await toggle.click();
      await expect(page.locator("html")).toHaveClass(/dark/);
      const responseTime = Date.now() - start;

      expect(responseTime).toBeLessThan(500);
    });
  });
});
