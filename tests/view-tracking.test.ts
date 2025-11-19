import { describe, it, beforeEach, mock } from "node:test";
import assert from "node:assert";
import { useEffect } from "react";

describe("View Tracking", () => {
  let mockSessionStorage: Record<string, string>;

  beforeEach(() => {
    mockSessionStorage = {};

    global.sessionStorage = {
      getItem: (key: string) => mockSessionStorage[key] || null,
      setItem: (key: string, value: string) => {
        mockSessionStorage[key] = value;
      },
      removeItem: (key: string) => {
        delete mockSessionStorage[key];
      },
      clear: () => {
        mockSessionStorage = {};
      },
      length: 0,
      key: () => null,
    } as Storage;
  });

  describe("getViewedPosts", () => {
    it("returns empty Set when no posts viewed", async () => {
      const { getViewedPosts } = await import("../src/lib/view-tracking.js");
      const result = getViewedPosts();
      assert.strictEqual(result.size, 0);
    });

    it("returns Set with stored slugs", async () => {
      mockSessionStorage["volvox_viewed_posts"] = JSON.stringify([
        "post-1",
        "post-2",
      ]);
      const { getViewedPosts } = await import("../src/lib/view-tracking.js");
      const result = getViewedPosts();
      assert.strictEqual(result.size, 2);
      assert.ok(result.has("post-1"));
      assert.ok(result.has("post-2"));
    });
  });

  describe("saveViewedPosts", () => {
    it("saves Set to sessionStorage as JSON array", async () => {
      const { saveViewedPosts } = await import("../src/lib/view-tracking.js");
      const posts = new Set(["post-1", "post-2"]);
      saveViewedPosts(posts);
      const stored = mockSessionStorage["volvox_viewed_posts"];
      assert.ok(stored);
      const parsed = JSON.parse(stored);
      assert.strictEqual(parsed.length, 2);
      assert.ok(parsed.includes("post-1"));
      assert.ok(parsed.includes("post-2"));
    });
  });

  describe("trackPostView", () => {
    let fetchMock: any;

    beforeEach(() => {
      mockSessionStorage = {};
      fetchMock = mock.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({}),
        })
      );
      global.fetch = fetchMock as any;
    });

    it("tracks view for new post", async () => {
      const { trackPostView } = await import("../src/lib/view-tracking.js");
      await trackPostView("test-post");

      assert.strictEqual(fetchMock.mock.calls.length, 1);
      const [url, options] = fetchMock.mock.calls[0].arguments;
      assert.strictEqual(url, "/api/blog/views");
      assert.strictEqual(options.method, "POST");
      assert.ok(options.body.includes("test-post"));

      const stored = mockSessionStorage["volvox_viewed_posts"];
      const parsed = JSON.parse(stored);
      assert.ok(parsed.includes("test-post"));
    });

    it("skips tracking for already viewed post", async () => {
      mockSessionStorage["volvox_viewed_posts"] = JSON.stringify(["test-post"]);
      const { trackPostView } = await import("../src/lib/view-tracking.js");
      await trackPostView("test-post");

      assert.strictEqual(fetchMock.mock.calls.length, 0);
    });

    it("does not save to sessionStorage if API fails", async () => {
      fetchMock = mock.fn(() =>
        Promise.resolve({
          ok: false,
          status: 500,
        })
      );
      global.fetch = fetchMock as any;

      const { trackPostView } = await import("../src/lib/view-tracking.js");
      await trackPostView("test-post");

      assert.strictEqual(fetchMock.mock.calls.length, 1);
      assert.strictEqual(mockSessionStorage["volvox_viewed_posts"], undefined);
    });

    it("handles empty slug gracefully", async () => {
      const { trackPostView } = await import("../src/lib/view-tracking.js");
      await trackPostView("");

      assert.strictEqual(fetchMock.mock.calls.length, 0);
    });
  });

  describe("usePostViewTracking", () => {
    it("exports the hook function", async () => {
      const { usePostViewTracking } = await import("../src/lib/view-tracking.js");
      assert.strictEqual(typeof usePostViewTracking, "function");
    });
  });
});
