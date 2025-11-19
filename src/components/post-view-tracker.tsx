"use client";

import { useEffect, useRef } from "react";

interface PostViewTrackerProps {
  slug: string;
}

/**
 * Tracks a blog post view once per mount using the most reliable transport
 * available for background analytics events.
 */
export function PostViewTracker({ slug }: PostViewTrackerProps) {
  const lastTrackedSlugRef = useRef<string | null>(null);

  useEffect(() => {
    if (!slug || lastTrackedSlugRef.current === slug) {
      return;
    }

    const url = "/api/blog/views";
    const payload = JSON.stringify({ slug });
    lastTrackedSlugRef.current = slug;

    const sendViaBeacon = (): boolean => {
      if (
        typeof navigator === "undefined" ||
        typeof navigator.sendBeacon !== "function"
      ) {
        return false;
      }

      const blob = new Blob([payload], { type: "application/json" });
      return navigator.sendBeacon(url, blob);
    };

    const beaconSent = sendViaBeacon();

    if (!beaconSent) {
      fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: payload,
        keepalive: true,
      }).catch((error) => {
        console.error("Error tracking view:", error);
      });
    }
  }, [slug]);

  return null;
}
