import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines class names with Tailwind CSS merging.
 *
 * @param inputs - Class names, conditional classes, or arrays of classes
 * @returns Merged class name string with conflicts resolved
 *
 * @example
 * ```ts
 * cn("p-4", isOpen && "bg-blue-500", "text-center")
 * ```
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generate a simple hash code from a string.
 *
 * @param text - The text to hash
 * @returns A positive integer hash code
 */
function simpleHash(text: string): number {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

/**
 * Generate a URL-safe heading ID from text content.
 *
 * Converts text to lowercase, replaces spaces with hyphens, removes
 * non-alphanumeric characters (except hyphens and underscores), and
 * trims leading/trailing hyphens.
 *
 * For headings with non-ASCII characters (e.g., Chinese, Arabic, emojis)
 * or punctuation-only content that would result in an empty slug, a
 * hash-based ID is generated to ensure unique, valid anchors.
 *
 * @param text - The text content to convert to an ID
 * @param fallback - Optional fallback ID to use if text is empty
 * @returns A URL-safe ID string, never empty unless input is empty and no fallback provided
 *
 * @example
 * generateHeadingId("Hello World!") // returns "hello-world"
 * generateHeadingId("API Reference") // returns "api-reference"
 * generateHeadingId("  Spaced  ") // returns "spaced"
 * generateHeadingId("こんにちは") // returns "heading-123456789" (hash-based)
 * generateHeadingId("🎉🎊") // returns "heading-987654321" (hash-based)
 * generateHeadingId("", "custom") // returns "custom"
 */
export function generateHeadingId(text: string, fallback?: string): string {
  // Return fallback immediately if text is empty
  if (!text.trim()) {
    return fallback || "";
  }

  // Generate standard slug
  const slug = text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-_]/g, "")
    .replace(/-+/g, "-") // Collapse consecutive hyphens
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens

  // If slug is empty (non-ASCII/punctuation-only content), generate hash-based ID
  if (!slug) {
    const hash = simpleHash(text);
    return `heading-${hash}`;
  }

  return slug;
}
