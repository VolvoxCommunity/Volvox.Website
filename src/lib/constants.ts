/**
 * Global constants used across the application.
 * Centralizes configuration values to avoid duplication.
 */

/** Base URL for the production website (must match canonical domain to avoid redirects) */
export const SITE_URL = "https://www.volvoxdev.com";

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

/** Twitter/X profile URL */
export const TWITTER_URL = "https://twitter.com/VolvoxLLC";

/** Brand colors for OG images and other static uses */
export const BRAND_COLORS = {
  primary: "#007aff",
  secondary: "#af58da",
  accent: "#ff9500",
  background: "#0a0a0a",
  backgroundLight: "#1a1a2e",
  text: "#ffffff",
  textMuted: "#a1a1aa",
};

/** Vibrant colors for confetti effects - uses brand colors plus complementary purples */
export const CONFETTI_COLORS = [
  BRAND_COLORS.primary, // Blue
  BRAND_COLORS.secondary, // Purple
  BRAND_COLORS.accent, // Orange
  "#6446ff", // Indigo
  "#c864ff", // Violet
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
