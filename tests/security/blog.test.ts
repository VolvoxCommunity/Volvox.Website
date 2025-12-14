import { getPostBySlug } from "@/lib/blog";

describe("Blog Security", () => {
  it("should prevent directory traversal in slug", async () => {
    const maliciousSlug = "../../../package.json";

    // We expect the function to reject the slug before even trying to look up the file
    // Currently (before fix) it might throw "Post not found" or attempt to access the file
    // After fix, it should throw "Invalid slug"

    await expect(getPostBySlug(maliciousSlug)).rejects.toThrow(/Invalid slug/);
  });

  it("should prevent slugs with special characters", async () => {
    const maliciousSlug = "hello$world";
    await expect(getPostBySlug(maliciousSlug)).rejects.toThrow(/Invalid slug/);
  });
});
