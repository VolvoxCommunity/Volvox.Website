/**
 * @jest-environment node
 */
import { GET } from "@/app/api/blog/[slug]/route";
import { getPostBySlug } from "@/lib/blog";

jest.mock("@/lib/blog");

describe("Blog API Route", () => {
  it("returns post data", async () => {
    (getPostBySlug as jest.Mock).mockResolvedValue({
      frontmatter: { title: "Title" },
    });

    const request = new Request("http://localhost");
    const params = Promise.resolve({ slug: "post-1" });
    const response = await GET(request, { params });

    const json: unknown = await response.json();
    expect(json).toEqual({ title: "Title" });
  });

  it("returns 404 on error", async () => {
    (getPostBySlug as jest.Mock).mockRejectedValue(new Error("Not found"));

    const request = new Request("http://localhost");
    const params = Promise.resolve({ slug: "post-1" });
    const response = await GET(request, { params });

    expect(response.status).toBe(404);
  });
});
