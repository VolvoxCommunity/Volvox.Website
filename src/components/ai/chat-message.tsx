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

function isSurfaceToolPart(part: unknown): part is {
  type: string;
  input?: unknown;
  output?: unknown;
  state?: string;
} {
  return isToolPart(part) && SURFACE_TOOL_TYPES.has(part.type);
}

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

function isReasoningPart(
  part: unknown,
): part is { type: "reasoning"; text: string; state?: string } {
  if (typeof part !== "object" || part === null) return false;
  const p = part as { type?: unknown; text?: unknown };
  return p.type === "reasoning" && typeof p.text === "string";
}

function getToolStatusLabel(toolType: string): string {
  switch (toolType) {
    case "tool_get_team_members":
      return "Getting team members info";
    case "tool_get_team_member":
      return "Fetching member details";
    case "tool_get_products":
      return "Checking products";
    case "tool_get_product":
      return "Fetching product details";
    case "tool_get_blog_posts":
      return "Searching blog posts";
    case "tool_get_blog_post":
      return "Reading blog post";
    case "tool_get_community_info":
      return "Checking community info";
    case "tool_surface_team_card":
      return "Preparing team card";
    case "tool_surface_product_card":
      return "Preparing product card";
    case "tool_surface_blog_card":
      return "Preparing blog card";
    default:
      return "Working on answer";
  }
}

function getAssistantStatusLabel(message: UIMessage): string {
  const parts = message.parts ?? [];
  const lastStepStartIndex = parts.reduce(
    (lastIndex, part, index) =>
      part.type === "step-start" ? index : lastIndex,
    -1,
  );
  const currentParts =
    lastStepStartIndex >= 0 ? parts.slice(lastStepStartIndex + 1) : parts;

  const activeTool = [...currentParts]
    .reverse()
    .find(
      (part) =>
        isToolPart(part) &&
        part.state !== "output-available" &&
        part.state !== "output-error" &&
        part.state !== "output-denied",
    );
  if (activeTool) {
    return getToolStatusLabel(activeTool.type);
  }

  const hasStreamingText = currentParts.some(
    (part) => isTextPart(part) && part.state === "streaming",
  );
  if (hasStreamingText) {
    return "Writing answer";
  }

  const hasReasoning = currentParts.some(
    (part) => isReasoningPart(part) && part.state === "streaming",
  );
  if (hasReasoning) {
    return "Thinking";
  }

  const hasCompletedTool = currentParts.some(
    (part) =>
      isToolPart(part) &&
      (part.state === "output-available" || part.state === "output-error"),
  );
  if (hasCompletedTool) {
    return "Organizing information";
  }

  const hasVisibleText = currentParts.some(
    (part) => isTextPart(part) && part.text.trim().length > 0,
  );
  if (hasVisibleText) {
    return "Writing answer";
  }

  return "Thinking";
}

