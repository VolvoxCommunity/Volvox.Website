"use client";

import { ReactNode, useState } from "react";
import { Check, Copy } from "lucide-react";

interface CodeBlockProps {
  children: ReactNode;
  className?: string;
  filename?: string;
}

export function CodeBlock({ children, className, filename }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  // Extract language from className (e.g., "language-typescript" -> "typescript")
  const language = className?.replace("language-", "") || "plaintext";

  const handleCopy = async () => {
    // Get the text content from the code element
    let text = "";

    if (typeof children === "string") {
      text = children;
    } else if (typeof children === "object" && children !== null) {
      // Extract text from nested code element
      const childrenObj = children as any;
      if (childrenObj.props?.children) {
        text = typeof childrenObj.props.children === "string"
          ? childrenObj.props.children
          : "";
      }
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="group relative my-6">
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
          onClick={handleCopy}
          className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200
                     bg-muted hover:bg-muted/80 text-foreground/80 hover:text-foreground
                     rounded-md p-2 border border-border shadow-sm"
          aria-label={copied ? "Copied!" : "Copy code"}
        >
          {copied ? (
            <Check className="h-4 w-4 text-[oklch(0.646_0.222_142)]" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </button>
      </div>
    </div>
  );
}
