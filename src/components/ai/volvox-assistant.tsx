"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { ChatPanel } from "./chat-panel";
import { ChatProvider, useChatContext } from "./chat-provider";
import { ChatTrigger } from "./chat-trigger";

function AssistantInner() {
  const { isOpen, open, close, hasUnread, markRead } = useChatContext();
  const reduced = useReducedMotion();
  const pathname = usePathname();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.key.toLowerCase() === "k" && !e.shiftKey) {
        e.preventDefault();
        if (isOpen) {
          close();
        } else {
          open();
        }
      }
      if (e.key === "Escape" && isOpen) {
        close();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, open, close]);

  useEffect(() => {
    if (isOpen) markRead();
  }, [isOpen, markRead]);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  if (pathname === "/chat") return null;

  return (
    <>
      <ChatTrigger
        isOpen={isOpen}
        onOpen={open}
        onClose={close}
        hasUnread={hasUnread}
      />

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              key="chat-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="fixed inset-0 z-40 bg-background/45"
              onClick={close}
            />
            <motion.div
              key="chat-panel"
              data-lenis-prevent
              data-lenis-prevent-wheel
              data-lenis-prevent-touch
              initial={reduced ? { opacity: 0 } : { x: "100%", opacity: 0 }}
              animate={reduced ? { opacity: 1 } : { x: 0, opacity: 1 }}
              exit={reduced ? { opacity: 0 } : { x: "100%", opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className={cn(
                "fixed z-50 flex flex-col overscroll-contain",
                "inset-y-0 right-0",
                "w-full sm:w-[440px]",
                "bg-card shadow-2xl",
              )}
              role="dialog"
              aria-label="Volvox Assistant"
            >
              {/* Gradient fade div on left edge of sheet - tweak w- and the gradient to get your desired effect */}
              <div className="absolute inset-y-0 -left-4 w-8 pointer-events-none bg-gradient-to-l from-card via-card/95 to-transparent z-1000" />
              <ChatPanel variant="floating" />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export function VolvoxAssistant() {
  return (
    <ChatProvider>
      <AssistantInner />
    </ChatProvider>
  );
}
