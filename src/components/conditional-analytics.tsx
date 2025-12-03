"use client";

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { GoogleAnalytics } from "@next/third-parties/google";
import { useCookieConsent } from "@/components/providers/cookie-consent-provider";

/**
 * Conditionally renders analytics components based on user's cookie consent preferences.
 * Only loads Google Analytics and Vercel Analytics if the user has consented to analytics cookies.
 * Only loads SpeedInsights/Sentry if the user has consented to performance cookies.
 *
 * @returns Analytics components if consent is given, null otherwise
 */
export function ConditionalAnalytics() {
  const { consent } = useCookieConsent();
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  const isProduction = process.env.NODE_ENV === "production";

  return (
    <>
      {/* Vercel Analytics - loads if analytics consent is given */}
      {consent.analytics && <Analytics />}

      {/* Vercel Speed Insights - loads if performance consent is given */}
      {consent.performance && <SpeedInsights />}

      {/* Google Analytics - only in production with analytics consent and valid GA ID */}
      {isProduction && consent.analytics && gaId && (
        <GoogleAnalytics gaId={gaId} />
      )}
    </>
  );
}