export function ChatMessageBubble({
  message,
  isStreaming,
}: ChatMessageBubbleProps) {
  const isUser = message.role === "user";
  const messageWithContent = message as unknown as { content?: unknown };
  const content =
    typeof messageWithContent.content === "string"
      ? messageWithContent.content
      : "";
  const rawParts =
    message.parts && message.parts.length > 0
      ? message.parts
      : content
        ? [{ type: "text", text: content }]
        : [];

  const displayParts = rawParts.filter(
    (part) => isTextPart(part) || isSurfaceToolPart(part),
  );

  const sortedParts = [...displayParts].sort((a, b) => {
    const orderA = isTextPart(a) ? 0 : 1;
    const orderB = isTextPart(b) ? 0 : 1;
    return orderA - orderB;
  });

  const hasContent = sortedParts.some(
    (p) =>
      isTextPart(p) ||
      SURFACE_TOOL_TYPES.has((p as { type?: string }).type ?? ""),
  );

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

  const textParts = dedupedParts.filter(
    (p): p is { type: "text"; text: string } =>
      isTextPart(p) && p.text.trim().length > 0,
  );

  const surfaceCards = dedupedParts.filter(isSurfaceToolPart);
  const statusLabel =
    isStreaming && !isUser ? getAssistantStatusLabel(message) : null;

  if (!hasContent) {
    if (statusLabel) {
      return (
        <div className="flex w-full justify-start" data-role={message.role}>
          <AssistantStatusPill label={statusLabel} />
        </div>
      );
    }
    return null;
  }

  return (
    <div
      className={cn("flex w-full", isUser ? "justify-end" : "justify-start")}
      data-role={message.role}
    >
      {isUser ? (
        <div className="w-fit max-w-[75%] space-y-1 rounded-3xl bg-primary px-3.5 py-2.5 text-primary-foreground shadow-sm">
          {dedupedParts.map((part) => {
            if (isTextPart(part)) {
              const text = part.text;
              if (!text) return null;
              return (
                <div
                  key={`user-text-${text}`}
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
          {statusLabel && <AssistantStatusPill label={statusLabel} />}

          {textParts.map((part) => (
            <ChatText key={`assistant-text-${part.text}`} text={part.text} />
          ))}

          {surfaceCards.map((part) => {
            const tp = part as {
              type: string;
              input?: unknown;
              output?: unknown;
            };
            const type = tp.type;
            const input =
              tp.input && typeof tp.input === "object"
                ? (tp.input as Record<string, unknown>)
                : {};
            const slug = typeof input.slug === "string" ? input.slug : "";
            if (!slug) return null;
            const reason = typeof input.reason === "string" ? input.reason : "";
            const out =
              tp.output && typeof tp.output === "object"
                ? (tp.output as Record<string, unknown>)
                : {};
            if (type === "tool-surface_team_card") {
              return (
                <ChatTeamCard
                  key={`team-${slug}`}
                  slug={slug}
                  reason={reason}
                  name={typeof out.name === "string" ? out.name : undefined}
                  role={typeof out.role === "string" ? out.role : undefined}
                  avatar={
                    typeof out.avatar === "string" ? out.avatar : undefined
                  }
                  profileUrl={
                    typeof out.profileUrl === "string"
                      ? out.profileUrl
                      : undefined
                  }
                  isHireable={
                    typeof out.isHireable === "boolean"
                      ? out.isHireable
                      : undefined
                  }
                />
              );
            }
            if (type === "tool-surface_product_card") {
              return (
                <ChatProductCard
                  key={`product-${slug}`}
                  slug={slug}
                  reason={reason}
                  name={typeof out.name === "string" ? out.name : undefined}
                  tagline={
                    typeof out.tagline === "string" ? out.tagline : undefined
                  }
                  pageUrl={
                    typeof out.pageUrl === "string" ? out.pageUrl : undefined
                  }
                  image={typeof out.image === "string" ? out.image : undefined}
                />
              );
            }
            if (type === "tool-surface_blog_card") {
              return (
                <ChatBlogCard
                  key={`blog-${slug}`}
                  slug={slug}
                  reason={reason}
                  title={typeof out.title === "string" ? out.title : undefined}
                  excerpt={
                    typeof out.excerpt === "string" ? out.excerpt : undefined
                  }
                  authorName={
                    typeof out.authorName === "string"
                      ? out.authorName
                      : undefined
                  }
                  readingTime={
                    typeof out.readingTime === "number"
                      ? out.readingTime
                      : undefined
                  }
                  url={typeof out.url === "string" ? out.url : undefined}
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

function AssistantStatusPill({ label }: { label: string }) {
  return (
    <div className="flex w-fit items-center gap-1.5 rounded-full border border-border/40 bg-muted/40 px-3 py-2">
      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary/60 [animation-delay:-0.6s]" />
      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary/60 [animation-delay:-0.3s]" />
      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary/60" />
      <span className="text-[11px] text-muted-foreground">{label}</span>
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

  const shouldShowPendingAssistant =
    isStreaming && messages[messages.length - 1]?.role === "user";

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
      {shouldShowPendingAssistant && (
        <div className="flex w-full justify-start" data-role="assistant">
          <AssistantStatusPill label="Thinking" />
        </div>
      )}
    </div>
  );
}
