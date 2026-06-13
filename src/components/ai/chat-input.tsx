"use client";

import { ArrowUp, Stop } from "@phosphor-icons/react";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { useChatContext } from "./chat-provider";

interface ChatInputProps {
  floating?: boolean;
}

export function ChatInput({ floating }: ChatInputProps) {
  const { sendMessage, status, stop } = useChatContext();
  const isStreaming = status === "streaming" || status === "submitted";
  const isDisabled = status === "error";
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const ta = inputRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    const next = Math.min(ta.scrollHeight, 160);
    ta.style.height = `${next}px`;
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isStreaming) return;
    const form = e.currentTarget;
    const data = new FormData(form);
    const text = String(data.get("message") ?? "").trim();
    if (!text) return;
    sendMessage({ text });
    form.reset();
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      formRef.current?.requestSubmit();
    }
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      data-lenis-prevent
      className={cn(
        "transition-[border-color,background-color] mx-auto w-full max-w-4xl",
        floating
          ? "px-3 pb-3 pt-0 sm:px-4 sm:pb-4"
          : "border-t border-border/40 bg-transparent p-3 sm:p-4",
      )}
    >
      <div className="flex items-end gap-2 rounded-[24px] border border-border/60 bg-background p-2 transition-[border-color,box-shadow] focus-within:border-primary/50 focus-within:bg-background focus-within:shadow-[0_4px_15px_oklch(from_var(--primary)_l_c_h_/_0.22)]">
        <textarea
          ref={inputRef}
          name="message"
          placeholder="Ask about Volvox, our team, or products..."
          rows={1}
          disabled={isDisabled}
          onKeyDown={handleKeyDown}
          className={cn(
            "no-ring min-h-[28px] flex-1 resize-none bg-transparent px-2 py-1.5 text-sm leading-relaxed text-foreground",
            "placeholder:text-muted-foreground/60",
            "disabled:cursor-not-allowed disabled:opacity-50",
          )}
          aria-label="Message Volvox Assistant"
        />
        {isStreaming ? (
          <button
            type="button"
            onClick={stop}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-destructive text-destructive-foreground transition-[opacity,border-radius] hover:opacity-90 active:rounded-xl"
            aria-label="Stop generating"
          >
            <Stop className="h-4 w-4" weight="fill" />
          </button>
        ) : (
          <button
            type="submit"
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-[opacity,border-radius]",
              "bg-primary text-primary-foreground",
              "hover:opacity-90 active:rounded-xl",
            )}
            aria-label="Send message"
          >
            <ArrowUp className="h-4 w-4" weight="bold" />
          </button>
        )}
      </div>
    </form>
  );
}
