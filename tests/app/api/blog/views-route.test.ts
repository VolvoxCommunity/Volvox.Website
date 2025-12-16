/**
 * @jest-environment node
 */
import { POST } from "@/app/api/blog/[slug]/views/route";
import { incrementPostViews } from "@/lib/blog";

jest.mock("@/lib/blog");

describe("Blog Views API Route", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("increments views and returns new count", async () => {
    (incrementPostViews as jest.Mock).mockResolvedValue(42);

    const request = new Request("http://localhost", { method: "POST" });
    const params = Promise.resolve({ slug: "test-post" });
    const response = await POST(request, { params });

    expect(incrementPostViews).toHaveBeenCalledWith("test-post");
    expect(response.status).toBe(200);

    const json = (await response.json()) as { views: number };
    expect(json.views).toBe(42);
  });

  it("returns 400 for invalid slug", async () => {
    const request = new Request("http://localhost", { method: "POST" });
    const params = Promise.resolve({ slug: "../invalid" });
    const response = await POST(request, { params });

    expect(incrementPostViews).not.toHaveBeenCalled();
    expect(response.status).toBe(400);

    const json = (await response.json()) as { error: string };
    expect(json.error).toBe("Invalid slug");
  });

  it("returns 500 when increment fails", async () => {
    (incrementPostViews as jest.Mock).mockResolvedValue(-1);

    const request = new Request("http://localhost", { method: "POST" });
    const params = Promise.resolve({ slug: "test-post" });
    const response = await POST(request, { params });

    expect(response.status).toBe(500);

    const json = (await response.json()) as { error: string };
    expect(json.error).toBe("Failed to increment views");
  });

  it("returns 500 on exception", async () => {
    (incrementPostViews as jest.Mock).mockRejectedValue(new Error("DB Error"));

    const request = new Request("http://localhost", { method: "POST" });
    const params = Promise.resolve({ slug: "test-post" });
    const response = await POST(request, { params });

    expect(response.status).toBe(500);

    const json = (await response.json()) as { error: string };
    expect(json.error).toBe("Internal server error");
  });
});
