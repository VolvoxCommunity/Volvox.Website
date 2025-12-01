import robots from "@/app/robots";

describe("robots", () => {
  it("generates robots config with correct structure", () => {
    const result = robots();
    // Verify the rules structure
    expect(result).toMatchObject({
      rules: {
        userAgent: "*",
        allow: "/",
      },
    });
    // Verify sitemap URL ends with /sitemap.xml (SITE_URL may vary)
    expect(result.sitemap).toContain("/sitemap.xml");
  });
});
