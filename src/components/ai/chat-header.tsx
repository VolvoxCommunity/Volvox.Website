"use client";

import { ArrowSquareOut, Trash, X } from "@phosphor-icons/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface ChatHeaderProps {
  variant?: "floating" | "fullscreen";
  onClose?: () => void;
  onClear: () => void;
  isStreaming: boolean;
}

export function ChatHeader({
  onClose,
  onClear,
  isStreaming,
  variant,
}: ChatHeaderProps) {
  return (
    <div className="flex items-center justify-between px-3 sm:px-4">
      <div className="flex items-center gap-2">
        <h2 className="font-[family-name:var(--font-jetbrains-mono)] text-sm font-bold tracking-tight sm:text-[15px]">
          VOLVOX.BOT
        </h2>
        {isStreaming && (
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary/60" />
        )}
      </div>

      <div className="flex items-center gap-1">
        {variant === "floating" && (
          <Button
            variant="text"
            size="icon"
            shape="square"
            className="text-muted-foreground hover:text-foreground"
            title="Open full page"
            asChild
          >
            <Link href="/chat">
              <ArrowSquareOut className="h-4 w-4" />
            </Link>
          </Button>
        )}
        <Button
          variant="text"
          size="icon"
          shape="square"
          onClick={onClear}
          title="Clear conversation"
          className="text-muted-foreground hover:text-foreground"
        >
          <Trash className="h-4 w-4" />
        </Button>
        {onClose && (
          <Button
            variant="text"
            size="icon"
            shape="square"
            onClick={onClose}
            title="Close assistant"
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
