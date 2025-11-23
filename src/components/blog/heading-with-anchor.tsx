"use client";

import { useState, useId, type HTMLAttributes, type ReactNode } from "react";
import { Link2, Check } from "lucide-react";
import { generateHeadingId, cn } from "@/lib/utils";
import { reportError } from "@/lib/logger";

interface HeadingWithAnchorProps extends HTMLAttributes<HTMLHeadingElement> {
  as: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  children?: ReactNode;
}

/**
 * Render a heading (h1–h6) that exposes a copyable URL anchor.
 *
 * Renders the specified heading element containing the provided children and an inline button
 * that copies the full URL (including the heading hash) to the clipboard. If `id` is not provided,
 * an id is derived from the text children or a stable fallback is generated.
 *
 * @param as - The heading level tag to render (`"h1"` through `"h6"`).
 * @param children - Content to display inside the heading. If a string, it will be used to derive the heading id when `id` is not provided.
 * @param id - Optional explicit id to assign to the heading; when omitted an id is derived from `children` or a fallback is generated.
 * @returns A React element for the heading with an inline copy-link button.
 */
export function HeadingWithAnchor({
  as: Component,
  children,
  id,
  className,
  ...props
}: HeadingWithAnchorProps) {
  const [copied, setCopied] = useState(false);
  const [announceText, setAnnounceText] = useState("");
  const autoId = useId();

  // Generate ID from text if not provided
  const headingId =
    id ||
    (typeof children === "string"
      ? generateHeadingId(children, `heading-${autoId}`)
      : `heading-${autoId}`);

  const handleCopyLink = async () => {
    const url = `${window.location.origin}${window.location.pathname}#${headingId}`;

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setAnnounceText("Link copied to clipboard");
      setTimeout(() => {
        setCopied(false);
        setAnnounceText("");
      }, 2000);
    } catch (err) {
      reportError("HeadingWithAnchor: Failed to copy link to clipboard", err);
      setAnnounceText("Failed to copy link");
    }
  };

  return (
    <Component
      id={headingId}
      className={cn("group relative", className)}
      {...props}
    >
      {children}
      <span className="sr-only" role="status" aria-live="polite">
        {announceText}
      </span>
      <button
        type="button"
        onClick={handleCopyLink}
        className="inline-flex ml-2 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity duration-200
                   text-muted-foreground hover:text-secondary align-middle"
        aria-label="Copy link to heading"
      >
        {copied ? (
          <Check className="h-4 w-4 text-green-500" />
        ) : (
          <Link2 className="h-4 w-4" />
        )}
      </button>
    </Component>
  );
}
