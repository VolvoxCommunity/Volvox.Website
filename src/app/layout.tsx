import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import "highlight.js/styles/github-dark.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Volvox - Software Development & Learning Community",
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
    url: "https://volvox.dev",
    title: "Volvox - Software Development & Learning Community",
    description:
      "Building great software while fostering the next generation of developers through mentorship and open source.",
    siteName: "Volvox",
  },
  twitter: {
    card: "summary_large_image",
    title: "Volvox - Software Development & Learning Community",
    description:
      "Building great software while fostering the next generation of developers through mentorship and open source.",
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
      </head>
      <body className={`${jetbrainsMono.variable} antialiased`}>
        <ThemeProvider defaultTheme="system" storageKey="volvox-theme">
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
