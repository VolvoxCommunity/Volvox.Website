"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, Variants } from "framer-motion";
import { cn } from "@/lib/utils";

// Luminous Solid variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.3,
    },
  },
};

const letterVariants: Variants = {
  hidden: {
    y: "40%",
    opacity: 0,
    filter: "blur(8px)",
  },
  visible: {
    y: "0%",
    opacity: 1,
    filter: "blur(0px)",
    transition: {
      duration: 1.4,
      ease: [0.19, 1, 0.22, 1], // Fluid cinematic ease
    },
  },
};

interface IntroSectionProps {
  onComplete?: () => void;
}

export function IntroSection({ onComplete }: IntroSectionProps) {
  const [phase, setPhase] = useState<"text" | "interactive">("text");
  const [isDark, setIsDark] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Detect theme on mount
  useEffect(() => {
    requestAnimationFrame(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
  }, []);

  // Scroll locking logic
  const didLockRef = useRef(false);
  const originalOverflowRef = useRef("");

  // Detect prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) {
      requestAnimationFrame(() => {
        setPhase("interactive");
        onComplete?.();
      });
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
      {/* Text Phase */}
      {(phase === "text" || phase === "interactive") && (
        <motion.div
          style={{ scale, opacity, filter: blur, y }}
          className="relative z-10 w-full text-center"
        >
          {/* Logo Video - Replaces static image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, delay: 1, ease: "easeOut" }}
            className="absolute top-[-50px] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100px] h-[100px] -z-10 flex items-center justify-center"
          >
            <video
              src={videoSrc}
              autoPlay
              loop
              muted
              playsInline
              className={cn(
                "w-full h-full object-contain pointer-events-none select-none",
                isDark && "mix-blend-screen brightness-90 contrast-125"
              )}
            />
          </motion.div>

          <motion.h1
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            onAnimationComplete={() => {
              requestAnimationFrame(() => {
                setPhase("interactive");
                onComplete?.();
              });
            }}
            className="relative z-10 font-[family-name:var(--font-space-grotesk)] text-[18vw] leading-none font-extrabold tracking-tighter select-none p-4"
            style={{
              backgroundImage:
                "linear-gradient(180deg, #FFFFFF 10%, #C0C0C0 30%, #505050 48%, #FFFFFF 50%, #C0C0C0 70%, #606060 90%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              color: "transparent",
              WebkitTextStroke: "4px rgba(129, 129, 129, 0.4)",
              filter: "drop-shadow(0 0 20px rgba(255,255,255,0.4))",
            }}
          >
            {Array.from("VOLVOX").map((letter, index) => (
              <motion.span
                key={index}
                variants={letterVariants}
                className="inline-block"
              >
                {letter}
              </motion.span>
            ))}
          </motion.h1>

          {/* Subtle Ambient Glow */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[40vw] -z-10 blur-[120px] opacity-20 pointer-events-none animate-pulse-slow"
            style={{
              background:
                "radial-gradient(ellipse at center, var(--primary) 0%, transparent 60%)",
            }}
          />
        </motion.div>
      )}
    </section>
  );
}
