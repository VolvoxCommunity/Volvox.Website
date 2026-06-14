"use client";

import { GoogleAnalytics } from "@next/third-parties/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import {
  type CookieConsent,
  useCookieConsent,
} from "@/components/providers/cookie-consent-provider";

type AnalyticsConsent = Pick<CookieConsent, "analytics" | "performance">;

interface AnalyticsIntegrationOptions {
  consent: AnalyticsConsent;
  deploymentEnvironment?: string | null;
  gaId?: string;
  nodeEnv?: string;
}

interface EnabledAnalyticsIntegrations {
  googleAnalytics: boolean;
  speedInsights: boolean;
  vercelAnalytics: boolean;
}

interface ConditionalAnalyticsProps {
  deploymentEnvironment?: string | null;
}

export function getEnabledAnalyticsIntegrations({
  consent,
  deploymentEnvironment,
  gaId,
  nodeEnv = process.env.NODE_ENV,
}: AnalyticsIntegrationOptions): EnabledAnalyticsIntegrations {
  const isDeployedProduction =
    nodeEnv === "production" && deploymentEnvironment === "production";

  return {
    googleAnalytics: Boolean(isDeployedProduction && consent.analytics && gaId),
    speedInsights: Boolean(isDeployedProduction && consent.performance),
    vercelAnalytics: Boolean(isDeployedProduction && consent.analytics),
  };
}

/**
 * Conditionally renders analytics components based on user's cookie consent preferences.
 * Only loads Google Analytics and Vercel Analytics if the user has consented to analytics cookies.
 * Only loads SpeedInsights/Sentry if the user has consented to performance cookies.
 *
 * @returns Analytics components if consent is given, null otherwise
 */
export function ConditionalAnalytics({
  deploymentEnvironment = process.env.NEXT_PUBLIC_VERCEL_ENV ?? null,
}: ConditionalAnalyticsProps = {}) {
  const { consent } = useCookieConsent();
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  const enabledIntegrations = getEnabledAnalyticsIntegrations({
    consent,
    deploymentEnvironment,
    gaId,
  });

  return (
    <>
      {/* Vercel Analytics - loads if analytics consent is given */}
      {enabledIntegrations.vercelAnalytics && <Analytics />}

      {/* Vercel Speed Insights - loads if performance consent is given */}
      {enabledIntegrations.speedInsights && <SpeedInsights />}

      {/* Google Analytics - only in production with analytics consent and valid GA ID */}
      {enabledIntegrations.googleAnalytics && gaId && (
        <GoogleAnalytics gaId={gaId} />
      )}
    </>
  );
}
