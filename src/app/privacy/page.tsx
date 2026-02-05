import type { Metadata } from "next";
import Script from "next/script";
import { PrivacyClient } from "./privacy-client";
import {
  generateWebPageSchema,
  generateBreadcrumbSchema,
} from "@/lib/structured-data";
import { safeJsonLdSerialize, SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy Policy for Volvox - Learn how we collect, use, and protect your personal information.",
  alternates: {
    canonical: "/privacy",
  },
  openGraph: {
    title: "Privacy Policy | Volvox",
    description:
      "Privacy Policy for Volvox - Learn how we collect, use, and protect your personal information.",
  },
  twitter: {
    title: "Privacy Policy | Volvox",
    description:
      "Privacy Policy for Volvox - Learn how we collect, use, and protect your personal information.",
  },
};

/**
 * Render the Privacy Policy page layout, delegating interactive behavior to client-side components.
 *
 * @returns A JSX element representing the Privacy Policy page
 */
export default function PrivacyPage() {
  const jsonLd = generateWebPageSchema(
    "Privacy Policy | Volvox",
    "Privacy Policy for Volvox - Learn how we collect, use, and protect your personal information.",
    "/privacy",
    undefined,
    "2025-12-07" // Matching the "Last updated" date in content
  );

  return (
    <>
      <Script
        id="privacy-schema"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: safeJsonLdSerialize(jsonLd),
        }}
      />
      <Script
        id="privacy-breadcrumb-schema"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: safeJsonLdSerialize(
            generateBreadcrumbSchema([
              { name: "Home", url: SITE_URL },
              { name: "Privacy Policy", url: `${SITE_URL}/privacy` },
            ])
          ),
        }}
      />
      <PrivacyClient />
    </>
  );
}
