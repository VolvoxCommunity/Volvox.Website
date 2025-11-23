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
 * Render the Privacy Policy page layout, delegating interactive behavior to client-side components.
 *
 * @returns A JSX element representing the Privacy Policy page
 */
export default function PrivacyPage() {
  return <PrivacyClient />;
}
