import robots from "@/app/robots";

describe("robots", () => {
  it("generates robots config", () => {
    const result = robots();
    expect(result.rules).toBeTruthy();
    expect(result.sitemap).toBeTruthy();
  });
});
