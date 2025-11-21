"use client";

import Link from "next/link";
import { version } from "../../package.json";

/**
 * Footer Component
 *
 * Displays the site footer with copyright information, version number,
 * and links to legal pages.
 *
 * @returns The footer component
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
        <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground/60">
          <Link
            href="/privacy-policy"
            className="hover:text-muted-foreground transition-colors"
          >
            Privacy Policy
          </Link>
          <span>v{version}</span>
        </div>
      </div>
    </footer>
  );
}
