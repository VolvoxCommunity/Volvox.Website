import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import "highlight.js/styles/github-dark.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { GoogleAnalytics } from "@next/third-parties/google";
import { generateOrganizationSchema } from "@/lib/structured-data";
import { safeJsonLdSerialize } from "@/lib/constants";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://volvoxdev.com"),
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
    url: "https://volvoxdev.com",
    siteName: "Volvox",
  },
  twitter: {
    card: "summary_large_image",
    creator: "@VolvoxLLC",
  },
  robots: {
    index: true,
    follow: true,
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
        <ThemeProvider defaultTheme="system" storageKey="volvox-theme">
          {children}
          <Toaster />
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
        <GoogleAnalytics gaId="G-W02EBRX2ZF" />
      </body>
    </html>
  );
}
