"use client";

import Link from "next/link";
import { version } from "../../package.json";

/**
 * Renders the site footer with a Privacy Policy link, current year copyright, and package version.
 *
 * @returns The footer JSX element containing the legal link, copyright notice (current year), and package version.
 */
export function Footer() {
  return (
    <footer className="py-8 px-4 border-t">
      <div className="container mx-auto max-w-7xl text-center space-y-3">
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
          <Link
            href="/privacy"
            className="hover:text-foreground transition-colors underline-offset-4 hover:underline"
          >
            Privacy Policy
          </Link>
        </div>
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Volvox. All rights reserved.
        </p>
        <p className="text-xs text-muted-foreground/60">v{version}</p>
      </div>
    </footer>
  );
}
