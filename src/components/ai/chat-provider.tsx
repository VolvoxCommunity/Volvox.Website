"use client";

import { type UIMessage, useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { clearChat, loadChat, saveChat } from "@/lib/ai/chat-store";
import type { VisitorIntent } from "@/lib/ai/types";

interface ChatContextValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  messages: UIMessage[];
  sendMessage: (msg: { text: string }) => Promise<void>;
  status: "submitted" | "streaming" | "ready" | "error";
  error: Error | undefined;
  stop: () => void;
  reload: () => void;
  clear: () => void;
  hasUnread: boolean;
  markRead: () => void;
  detectedIntent: VisitorIntent;
  detectedConfidence: number;
  rateLimitRemaining: number | null;
  explicitSeed: VisitorIntent | null;
  setExplicitSeed: (seed: VisitorIntent | null) => void;
  storageLoaded: boolean;
  resumeMessage: string | null;
}

const ChatContext = createContext<ChatContextValue | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const [explicitSeed, setExplicitSeed] = useState<VisitorIntent | null>(null);
  const [storageLoaded, setStorageLoaded] = useState(false);
  const [resumeMessage, setResumeMessage] = useState<string | null>(null);
  const [detectedIntent, setDetectedIntent] =
    useState<VisitorIntent>("professional");
  const [detectedConfidence, setDetectedConfidence] = useState(0);
  const [rateLimitRemaining, setRateLimitRemaining] = useState<number | null>(
    null,
  );

  const wasStreamingRef = useRef(false);

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
        prepareSendMessagesRequest: ({ messages }) => ({
          body: {
            messages,
            intentSeed: explicitSeed,
          },
        }),
      }),
    [explicitSeed],
  );

  const {
    messages,
    sendMessage,
    status,
    error,
    stop,
    regenerate,
    setMessages,
  } = useChat({
    id: "volvox-assistant",
    transport,
    onData: (part) => {
      if (
        typeof part === "object" &&
        part !== null &&
        "type" in part &&
        (part as { type: string }).type === "data-chat-meta"
      ) {
        const data = (part as { data?: unknown }).data as
          | {
              intent?: VisitorIntent;
              confidence?: number;
              rateLimitRemaining?: number;
            }
          | undefined;
        if (data?.intent) {
          setDetectedIntent(data.intent);
          setDetectedConfidence(data.confidence ?? 0);
        }
        if (typeof data?.rateLimitRemaining === "number") {
          setRateLimitRemaining(data.rateLimitRemaining);
        }
      }
    },
    onError: (err) => {
      console.error("[Volvox Assistant] chat error:", err);
    },
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = loadChat();
    if (stored && stored.messages.length > 0) {
      setMessages(stored.messages as unknown as UIMessage[]);
      setExplicitSeed(stored.intent);
      if (stored.intent) setDetectedIntent(stored.intent);
      const daysLeft = Math.max(
        0,
        Math.round((stored.expiresAt - Date.now()) / (24 * 60 * 60 * 1000)),
      );
      setResumeMessage(
        daysLeft > 0
          ? `Resuming your conversation from ${14 - daysLeft} day${14 - daysLeft === 1 ? "" : "s"} ago.`
          : null,
      );
    }
    setStorageLoaded(true);
  }, [setMessages]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!storageLoaded) return;
    if (messages.length === 0) return;
    saveChat({ messages: messages as unknown[], intent: explicitSeed });
  }, [messages, explicitSeed, storageLoaded]);

  useEffect(() => {
    if (isOpen && hasUnread) {
      setHasUnread(false);
    }
  }, [isOpen, hasUnread]);

  useEffect(() => {
    if (status === "streaming" || status === "submitted") {
      wasStreamingRef.current = true;
    } else if (status === "ready" && wasStreamingRef.current) {
      wasStreamingRef.current = false;
      if (!isOpen) {
        setHasUnread(true);
      }
    }
  }, [status, isOpen]);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((p) => !p), []);

  const markRead = useCallback(() => setHasUnread(false), []);

  const clear = useCallback(() => {
    setMessages([]);
    setExplicitSeed(null);
    setDetectedIntent("professional");
    setDetectedConfidence(0);
    setResumeMessage(null);
    clearChat();
  }, [setMessages]);

  const value = useMemo<ChatContextValue>(
    () => ({
      isOpen,
      open,
      close,
      toggle,
      messages,
      sendMessage: async (msg: { text: string }) => {
        await sendMessage(msg);
      },
      status,
      error,
      stop,
      reload: () => {
        void regenerate();
      },
      clear,
      hasUnread,
      markRead,
      detectedIntent,
      detectedConfidence,
      rateLimitRemaining,
      explicitSeed,
      setExplicitSeed,
      storageLoaded,
      resumeMessage,
    }),
    [
      isOpen,
      open,
      close,
      toggle,
      messages,
      sendMessage,
      status,
      error,
      stop,
      regenerate,
      clear,
      hasUnread,
      markRead,
      detectedIntent,
      detectedConfidence,
      rateLimitRemaining,
      explicitSeed,
      storageLoaded,
      resumeMessage,
    ],
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChatContext(): ChatContextValue {
  const ctx = useContext(ChatContext);
  if (!ctx)
    throw new Error("useChatContext must be used within a ChatProvider");
  return ctx;
}
