/**
 * Global constants used across the application.
 * Centralizes configuration values to avoid duplication.
 */

/** Base URL for the production website (must match canonical domain to avoid redirects) */
export const SITE_URL = "https://www.volvox.dev";

/** Site name used in metadata and branding */
export const SITE_NAME = "Volvox";

/** Site description used in metadata */
export const SITE_DESCRIPTION =
  "Building great software while fostering the next generation of developers through mentorship and open source.";

/** Height of the top navigation bar */
export const NAV_HEIGHT = "5rem";

/** GitHub community URL */
export const GITHUB_URL = "https://github.com/VolvoxCommunity";

/** Discord community invite URL */
export const DISCORD_URL = "https://discord.gg/8ahXACdamN";

export const TWITTER_URL = "https://x.com/volvox_llc";

/** LinkedIn company page URL */
export const LINKEDIN_URL = "https://www.linkedin.com/company/volvoxllc";

/** YouTube channel URL */
export const YOUTUBE_URL = "https://www.youtube.com/@volvox_llc";

/** Instagram profile URL */
export const INSTAGRAM_URL = "https://www.instagram.com/volvox_llc";

/** TikTok profile URL */
export const TIKTOK_URL = "https://www.tiktok.com/@volvox_llc";

/**
 * Meta (Facebook) Pixel ID for ad conversion tracking.
 * Pixel IDs are public identifiers (visible to every visitor in page source),
 * so this is safe to keep in code. The pixel only loads on production deploys
 * after the user grants advertising cookie consent (see
 * `src/components/conditional-analytics.tsx`).
 */
export const META_PIXEL_ID = "4277433129168323";

/** Spline 3D background scene URL */
export const SPLINE_IFRAME_URL =
  "https://my.spline.design/aidatamodelinteraction-mdTL3FktFVHgDvFr5TKtnYDV";

/** Brand colors for OG images and other static uses */
export const BRAND_COLORS = {
  primary: "#007AFF",
  secondary: "#AF58DA",
  accent: "#FF9500",
  background: "#0a0a0a",
  backgroundLight: "#1a1a2e",
  text: "#ffffff",
  textMuted: "#a1a1aa",
};

/** Vibrant colors for confetti effects - uses brand colors */
export const CONFETTI_COLORS = [
  BRAND_COLORS.primary, // Blue #007AFF
  BRAND_COLORS.secondary, // Purple #AF58DA
  BRAND_COLORS.accent, // Orange #FF9500
  "#34C759", // Green (iOS)
  "#FF2D55", // Pink (iOS)
];

/**
 * Safely serializes an object to JSON for use in script tags.
 * Escapes angle brackets and ampersands to prevent script tag injection.
 *
 * @param data - The object to serialize
 * @returns JSON string safe for embedding in HTML script tags
 */
export function safeJsonLdSerialize(data: object): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");
}

/** Navigation items used across all navbar components */
export interface NavItem {
  id: string;
  label: string;
  href: string;
  /** When true, the item is hidden on narrower desktop widths (below xl) to avoid overflow. */
  optional?: boolean;
}

export const NAV_ITEMS: NavItem[] = [
  { id: "home", label: "Home", href: "/" },
  { id: "how-we-work", label: "How We Work", href: "/#how-we-work" },
  { id: "products", label: "Products", href: "/products" },
  { id: "reviews", label: "Reviews", href: "/#reviews" },
  { id: "blog", label: "Blog", href: "/blog" },
  {
    id: "mentorship",
    label: "Team",
    href: "/#mentorship",
    optional: true,
  },
  { id: "about", label: "About", href: "/#about", optional: true },
];

/** Subpage navigation items (used on subpages like /blog, /products, /team) */
export const PAGE_NAV_ITEMS: NavItem[] = [
  { id: "home", label: "Home", href: "/" },
  { id: "products", label: "Products", href: "/products" },
  { id: "blog", label: "Blog", href: "/blog" },
  { id: "team", label: "Team", href: "/team" },
];
