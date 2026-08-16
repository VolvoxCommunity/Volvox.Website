/* biome-ignore-all lint/security/noDangerouslySetInnerHtml: JSON-LD is serialized with safeJsonLdSerialize before rendering. */

import type { Metadata } from "next";
import { safeJsonLdSerialize } from "@/lib/constants";
import { generateWebPageSchema } from "@/lib/structured-data";
import { PrivacyClient } from "./privacy-client";

export const metadata: Metadata = {
  title: "Privacy Policy | Volvox",
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
    "2025-12-07", // Matching the "Last updated" date in content
  );

  return (
    <>
      {/* biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD is serialized with safeJsonLdSerialize before rendering. */}
      <script
        id="privacy-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeJsonLdSerialize(jsonLd),
        }}
      />
      <PrivacyClient />
    </>
  );
}
