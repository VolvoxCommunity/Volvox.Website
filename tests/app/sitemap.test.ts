import sitemap from "@/app/sitemap";
import { getAllPosts } from "@/lib/blog";

jest.mock("@/lib/blog");

describe("sitemap", () => {
  it("generates sitemap with posts", async () => {
    (getAllPosts as jest.Mock).mockResolvedValue([
      { slug: "post-1", date: "2023-01-01" },
    ]);

    const result = await sitemap();
    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          url: expect.stringContaining("/blog/post-1") as unknown,
        }),
      ])
    );
    // Should also contain static routes
    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          url: expect.stringContaining("/privacy") as unknown,
        }),
      ])
    );
  });

  it("handles errors", async () => {
    (getAllPosts as jest.Mock).mockRejectedValue(new Error("Fail"));
    const result = await sitemap();
    // Should return static routes
    expect(result.length).toBeGreaterThan(0);
  });
});
