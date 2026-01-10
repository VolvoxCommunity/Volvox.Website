import { test, expect } from "../fixtures/base.fixture";

test.describe("llms.txt Endpoint", () => {
  test("returns plain text content", async ({ request }) => {
    const response = await request.get("/llms.txt");

    expect(response.ok()).toBe(true);
    expect(response.headers()["content-type"]).toContain("text/plain");
  });

  test("contains site name and description", async ({ request }) => {
    const response = await request.get("/llms.txt");
    const content = await response.text();

    expect(content).toContain("Volvox");
    expect(content).toContain("# Volvox");
  });

  test("contains products section", async ({ request }) => {
    const response = await request.get("/llms.txt");
    const content = await response.text();

    expect(content).toContain("## Products");
    // Should have at least one product link or fallback message
    expect(content).toMatch(
      /Products[\s\S]*(-.*|_Products information temporarily unavailable._)/
    );
  });

  test("contains blog section", async ({ request }) => {
    const response = await request.get("/llms.txt");
    const content = await response.text();

    expect(content).toContain("## Blog");
    // Should have at least one blog post link or fallback message
    expect(content).toMatch(
      /Blog[\s\S]*(-.*|_Blog posts temporarily unavailable._)/
    );
  });

  test("contains company information", async ({ request }) => {
    const response = await request.get("/llms.txt");
    const content = await response.text();

    expect(content).toContain("## Company");
    expect(content).toContain("About");
    expect(content).toContain("Mentorship");
  });

  test("contains legal links", async ({ request }) => {
    const response = await request.get("/llms.txt");
    const content = await response.text();

    expect(content).toContain("## Legal");
    expect(content).toContain("Privacy Policy");
    expect(content).toContain("Terms of Service");
  });

  test("contains connect links", async ({ request }) => {
    const response = await request.get("/llms.txt");
    const content = await response.text();

    expect(content).toContain("## Connect");
    expect(content).toContain("Discord");
    expect(content).toContain("GitHub");
  });

  test("contains technical stack information", async ({ request }) => {
    const response = await request.get("/llms.txt");
    const content = await response.text();

    expect(content).toContain("## Technical Stack");
    expect(content).toContain("Next.js");
    expect(content).toContain("React");
    expect(content).toContain("TypeScript");
    expect(content).toContain("Tailwind CSS");
  });

  test("has proper cache headers", async ({ request }) => {
    const response = await request.get("/llms.txt");
    const cacheControl = response.headers()["cache-control"];

    // Should have some form of caching
    expect(cacheControl).toBeDefined();
  });

  test("URLs in content are valid format", async ({ request }) => {
    const response = await request.get("/llms.txt");
    const content = await response.text();

    // Extract markdown links and verify they have proper format
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const matches = [...content.matchAll(linkRegex)];

    expect(matches.length).toBeGreaterThan(0);

    for (const match of matches) {
      const url = match[2];
      // URLs should be absolute or start with /
      expect(url).toMatch(/^(https?:\/\/|\/)/);
    }
  });
});
