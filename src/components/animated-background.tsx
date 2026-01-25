"use client";

import { cn } from "@/lib/utils";

/**
 * Renders a full-screen, interactive Spline 3D background.
 *
 * @param className - Additional CSS classes for the container.
 * @returns The Spline background component.
 */
export function AnimatedBackground({ className = "" }: { className?: string }) {
  return (
    <div
      data-testid="animated-background"
      className={cn(
        "spline-container absolute top-0 left-0 w-full h-full -z-10",
        className
      )}
    >
      <iframe
        src="https://my.spline.design/aidatamodelinteraction-mdTL3FktFVHgDvFr5TKtnYDV"
        frameBorder="0"
        width="100%"
        height="100%"
        id="aura-spline"
        title="Interactive 3D Data Model Interaction"
        className="pointer-events-auto"
      />
    </div>
  );
}
