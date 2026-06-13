"use client";

import { ChatMarkdown } from "./chat-markdown";

interface ChatTextProps {
  text: string;
}

export function ChatText({ text }: ChatTextProps) {
  return (
    <div className="text-sm leading-relaxed text-foreground">
      <ChatMarkdown content={text} />
    </div>
  );
}
