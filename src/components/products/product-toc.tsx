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
 * Sticky table of contents with scroll tracking and optional back navigation.
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
    <nav className="sticky z-30 bg-background/80 backdrop-blur-sm border-b border-border/50 py-3 top-[57px]">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="flex items-center justify-center gap-4">
          {/* TOC Links */}
          <ul className="flex flex-wrap gap-1 md:gap-2 justify-center">
            {sections.map(({ id, label }) => (
              <li key={id}>
                <button
                  type="button"
                  onClick={() => handleClick(id)}
                  className={cn(
                    "px-3 py-1 text-sm rounded-full transition-colors",
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
      </div>
    </nav>
  );
}
