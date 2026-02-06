"use client";

import { useState, useEffect, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  Variants,
} from "framer-motion";
import { cn } from "@/lib/utils";

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
  const containerRef = useRef<HTMLDivElement>(null);

  // Detect theme on mount
  useEffect(() => {
    const frameId = requestAnimationFrame(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    return () => cancelAnimationFrame(frameId);
  }, []);

  // Scroll locking logic
  const didLockRef = useRef(false);
  const originalOverflowRef = useRef("");
  const didCompleteRef = useRef(false);

  // Detect prefers-reduced-motion
  const didSkipRef = useRef(false);
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches && !didSkipRef.current) {
      didSkipRef.current = true;
      const frameId = requestAnimationFrame(() => {
        setPhase("interactive");
        onComplete?.();
      });
      return () => cancelAnimationFrame(frameId);
    }
  }, [onComplete]);

  // Scroll animations for exit
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const blur = useTransform(scrollYProgress, [0, 0.4], ["0px", "10px"]);
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "-10%"]);

  useEffect(() => {
    // Lock scroll initially
    if (phase !== "interactive" && !didLockRef.current) {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      if (!mediaQuery.matches) {
        originalOverflowRef.current = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        didLockRef.current = true;
      }
    }

    // Unlock scroll once we hit the interactive text phase
    if (phase === "interactive" && didLockRef.current) {
      document.body.style.overflow = originalOverflowRef.current;
      didLockRef.current = false;
    }

    return () => {
      if (didLockRef.current) {
        document.body.style.overflow = originalOverflowRef.current;
        didLockRef.current = false;
      }
    };
  }, [phase]);

  const videoSrc = isDark ? "/animated-logo.webm" : "/animated-logo-white.mp4";

  return (
    <section
      ref={containerRef}
      data-testid="intro-section"
      className="relative h-screen w-full flex items-center justify-center overflow-hidden z-20"
      style={{ perspective: "1000px" }}
    >
      {/* Background Gradient / Vignette for depth */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-neutral-800/10 via-background to-background pointer-events-none" />

      {/* Intro Phase */}
      {(phase === "text" || phase === "interactive") && (
        <motion.div
          style={{ scale, opacity, filter: blur, y }}
          className="relative z-10 w-full text-center flex flex-col items-center justify-center"
        >
          {/* Logo Video - Replaces static image */}
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
          >
            <AnimatePresence mode="wait">
              {!logoFinished ? (
                <motion.video
                  key="video"
                  src={videoSrc}
                  autoPlay
                  muted
                  playsInline
                  aria-hidden="true"
                  onEnded={() => setLogoFinished(true)}
                  onError={() => {
                    // Fail gracefully if video fails to load
                    console.warn("IntroSection video failed to load:", videoSrc);
                    setLogoFinished(true);
                  }}
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className={cn(
                    "w-full h-full object-contain pointer-events-none select-none",
                    isDark && "mix-blend-screen brightness-90 contrast-125"
                  )}
                />
              ) : (
                <motion.img
                  key="image"
                  src="/logo.png"
                  alt="Volvox Logo"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1 }}
                  className="w-full h-full object-contain pointer-events-none select-none"
                />
              )}
            </AnimatePresence>
          </motion.div>

          {/* Stencil SVG Typography */}
          <motion.div
            variants={svgContainerVariants}
            initial="hidden"
            animate="visible"
            onAnimationComplete={() => {
              if (didCompleteRef.current) return;
              didCompleteRef.current = true;
              requestAnimationFrame(() => {
                setPhase("interactive");
                onComplete?.();
              });
            }}
            className="relative z-10 w-full max-w-5xl px-4"
          >
            <svg
              viewBox="0 0 800 200"
              aria-hidden="true"
              className="w-full h-auto overflow-visible pointer-events-none select-none"
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
                className="font-volvox tracking-widest uppercase pointer-events-none select-none"
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
      )}
    </section>
  );
}
