/**
 * Runtime helpers for the Meta (Facebook) Pixel.
 *
 * The pixel script is loaded by `MetaPixel` (`src/components/meta-pixel.tsx`)
 * only on production deploys and only after the user has granted advertising
 * cookie consent, so `window.fbq` is frequently undefined. Helpers here must
 * therefore fail silently when the pixel is unavailable.
 */

/** Subset of the Meta Pixel command API used by this application */
interface MetaPixelFunction {
  (command: "init", pixelId: string): void;
  (
    command: "track",
    eventName: string,
    parameters?: Record<string, unknown>,
  ): void;
}

declare global {
  interface Window {
    /** Meta Pixel command queue, present only after the pixel has loaded */
    fbq?: MetaPixelFunction;
  }
}

/**
 * Tracks a Meta Pixel standard event (e.g. "Lead", "Contact").
 *
 * No-ops when the pixel is not loaded — during SSR, when the user has not
 * granted advertising consent, or when the script is blocked.
 *
 * @param eventName - Standard event name to send to Meta
 * @param parameters - Optional event parameters forwarded to the pixel
 */
export function trackMetaPixelEvent(
  eventName: string,
  parameters?: Record<string, unknown>,
): void {
  if (typeof window === "undefined" || typeof window.fbq !== "function") {
    return;
  }
  window.fbq("track", eventName, parameters);
}
