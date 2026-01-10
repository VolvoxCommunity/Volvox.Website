"use client";

/**
 * Skip link component for keyboard accessibility.
 * Allows keyboard users to skip directly to main content,
 * bypassing navigation and other repeated elements.
 *
 * The link is visually hidden until focused, then appears
 * prominently at the top of the page.
 */
export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
    >
      Skip to main content
    </a>
  );
}
