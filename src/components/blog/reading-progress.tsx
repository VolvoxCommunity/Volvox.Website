"use client";

import { useEffect, useState } from "react";

export function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      // Get total scrollable height
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      // Get current scroll position
      const scrolled = window.scrollY;
      // Calculate progress percentage
      const progressPercentage = (scrolled / scrollHeight) * 100;

      setProgress(Math.min(progressPercentage, 100));
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
