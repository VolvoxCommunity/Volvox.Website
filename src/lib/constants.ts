/**
 * Global constants used across the application.
 * Centralizes configuration values to avoid duplication.
 */

/** Base URL for the production website */
export const SITE_URL = "https://volvoxdev.com";

/** Site name used in metadata and branding */
export const SITE_NAME = "Volvox";

/** Site description used in metadata */
export const SITE_DESCRIPTION =
  "Building great software while fostering the next generation of developers through mentorship and open source.";

/**
 * Safely serializes an object to JSON for use in script tags.
 * Escapes "<" characters to prevent script tag injection.
 *
 * @param data - The object to serialize
 * @returns JSON string with escaped angle brackets
 */
export function safeJsonLdSerialize(data: object): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
