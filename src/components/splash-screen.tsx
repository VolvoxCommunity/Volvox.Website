"use client";

import { useState, useEffect, useRef, useSyncExternalStore } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { reportError } from "@/lib/logger";
import { cn } from "@/lib/utils";

/**
 * Hook to detect user's reduced motion preference with proper SSR handling.
 * Uses useSyncExternalStore to avoid hydration mismatches.
 *
 * Server snapshot returns true to avoid showing animations during hydration.
 */
function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    (callback) => {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      mediaQuery.addEventListener("change", callback);
      return () => mediaQuery.removeEventListener("change", callback);
    },
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => true // Server snapshot: assume reduced motion to be safe
  );
}

export function SplashScreen(): React.ReactElement | null {
  const prefersReducedMotion = usePrefersReducedMotion();
  // Track whether splash has been dismissed (separate from reduced motion)
  const [isDismissed, setIsDismissed] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Derive visibility from preference and dismissal state
  const isVisible = !prefersReducedMotion && !isDismissed;

  // Timer refs to allow precise clearing
  const initialTimerRef = useRef<NodeJS.Timeout | null>(null);
  const dismissTimerRef = useRef<NodeJS.Timeout | null>(null);
  const fallbackTimerRef = useRef<NodeJS.Timeout | null>(null);
  // Store original overflow value and tracking flag
  const originalOverflowRef = useRef<string>("");
  const didLockRef = useRef<boolean>(false);

  const dismissSplash = () => {
    setIsDismissed(true);
    // Ensure all timers are cleared when dismissing
    if (initialTimerRef.current) clearTimeout(initialTimerRef.current);
    if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current);
    if (fallbackTimerRef.current) clearTimeout(fallbackTimerRef.current);
  };

  useEffect(() => {
    // If reduced motion is preferred, splash is already hidden via initial state
    if (!isVisible) return;

    // Local dismiss function to avoid stale closure issues
    const dismiss = () => {
      setIsDismissed(true);
      if (initialTimerRef.current) clearTimeout(initialTimerRef.current);
      if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current);
      if (fallbackTimerRef.current) clearTimeout(fallbackTimerRef.current);
    };

    // Phase 1: 1.5s delay before video appears
    initialTimerRef.current = setTimeout(() => {
      setShowVideo(true);

      // Robustness: Start a max-duration fallback timer once we intend to show the video.
      // If the video fails to load or the 'ended' event doesn't fire, we still dismiss.
      fallbackTimerRef.current = setTimeout(() => {
        dismiss();
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
    if (isVisible && !didLockRef.current) {
      // Store original overflow value before modifying
      originalOverflowRef.current = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      didLockRef.current = true;
    }

    return () => {
      // Restore original overflow on cleanup or hide, ONLY if we previously locked it
      if (didLockRef.current) {
        document.body.style.overflow = originalOverflowRef.current;
        didLockRef.current = false;
      }
    };
  }, [isVisible]);

  const handleVideoEnd = () => {
    // Phase 3: Hold after video ends before fading out
    dismissTimerRef.current = setTimeout(() => {
      dismissSplash();
    }, 1500);
  };

  const handleVideoError = () => {
    reportError(
      "SplashScreen video failed to load",
      new Error("Video load error")
    );
    dismissSplash();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[10000] bg-background flex items-center justify-center"
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
