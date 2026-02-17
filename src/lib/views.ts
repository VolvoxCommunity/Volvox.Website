import { Redis } from "@upstash/redis";
import { unstable_cache } from "next/cache";
import { reportError } from "./logger";

/**
 * Key prefix for blog post view counts in Redis.
 */
const VIEW_KEY_PREFIX = "blog:views:";

/**
 * Lazily initialized Redis client.
 */
let redis: Redis | null = null;

/**
 * Gets or creates the Redis client instance.
 *
 * @returns Redis client instance or null if not configured
 */
function getRedisClient(): Redis | null {
  if (redis) {
    return redis;
  }

  if (!isRedisConfigured()) {
    return null;
  }

  redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  });

  return redis;
}

/**
 * Constructs the Redis key for a blog post's view count.
 *
 * @param slug - The blog post slug
 * @returns The formatted Redis key
 */
function getViewKey(slug: string): string {
  return `${VIEW_KEY_PREFIX}${slug}`;
}

/**
 * Checks if Upstash Redis is configured and available.
 *
 * @returns true if UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN are set
 */
function isRedisConfigured(): boolean {
  return !!(
    process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  );
}

/**
 * Retrieves the view count for a blog post (uncached, for API routes).
 */
export async function fetchPostViews(slug: string): Promise<number> {
  const client = getRedisClient();
  if (!client) {
    return 0;
  }

  try {
    const views = await client.get<number>(getViewKey(slug));
    return views ?? 0;
  } catch (error) {
    reportError(`Failed to get views for post: ${slug}`, error);
    return 0;
  }
}

/**
 * Retrieves the view count for a blog post, cached for static generation.
 * Revalidates every 60 seconds at runtime.
 *
 * @param slug - The blog post slug
 * @returns The current view count, or 0 if not found or Redis is unavailable
 */
export const getPostViews = unstable_cache(
  fetchPostViews,
  ["blog-post-views"],
  { revalidate: 60 }
);

/**
 * Retrieves view counts for multiple blog posts.
 * Uses the cached single-post fetcher so results are compatible with static generation.
 *
 * @param slugs - Array of blog post slugs
 * @returns Map of slug to view count
 */
export async function getPostViewsBatch(
  slugs: string[]
): Promise<Map<string, number>> {
  const viewsMap = new Map<string, number>();

  if (slugs.length === 0) {
    return viewsMap;
  }

  const results = await Promise.all(slugs.map((slug) => getPostViews(slug)));
  slugs.forEach((slug, index) => {
    viewsMap.set(slug, results[index]);
  });

  return viewsMap;
}

/**
 * Increments the view count for a blog post.
 *
 * @param slug - The blog post slug
 * @returns The new view count, or -1 if the operation failed
 */
export async function incrementPostViews(slug: string): Promise<number> {
  const client = getRedisClient();
  if (!client) {
    return 0;
  }

  try {
    const newCount = await client.incr(getViewKey(slug));
    return newCount;
  } catch (error) {
    reportError(`Failed to increment views for post: ${slug}`, error);
    return -1;
  }
}
