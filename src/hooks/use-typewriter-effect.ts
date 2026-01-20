"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/** Animation phases for the typewriter effect */
type TypewriterPhase = "idle" | "backspacing" | "pausing" | "typing";

interface UseTypewriterEffectOptions {
  /** Delay between each character action in milliseconds (default: 50) */
  characterDelay?: number;
  /** Pause duration between backspace and type phases in milliseconds (default: 150) */
  pauseDuration?: number;
  /** Whether to start with the initial text already displayed (default: true) */
  startWithText?: boolean;
}

interface UseTypewriterEffectReturn {
  /** The currently displayed text (animated) */
  displayedText: string;
  /** Whether animation is currently in progress */
  isAnimating: boolean;
  /** Current animation phase */
  phase: TypewriterPhase;
}

/**
 * A hook that creates a typewriter effect for text transitions.
 * When the target text changes, it backspaces the old text and types the new text
 * one character at a time.
 *
 * @param targetText - The text to animate towards
 * @param options - Configuration options for the animation
 * @returns Object containing the displayed text and animation state
 *
 * @example
 * ```tsx
 * const { displayedText, isAnimating } = useTypewriterEffect("Hello World", {
 *   characterDelay: 50,
 *   pauseDuration: 150,
 * });
 * ```
 */
export function useTypewriterEffect(
  targetText: string,
  options: UseTypewriterEffectOptions = {}
): UseTypewriterEffectReturn {
  const {
    characterDelay = 50,
    pauseDuration = 150,
    startWithText = true,
  } = options;

  // Track the current displayed text
  const [displayedText, setDisplayedText] = useState(
    startWithText ? targetText : ""
  );
  // Track the current animation phase
  const [phase, setPhase] = useState<TypewriterPhase>("idle");

  // Refs to track animation state without causing re-renders
  const currentTargetRef = useRef(targetText);
  const animationFrameRef = useRef<number | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isAnimatingRef = useRef(false);

  // Cleanup function for animations
  const cleanup = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  // Animate text change with backspace then type effect
  const animateTextChange = useCallback(
    (fromText: string, toText: string) => {
      cleanup();
      isAnimatingRef.current = true;

      let currentText = fromText;
      let charIndex = 0;

      // Phase 1: Backspace the old text
      const backspace = () => {
        if (currentTargetRef.current !== toText) {
          // Target changed during animation, abort
          isAnimatingRef.current = false;
          setPhase("idle");
          return;
        }

        if (currentText.length > 0) {
          currentText = currentText.slice(0, -1);
          setDisplayedText(currentText);
          timeoutRef.current = setTimeout(backspace, characterDelay);
        } else {
          // Done backspacing, pause before typing
          setPhase("pausing");
          timeoutRef.current = setTimeout(startTyping, pauseDuration);
        }
      };

      // Phase 2: Type the new text
      const startTyping = () => {
        if (currentTargetRef.current !== toText) {
          // Target changed during animation, abort
          isAnimatingRef.current = false;
          setPhase("idle");
          return;
        }

        setPhase("typing");
        charIndex = 0;
        typeNextChar();
      };

      const typeNextChar = () => {
        if (currentTargetRef.current !== toText) {
          // Target changed during animation, abort
          isAnimatingRef.current = false;
          setPhase("idle");
          return;
        }

        if (charIndex < toText.length) {
          charIndex++;
          setDisplayedText(toText.slice(0, charIndex));
          timeoutRef.current = setTimeout(typeNextChar, characterDelay);
        } else {
          // Animation complete
          setPhase("idle");
          isAnimatingRef.current = false;
        }
      };

      // Start the animation
      setPhase("backspacing");
      backspace();
    },
    [characterDelay, pauseDuration, cleanup]
  );

  // Handle target text changes
  useEffect(() => {
    const previousTarget = currentTargetRef.current;
    currentTargetRef.current = targetText;

    // Skip if target hasn't changed
    if (previousTarget === targetText) {
      return;
    }

    // Handle empty target text
    if (targetText === "") {
      cleanup();
      setDisplayedText("");
      setPhase("idle");
      isAnimatingRef.current = false;
      return;
    }

    // Start animation from current displayed text to new target
    animateTextChange(displayedText, targetText);

    return cleanup;
  }, [targetText, displayedText, animateTextChange, cleanup]);

  // Cleanup on unmount
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  return {
    displayedText,
    isAnimating: phase !== "idle",
    phase,
  };
}
