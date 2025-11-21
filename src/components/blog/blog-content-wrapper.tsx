"use client";

import { ReactNode } from "react";
import { ReadingProgress } from "./reading-progress";
import { TableOfContents } from "./table-of-contents";

interface BlogContentWrapperProps {
  children: ReactNode;
}

/**
 * Layout wrapper that displays blog content with a reading progress indicator and a desktop table of contents.
 *
 * @param children - Content rendered inside the main article column
 * @returns The composed blog layout containing a ReadingProgress bar, the main article area, and a TableOfContents shown on large screens
 */
export function BlogContentWrapper({ children }: BlogContentWrapperProps) {
  return (
    <>
      <ReadingProgress />
      <main className="container mx-auto px-4 py-16 max-w-7xl">
        <div className="flex gap-12">
          {/* Main content */}
          <article className="flex-1 min-w-0 max-w-4xl">{children}</article>

          {/* Table of Contents - desktop only */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <TableOfContents />
          </aside>
        </div>
      </main>
    </>
  );
}
