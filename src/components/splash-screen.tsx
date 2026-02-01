"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

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
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[10000] bg-black flex items-center justify-center pointer-events-none"
        >
          <div className="w-full max-w-[500px] px-6">
            <video
              ref={videoRef}
              src="/animated-logo.webm"
              autoPlay
              muted
              playsInline
              onEnded={handleVideoEnd}
              className="w-full h-auto"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
