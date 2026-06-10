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
              className="fixed inset-0 z-40 bg-background/45 backdrop-blur-sm sm:hidden"
              onClick={close}
            />
            <motion.div
              key="chat-panel"
              data-lenis-prevent
              data-lenis-prevent-wheel
              data-lenis-prevent-touch
              initial={
                reduced ? { opacity: 0 } : { opacity: 0, y: 18, scale: 0.97 }
              }
              animate={
                reduced ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }
              }
              exit={
                reduced ? { opacity: 0 } : { opacity: 0, y: 18, scale: 0.97 }
              }
              transition={{ duration: 0.22, ease: [0.2, 0, 0, 1] }}
              className={cn(
                "fixed z-50 flex flex-col overflow-hidden overscroll-contain",
                "inset-x-0 bottom-0 top-0",
                "sm:inset-auto sm:bottom-24 sm:right-6",
                "sm:h-[min(720px,calc(100vh-7.5rem))] sm:w-[440px]",
                "rounded-none sm:rounded-[32px]",
                "bg-card shadow-[0_20px_50px_-10px_hsla(0,0%,0%,0.35)]",
              )}
              role="dialog"
              aria-label="Volvox Assistant"
            >
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
