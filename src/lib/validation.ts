const SLUG_PATTERN = /^[a-z0-9-]+$/;
const MAX_SLUG_LENGTH = 120;

/**
 * Normalizes and validates a blog slug string.
 *
 * @param rawSlug - Unknown slug input provided by an API caller.
 * @returns A sanitized slug when valid; otherwise `null`.
 */
export function normalizeSlug(rawSlug: unknown): string | null {
  if (typeof rawSlug !== "string") {
    return null;
  }

  const trimmed = rawSlug.trim().toLowerCase();

  if (!trimmed || trimmed.length > MAX_SLUG_LENGTH) {
    return null;
  }

  if (!SLUG_PATTERN.test(trimmed)) {
    return null;
  }

  return trimmed;
}

/**
 * Public slug constraints for validation messaging.
 */
export const slugConstraints = {
  pattern: SLUG_PATTERN,
  maxLength: MAX_SLUG_LENGTH,
};
