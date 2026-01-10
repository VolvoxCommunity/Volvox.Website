import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import "highlight.js/styles/github-dark.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { CookieConsentProvider } from "@/components/providers/cookie-consent-provider";
import { Toaster } from "@/components/ui/sonner";
import { CookieConsentBanner } from "@/components/cookie-consent-banner";
import { ConditionalAnalytics } from "@/components/conditional-analytics";
import { generateOrganizationSchema } from "@/lib/structured-data";
import { safeJsonLdSerialize, SITE_URL } from "@/lib/constants";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Volvox - Software Development & Learning Community",
    template: "%s | Volvox",
  },
  description:
    "Building great software while fostering the next generation of developers through mentorship and open source.",
  keywords: [
    "software development",
    "mentorship",
    "open source",
    "learning",
    "programming",
    "React",
    "TypeScript",
  ],
  authors: [{ name: "Bill Chirico" }],
  creator: "Volvox",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "Volvox",
    images: [
      {
        url: "/banner.jpeg",
        width: 1200,
        height: 630,
        alt: "Volvox Banner",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    creator: "@VolvoxLLC",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/png" href="/volvox-logo.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: safeJsonLdSerialize(generateOrganizationSchema()),
          }}
        />
      </head>
      <body className={`${jetbrainsMono.variable} antialiased`}>
        <CookieConsentProvider>
          <ThemeProvider defaultTheme="system" storageKey="volvox-theme">
            {children}
            <Toaster />
            <CookieConsentBanner />
          </ThemeProvider>
          <ConditionalAnalytics />
        </CookieConsentProvider>
      </body>
    </html>
  );
}
