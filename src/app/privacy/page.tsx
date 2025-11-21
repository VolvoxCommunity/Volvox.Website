import type { Metadata } from "next";
import { PrivacyClient } from "./privacy-client";

export const metadata: Metadata = {
  title: "Privacy Policy | Volvox",
  description:
    "Privacy Policy for Volvox - Learn how we collect, use, and protect your personal information.",
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
 * Privacy Policy Page Component
 *
 * Server component that renders the privacy policy page with client-side navigation.
 *
 * @returns The privacy policy page
 */
export default function PrivacyPage() {
  return <PrivacyClient />;
}
