import { GET } from "@/app/api/blog/[slug]/route";
import { getPostBySlug } from "@/lib/blog";

jest.mock("@/lib/blog");

jest.mock("next/server", () => ({
  NextResponse: {
    json: (body: any, init?: any) => ({
      json: () => Promise.resolve(body),
      status: init?.status || 200,
    }),
  },
}));

describe("Blog API Route", () => {
  it("returns post data", async () => {
    (getPostBySlug as jest.Mock).mockResolvedValue({
      frontmatter: { title: "Title" }
    });

    const request = {} as any;
    const params = Promise.resolve({ slug: "post-1" });
    const response = await GET(request, { params });

    const json = await response.json();
    expect(json).toEqual({ title: "Title" });
  });

  it("returns 404 on error", async () => {
    (getPostBySlug as jest.Mock).mockRejectedValue(new Error("Not found"));

    const request = {} as any;
    const params = Promise.resolve({ slug: "post-1" });
    const response = await GET(request, { params });

    expect(response.status).toBe(404);
  });
});
