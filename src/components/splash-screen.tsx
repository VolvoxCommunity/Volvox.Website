"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true);
  const [showVideo, setShowVideo] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
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
    // Phase 3: 2s hold after video ends
    setTimeout(() => {
      setIsVisible(false);
    }, 1500);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[10000] bg-background flex items-center justify-center pointer-events-none"
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
