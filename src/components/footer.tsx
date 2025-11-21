"use client";

import { version } from "../../package.json";

export function Footer() {
  return (
    <footer className="py-8 px-4 border-t">
      <div className="container mx-auto max-w-7xl text-center space-y-1">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Volvox. All rights reserved.
        </p>
        <p className="text-xs text-muted-foreground/60">v{version}</p>
      </div>
    </footer>
  );
}
