"use client";

import { useEffect, useState } from "react";

interface Heading {
  id: string;
  text: string;
  level: number;
}

export function TableOfContents() {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    // Extract headings from the page
    const elements = document.querySelectorAll("h2, h3");
    const headingData: Heading[] = [];

    elements.forEach((element) => {
      const id = element.id || element.textContent?.toLowerCase().replace(/\s+/g, "-") || "";
      if (!element.id) {
        element.id = id;
      }

      headingData.push({
        id,
        text: element.textContent || "",
        level: parseInt(element.tagName.substring(1)),
      });
    });

    setHeadings(headingData);

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
      elements.forEach((element) => {
        observer.unobserve(element);
      });
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
                onClick={() => scrollToHeading(heading.id)}
                className={`text-left transition-colors duration-200 hover:text-primary ${
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
