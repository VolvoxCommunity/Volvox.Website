"use client";

import { useEffect, useRef, useState } from "react";

const MAX_REVEAL_DELAY_MS = 5000;

interface ScrollRevealProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

/**
 * Reveals its children with a fade-and-slide-up animation when the element enters the viewport.
 *
 * Renders a wrapper div that starts hidden and transitions to visible when intersecting the viewport; respects the user's `prefers-reduced-motion` setting by showing content immediately. The reveal can be delayed and additional class names can be applied to the wrapper.
 *
 * @param children - Content to render inside the reveal wrapper.
 * @param delay - Optional delay before the transition begins, in milliseconds (default: 0, clamped to 0-{@link MAX_REVEAL_DELAY_MS}ms range).
 * @param className - Optional additional CSS class names to apply to the wrapper.
 * @returns The wrapper div element that performs the reveal animation around `children`.
 */
export function ScrollReveal({
  children,
  delay = 0,
  className = "",
}: ScrollRevealProps) {
  // Clamp delay to reasonable range
  const clampedDelay = Math.max(0, Math.min(delay, MAX_REVEAL_DELAY_MS));

  // Use lazy initializer to check reduced motion preference once
  const [isVisible, setIsVisible] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false
  );
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useRef(isVisible);

  useEffect(() => {
    // Skip observer if reduced motion is preferred
    if (prefersReducedMotion.current) {
      return;
    }

    // Store the element to ensure cleanup unobserves the correct element
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Once visible, stop observing
          observer.unobserve(element);
        }
      },
      {
        threshold: 0.1,
        rootMargin: "50px",
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-[opacity,transform] duration-700 ease-out ${className}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(20px)",
        transitionDelay: `${clampedDelay}ms`,
      }}
    >
      {children}
    </div>
  );
}
