"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  Variants,
} from "framer-motion";
import { cn } from "@/lib/utils";
import { reportError } from "@/lib/logger";

// Entrance variants for the SVG container
const svgContainerVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 40,
    filter: "blur(10px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 1.5,
      ease: [0.19, 1, 0.22, 1], // Fluid cinematic ease
      delay: 0.2,
    },
  },
};

interface IntroSectionProps {
  onComplete?: () => void;
}

export function IntroSection({ onComplete }: IntroSectionProps) {
  const [phase, setPhase] = useState<"text" | "interactive">("text");
  const [isDark, setIsDark] = useState(false);
  const [logoFinished, setLogoFinished] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const onCompleteRef = useRef(onComplete);

  // Sync ref when onComplete changes
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // Scroll locking & transition control refs
  const didLockRef = useRef(false);
  const originalOverflowRef = useRef("");
  const isSkippingRef = useRef(false);

  const unlockScroll = useCallback(() => {
    if (didLockRef.current) {
      document.body.style.overflow = originalOverflowRef.current;
      didLockRef.current = false;
    }
  }, []);

  const handleComplete = useCallback(() => {
    if (isSkippingRef.current) return;
    isSkippingRef.current = true;

    unlockScroll();
    setPhase("interactive");
    setIsVisible(false);
    onCompleteRef.current?.();
  }, [unlockScroll]);

  // Initial check for skip conditions
  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const isBot = /bot|googlebot|crawler|spider|robot|crawling/i.test(
      navigator.userAgent
    );

    if (isBot || mediaQuery.matches) {
      // Immediate skip
      requestAnimationFrame(() => {
        setPhase("interactive");
        onCompleteRef.current?.();
      });
    } else {
      // Show intro and lock scroll
      requestAnimationFrame(() => {
        setIsVisible(true);
        setIsDark(document.documentElement.classList.contains("dark"));
      });
      originalOverflowRef.current = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      didLockRef.current = true;
    }

    return () => unlockScroll();
  }, [unlockScroll]); // Stable - runs once on mount

  // Safety hang timeout
  useEffect(() => {
    if (phase !== "text") return;

    const safetyTimer = setTimeout(() => {
      if (!isSkippingRef.current) {
        handleComplete();
      }
    }, 10000); // 10s fallback

    return () => clearTimeout(safetyTimer);
  }, [phase, handleComplete]);

  // Scroll animations for exit
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const blur = useTransform(scrollYProgress, [0, 0.4], ["0px", "10px"]);
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "-10%"]);

  const videoSrc = isDark ? "/animated-logo.webm" : "/animated-logo-white.mp4";

  if (!isVisible && phase === "interactive") return null;

  return (
    <section
      ref={containerRef}
      data-testid="intro-section"
      className="relative h-screen w-full flex items-center justify-center overflow-hidden z-20"
      style={{ perspective: "1000px" }}
    >
      {/* Background Gradient / Vignette for depth */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-neutral-800/10 via-background to-background pointer-events-none" />

      <motion.div
        style={{ scale, opacity, filter: blur, y }}
        className="relative z-10 w-full text-center flex flex-col items-center justify-center"
      >
        {/* Logo Video - Decorative */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 20,
            delay: 1.2,
          }}
          className="absolute top-[-50px] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120px] md:w-[170px] h-[120px] md:h-[170px] -z-10 flex items-center justify-center"
          aria-hidden="true"
        >
          <AnimatePresence mode="wait">
            {!logoFinished ? (
              <motion.video
                key="video"
                src={videoSrc}
                autoPlay
                muted
                playsInline
                onEnded={() => setLogoFinished(true)}
                onError={(e) => {
                  reportError("IntroSection video failure", e);
                  setLogoFinished(true);
                }}
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className={cn(
                  "w-full h-full object-contain pointer-events-none select-none",
                  isDark && "mix-blend-screen brightness-90 contrast-125"
                )}
                role="presentation"
                aria-hidden="true"
              />
            ) : (
              <motion.img
                key="image"
                src="/logo.png"
                alt=""
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                className="w-full h-full object-contain pointer-events-none select-none"
                role="presentation"
                aria-hidden="true"
              />
            )}
          </AnimatePresence>
        </motion.div>

        {/* Stencil SVG Typography - Decorative */}
        <motion.div
          variants={svgContainerVariants}
          initial="hidden"
          animate="visible"
          onAnimationComplete={handleComplete}
          className="relative z-10 w-full max-w-5xl px-4"
          aria-hidden="true"
        >
          <svg
            viewBox="0 0 800 200"
            className="w-full h-auto drop-shadow-2xl overflow-visible pointer-events-none select-none"
            role="presentation"
            aria-hidden="true"
          >
            <defs>
              <linearGradient
                id="metallic-gradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%" stopColor="#333" />
                <stop offset="20%" stopColor="#555" />
                <stop offset="22%" stopColor="#fff" />
                <stop offset="25%" stopColor="#555" />
                <stop offset="40%" stopColor="#222" />
                <stop offset="58%" stopColor="#999" />
                <stop offset="60%" stopColor="#e0e0e0" />
                <stop offset="62%" stopColor="#555" />
                <stop offset="100%" stopColor="#111" />
              </linearGradient>
            </defs>
            <text
              x="50%"
              y="80%"
              textAnchor="middle"
              className="tracking-widest uppercase pointer-events-none select-none"
              style={{
                fontFamily: "var(--font-saira-stencil)",
                fontSize: "140px",
                fill: "transparent",
                stroke: "url(#metallic-gradient)",
                strokeWidth: "4px",
                strokeLinejoin: "round",
              }}
            >
              VOLVOX
            </text>
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
}
