import { useEffect } from "react";

const VIEWED_POSTS_KEY = "volvox_viewed_posts";

/**
 * Get the set of viewed post slugs from sessionStorage.
 */
export function getViewedPosts(): Set<string> {
  try {
    if (typeof sessionStorage === "undefined") return new Set();
    const stored = sessionStorage.getItem(VIEWED_POSTS_KEY);
    return new Set(stored ? JSON.parse(stored) : []);
  } catch {
    return new Set();
  }
}

/**
 * Save the set of viewed post slugs to sessionStorage.
 */
export function saveViewedPosts(posts: Set<string>): void {
  try {
    if (typeof sessionStorage === "undefined") return;
    sessionStorage.setItem(VIEWED_POSTS_KEY, JSON.stringify([...posts]));
  } catch (error) {
    console.error("Failed to save viewed posts:", error);
  }
}

/**
 * Track a blog post view, ensuring it's only counted once per session.
 * Uses sessionStorage to deduplicate across modal and full page views.
 */
export async function trackPostView(slug: string): Promise<void> {
  if (!slug || typeof fetch === "undefined") return;

  // Check if already tracked in this session
  const viewedPosts = getViewedPosts();
  if (viewedPosts.has(slug)) return;

  // Track the view via API
  try {
    const response = await fetch("/api/blog/views", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug }),
      keepalive: true,
    });

    if (response.ok) {
      // Only mark as viewed if API call succeeds
      viewedPosts.add(slug);
      saveViewedPosts(viewedPosts);
    }
  } catch (error) {
    console.error("Failed to track post view:", error);
  }
}

/**
 * React hook to track post view on component mount.
 * Use this in blog post pages for declarative view tracking.
 */
export function usePostViewTracking(slug: string): void {
  useEffect(() => {
    trackPostView(slug);
  }, [slug]);
}
