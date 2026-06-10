"use client";

import { useReducedMotion } from "framer-motion";
import { useEffect, useRef } from "react";
import type { VisitorIntent } from "@/lib/ai/types";
import { cn } from "@/lib/utils";
import { ChatHeader } from "./chat-header";
import { ChatInput } from "./chat-input";
import { ChatMessageList } from "./chat-message";
import { useChatContext } from "./chat-provider";
import { ChatWelcome } from "./chat-welcome";

interface ChatPanelProps {
  variant?: "floating" | "fullscreen";
  className?: string;
}

export function ChatPanel({
  variant = "fullscreen",
  className,
}: ChatPanelProps) {
  const reduced = useReducedMotion();
  const {
    messages,
    status,
    error,
    clear,
    resumeMessage,
    setExplicitSeed,
    sendMessage,
    close,
  } = useChatContext();

  const isStreaming = status === "streaming" || status === "submitted";
  const scrollRef = useRef<HTMLDivElement>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll on new message
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({
      top: el.scrollHeight,
      behavior: reduced ? "auto" : "smooth",
    });
  }, [messages, reduced]);

  const handlePick = (text: string) => {
    if (isStreaming) return;
    sendMessage({ text });
  };

  const handlePickPersona = (intent: VisitorIntent, text: string) => {
    setExplicitSeed(intent);
    if (!isStreaming) sendMessage({ text });
  };

  const containerClasses = cn(
    "relative flex h-full min-h-0 w-full flex-col overflow-hidden border border-border/60 bg-card shadow-[0_20px_50px_-10px_hsla(0,0%,0%,0.28)]",
    variant === "floating" && "rounded-none sm:rounded-[32px]",
    variant === "fullscreen" && "rounded-[32px] bg-card p-2",
    className,
  );

  return (
    <div className={containerClasses} data-lenis-prevent>
      <div className="absolute inset-x-0 top-0 z-10 bg-gradient-to-b from-card via-card/95 to-transparent pb-8 pt-2 sm:pb-10">
        <ChatHeader
          variant={variant}
          onClose={variant === "floating" ? close : undefined}
          onClear={clear}
          isStreaming={isStreaming}
        />
      </div>

      <div
        ref={scrollRef}
        data-lenis-prevent
        data-lenis-prevent-wheel
        data-lenis-prevent-touch
        onWheelCapture={(event) => event.stopPropagation()}
        onTouchMoveCapture={(event) => event.stopPropagation()}
        className={cn(
          "min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 pb-28 pt-20 sm:px-4 sm:pb-32 sm:pt-24",
          variant === "fullscreen" && "rounded-[24px] bg-background/70",
          "[&::-webkit-scrollbar]:w-[3px] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border/50 [&::-webkit-scrollbar-thumb]:hover:bg-border/80",
        )}
        role="log"
        aria-live="polite"
        aria-label="Chat messages"
      >
        {messages.length === 0 ? (
          <ChatWelcome onPick={handlePick} onPickPersona={handlePickPersona} />
        ) : (
          <div className="space-y-3">
            <ChatMessageList
              messages={messages}
              resumeMessage={resumeMessage}
              isStreaming={isStreaming}
            />
            {error && (
              <div className="rounded-2xl border border-destructive/40 bg-destructive/10 p-3 text-xs text-destructive">
                Something went wrong. Try again or refresh the page.
              </div>
            )}
          </div>
        )}
      </div>

      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-card via-card/95 to-transparent pt-8">
        <ChatInput floating />
      </div>
    </div>
  );
}
