"use client";

import { usePathname } from "next/navigation";

/**
 * Skip link item configuration.
 */
interface SkipLinkItem {
  /** The target element ID (without the #) */
  targetId: string;
  /** The display label for the skip link */
  label: string;
}

/**
 * Default skip links available on all pages.
 */
const DEFAULT_SKIP_LINKS: SkipLinkItem[] = [
  { targetId: "main-content", label: "Skip to main content" },
];

/**
 * Page-specific skip links configuration.
 * Keys are pathname patterns (exact match or prefix with wildcard).
 */
const PAGE_SKIP_LINKS: Record<string, SkipLinkItem[]> = {
  "/": [
    { targetId: "main-content", label: "Skip to main content" },
    { targetId: "blog", label: "Skip to blog posts" },
    { targetId: "mentorship", label: "Skip to community" },
    { targetId: "about", label: "Skip to about" },
  ],
  "/team": [
    { targetId: "main-content", label: "Skip to main content" },
    { targetId: "team-members", label: "Skip to team members" },
  ],
  "/blog": [
    { targetId: "main-content", label: "Skip to main content" },
    { targetId: "blog-posts", label: "Skip to blog posts" },
  ],
  "/products": [
    { targetId: "main-content", label: "Skip to main content" },
    { targetId: "products-list", label: "Skip to products" },
  ],
};

/**
 * Gets the skip links for a given pathname.
 * Returns page-specific links if configured, otherwise defaults.
 * @param pathname - The current page pathname
 * @returns Array of skip link configurations
 */
function getSkipLinksForPath(pathname: string): SkipLinkItem[] {
  return PAGE_SKIP_LINKS[pathname] ?? DEFAULT_SKIP_LINKS;
}

/**
 * Skip link component for keyboard accessibility.
 * Allows keyboard users to skip directly to main content or other
 * page sections, bypassing navigation and other repeated elements.
 *
 * Features:
 * - Hidden by default, visible on keyboard focus
 * - Context-aware: shows relevant skip links based on current page
 * - Multiple skip link options for pages with distinct sections
 * - Smooth focus management for screen reader users
 *
 * Meets WCAG 2.1 Level A Success Criterion 2.4.1 (Bypass Blocks).
 */
export function SkipLink() {
  const pathname = usePathname();
  const availableLinks = getSkipLinksForPath(pathname);

  const handleClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    targetId: string
  ) => {
    e.preventDefault();
    const target = document.getElementById(targetId);
    if (target) {
      // Set tabindex temporarily to allow focus on non-focusable elements
      if (!target.hasAttribute("tabindex")) {
        target.setAttribute("tabindex", "-1");
        target.addEventListener(
          "blur",
          () => {
            target.removeAttribute("tabindex");
          },
          { once: true }
        );
      }
      target.focus({ preventScroll: true });
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <nav aria-label="Skip links" className="skip-links-container">
      {availableLinks.map((link, index) => (
        <a
          key={link.targetId}
          href={`#${link.targetId}`}
          onClick={(e) => handleClick(e, link.targetId)}
          className="skip-link"
          style={
            {
              "--skip-link-top": `${1 + index * 3.5}rem`,
              "--skip-link-left": "1rem",
            } as React.CSSProperties
          }
        >
          {link.label}
        </a>
      ))}
    </nav>
  );
}
