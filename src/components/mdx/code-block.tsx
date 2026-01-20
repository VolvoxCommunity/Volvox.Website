"use client";

import { ReactNode, useState, isValidElement, ReactElement } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import { reportError } from "@/lib/logger";

interface CodeBlockProps {
  children: ReactNode;
  className?: string;
  filename?: string;
  wrapperClassName?: string;
}

/**
 * Type guard to check if a value is a React element with string children.
 * This is specifically for code blocks where we expect the content to be text.
 */
function hasStringChildren(
  value: unknown
): value is ReactElement<{ children: string }> {
  return (
    isValidElement(value) &&
    typeof value.props === "object" &&
    value.props !== null &&
    "children" in value.props &&
    typeof value.props.children === "string"
  );
}

/**
 * Render a styled code block with an optional filename/language header and a copy-to-clipboard button.
 *
 * @param children - Code content to render; may be a raw string or a code element whose children contain the text to display and copy.
 * @param className - Optional class name for the `<pre>` element (e.g., "language-typescript"); the language label is derived by removing the "language-" prefix and defaults to "plaintext".
 * @param filename - Optional filename to show in the header bar.
 * @param wrapperClassName - Optional class name for the wrapper div; merged with "group relative my-6" to allow safe style extension.
 * @returns A JSX element representing the code block with header (when filename or language is present) and an accessible copy button.
 */
export function CodeBlock({
  children,
  className,
  filename,
  wrapperClassName,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  // Extract language from className (e.g., "language-typescript" -> "typescript")
  const language = className?.replace("language-", "") || "plaintext";

  const handleCopy = async () => {
    // Get the text content from the code element
    let text = "";

    if (typeof children === "string") {
      text = children;
    } else if (hasStringChildren(children)) {
      text = children.props.children;
    }

    if (!text) {
      reportError(
        "CodeBlock: No text content found to copy",
        new Error("Empty code block content")
      );
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      reportError("CodeBlock: Failed to copy to clipboard", err);
    }
  };

  return (
    <div className={cn("group relative my-6", wrapperClassName)}>
      {/* Header with filename and/or language badge */}
      {(filename || language) && (
        <div className="flex items-center justify-between bg-muted/50 border border-b-0 border-border rounded-t-lg px-4 py-2 text-xs">
          {filename && (
            <span className="font-medium text-foreground/80">{filename}</span>
          )}
          {!filename && <span />}
          <span className="text-muted-foreground font-mono uppercase tracking-wider">
            {language}
          </span>
        </div>
      )}

      {/* Code block */}
      <div className="relative">
        <pre
          className={`${filename || language ? "rounded-t-none" : ""} ${className || ""}`}
        >
          {children}
        </pre>

        {/* Copy button */}
        <button
          type="button"
          onClick={handleCopy}
          className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity duration-200
                     bg-muted hover:bg-muted/80 text-foreground/80 hover:text-foreground
                     rounded-md p-2 border border-border shadow-sm"
          aria-label="Copy code to clipboard"
          aria-describedby="code-copy-status"
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-500" aria-hidden="true" />
          ) : (
            <Copy className="h-4 w-4" aria-hidden="true" />
          )}
        </button>
        {/* ARIA live region for copy status announcements */}
        <span
          id="code-copy-status"
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className="sr-only"
        >
          {copied ? "Code copied to clipboard" : ""}
        </span>
      </div>
    </div>
  );
}
