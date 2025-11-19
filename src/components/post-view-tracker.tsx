"use client";

import { usePostViewTracking } from "@/lib/view-tracking";

interface PostViewTrackerProps {
  slug: string;
}

/**
 * Tracks a blog post view using session-based deduplication.
 * Ensures each post is only counted once per session, whether viewed
 * in a modal or on the full page.
 */
export function PostViewTracker({ slug }: PostViewTrackerProps) {
  usePostViewTracking(slug);
  return null;
}
