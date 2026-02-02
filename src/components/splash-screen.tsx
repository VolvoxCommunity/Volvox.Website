"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { reportError } from "@/lib/logger";
import { cn } from "@/lib/utils";

/**
 * Check if the user prefers reduced motion.
 * Returns true during SSR to avoid animation flash.
 */
function getPrefersReducedMotion(): boolean {
  if (typeof window === "undefined") return true;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function SplashScreen(): React.ReactElement | null {
  // Initialize state based on reduced motion preference to avoid setState in useEffect
  const [isVisible, setIsVisible] = useState(() => !getPrefersReducedMotion());
  const [showVideo, setShowVideo] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Timer refs to allow precise clearing
  const initialTimerRef = useRef<NodeJS.Timeout | null>(null);
  const dismissTimerRef = useRef<NodeJS.Timeout | null>(null);
  const fallbackTimerRef = useRef<NodeJS.Timeout | null>(null);
  // Store original overflow value
  const originalOverflowRef = useRef<string>("");

  const dismissSplash = () => {
    setIsVisible(false);
    // Ensure all timers are cleared when dismissing
    if (initialTimerRef.current) clearTimeout(initialTimerRef.current);
    if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current);
    if (fallbackTimerRef.current) clearTimeout(fallbackTimerRef.current);
  };

  useEffect(() => {
    // If reduced motion is preferred, splash is already hidden via initial state
    if (!isVisible) return;

    // Phase 1: 1.5s delay before video appears
    initialTimerRef.current = setTimeout(() => {
      setShowVideo(true);

      // Robustness: Start a max-duration fallback timer once we intend to show the video.
      // If the video fails to load or the 'ended' event doesn't fire, we still dismiss.
      fallbackTimerRef.current = setTimeout(() => {
        dismissSplash();
      }, 10000);
    }, 1500);

    return () => {
      if (initialTimerRef.current) clearTimeout(initialTimerRef.current);
      if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current);
      if (fallbackTimerRef.current) clearTimeout(fallbackTimerRef.current);
    };
  }, [isVisible]);

  useEffect(() => {
    // Prevent scrolling while splash screen is visible
    if (isVisible) {
      // Store original overflow value before modifying
      originalOverflowRef.current = document.body.style.overflow;
      document.body.style.overflow = "hidden";
    } else {
      // Restore original overflow value
      document.body.style.overflow = originalOverflowRef.current;
    }

    return () => {
      // Restore original overflow on cleanup
      document.body.style.overflow = originalOverflowRef.current;
    };
  }, [isVisible]);

  const handleVideoEnd = () => {
    // Phase 3: Hold after video ends before fading out
    dismissTimerRef.current = setTimeout(() => {
      dismissSplash();
    }, 1500);
  };

  const handleVideoError = () => {
    reportError("SplashScreen video failed to load", new Error("Video load error"));
    dismissSplash();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          // Block interactions while splash is visible
          className="fixed inset-0 z-[10000] bg-background flex items-center justify-center pointer-events-auto"
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
                  ref={videoRef}
                  src="/animated-logo.webm"
                  autoPlay
                  muted
                  playsInline
                  onEnded={handleVideoEnd}
                  onError={handleVideoError}
                  className={cn(
                    "w-full h-auto",
                    "invert hue-rotate-180 brightness-125 contrast-110 mix-blend-multiply",
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
