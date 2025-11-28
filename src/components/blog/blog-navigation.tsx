"use client";

import { Navigation } from "@/components/navigation";

/**
 * Blog-specific navigation wrapper that uses the main Navigation component in link mode.
 * This ensures consistent navigation across the homepage and blog pages.
 *
 * @returns The Navigation component configured for blog pages with link-based navigation.
 */
export function BlogNavigation() {
  return <Navigation linkMode />;
}
