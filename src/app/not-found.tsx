import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AnimatedBackground } from "@/components/animated-background";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { NAV_HEIGHT } from "@/lib/constants";

/**
 * Metadata for 404 page - explicitly set noindex to prevent search engine indexing.
 * This overrides the layout's robots config to ensure 404 pages are never indexed.
 */
export const metadata: Metadata = {
  title: "Page Not Found",
  description: "The page you're looking for doesn't exist.",
  robots: {
    index: false,
    follow: true,
    noarchive: true,
    nosnippet: true,
    noimageindex: true,
    nocache: true,
  },
};

/**
 * Custom 404 Not Found page.
 * Displays a user-friendly error message with navigation back to the homepage.
 */
export default function NotFound() {
  return (
    <div className="min-h-screen relative flex flex-col">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <AnimatedBackground />
      </div>

      {/* Content Layer */}
      <div className="relative z-10 flex-1 flex flex-col">
        <Navigation currentSection="home" />

        {/* Spacer for fixed navigation */}
        <div style={{ height: NAV_HEIGHT }} />

        {/* 404 Content */}
        <main
          id="main-content"
          className="flex-1 flex items-center justify-center px-4"
        >
          <div className="text-center max-w-md">
            <p
              className="text-8xl font-bold text-primary mb-4"
              aria-hidden="true"
            >
              404
            </p>
            <h1 className="text-2xl font-semibold mb-4">Page Not Found</h1>
            <p className="text-muted-foreground mb-8">
              The page you&apos;re looking for doesn&apos;t exist or has been
              moved.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </div>
        </main>
      </div>

      {/* Footer */}
      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}
