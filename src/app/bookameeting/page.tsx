/* biome-ignore-all lint/security/noDangerouslySetInnerHtml: JSON-LD is serialized with safeJsonLdSerialize before rendering. */

import type { Metadata } from "next";
import Script from "next/script";
import { safeJsonLdSerialize } from "@/lib/constants";
import { generateWebPageSchema } from "@/lib/structured-data";
import { BookAMeetingClient } from "./book-a-meeting-client";

export const metadata: Metadata = {
  title: "Book a Meeting | Volvox",
  description:
    "Schedule a call with Volvox to discuss your project, ideas, or engineering goals.",
  alternates: {
    canonical: "/bookameeting",
  },
  openGraph: {
    title: "Book a Meeting | Volvox",
    description:
      "Schedule a call with Volvox to discuss your project, ideas, or engineering goals.",
  },
  twitter: {
    title: "Book a Meeting | Volvox",
    description:
      "Schedule a call with Volvox to discuss your project, ideas, or engineering goals.",
  },
};

/**
 * Render the Book a Meeting page layout.
 */
export default function BookAMeetingPage() {
  const jsonLd = generateWebPageSchema(
    "Book a Meeting | Volvox",
    "Schedule a call with Volvox to discuss your project, ideas, or engineering goals.",
    "/bookameeting",
    undefined,
    "2026-07-28",
  );

  return (
    <>
      <Script
        id="bookameeting-schema"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: safeJsonLdSerialize(jsonLd),
        }}
      />
      <BookAMeetingClient />
    </>
  );
}
