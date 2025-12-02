import {
  getAllPosts,
  getPostBySlug,
  getPostSlugs,
  incrementPostViews,
} from "@/lib/blog";
import * as fs from "fs";
import matter from "gray-matter";
import { getAuthorById } from "@/lib/content";
import { reportError } from "@/lib/logger";

jest.mock("fs");
jest.mock("gray-matter");
jest.mock("@/lib/logger", () => ({
  reportError: jest.fn(),
}));
jest.mock("@/lib/content", () => ({
  getAuthorById: jest.fn(),
}));

describe("blog lib", () => {
  const mockDate = "2023-01-01";
  const mockPostData = {
    title: "Test Post",
    slug: "test-post",
    excerpt: "Test excerpt",
    authorId: "user1",
    date: mockDate,
    tags: ["test"],
    published: true,
  };

  beforeEach(() => {
    jest.resetAllMocks();
    (getAuthorById as jest.Mock).mockReturnValue({
      id: "user1",
      name: "User One",
      image: "/avatars/user1.png",
      bio: "Bio",
    });
  });

  describe("getAllPosts", () => {
    it("returns published posts", async () => {
      (fs.readdirSync as jest.Mock).mockReturnValue(["test-post.mdx"]);
      (fs.readFileSync as jest.Mock).mockReturnValue("content");
      (matter as unknown as jest.Mock).mockReturnValue({
        data: mockPostData,
        content: "content body",
      });

      const posts = await getAllPosts();
      expect(posts).toHaveLength(1);
      expect(posts[0].slug).toBe("test-post");
      expect(posts[0].content).toBe("content body");
    });

    it("filters unpublished posts", async () => {
      (fs.readdirSync as jest.Mock).mockReturnValue(["draft.mdx"]);
      (fs.readFileSync as jest.Mock).mockReturnValue("content");
      (matter as unknown as jest.Mock).mockReturnValue({
        data: { ...mockPostData, published: false },
        content: "content body",
      });

      const posts = await getAllPosts();
      expect(posts).toHaveLength(0);
    });

    it("sorts posts by date", async () => {
      (fs.readdirSync as jest.Mock).mockReturnValue(["post1.mdx", "post2.mdx"]);

      (fs.readFileSync as jest.Mock).mockImplementation((path: string) => {
        if (path.includes("post1")) return "post1 content";
        return "post2 content";
      });

      (matter as unknown as jest.Mock).mockImplementation((content: string) => {
        if (content === "post1 content") {
          return {
            data: { ...mockPostData, date: "2023-01-01", slug: "post1" },
            content: "",
          };
        }
        return {
          data: { ...mockPostData, date: "2023-01-02", slug: "post2" },
          content: "",
        };
      });

      const posts = await getAllPosts();
      expect(posts).toHaveLength(2);
      expect(posts[0].slug).toBe("post2"); // Newer first
      expect(posts[1].slug).toBe("post1");
    });

    it("handles errors gracefully", async () => {
      (fs.readdirSync as jest.Mock).mockImplementation(() => {
        throw new Error("FS Error");
      });

      const posts = await getAllPosts();
      expect(posts).toHaveLength(0);
      expect(reportError).toHaveBeenCalled();
    });
  });

  describe("getPostBySlug", () => {
    it("returns post if exists", async () => {
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.readFileSync as jest.Mock).mockReturnValue("content");
      (matter as unknown as jest.Mock).mockReturnValue({
        data: mockPostData,
        content: "content body",
      });

      const post = await getPostBySlug("test-post");
      expect(post.slug).toBe("test-post");
      expect(post.content).toBe("content body");
    });

    it("throws if post not found", async () => {
      (fs.existsSync as jest.Mock).mockReturnValue(false);

      await expect(getPostBySlug("missing")).rejects.toThrow("Post not found");
      expect(reportError).toHaveBeenCalled();
    });
  });

  describe("getPostSlugs", () => {
    it("returns filtered slugs", async () => {
      (fs.readdirSync as jest.Mock).mockReturnValue(["post1.mdx", "draft.mdx"]);
      (fs.readFileSync as jest.Mock).mockImplementation((path: string) => {
        if (path.includes("post1")) return "post1";
        return "draft";
      });
      (matter as unknown as jest.Mock).mockImplementation((content: string) => {
        if (content === "post1")
          return { data: { ...mockPostData, slug: "post1", published: true } };
        return { data: { ...mockPostData, slug: "draft", published: false } };
      });

      const slugs = await getPostSlugs();
      expect(slugs).toEqual(["post1"]);
    });
  });

  describe("incrementPostViews", () => {
    it("returns true (noop)", async () => {
      const result = await incrementPostViews("any-slug");
      expect(result).toBe(true);
    });
  });
});
