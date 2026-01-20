"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface TocSection {
  id: string;
  label: string;
}

interface ProductTocProps {
  sections: TocSection[];
}

/**
 * Sticky sidebar table of contents with scroll tracking.
 * Hidden on mobile devices (xs/sm/md), visible on large screens (lg+).
 *
 * @param sections - Array of sections with id and label to display in the TOC
 */
export function ProductToc({ sections }: ProductTocProps) {
  // Default to first section (overview) on initial load
  const [activeSection, setActiveSection] = useState<string>(
    sections[0]?.id ?? ""
  );

  useEffect(() => {
    // Early return if no sections to observe
    if (sections.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0px -70% 0px" }
    );

    sections.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [sections]);

  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="hidden lg:block fixed left-8 top-1/2 -translate-y-1/2 z-30">
      <div className="bg-background/60 backdrop-blur-md border border-border/50 rounded-2xl p-4">
        <ul className="flex flex-col gap-1">
          {sections.map(({ id, label }) => (
            <li key={id}>
              <button
                type="button"
                onClick={() => handleClick(id)}
                className={cn(
                  "w-full text-left px-4 py-2 text-sm rounded-xl transition-colors",
                  activeSection === id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                {label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
