"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { ChatPanel } from "@/components/ai/chat-panel";
import { ChatProvider, useChatContext } from "@/components/ai/chat-provider";
import type { VisitorIntent } from "@/lib/ai/types";

const INTENT_VALUES = new Set<VisitorIntent>([
  "beginner",
  "professional",
  "hirer",
]);

function PageInner() {
  const params = useSearchParams();
  const { sendMessage, setExplicitSeed, messages, storageLoaded } =
    useChatContext();
  const intentParam = params.get("intent");
  const promptParam = params.get("q");
  const sentRef = useRef(false);

  useEffect(() => {
    if (intentParam && INTENT_VALUES.has(intentParam as VisitorIntent)) {
      setExplicitSeed(intentParam as VisitorIntent);
    }
  }, [intentParam, setExplicitSeed]);

  useEffect(() => {
    if (!promptParam || sentRef.current || !storageLoaded) return;
    const alreadySent = messages.some(
      (m) =>
        m.role === "user" &&
        m.parts?.some(
          (p) =>
            typeof p === "object" &&
            p !== null &&
            "type" in p &&
            p.type === "text" &&
            "text" in p &&
            (p as { text: string }).text === promptParam,
        ),
    );
    if (alreadySent) return;
    sentRef.current = true;
    const timer = setTimeout(() => {
      sendMessage({ text: promptParam });
    }, 300);
    return () => clearTimeout(timer);
  }, [promptParam, sendMessage, messages, storageLoaded]);

  return null;
}

export function ChatPageClient() {
  return (
    <ChatProvider>
      <PageInner />
      <main className="relative flex h-[100dvh] min-h-0 flex-col overflow-hidden bg-background">
        <div className="relative z-10 flex flex-1 min-h-0">
          <section className="w-full h-full min-h-0">
            <ChatPanel variant="fullscreen" />
          </section>
        </div>
      </main>
    </ChatProvider>
  );
}
