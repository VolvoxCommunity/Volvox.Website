"use client";

import { memo, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface ChatMarkdownProps {
  content: string;
}

function MarkdownImpl({ content }: ChatMarkdownProps) {
  const components = useMemo(
    () => ({
      p: ({ children }: { children?: React.ReactNode }) => (
        <p className="my-1.5 first:mt-0 last:mb-0">{children}</p>
      ),
      a: ({
        href,
        children,
      }: {
        href?: string;
        children?: React.ReactNode;
      }) => (
        <a
          href={href}
          target={href?.startsWith("http") ? "_blank" : undefined}
          rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
          className="text-primary underline-offset-2 hover:underline"
        >
          {children}
        </a>
      ),
      strong: ({ children }: { children?: React.ReactNode }) => (
        <strong className="font-semibold text-foreground">{children}</strong>
      ),
      em: ({ children }: { children?: React.ReactNode }) => (
        <em className="italic">{children}</em>
      ),
      ul: ({ children }: { children?: React.ReactNode }) => (
        <ul className="my-1.5 ml-4 list-disc space-y-1 first:mt-0 last:mb-0">
          {children}
        </ul>
      ),
      ol: ({ children }: { children?: React.ReactNode }) => (
        <ol className="my-1.5 ml-4 list-decimal space-y-1 first:mt-0 last:mb-0">
          {children}
        </ol>
      ),
      li: ({ children }: { children?: React.ReactNode }) => (
        <li className="leading-relaxed">{children}</li>
      ),
      code: ({ children }: { children?: React.ReactNode }) => (
        <code className="rounded bg-muted px-1 py-0.5 font-mono text-[0.8em]">
          {children}
        </code>
      ),
      pre: ({ children }: { children?: React.ReactNode }) => (
        <pre className="my-1.5 overflow-x-auto rounded-lg border border-border/40 bg-muted/60 p-2 font-mono text-xs first:mt-0 last:mb-0">
          {children}
        </pre>
      ),
      h1: ({ children }: { children?: React.ReactNode }) => (
        <h1 className="mt-2 mb-1 text-base font-bold first:mt-0">{children}</h1>
      ),
      h2: ({ children }: { children?: React.ReactNode }) => (
        <h2 className="mt-2 mb-1 text-sm font-bold first:mt-0">{children}</h2>
      ),
      h3: ({ children }: { children?: React.ReactNode }) => (
        <h3 className="mt-1.5 mb-0.5 text-sm font-semibold first:mt-0">
          {children}
        </h3>
      ),
      blockquote: ({ children }: { children?: React.ReactNode }) => (
        <blockquote className="my-1.5 border-l-2 border-primary/40 pl-2 italic first:mt-0 last:mb-0">
          {children}
        </blockquote>
      ),
    }),
    [],
  );

  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
      {content}
    </ReactMarkdown>
  );
}

export const ChatMarkdown = memo(MarkdownImpl);
