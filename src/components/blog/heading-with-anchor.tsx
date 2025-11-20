"use client";

import { useState } from "react";
import { Link2, Check } from "lucide-react";

interface HeadingWithAnchorProps {
  as: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  children?: React.ReactNode;
  id?: string;
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
export function HeadingWithAnchor({ as: Component, children, id, ...props }: HeadingWithAnchorProps) {
  const [copied, setCopied] = useState(false);

  // Generate ID from text if not provided
  const headingId =
    id ||
    (typeof children === "string"
      ? children
          .toLowerCase()
          .trim()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-_]/g, "")
          .replace(/^-+|-+$/g, "") // Remove leading/trailing hyphens
      : `heading-${Math.random().toString(36).substr(2, 9)}`); // Fallback for non-string

  const handleCopyLink = async () => {
    const url = `${window.location.origin}${window.location.pathname}#${headingId}`;

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  return (
    <Component id={headingId} className="group relative" {...props}>
      {children}
      <button
        onClick={handleCopyLink}
        className="inline-flex ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200
                   text-muted-foreground hover:text-primary align-middle"
        aria-label="Copy link to heading"
      >
        {copied ? (
          <Check className="h-4 w-4 text-[oklch(0.646_0.222_142)]" />
        ) : (
          <Link2 className="h-4 w-4" />
        )}
      </button>
    </Component>
  );
}