"use client";

import { ChatsCircle, Sparkle, X } from "@phosphor-icons/react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface ChatTriggerProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  hasUnread?: boolean;
}

export function ChatTrigger({
  isOpen,
  onOpen,
  onClose,
  hasUnread = false,
}: ChatTriggerProps) {
  const reduced = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [hintDismissed, setHintDismissed] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window === "undefined") return;
    try {
      if (window.sessionStorage.getItem("volvox-chat-hint-dismissed") === "1") {
        setHintDismissed(true);
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (!mounted || hintDismissed) return;
    const t = setTimeout(() => setShowHint(true), 4500);
    const auto = setTimeout(() => {
      setShowHint(false);
    }, 18000);
    return () => {
      clearTimeout(t);
      clearTimeout(auto);
    };
  }, [mounted, hintDismissed]);

  const dismissHint = () => {
    setShowHint(false);
    setHintDismissed(true);
    try {
      window.sessionStorage.setItem("volvox-chat-hint-dismissed", "1");
    } catch {}
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-end gap-3 sm:bottom-6 sm:right-6">
      <AnimatePresence>
        {showHint && !isOpen && (
          <motion.div
            initial={reduced ? false : { opacity: 0, x: 8, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 8, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <div className="rounded-3xl bg-card p-3 shadow-xl">
              <div className="flex items-start gap-2">
                <Sparkle
                  className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                  weight="fill"
                />
                <div className="flex-1 text-xs leading-relaxed text-foreground/80">
                  Try asking about our products, team, or how to join the
                  community.
                </div>
                <button
                  type="button"
                  onClick={dismissHint}
                  className="shrink-0 rounded p-0.5 text-muted-foreground transition-colors hover:text-foreground"
                  aria-label="Dismiss hint"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!isOpen && (
          <motion.button
            type="button"
            onClick={onOpen}
            initial={reduced ? false : { opacity: 0, scale: 0.8, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 16 }}
            transition={{
              delay: reduced ? 0 : 1.2,
              type: "spring",
              stiffness: 260,
              damping: 22,
            }}
            whileHover={reduced ? undefined : { scale: 1.05 }}
            whileTap={reduced ? undefined : { scale: 0.95 }}
            aria-label="Open Volvox Assistant"
            className={cn(
              "group relative flex h-12 w-12 items-center justify-center rounded-full",
              "bg-primary text-primary-foreground shadow-xl shadow-primary/30",
              "ring-2 ring-primary/20 ring-offset-2 ring-offset-background",
              "focus-visible:outline-none focus-visible:ring-4",
            )}
          >
            <ChatsCircle className="h-5 w-5" weight="fill" />
            {hasUnread && (
              <span className="absolute right-0.5 top-0.5 h-2 w-2 rounded-full bg-accent ring-2 ring-background" />
            )}
            <span className="sr-only">Open Volvox Assistant</span>
          </motion.button>
        )}
      </AnimatePresence>
      {isOpen && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Close Volvox Assistant"
          className="flex h-12 w-12 items-center justify-center rounded-full border border-border/60 bg-card text-foreground shadow-xl transition-colors hover:bg-card/80 sm:hidden"
        >
          <X className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}
