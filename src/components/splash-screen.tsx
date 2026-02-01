"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true);
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    // Respect user's motion preferences
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      // Skip splash screen entirely for users who prefer reduced motion
      setIsVisible(false);
      return;
    }

    // Phase 1: 1.5s delay before video appears
    const initialDelay = setTimeout(() => {
      setShowVideo(true);
    }, 1500);

    return () => clearTimeout(initialDelay);
  }, []);

  useEffect(() => {
    // Prevent scrolling while splash screen is visible
    if (isVisible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isVisible]);

  const handleVideoEnd = () => {
    // Hold for 1.5s after video ends before fading out
    setTimeout(() => {
      setIsVisible(false);
    }, 1500);
  };

  const handleVideoError = () => {
    // If video fails to load, hide splash screen
    setIsVisible(false);
  };

  // Don't render anything if not visible (after reduced motion check)
  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[10000] bg-background flex items-center justify-center pointer-events-none"
          aria-hidden="true"
        >
          <AnimatePresence>
            {showVideo && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="w-full max-w-[500px] px-6"
              >
                <video
                  src="/animated-logo.webm"
                  autoPlay
                  muted
                  playsInline
                  onEnded={handleVideoEnd}
                  onError={handleVideoError}
                  className={cn(
                    "w-full h-auto",
                    // Light mode (default): invert + hue-rotate to keep logo colors while making bg white.
                    "invert hue-rotate-180 brightness-125 contrast-110 mix-blend-multiply",
                    // Dark mode: restore original colors and use screen blend.
                    "dark:invert-0 dark:hue-rotate-0 dark:brightness-110 dark:contrast-100 dark:mix-blend-screen"
                  )}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
