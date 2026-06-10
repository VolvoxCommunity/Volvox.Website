"use client";

import type { UIMessage } from "@ai-sdk/react";
import { cn } from "@/lib/utils";
import { ChatBlogCard } from "./chat-blog-card";
import { ChatProductCard } from "./chat-product-card";
import { ChatTeamCard } from "./chat-team-card";
import { ChatText } from "./chat-text";

interface ChatMessageBubbleProps {
  message: UIMessage;
  isStreaming?: boolean;
}

const SURFACE_TOOL_TYPES = new Set([
  "tool-surface_team_card",
  "tool-surface_product_card",
  "tool-surface_blog_card",
]);

function isTextPart(
  part: unknown,
): part is { type: "text"; text: string; state?: string } {
  if (typeof part !== "object" || part === null) return false;
  const p = part as { type?: unknown; text?: unknown };
  return p.type === "text" && typeof p.text === "string";
}

function isToolPart(
  part: unknown,
): part is { type: string; input?: unknown; output?: unknown; state?: string } {
  if (typeof part !== "object" || part === null) return false;
  const p = part as { type?: unknown };
  return typeof p.type === "string" && p.type.startsWith("tool-");
}

export function ChatMessageBubble({
  message,
  isStreaming,
}: ChatMessageBubbleProps) {
  const isUser = message.role === "user";

  const sortedParts = [...(message.parts ?? [])].sort((a, b) => {
    const orderA = isTextPart(a) ? 0 : 1;
    const orderB = isTextPart(b) ? 0 : 1;
    return orderA - orderB;
  });

  const hasContent = sortedParts.some(
    (p) =>
      isTextPart(p) ||
      SURFACE_TOOL_TYPES.has((p as { type?: string }).type ?? ""),
  );

  if (!hasContent) return null;

  const dedupedParts = sortedParts.filter((part, index) => {
    if (!isToolPart(part)) return true;
    const slug = (part.input as { slug?: string } | undefined)?.slug;
    if (!slug) return true;
    const _key = `${part.type}-${slug}`;
    return (
      sortedParts.findLastIndex(
        (p) =>
          isToolPart(p) &&
          p.type === part.type &&
          (p.input as { slug?: string } | undefined)?.slug === slug,
      ) === index
    );
  });

  const hasTextContent = dedupedParts.some(
    (p) => isTextPart(p) && p.text.trim().length > 0,
  );

  const textParts = dedupedParts.filter(
    (p): p is { type: "text"; text: string } =>
      isTextPart(p) && p.text.trim().length > 0,
  );

  const surfaceCards = dedupedParts.filter((p) => {
    if (!isToolPart(p)) return false;
    return SURFACE_TOOL_TYPES.has(p.type);
  });

  const runningTools = dedupedParts.filter((p) => {
    if (!isToolPart(p)) return false;
    if (SURFACE_TOOL_TYPES.has(p.type)) return false;
    if (p.state === "output-available") return false;
    return true;
  });

  const thinking = isStreaming && !hasTextContent && runningTools.length === 0;

  const working = isStreaming && !hasTextContent && runningTools.length > 0;

  return (
    <div
      className={cn("flex w-full", isUser ? "justify-end" : "justify-start")}
      data-role={message.role}
    >
      {isUser ? (
        <div className="w-fit max-w-[75%] space-y-1 rounded-3xl bg-primary px-3.5 py-2.5 text-primary-foreground shadow-sm">
          {dedupedParts.map((part, idx) => {
            if (isTextPart(part)) {
              const text = part.text;
              if (!text) return null;
              return (
                <div
                  key={`text-${idx}`}
                  className="whitespace-pre-wrap text-sm leading-relaxed"
                >
                  {text}
                </div>
              );
            }
            return null;
          })}
        </div>
      ) : (
        <div className="max-w-[88%] space-y-1.5">
          {thinking && (
            <div className="flex items-center gap-1.5 rounded-full border border-border/40 bg-muted/40 px-3 py-2">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary/60 [animation-delay:-0.6s]" />
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary/60 [animation-delay:-0.3s]" />
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary/60" />
              <span className="text-[11px] text-muted-foreground">
                Thinking
              </span>
            </div>
          )}

          {working &&
            runningTools.map((part, idx) => (
              <div
                key={`tool-${idx}`}
                className="flex items-center gap-1.5 rounded-full border border-border/40 bg-muted/40 px-3 py-1 text-[11px] text-muted-foreground"
              >
                <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
                <span>
                  Looking up{" "}
                  {part.type.replace(/^tool-/, "").replace(/_/g, " ")}
                  ...
                </span>
              </div>
            ))}

          {textParts.map((part, idx) => (
            <ChatText key={`text-${idx}`} text={part.text} />
          ))}

          {surfaceCards.map((part, idx) => {
            const type = part.type;
            if (type === "tool-surface_team_card") {
              const input = (part.input ?? {}) as {
                slug?: string;
                reason?: string;
              };
              const output = part.output as
                | {
                    slug?: string;
                    reason?: string;
                    name?: string;
                    role?: string;
                    avatar?: string;
                    profileUrl?: string;
                    isHireable?: boolean;
                    tagline?: string;
                  }
                | undefined;
              if (!input.slug) return null;
              return (
                <ChatTeamCard
                  key={`team-${input.slug}-${idx}`}
                  slug={input.slug}
                  reason={input.reason ?? ""}
                  name={output?.name}
                  role={output?.role}
                  avatar={output?.avatar}
                  profileUrl={output?.profileUrl}
                  isHireable={output?.isHireable}
                />
              );
            }
            if (type === "tool-surface_product_card") {
              const input = (part.input ?? {}) as {
                slug?: string;
                reason?: string;
              };
              const output = part.output as
                | {
                    slug?: string;
                    reason?: string;
                    name?: string;
                    tagline?: string;
                    pageUrl?: string;
                    image?: string;
                  }
                | undefined;
              if (!input.slug) return null;
              return (
                <ChatProductCard
                  key={`product-${input.slug}-${idx}`}
                  slug={input.slug}
                  reason={input.reason ?? ""}
                  name={output?.name}
                  tagline={output?.tagline}
                  pageUrl={output?.pageUrl}
                  image={output?.image}
                />
              );
            }
            if (type === "tool-surface_blog_card") {
              const input = (part.input ?? {}) as {
                slug?: string;
                reason?: string;
              };
              const output = part.output as
                | {
                    slug?: string;
                    reason?: string;
                    title?: string;
                    excerpt?: string;
                    authorName?: string;
                    readingTime?: number;
                    url?: string;
                  }
                | undefined;
              if (!input.slug) return null;
              return (
                <ChatBlogCard
                  key={`blog-${input.slug}-${idx}`}
                  slug={input.slug}
                  reason={input.reason ?? ""}
                  title={output?.title}
                  excerpt={output?.excerpt}
                  authorName={output?.authorName}
                  readingTime={output?.readingTime}
                  url={output?.url}
                />
              );
            }
            return null;
          })}
        </div>
      )}
    </div>
  );
}

interface ChatMessageListProps {
  messages: UIMessage[];
  resumeMessage?: string | null;
  isStreaming?: boolean;
}

export function ChatMessageList({
  messages,
  resumeMessage,
  isStreaming,
}: ChatMessageListProps) {
  if (messages.length === 0) return null;

  return (
    <div className="flex flex-col gap-3">
      {resumeMessage && (
        <div className="mx-auto rounded-full border border-border/40 bg-muted/40 px-3 py-1 text-[11px] text-muted-foreground">
          {resumeMessage}
        </div>
      )}
      {messages.map((m, idx) => (
        <ChatMessageBubble
          key={m.id}
          message={m}
          isStreaming={isStreaming && idx === messages.length - 1}
        />
      ))}
    </div>
  );
}
