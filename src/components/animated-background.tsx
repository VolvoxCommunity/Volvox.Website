"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { SPLINE_IFRAME_URL } from "@/lib/constants";

/**
 * Renders a full-screen, interactive Spline 3D background.
 * Includes a fallback state during loading or on error.
 *
 * @param className - Additional CSS classes for the container.
 * @returns The Spline background component.
 */
export function AnimatedBackground({ className = "" }: { className?: string }) {
  const [hasLoaded, setHasLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <div
      data-testid="animated-background"
      className={cn(
        "spline-container absolute top-0 left-0 w-full h-full -z-10",
        // Fallback or loading background: sleek dark gradient
        "bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-slate-900 via-purple-900/20 to-slate-900",
        className
      )}
    >
      {!hasError && (
        <iframe
          src={SPLINE_IFRAME_URL}
          width="100%"
          height="100%"
          id="aura-spline"
          title="Interactive 3D Data Model Interaction"
          loading="lazy"
          sandbox="allow-scripts allow-same-origin allow-pointer-lock"
          onLoad={() => setHasLoaded(true)}
          onError={() => setHasError(true)}
          style={{ border: 0 }}
          className={cn(
            "pointer-events-auto transition-opacity duration-1000",
            hasLoaded ? "opacity-100" : "opacity-0"
          )}
        />
      )}

      {/* Accessible message for assistive tech if frame fails */}
      {hasError && (
        <span className="sr-only">Background scene failed to load.</span>
      )}
    </div>
  );
}
