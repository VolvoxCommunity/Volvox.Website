import type { Metadata } from "next";
import {
  JetBrains_Mono,
  Manrope,
  Space_Grotesk,
  Saira_Stencil_One,
} from "next/font/google";
import "./globals.css";
import "highlight.js/styles/github-dark.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { CookieConsentProvider } from "@/components/providers/cookie-consent-provider";
import { Toaster } from "@/components/ui/sonner";
import { CookieConsentBanner } from "@/components/cookie-consent-banner";
import { ConditionalAnalytics } from "@/components/conditional-analytics";
import { SkipLink } from "@/components/skip-link";
import { SmoothScroll } from "@/components/providers/smooth-scroll";
import {
  generateOrganizationSchema,
  generateWebSiteSchema,
} from "@/lib/structured-data";
import {
  safeJsonLdSerialize,
  SITE_URL,
  SITE_NAME,
  SITE_DESCRIPTION,
} from "@/lib/constants";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["300", "400", "600", "800"],
  variable: "--font-manrope",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "500", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const sairaStencilOne = Saira_Stencil_One({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-saira-stencil",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} - Software Development & Learning Community`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
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
  creator: SITE_NAME,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    images: [
      {
        url: "/banner.jpeg",
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} Banner`,
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: safeJsonLdSerialize(generateWebSiteSchema()),
          }}
        />
      </head>
      <body
        className={`${jetbrainsMono.variable} ${manrope.variable} ${spaceGrotesk.variable} ${sairaStencilOne.variable} antialiased font-sans`}
      >
        <div className="noise" />
        <SmoothScroll>
          <SkipLink />
          <CookieConsentProvider>
            <ThemeProvider defaultTheme="system" storageKey="volvox-theme">
              {children}
              <Toaster />
              <CookieConsentBanner />
            </ThemeProvider>
            <ConditionalAnalytics />
          </CookieConsentProvider>
        </SmoothScroll>
      </body>
    </html>
  );
}
