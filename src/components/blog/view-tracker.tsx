"use client";

import { useEffect } from "react";

interface ViewTrackerProps {
  slug: string;
}

/**
 * Generates a session storage key for tracking views.
 */
function getTrackingKey(slug: string): string {
  return `volvox:viewed:${slug}`;
}

/**
 * Client component that tracks blog post views on mount.
 * Calls the views API endpoint once per session per post.
 * Uses sessionStorage to persist tracking state across StrictMode remounts.
 * Renders nothing - purely for side effects.
 *
 * @param slug - The blog post slug to track views for
 */
export function ViewTracker({ slug }: ViewTrackerProps) {
  useEffect(() => {
    // Check if already tracked this session (survives StrictMode remounts)
    const trackingKey = getTrackingKey(slug);
    if (typeof window !== "undefined" && sessionStorage.getItem(trackingKey)) {
      return;
    }

    // Mark as tracked immediately to prevent race conditions
    if (typeof window !== "undefined") {
      sessionStorage.setItem(trackingKey, "1");
    }

    // Fire and forget - don't await the response
    fetch(`/api/blog/${encodeURIComponent(slug)}/views`, {
      method: "POST",
    }).catch(() => {
      // Silently ignore errors - view tracking is non-critical
      // Remove tracking key on error so it can retry next time
      if (typeof window !== "undefined") {
        sessionStorage.removeItem(trackingKey);
      }
    });
  }, [slug]);

  return null;
}
