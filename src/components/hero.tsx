"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect } from "react";
import type { HomepageReview } from "@/lib/types";
import { HeroSection } from "./hero/hero-section";

interface HeroProps {
  onNavigate: (section: string) => void;
  reviews?: HomepageReview[];
}

gsap.registerPlugin(ScrollTrigger);

export function Hero({ onNavigate, reviews }: HeroProps) {
  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Ensure clean initial state
        gsap.set(
          [
            ".hero-badge",
            ".hero-headline",
            ".hero-subheadline",
            ".hero-cta-group > *",
            ".hero-reviews-widget",
          ],
          { opacity: 1, filter: "none", y: 0, scale: 1 },
        );

        // ===========================================
        // HERO SECTION ENTRANCE ANIMATIONS
        // ===========================================
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        // Wait a tiny beat for load
        tl.to({}, { duration: 0.2 });

        // Badge
        tl.from(".hero-badge", { y: 20, opacity: 0, duration: 0.8 });

        // Headline
        tl.from(
          ".hero-headline",
          {
            y: 50,
            opacity: 0,
            filter: "blur(12px)",
            duration: 1.1,
            ease: "power4.out",
            clearProps: "filter",
          },
          "-=0.5",
        );

        // Subheadline
        tl.from(
          ".hero-subheadline",
          {
            y: 24,
            opacity: 0,
            filter: "blur(6px)",
            duration: 0.9,
            clearProps: "filter",
          },
          "-=0.6",
        );

        // CTA buttons (staggered split enter)
        tl.from(
          ".hero-cta-group > *",
          {
            y: 20,
            opacity: 0,
            scale: 0.95,
            duration: 0.8,
            stagger: 0.15,
            ease: "back.out(1.4)",
          },
          "-=0.5",
        );

        // Reviews widget entrance
        tl.from(
          ".hero-reviews-widget",
          {
            y: 24,
            opacity: 0,
            filter: "blur(8px)",
            duration: 0.9,
            ease: "power3.out",
            clearProps: "filter",
          },
          "-=0.3",
        );

        // ===========================================
        // HERO SECTION EXIT ANIMATIONS (SCROLLDOWN)
        // ===========================================
        const exitTl = gsap.timeline({
          scrollTrigger: {
            trigger: ".hero-section",
            start: "top top",
            end: "35% top",
            scrub: true,
          },
        });

        // Individual UI element groups transitioning out rapidly staggered
        exitTl
          .to(
            ".hero-badge",
            { opacity: 0, y: -25, filter: "blur(6px)", ease: "power1.in" },
            0,
          )
          .to(
            ".hero-headline",
            { opacity: 0, y: -35, filter: "blur(8px)", ease: "power1.in" },
            0.03,
          )
          .to(
            ".hero-subheadline",
            { opacity: 0, y: -30, filter: "blur(6px)", ease: "power1.in" },
            0.06,
          )
          .to(
            ".hero-cta-group > *",
            {
              opacity: 0,
              y: -25,
              scale: 0.95,
              stagger: 0.02,
              ease: "power1.in",
            },
            0.09,
          )
          .to(
            ".hero-reviews-widget",
            { opacity: 0, y: -25, filter: "blur(6px)", ease: "power1.in" },
            0.12,
          );
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="flex flex-col w-full">
      <HeroSection onNavigate={onNavigate} reviews={reviews} />
    </div>
  );
}
