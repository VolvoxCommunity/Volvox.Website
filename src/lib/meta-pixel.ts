/**
 * Runtime helpers for the Meta (Facebook) Pixel.
 *
 * The pixel script is loaded by `MetaPixel` (`src/components/meta-pixel.tsx`)
 * only on production deploys and only after the user has granted advertising
 * cookie consent, so `window.fbq` is frequently undefined. The pixel script
 * also stays loaded for the rest of the session if the visitor revokes
 * advertising consent after granting it, so every helper here re-checks the
 * stored consent before forwarding anything and fails silently when the
 * pixel is unavailable.
 */

import { getStoredCookieConsent } from "@/components/providers/cookie-consent-provider";

/**
 * Meta Pixel standard events.
 *
 * @see https://developers.facebook.com/docs/meta-pixel/reference
 */
export type MetaPixelStandardEvent =
  | "AddPaymentInfo"
  | "AddToCart"
  | "AddToWishlist"
  | "CompleteRegistration"
  | "Contact"
  | "CustomizeProduct"
  | "Donate"
  | "FindLocation"
  | "InitiateCheckout"
  | "Lead"
  | "PageView"
  | "Purchase"
  | "Schedule"
  | "Search"
  | "StartTrial"
  | "SubmitApplication"
  | "Subscribe"
  | "ViewContent";

/** Subset of the Meta Pixel command API used by this application */
interface MetaPixelFunction {
  (command: "init", pixelId: string): void;
  (
    command: "track",
    eventName: MetaPixelStandardEvent,
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
 * No-ops when the pixel is unavailable or must not be used — during SSR,
 * when the script is blocked, or when the visitor has not granted (or has
 * since revoked) advertising cookie consent. The consent re-check matters
 * because the loaded pixel script keeps `window.fbq` alive for the rest of
 * the session after a mid-session revocation unmounts `MetaPixel`.
 *
 * @param eventName - Standard event name to send to Meta
 * @param parameters - Optional event parameters forwarded to the pixel
 */
export function trackMetaPixelEvent(
  eventName: MetaPixelStandardEvent,
  parameters?: Record<string, unknown>,
): void {
  if (typeof window === "undefined" || typeof window.fbq !== "function") {
    return;
  }
  if (!getStoredCookieConsent().advertising) {
    return;
  }
  window.fbq("track", eventName, parameters);
}
