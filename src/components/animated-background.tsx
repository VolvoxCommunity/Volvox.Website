"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface GradientBarsProps {
  numBars?: number;
  gradientFrom?: string;
  gradientTo?: string;
  animationDuration?: number;
  className?: string;
}

const GradientBars: React.FC<GradientBarsProps> = ({
  numBars = 15,
  gradientFrom = "var(--primary)",
  gradientTo = "transparent",
  animationDuration = 2,
  className = "",
}) => {
  const calculateHeight = (index: number, total: number) => {
    // Guard against division by zero when total <= 1
    if (total <= 1) return 65;

    const position = index / (total - 1);
    const maxHeight = 100;
    const minHeight = 30;

    const center = 0.5;
    const distanceFromCenter = Math.abs(position - center);
    const heightPercentage = Math.pow(distanceFromCenter * 2, 1.2);

    return minHeight + (maxHeight - minHeight) * heightPercentage;
  };

  return (
    <div className={cn("absolute inset-0 z-0 overflow-hidden", className)}>
      <div
        className="flex h-full"
        style={{
          width: "100%",
          transform: "translateZ(0)",
          WebkitFontSmoothing: "antialiased",
        }}
      >
        {Array.from({ length: numBars }).map((_, index) => {
          const height = calculateHeight(index, numBars);
          return (
            <div
              key={index}
              style={
                {
                  flex: `1 0 calc(100% / ${numBars})`,
                  maxWidth: `calc(100% / ${numBars})`,
                  height: "100%",
                  background: `linear-gradient(to top, ${gradientFrom}, ${gradientTo})`,
                  transform: `scaleY(${height / 100})`,
                  transformOrigin: "bottom",
                  transition: "transform 0.5s ease-in-out",
                  animation: `pulseBar ${animationDuration}s ease-in-out infinite alternate`,
                  animationDelay: `${index * 0.1}s`,
                  outline: "1px solid rgba(0, 0, 0, 0)",
                  boxSizing: "border-box",
                  "--initial-scale": height / 100,
                } as React.CSSProperties
              }
            />
          );
        })}
      </div>
    </div>
  );
};

export function AnimatedBackground({
  className = "",
  numBars,
  gradientFrom = "var(--primary)",
  gradientTo = "transparent",
  animationDuration = 2,
  backgroundColor = "var(--background)",
}: {
  className?: string;
  numBars?: number;
  gradientFrom?: string;
  gradientTo?: string;
  animationDuration?: number;
  backgroundColor?: string;
}) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Use explicit numBars if provided, otherwise responsive default
  const effectiveNumBars = numBars ?? (isMobile ? 8 : 18);

  return (
    <div
      className={cn(
        "absolute inset-0 w-full h-full -z-10 overflow-hidden",
        className
      )}
      style={{ backgroundColor }}
      data-testid="animated-background"
    >
      <GradientBars
        numBars={effectiveNumBars}
        gradientFrom={gradientFrom}
        gradientTo={gradientTo}
        animationDuration={animationDuration}
      />
    </div>
  );
}
