"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { HeroSection } from "./hero/hero-section";

interface HeroProps {
  onNavigate: (section: string) => void;
}

gsap.registerPlugin(ScrollTrigger);

export function Hero({ onNavigate }: HeroProps) {
  useEffect(() => {
    const ctx = gsap.context(() => {
      // ===========================================
      // 1. HERO SECTION ANIMATIONS
      // ===========================================
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Badge
      tl.from(".hero-badge", { y: 20, opacity: 0, duration: 0.8 }, "-=0.5");

      // Headline
      tl.from(
        ".hero-headline",
        {
          y: 100,
          opacity: 0,
          filter: "blur(20px)",
          rotationX: -20,
          duration: 1.2,
          transformOrigin: "0% 50% -50",
        },
        "-=0.6"
      );

      // Subheadline
      tl.from(".hero-subheadline", { y: 30, opacity: 0, duration: 1 }, "-=0.8");

      // CTA buttons
      tl.from(".hero-cta-group", { y: 20, opacity: 0, duration: 0.8 }, "-=0.8");

      // Hero Content Fade Out
      gsap.to(".hero-content", {
        scrollTrigger: {
          trigger: ".hero-section",
          start: "top top",
          end: "center top",
          scrub: true,
        },
        y: 100,
        opacity: 0,
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="flex flex-col w-full">
      <HeroSection onNavigate={onNavigate} />
    </div>
  );
}
