"use client";

import { useEffect, useState, startTransition } from "react";
import { generateHeadingId } from "@/lib/utils";

interface Heading {
  id: string;
  text: string;
  level: number;
}

/**
 * Renders a sticky table of contents for h2 and h3 headings on the page and highlights the currently visible section.
 *
 * Scans the document for h2 and h3 elements, assigns unique ids when missing, tracks the active heading via an IntersectionObserver, and enables smooth scrolling to a section when its TOC entry is clicked. The component does not render if fewer than three headings are found.
 *
 * @returns A navigation element containing the page table of contents, or `null` when there are fewer than three headings.
 */
export function TableOfContents() {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    // Extract headings from the article content only (not the entire page)
    // This prevents picking up headings from other page elements like modals/banners
    const article = document.querySelector("article");
    if (!article) return;

    const elements = article.querySelectorAll("h2, h3");
    const headingData: Heading[] = [];
    const seenIds = new Set<string>();

    elements.forEach((element, index) => {
      const baseId =
        element.id ||
        generateHeadingId(element.textContent || "", `heading-${index}`);
      let id = baseId;
      let counter = 1;

      // Ensure unique IDs (handles collisions from both HeadingWithAnchor and TOC-generated IDs)
      while (seenIds.has(id)) {
        id = `${baseId}-${counter}`;
        counter++;
      }

      seenIds.add(id);

      // Update DOM if ID was missing or had to be deduplicated
      if (element.id !== id) {
        element.id = id;
      }

      headingData.push({
        id,
        text: element.textContent || "",
        level: parseInt(element.tagName.substring(1), 10),
      });
    });

    // Use startTransition for non-urgent state update from DOM
    startTransition(() => {
      setHeadings(headingData);
    });

    // Only show TOC if there are 3+ headings
    if (headingData.length < 3) {
      return;
    }

    // Track active heading on scroll
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-100px 0px -80% 0px",
      }
    );

    elements.forEach((element) => {
      observer.observe(element);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  // Don't render if fewer than 3 headings
  if (headings.length < 3) {
    return null;
  }

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <nav className="hidden lg:block sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto">
      <div className="border-l-2 border-border pl-4">
        <p className="text-sm font-medium text-foreground mb-3 uppercase tracking-wide">
          On This Page
        </p>
        <ul className="space-y-2 text-sm">
          {headings.map((heading) => (
            <li key={heading.id} className={heading.level === 3 ? "ml-4" : ""}>
              <button
                type="button"
                onClick={() => scrollToHeading(heading.id)}
                className={`text-left transition-colors duration-200 hover:text-secondary ${
                  activeId === heading.id
                    ? "text-primary font-medium"
                    : "text-muted-foreground"
                }`}
              >
                {heading.text}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
