import {
  getPostViews,
  getPostViewsBatch,
  incrementPostViews,
} from "@/lib/views";
import { Redis } from "@upstash/redis";

jest.mock("@upstash/redis");
jest.mock("@/lib/logger", () => ({
  reportError: jest.fn(),
}));

const mockRedisInstance = {
  get: jest.fn(),
  mget: jest.fn(),
  incr: jest.fn(),
};

describe("views lib", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetAllMocks();
    jest.resetModules();

    process.env = {
      ...originalEnv,
      UPSTASH_REDIS_REST_URL: "https://test.upstash.io",
      UPSTASH_REDIS_REST_TOKEN: "test-token",
    };

    (Redis as unknown as jest.Mock).mockImplementation(() => mockRedisInstance);
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe("getPostViews", () => {
    it("returns view count from Redis", async () => {
      mockRedisInstance.get.mockResolvedValue(42);

      const views = await getPostViews("test-slug");

      expect(mockRedisInstance.get).toHaveBeenCalledWith(
        "blog:views:test-slug"
      );
      expect(views).toBe(42);
    });

    it("returns 0 when Redis returns null", async () => {
      mockRedisInstance.get.mockResolvedValue(null);

      const views = await getPostViews("test-slug");

      expect(views).toBe(0);
    });

    it("returns 0 when Redis is not configured", async () => {
      delete process.env.UPSTASH_REDIS_REST_URL;

      // Need to re-import to pick up env changes
      jest.resetModules();
      const { getPostViews: getViewsUnconfig } = await import("@/lib/views");

      const views = await getViewsUnconfig("test-slug");

      expect(views).toBe(0);
    });

    it("returns 0 on error", async () => {
      mockRedisInstance.get.mockRejectedValue(new Error("Redis Error"));

      const views = await getPostViews("test-slug");

      expect(views).toBe(0);
    });
  });

  describe("getPostViewsBatch", () => {
    it("returns views map from Redis", async () => {
      mockRedisInstance.mget.mockResolvedValue([10, 20, 30]);

      const views = await getPostViewsBatch(["slug1", "slug2", "slug3"]);

      expect(mockRedisInstance.mget).toHaveBeenCalledWith(
        "blog:views:slug1",
        "blog:views:slug2",
        "blog:views:slug3"
      );
      expect(views.get("slug1")).toBe(10);
      expect(views.get("slug2")).toBe(20);
      expect(views.get("slug3")).toBe(30);
    });

    it("returns zeros for null values", async () => {
      mockRedisInstance.mget.mockResolvedValue([null, 5, null]);

      const views = await getPostViewsBatch(["slug1", "slug2", "slug3"]);

      expect(views.get("slug1")).toBe(0);
      expect(views.get("slug2")).toBe(5);
      expect(views.get("slug3")).toBe(0);
    });

    it("returns zeros when Redis is not configured", async () => {
      delete process.env.UPSTASH_REDIS_REST_URL;

      jest.resetModules();
      const { getPostViewsBatch: getBatchUnconfig } =
        await import("@/lib/views");

      const views = await getBatchUnconfig(["slug1", "slug2"]);

      expect(views.get("slug1")).toBe(0);
      expect(views.get("slug2")).toBe(0);
    });

    it("returns zeros for empty slugs array", async () => {
      const views = await getPostViewsBatch([]);

      expect(views.size).toBe(0);
    });

    it("returns zeros on error", async () => {
      mockRedisInstance.mget.mockRejectedValue(new Error("Redis Error"));

      const views = await getPostViewsBatch(["slug1", "slug2"]);

      expect(views.get("slug1")).toBe(0);
      expect(views.get("slug2")).toBe(0);
    });
  });

  describe("incrementPostViews", () => {
    it("increments and returns new count", async () => {
      mockRedisInstance.incr.mockResolvedValue(43);

      const newCount = await incrementPostViews("test-slug");

      expect(mockRedisInstance.incr).toHaveBeenCalledWith(
        "blog:views:test-slug"
      );
      expect(newCount).toBe(43);
    });

    it("returns 0 when Redis is not configured", async () => {
      delete process.env.UPSTASH_REDIS_REST_URL;

      jest.resetModules();
      const { incrementPostViews: incrementUnconfig } =
        await import("@/lib/views");

      const newCount = await incrementUnconfig("test-slug");

      expect(newCount).toBe(0);
    });

    it("returns -1 on error", async () => {
      mockRedisInstance.incr.mockRejectedValue(new Error("Redis Error"));

      const newCount = await incrementPostViews("test-slug");

      expect(newCount).toBe(-1);
    });
  });
});
