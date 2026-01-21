"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

/**
 * A floating sticky button that appears after scrolling down the page.
 * Provides quick navigation back to the blog section.
 *
 * @returns A floating button that fades in after scrolling 300px
 */
export function BackToPostsButton() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show button after scrolling past the header area (300px)
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Check initial state

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="fixed bottom-6 left-6 z-40"
        >
          <Button
            variant="outline"
            className="shadow-lg backdrop-blur-sm bg-background/80 hover:bg-background border-border/50 flex items-center gap-2"
            data-testid="back-to-posts"
            onClick={() => router.push("/#blog", { scroll: false })}
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Back to All Posts</span>
            <span className="sm:hidden">Back</span>
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
