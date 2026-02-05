import type { Metadata } from "next";
import Script from "next/script";
import { TermsClient } from "./terms-client";
import {
  generateWebPageSchema,
  generateBreadcrumbSchema,
} from "@/lib/structured-data";
import { safeJsonLdSerialize, SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms of Service for Volvox - Read our terms and conditions for using our website and services.",
  alternates: {
    canonical: "/terms",
  },
  openGraph: {
    title: "Terms of Service | Volvox",
    description:
      "Terms of Service for Volvox - Read our terms and conditions for using our website and services.",
  },
  twitter: {
    title: "Terms of Service | Volvox",
    description:
      "Terms of Service for Volvox - Read our terms and conditions for using our website and services.",
  },
};

/**
 * Render the Terms of Service page layout, delegating interactive behavior to client-side components.
 *
 * @returns A JSX element representing the Terms of Service page
 */
export default function TermsPage() {
  const jsonLd = generateWebPageSchema(
    "Terms of Service | Volvox",
    "Terms of Service for Volvox - Read our terms and conditions for using our website and services.",
    "/terms",
    undefined,
    "2025-12-07" // Matching the "Last updated" date in content
  );

  return (
    <>
      <Script
        id="terms-schema"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: safeJsonLdSerialize(jsonLd),
        }}
      />
      <Script
        id="terms-breadcrumb-schema"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: safeJsonLdSerialize(
            generateBreadcrumbSchema([
              { name: "Home", url: SITE_URL },
              { name: "Terms of Service", url: `${SITE_URL}/terms` },
            ])
          ),
        }}
      />
      <TermsClient />
    </>
  );
}
