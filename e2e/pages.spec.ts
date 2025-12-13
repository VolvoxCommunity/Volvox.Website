import { test, expect } from "@playwright/test";

test.describe("Static Pages", () => {
  test("should load privacy policy", async ({ page }) => {
    await page.goto("/privacy");
    await expect(page).toHaveTitle(/Privacy Policy/);
    await expect(
      page.getByRole("heading", { name: "Privacy Policy", level: 1 })
    ).toBeVisible();
  });

  test("should load terms of service", async ({ page }) => {
    await page.goto("/terms");
    await expect(page).toHaveTitle(/Terms of Service/);
    await expect(
      page.getByRole("heading", { name: "Terms of Service", level: 1 })
    ).toBeVisible();
  });
});
