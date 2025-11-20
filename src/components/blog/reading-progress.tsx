"use client";

import { useEffect, useState } from "react";

/**
 * Render a top-fixed horizontal reading progress bar that visually reflects the user's vertical scroll position.
 *
 * The bar's width corresponds to the current scroll progress (0–100%) and updates automatically as the page is scrolled.
 *
 * @returns A JSX element containing a fixed, full-width progress bar whose inner fill width represents the current vertical scroll progress percentage.
 */
export function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      // Get total scrollable height
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;

      // Handle pages with no scrollable content
      if (scrollHeight <= 0) {
        setProgress(100);
        return;
      }

      // Get current scroll position
      const scrolled = window.scrollY;
      // Calculate progress percentage
      const progressPercentage = (scrolled / scrollHeight) * 100;

      setProgress(Math.max(0, Math.min(progressPercentage, 100)));
    };

    // Update on scroll
    window.addEventListener("scroll", updateProgress, { passive: true });

    // Initial calculation
    updateProgress();

    return () => {
      window.removeEventListener("scroll", updateProgress);
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-0.5">
      <div
        className="h-full bg-gradient-to-r from-primary via-secondary to-accent transition-all duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}