import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { reportError } from "@/lib/logger";

const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

const redis =
  REDIS_URL && REDIS_TOKEN
    ? new Redis({ url: REDIS_URL, token: REDIS_TOKEN })
    : null;

let limiter: Ratelimit | null = null;
if (redis) {
  try {
    limiter = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(20, "10 m"),
      prefix: "volvox:chat",
      analytics: false,
    });
  } catch (err) {
    reportError("Failed to initialize chat rate limiter", err);
  }
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

const PASS_THROUGH: RateLimitResult = {
  success: true,
  limit: 20,
  remaining: 20,
  reset: 0,
};

export async function assertChatRateLimit(
  identifier: string,
): Promise<RateLimitResult> {
  if (!limiter) {
    return PASS_THROUGH;
  }
  try {
    const result = await limiter.limit(identifier);
    return {
      success: result.success,
      limit: result.limit,
      remaining: result.remaining,
      reset: result.reset,
    };
  } catch (err) {
    reportError("Chat rate limit check failed", err);
    return PASS_THROUGH;
  }
}
