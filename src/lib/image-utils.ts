const NEXT_IMAGE_REMOTE_HOSTS = new Set(["github.com"]);

/**
 * Checks whether a source can be passed to `next/image` with the current config.
 *
 * @param source - Image source path or URL.
 * @returns True when Next.js can optimize the source without remotePatterns errors.
 */
export function canUseNextImageOptimization(source: string): boolean {
  if (source.startsWith("/")) {
    return true;
  }

  try {
    const url = new URL(source);
    return (
      url.protocol === "https:" && NEXT_IMAGE_REMOTE_HOSTS.has(url.hostname)
    );
  } catch {
    return false;
  }
}

/**
 * Resolves a screenshot path to a valid image URL.
 * Handles:
 * - External URLs (http/https) - returns as-is
 * - Absolute paths (starts with /) - returns as-is
 * - Bare filenames - prepends the product image directory
 *
 * @param screenshot - The screenshot path or URL
 * @param productSlug - The product slug for constructing relative paths
 * @returns The resolved image path or null if screenshot is undefined
 */
export function resolveProductImagePath(
  screenshot: string | undefined,
  productSlug: string,
): string | null {
  if (!screenshot) return null;
  if (screenshot.startsWith("http://") || screenshot.startsWith("https://")) {
    return screenshot;
  }
  if (screenshot.startsWith("/")) {
    return screenshot;
  }
  return `/images/product/${productSlug}/${screenshot}`;
}
