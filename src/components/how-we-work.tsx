"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { type JSX, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { trackMetaPixelEvent } from "@/lib/meta-pixel";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const steps = [
  {
    step: "Step 01 — Discovery",
    title: "it starts with a conversation",
    desc: "Every project begins the same way: a call. No lengthy intake forms, no gatekeeping. We talk through what you're trying to build, what's not working right now, and what success actually looks like for your business.",
    img: "/images/UI/two_speech_bubble_cutout.png",
  },
  {
    step: "Step 02 — Scoping",
    title: "based on experience, not guesswork",
    desc: "Because we've built a wide range of software, we often have a sense of timeline and cost before the conversation even ends. We don't force every project into the same box — the approach flexes to fit what you actually need.",
    img: "/images/UI/laptop_cutout.png",
  },
  {
    step: "Step 03 — Design & Build",
    title: "the right tools for the job",
    desc: "Our stack depends on the project — we pick what's genuinely best for what you're building. That often includes React, Next.js, and TypeScript on the frontend, with .NET and C# on the backend, but the specifics shift based on your goals.",
    tag: "Everything built in-house",
    img: "/images/UI/floating_ui_elements_cutout.png",
  },
  {
    step: "Step 04 — Test & refine",
    title: "weekly, not once",
    desc: "We stay in sync with consistent weekly check-ins throughout the build — not because a process document says so, but because real communication is genuinely how we work best.",
    img: "/images/UI/calendar_cutout.png",
  },
  {
    step: "Step 05 — Launch",
    title: "and we don't disappear",
    desc: "From first call to shipped product. And once it's live, we're still here — support continues after launch, not just up until the invoice is paid.",
    img: "/images/UI/handshake_cutout.png",
  },
];

export function HowWeWork(): JSX.Element {
  const containerRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  // staticMode: small screens or reduced-motion users get a plain, non-pinned,
  // fully-visible vertical layout instead of the scroll-scrubbed experience.
  const [staticMode, setStaticMode] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobileQuery = window.matchMedia("(max-width: 767px)");
    const sync = () => {
      setReducedMotion(motionQuery.matches);
      setStaticMode(motionQuery.matches || mobileQuery.matches);
    };
    sync();
    motionQuery.addEventListener("change", sync);
    mobileQuery.addEventListener("change", sync);
    return () => {
      motionQuery.removeEventListener("change", sync);
      mobileQuery.removeEventListener("change", sync);
    };
  }, []);

  // Freeze or resume decorative SMIL SVG animations based on reduced-motion preference.
  useEffect(() => {
    const svgs = containerRef.current?.querySelectorAll("svg");
    svgs?.forEach((svg) => {
      const svgEl = svg as SVGSVGElement;
      if (reducedMotion) {
        svgEl.pauseAnimations();
      } else {
        svgEl.unpauseAnimations();
      }
    });
  }, [reducedMotion]);

  useGSAP(
    () => {
      if (staticMode || !pinRef.current) return;

      // Gate each overlapping phase from the a11y tree + tab order until revealed
      // (autoAlpha toggles visibility alongside opacity).
      gsap.set(
        [
          ".hww-headline",
          ".hww-subtext",
          ".hww-steps-wrapper",
          ".hww-info-wrapper",
          ".hww-values-wrapper",
          ".hww-cta-wrapper",
        ],
        { autoAlpha: 0 },
      );

      // Pinned timeline with substantial depth for choreographing all phases
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pinRef.current,
          start: "top top",
          end: "+=9500", // Expanded scroll depth to accommodate split phases perfectly
          scrub: 1,
          pin: true,
        },
      });

      // --- PHASE 1: "How we work" Title (Velocity 3D entrance & exit) ---
      tl.fromTo(
        ".hww-title-word",
        {
          y: 120,
          opacity: 0,
          rotationX: -60,
          transformOrigin: "50% 50% -50px",
        },
        {
          y: 0,
          opacity: 1,
          rotationX: 0,
          duration: 1,
          stagger: 0.1,
          ease: "power3.out",
        },
      );

      tl.to({}, { duration: 0.4 }); // beat pause

      // Title exit: clean fade + scale out to make space for headline (no top-left move)
      tl.to(".hww-title-container", {
        autoAlpha: 0,
        scale: 0.8,
        y: -30,
        duration: 0.8,
        ease: "power2.in",
      });

      // --- PHASE 2: Headline Entrance & Exit ---
      tl.fromTo(
        ".hww-headline",
        { autoAlpha: 0, y: 50, scale: 0.95 },
        { autoAlpha: 1, y: 0, scale: 1, duration: 1, ease: "power2.out" },
        "-=0.4",
      );

      tl.to({}, { duration: 0.6 });

      tl.to(".hww-headline", {
        autoAlpha: 0,
        y: -50,
        scale: 1.05,
        duration: 0.8,
        ease: "power2.in",
      });

      // --- PHASE 3: Subtext Word-by-Word Pull-up (Opacity Fix Applied!) ---
      // Force parent container opacity to 1 so the word-by-word reveal actually renders!
      tl.to(".hww-subtext", { autoAlpha: 1, duration: 0.1 });
      tl.fromTo(
        ".hww-subtext-word-inner",
        { opacity: 0, y: "100%" },
        {
          opacity: 1,
          y: "0%",
          duration: 0.6,
          stagger: 0.04,
          ease: "power2.out",
        },
        "<",
      );

      tl.to({}, { duration: 0.8 });

      tl.to(".hww-subtext", {
        autoAlpha: 0,
        y: -40,
        duration: 0.8,
        ease: "power2.in",
      });

      // --- PHASE 4: Steps Carousel ---
      const cardNodes = gsap.utils.toArray(".hww-card");
      const textNodes = gsap.utils.toArray(".hww-text");

      // Set initial states for steps (with slight random rotation offsets)
      gsap.set(cardNodes, {
        opacity: 0,
        scale: 0.3,
        y: 200,
        x: 200,
        rotation: 10,
        zIndex: 1,
      });
      gsap.set(textNodes, { opacity: 0, y: 50, filter: "blur(10px)" });

      // Bring steps container into focus
      tl.to(
        ".hww-steps-wrapper",
        { autoAlpha: 1, pointerEvents: "auto", duration: 0.5 },
        "-=0.3",
      );

      // Card 0 entry & Text 0 entry (Z-Axis tilt)
      tl.to(
        cardNodes[0] as HTMLElement,
        {
          opacity: 1,
          scale: 1,
          y: 0,
          x: 0,
          rotation: -2,
          zIndex: 10,
          duration: 1,
          ease: "power2.out",
        },
        "<",
      );
      tl.fromTo(
        textNodes[0] as HTMLElement,
        { opacity: 0, y: 50, filter: "blur(10px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 1,
          ease: "power3.out",
        },
        "<",
      );

      // Card 1 Standby (bottom right, tilted)
      tl.to(
        cardNodes[1] as HTMLElement,
        {
          opacity: 1,
          scale: 0.4,
          y: 250,
          x: 150,
          rotation: 8,
          zIndex: 5,
          duration: 1,
          ease: "power2.out",
        },
        "<0.2",
      );

      // Sequential steps transition loop
      for (let i = 0; i < steps.length; i++) {
        // Active image parallax zoom
        const img = (cardNodes[i] as HTMLElement).querySelector("img");
        tl.to(img, { scale: 1.08, duration: 1.5, ease: "none" });

        if (i < steps.length - 1) {
          const label = `stepTrans${i}`;

          // Old card sweeps out to top-left and fades
          tl.to(
            cardNodes[i] as HTMLElement,
            {
              opacity: 0,
              scale: 0.3,
              x: -300,
              y: -300,
              rotation: -12,
              duration: 1,
              ease: "power2.inOut",
            },
            label,
          );
          // Old text fades out/up with blur
          tl.to(
            textNodes[i] as HTMLElement,
            {
              opacity: 0,
              y: -40,
              filter: "blur(10px)",
              duration: 0.7,
              ease: "power2.in",
            },
            label,
          );

          // Standby card moves to center (scale up, dynamic rotation)
          tl.to(
            cardNodes[i + 1] as HTMLElement,
            {
              scale: 1,
              x: 0,
              y: 0,
              rotation: i % 2 === 0 ? 2 : -2,
              zIndex: 10,
              duration: 1,
              ease: "power2.inOut",
            },
            label,
          );
          // New text fades in from blur (crossfade overlap)
          tl.fromTo(
            textNodes[i + 1] as HTMLElement,
            { opacity: 0, y: 40, filter: "blur(10px)" },
            {
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              duration: 0.9,
              ease: "power3.out",
            },
            `${label}+=0.25`,
          );

          // Next standby enters bottom-right
          if (i + 2 < steps.length) {
            tl.to(
              cardNodes[i + 2] as HTMLElement,
              {
                opacity: 1,
                scale: 0.4,
                y: 250,
                x: 150,
                rotation: i % 2 === 0 ? 8 : -8,
                zIndex: 5,
                duration: 1,
                ease: "power2.out",
              },
              `${label}+=0.2`,
            );
          }
        }
      }

      tl.to({}, { duration: 0.4 }); // wait a bit on the final step

      // Fade out steps stage
      tl.to(".hww-steps-wrapper", {
        autoAlpha: 0,
        y: -40,
        pointerEvents: "none",
        duration: 0.8,
        ease: "power2.in",
      });

      // --- PHASE 5: Info Cards (3D staggered fly-in + SVG animations) ---
      const infoCards = gsap.utils.toArray(".hww-info-card");
      gsap.set(infoCards, {
        opacity: 0,
        y: 80,
        scale: 0.95,
        rotationX: -10,
        transformOrigin: "50% 50%",
      });

      tl.to(
        ".hww-info-wrapper",
        { autoAlpha: 1, pointerEvents: "auto", duration: 0.5 },
        "-=0.2",
      );
      tl.to(
        infoCards,
        {
          opacity: 1,
          y: 0,
          scale: 1,
          rotationX: 0,
          stagger: 0.15,
          duration: 1.2,
          ease: "back.out(1.1)",
        },
        "<0.2",
      );

      tl.to({}, { duration: 1.5 }); // pause on info cards to let SVG animations play out

      // Fade out info wrapper
      tl.to(".hww-info-wrapper", {
        autoAlpha: 0,
        scale: 1.05,
        y: -30,
        pointerEvents: "none",
        duration: 0.8,
        ease: "power2.in",
      });

      // --- PHASE 6: Values Stack (Editorial rows - Dedicated phase) ---
      tl.to(
        ".hww-values-wrapper",
        { autoAlpha: 1, pointerEvents: "auto", duration: 0.5 },
        "-=0.2",
      );

      // Staggered value items entrance (Editorial Stack)
      tl.fromTo(
        ".hww-value-item",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.18,
          duration: 0.9,
          ease: "power2.out",
        },
        "<0.1",
      );

      tl.to({}, { duration: 1.4 }); // wait and read values

      // Fade out values wrapper
      tl.to(".hww-values-wrapper", {
        autoAlpha: 0,
        scale: 0.95,
        y: -30,
        pointerEvents: "none",
        duration: 0.8,
        ease: "power2.in",
      });

      // --- PHASE 7: Closing CTA (Unified Crescendo - Dedicated phase) ---
      tl.to(
        ".hww-cta-wrapper",
        { autoAlpha: 1, pointerEvents: "auto", duration: 0.5 },
        "-=0.2",
      );

      // CTA content float and scale up
      tl.fromTo(
        ".hww-cta-content",
        { opacity: 0, y: 50, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: "power2.out" },
        "<0.1",
      );

      tl.to({}, { duration: 1.5 }); // lingering pause on final CTA before unpinning
    },
    { scope: containerRef, dependencies: [staticMode], revertOnUpdate: true },
  );

  return (
    <section
      id="how-we-work"
      data-testid="how-we-work-section"
      aria-label="How We Work"
      className="relative w-full bg-background overflow-hidden"
      ref={containerRef}
    >
      {/* Cinematic Ambient Radial Orbs (Ethereal Glass Vibe) */}
      {!staticMode && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-10 opacity-30">
          <div className="absolute top-[20%] left-[10%] w-[40vw] h-[40vw] rounded-full bg-primary/10 blur-[120px] transform-gpu" />
          <div className="absolute bottom-[20%] right-[10%] w-[50vw] h-[50vw] rounded-full bg-secondary/5 blur-[150px] transform-gpu" />
        </div>
      )}

      {/* DESKTOP VIEW (hidden on mobile, uses pinned animations) */}
      <div
        ref={pinRef}
        className="w-full relative h-screen overflow-hidden hidden md:block"
      >
        {/* The "How we work" Title (Phase 1, full screen center, then fades) */}
        <div className="hww-title-container absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none z-50 perspective-[1000px] transform-style-3d">
          <h2 className="text-6xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter flex gap-[0.2em] overflow-hidden p-4">
            {"How we work".split(" ").map((w, i) => (
              <span key={i} className="hww-title-word block">
                {w}
              </span>
            ))}
          </h2>
        </div>

        {/* Headline (Phase 2, centered, hidden initially) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40">
          <h2 className="hww-headline opacity-0 text-4xl md:text-6xl lg:text-7xl font-bold text-center max-w-5xl px-4 tracking-tight leading-tight">
            No black box. Just how we{" "}
            <span className="inline-flex items-center justify-center px-6 py-2 mx-2 text-2xl md:text-4xl lg:text-5xl font-mono uppercase tracking-[0.05em] font-bold bg-primary/10 border border-primary/30 text-primary rounded-full align-middle transform -rotate-1">
              actually
            </span>{" "}
            build.
          </h2>
        </div>

        {/* Subtext (Phase 3, centered, hidden initially) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40">
          <p className="hww-subtext opacity-0 text-2xl md:text-3xl text-center max-w-4xl px-4 leading-relaxed font-medium text-muted-foreground flex flex-wrap justify-center gap-x-2 gap-y-1">
            {"We don't have a stack of client case studies to point to yet — so here's the next best thing: an honest look at how a project with Volvox actually goes, from the first call to long after launch."
              .split(" ")
              .map((w, i) => (
                <span
                  key={i}
                  className="hww-subtext-word block overflow-hidden"
                >
                  <span className="hww-subtext-word-inner block">{w}</span>
                </span>
              ))}
          </p>
        </div>

        {/* Steps Wrapper (Phase 4, hidden initially) */}
        <div className="hww-steps-wrapper opacity-0 absolute inset-0 flex items-center justify-center w-full max-w-7xl mx-auto px-4 md:px-8 z-30 pointer-events-none">
          {/* Left Area: Cards with Double-Bezel Architecture */}
          <div className="w-1/2 h-[60vh] relative flex items-center justify-center">
            {steps.map((step, i) => (
              <div
                key={i}
                className="hww-card absolute w-full max-w-md aspect-[4/3] p-2 rounded-[2.5rem] bg-card/25 border border-border/30 shadow-2xl flex-shrink-0 origin-center"
              >
                <div className="w-full h-full rounded-[calc(2.5rem-0.5rem)] overflow-hidden bg-card border border-border/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] flex items-center justify-center">
                  <img
                    src={step.img}
                    alt={step.title}
                    className="w-full h-full object-contain p-8 origin-center transition-transform duration-700 ease-out hover:scale-105"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Right Area: Texts */}
          <div className="w-1/2 h-[60vh] relative">
            {steps.map((step, i) => (
              <div
                key={i}
                className="hww-text absolute inset-0 flex flex-col justify-center pr-8 lg:pr-16"
              >
                <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6 tracking-tight text-foreground leading-[1.1]">
                  {step.title}
                </h3>
                <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl">
                  {step.desc}
                </p>
                {step.tag && (
                  <p className="mt-6 text-sm font-medium text-primary">
                    {step.tag}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Info Cards Wrapper (Phase 5, Asymmetrical Bento Grid with Double-Bezel Architecture) */}
        <div className="hww-info-wrapper absolute inset-0 flex flex-col justify-center items-center w-full max-w-7xl mx-auto px-4 md:px-8 z-30 pointer-events-none opacity-0">
          <h3 className="text-sm font-semibold tracking-widest uppercase text-muted-foreground mb-12 text-center hww-info-title">
            What powers our process
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
            {/* CARD 1: Our Stack (col-span-2 horizontal split) */}
            <div className="md:col-span-2 hww-info-card p-2 rounded-[2.5rem] bg-card-deep/30 dark:bg-card-deep/10 border border-border/30 transform-gpu relative overflow-hidden group">
              <div className="w-full h-full rounded-[calc(2.5rem-0.5rem)] bg-card border border-border/10 p-8 flex flex-col md:flex-row items-center gap-8 justify-between shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
                <div className="flex flex-col text-left max-w-sm">
                  <h4 className="text-2xl font-bold mb-4">Our stack</h4>
                  <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
                    No fixed template — we choose what's right for the project.
                    Most commonly:
                  </p>
                  <p className="font-semibold text-primary text-sm mt-auto">
                    React, Next.js, TypeScript, .NET / C#
                  </p>
                </div>
                <div className="w-full md:w-1/2 h-32 flex items-center justify-center relative overflow-hidden">
                  <svg
                    viewBox="0 0 200 150"
                    className="w-full h-full opacity-85 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ maxWidth: "180px" }}
                    aria-hidden
                  >
                    <title>Tech Stack Orbit Animation</title>
                    <defs>
                      <linearGradient
                        id="stackGrad"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                      >
                        <stop
                          offset="0%"
                          stopColor="#007AFF"
                          stopOpacity="0.85"
                        />
                        <stop
                          offset="100%"
                          stopColor="#9b3fca"
                          stopOpacity="0.15"
                        />
                      </linearGradient>
                    </defs>

                    {/* Outer Orbit Path */}
                    <ellipse
                      cx="100"
                      cy="75"
                      rx="60"
                      ry="22"
                      fill="none"
                      stroke="rgba(255,255,255,0.08)"
                      strokeWidth="1"
                      transform="rotate(-15 100 75)"
                    />
                    {/* Inner Orbit Path */}
                    <ellipse
                      cx="100"
                      cy="75"
                      rx="42"
                      ry="42"
                      fill="none"
                      stroke="rgba(255,255,255,0.05)"
                      strokeWidth="1"
                    />

                    {/* Pulsing Core Node */}
                    <circle cx="100" cy="75" r="9" fill="url(#stackGrad)" />
                    <circle
                      cx="100"
                      cy="75"
                      r="12"
                      fill="none"
                      stroke="#007AFF"
                      strokeWidth="0.5"
                      opacity="0.3"
                    >
                      <animate
                        attributeName="r"
                        values="9;24;9"
                        dur="3s"
                        repeatCount="indefinite"
                      />
                      <animate
                        attributeName="opacity"
                        values="0.4;0;0.4"
                        dur="3s"
                        repeatCount="indefinite"
                      />
                    </circle>

                    {/* Backend Flow Channel Guidelines */}
                    <line
                      x1="58"
                      y1="20"
                      x2="58"
                      y2="130"
                      stroke="rgba(255,255,255,0.04)"
                      strokeWidth="1"
                      strokeDasharray="3 3"
                    />
                    <line
                      x1="142"
                      y1="20"
                      x2="142"
                      y2="130"
                      stroke="rgba(255,255,255,0.04)"
                      strokeWidth="1"
                      strokeDasharray="3 3"
                    />

                    {/* React orbit particle */}
                    <circle
                      r="3.5"
                      fill="#007AFF"
                      style={{ filter: "drop-shadow(0 0 5px #007AFF)" }}
                    >
                      <animateMotion
                        dur="4s"
                        repeatCount="indefinite"
                        path="M 40,75 A 60,22 0 1,0 160,75 A 60,22 0 1,0 40,75"
                      />
                    </circle>
                    {/* TS orbit particle */}
                    <circle
                      r="3"
                      fill="#9b3fca"
                      style={{ filter: "drop-shadow(0 0 4px #9b3fca)" }}
                    >
                      <animateMotion
                        dur="3.2s"
                        repeatCount="indefinite"
                        path="M 100,33 A 42,42 0 1,0 100,117 A 42,42 0 1,0 100,33"
                      />
                    </circle>

                    {/* Backend flow signals */}
                    <circle r="2" fill="#fff">
                      <animate
                        attributeName="cy"
                        values="20;130"
                        dur="2.4s"
                        repeatCount="indefinite"
                      />
                      <animate
                        attributeName="cx"
                        values="58;58"
                        dur="2.4s"
                        repeatCount="indefinite"
                      />
                      <animate
                        attributeName="opacity"
                        values="0;1;0"
                        dur="2.4s"
                        repeatCount="indefinite"
                      />
                    </circle>
                    <circle r="2" fill="#fff">
                      <animate
                        attributeName="cy"
                        values="130;20"
                        dur="1.9s"
                        begin="0.6s"
                        repeatCount="indefinite"
                      />
                      <animate
                        attributeName="cx"
                        values="142;142"
                        dur="1.9s"
                        begin="0.6s"
                        repeatCount="indefinite"
                      />
                      <animate
                        attributeName="opacity"
                        values="0;1;0"
                        dur="1.9s"
                        begin="0.6s"
                        repeatCount="indefinite"
                      />
                    </circle>
                  </svg>
                </div>
              </div>
            </div>

            {/* CARD 2: Our Team (col-span-1 vertical layout) */}
            <div className="md:col-span-1 hww-info-card p-2 rounded-[2.5rem] bg-card-deep/30 dark:bg-card-deep/10 border border-border/30 transform-gpu relative overflow-hidden group">
              <div className="w-full h-full rounded-[calc(2.5rem-0.5rem)] bg-card border border-border/10 p-8 flex flex-col items-center justify-between text-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
                <div className="w-full h-32 flex items-center justify-center mb-6 relative overflow-hidden">
                  <svg
                    viewBox="0 0 200 150"
                    className="w-full h-full opacity-85 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ maxWidth: "180px" }}
                    aria-hidden
                  >
                    <title>Flexible Team Network Graph Animation</title>
                    {/* Connections Guidelines */}
                    <g
                      stroke="rgba(255,255,255,0.06)"
                      strokeWidth="1"
                      fill="none"
                    >
                      <path id="team-p1" d="M 40,45 L 100,105" />
                      <path id="team-p2" d="M 160,45 L 100,105" />
                      <path id="team-p3" d="M 100,22 L 100,105" />
                      <path id="team-p4" d="M 40,45 L 160,45" />
                    </g>

                    {/* Glowing dynamic connecting pulses */}
                    <path
                      d="M 40,45 L 100,105"
                      stroke="#9b3fca"
                      strokeWidth="1.5"
                      opacity="0.3"
                      fill="none"
                    >
                      <animate
                        attributeName="stroke-dasharray"
                        values="0 100; 100 0"
                        dur="3s"
                        repeatCount="indefinite"
                      />
                    </path>
                    <path
                      d="M 160,45 L 100,105"
                      stroke="#007AFF"
                      strokeWidth="1.5"
                      opacity="0.3"
                      fill="none"
                    >
                      <animate
                        attributeName="stroke-dasharray"
                        values="100 0; 0 100"
                        dur="3.4s"
                        repeatCount="indefinite"
                      />
                    </path>

                    {/* Role Nodes */}
                    {/* Dev Node */}
                    <g transform="translate(40, 45)">
                      <circle
                        r="14"
                        fill="#09090b"
                        stroke="rgba(255,255,255,0.12)"
                        strokeWidth="1.5"
                      />
                      <circle
                        r="14"
                        fill="none"
                        stroke="#007AFF"
                        strokeWidth="1.5"
                        opacity="0.3"
                      >
                        <animate
                          attributeName="r"
                          values="14;18;14"
                          dur="3s"
                          repeatCount="indefinite"
                        />
                        <animate
                          attributeName="opacity"
                          values="0.3;0;0.3"
                          dur="3s"
                          repeatCount="indefinite"
                        />
                      </circle>
                      <text
                        y="4"
                        textAnchor="middle"
                        fill="#fff"
                        fontSize="8"
                        fontFamily="monospace"
                        fontWeight="bold"
                      >
                        &lt;/&gt;
                      </text>
                    </g>

                    {/* Designer Node */}
                    <g transform="translate(160, 45)">
                      <circle
                        r="14"
                        fill="#09090b"
                        stroke="rgba(255,255,255,0.12)"
                        strokeWidth="1.5"
                      />
                      <circle
                        r="14"
                        fill="none"
                        stroke="#9b3fca"
                        strokeWidth="1.5"
                        opacity="0.3"
                      >
                        <animate
                          attributeName="r"
                          values="14;18;14"
                          dur="3.4s"
                          begin="0.6s"
                          repeatCount="indefinite"
                        />
                        <animate
                          attributeName="opacity"
                          values="0.3;0;0.3"
                          dur="3.4s"
                          begin="0.6s"
                          repeatCount="indefinite"
                        />
                      </circle>
                      <text
                        y="3"
                        textAnchor="middle"
                        fill="#fff"
                        fontSize="9"
                        fontFamily="monospace"
                        fontWeight="bold"
                      >
                        ✎
                      </text>
                    </g>

                    {/* Central Hub */}
                    <g transform="translate(100, 105)">
                      <circle
                        r="17"
                        fill="#09090b"
                        stroke="rgba(255,255,255,0.18)"
                        strokeWidth="1.5"
                      />
                      <circle r="17" fill="rgba(0,122,255,0.03)" />
                      <text
                        y="4"
                        textAnchor="middle"
                        fill="#007AFF"
                        fontSize="7"
                        fontFamily="monospace"
                        fontWeight="bold"
                      >
                        VOLVOX
                      </text>
                    </g>

                    {/* Signals sliding down connection routes */}
                    <circle
                      r="2.5"
                      fill="#fff"
                      style={{ filter: "drop-shadow(0 0 3px #fff)" }}
                    >
                      <animateMotion
                        dur="3s"
                        repeatCount="indefinite"
                        path="M 40,45 L 100,105"
                      />
                    </circle>
                    <circle
                      r="2.5"
                      fill="#9b3fca"
                      style={{ filter: "drop-shadow(0 0 3px #9b3fca)" }}
                    >
                      <animateMotion
                        dur="2.5s"
                        begin="0.8s"
                        repeatCount="indefinite"
                        path="M 160,45 L 100,105"
                      />
                    </circle>
                  </svg>
                </div>
                <div className="flex flex-col items-center">
                  <h4 className="text-xl font-bold mb-4">Our team</h4>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Volvox isn't a rigid org chart. The team flexes based on
                    what a project actually needs — developers, designers, and
                    project support brought in as the work calls for it.
                  </p>
                </div>
              </div>
            </div>

            {/* CARD 3: How we communicate (col-span-3 horizontal split) */}
            <div className="md:col-span-3 hww-info-card p-2 rounded-[2.5rem] bg-card-deep/30 dark:bg-card-deep/10 border border-border/30 transform-gpu relative overflow-hidden group">
              <div className="w-full h-full rounded-[calc(2.5rem-0.5rem)] bg-card border border-border/10 p-8 flex flex-col md:flex-row items-center gap-8 justify-between shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
                <div className="flex flex-col text-left max-w-lg">
                  <h4 className="text-2xl font-bold mb-4">
                    How we communicate
                  </h4>
                  <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
                    Discord is our default hub where you can watch us build in
                    real-time, but we adapt our communication to whatever works
                    best for your team.
                  </p>
                  <p className="font-semibold text-primary text-sm mt-auto">
                    Discord, Slack, Email, Calls
                  </p>
                </div>
                <div className="w-full md:w-1/2 h-32 flex items-center justify-center relative overflow-hidden">
                  <svg
                    viewBox="0 0 200 150"
                    className="w-full h-full opacity-85 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ maxWidth: "180px" }}
                    aria-hidden
                  >
                    <title>Communication Channels Radial Wave Animation</title>
                    {/* Concentric expanding wave rings */}
                    <g transform="translate(100, 75)">
                      <circle
                        r="12"
                        fill="none"
                        stroke="rgba(255,255,255,0.04)"
                        strokeWidth="1"
                      />
                      <circle
                        r="26"
                        fill="none"
                        stroke="rgba(255,255,255,0.04)"
                        strokeWidth="1"
                      />
                      <circle
                        r="42"
                        fill="none"
                        stroke="rgba(255,255,255,0.02)"
                        strokeWidth="1"
                      />

                      <circle
                        r="8"
                        fill="none"
                        stroke="#007AFF"
                        strokeWidth="1"
                        opacity="0.8"
                      >
                        <animate
                          attributeName="r"
                          values="5;55"
                          dur="3s"
                          repeatCount="indefinite"
                        />
                        <animate
                          attributeName="opacity"
                          values="0.8;0"
                          dur="3s"
                          repeatCount="indefinite"
                        />
                      </circle>
                      <circle
                        r="8"
                        fill="none"
                        stroke="#9b3fca"
                        strokeWidth="0.75"
                        opacity="0.8"
                      >
                        <animate
                          attributeName="r"
                          values="5;45"
                          dur="3s"
                          begin="1.5s"
                          repeatCount="indefinite"
                        />
                        <animate
                          attributeName="opacity"
                          values="0.8;0"
                          dur="3s"
                          begin="1.5s"
                          repeatCount="indefinite"
                        />
                      </circle>

                      {/* Central core hub */}
                      <circle
                        r="8"
                        fill="#09090b"
                        stroke="rgba(255,255,255,0.15)"
                        strokeWidth="1.5"
                      />
                      <circle r="3.5" fill="#007AFF">
                        <animate
                          attributeName="r"
                          values="2.5;4.5;2.5"
                          dur="2s"
                          repeatCount="indefinite"
                        />
                      </circle>
                    </g>

                    {/* Channel Lines */}
                    <g
                      stroke="rgba(255,255,255,0.04)"
                      strokeWidth="1"
                      fill="none"
                    >
                      <path id="comm-p1" d="M 100,75 L 30,38" />
                      <path id="comm-p2" d="M 100,75 L 30,112" />
                      <path id="comm-p3" d="M 100,75 L 170,38" />
                      <path id="comm-p4" d="M 100,75 L 170,112" />
                    </g>

                    {/* Moving message signals */}
                    <circle
                      r="2"
                      fill="#5865F2"
                      style={{ filter: "drop-shadow(0 0 3px #5865F2)" }}
                    >
                      <animateMotion
                        dur="2.4s"
                        repeatCount="indefinite"
                        path="M 100,75 L 30,38"
                      />
                      <animate
                        attributeName="opacity"
                        values="0;1;0"
                        keyTimes="0;0.1;1"
                        dur="2.4s"
                        repeatCount="indefinite"
                      />
                    </circle>
                    <circle
                      r="2"
                      fill="#9b3fca"
                      style={{ filter: "drop-shadow(0 0 3px #9b3fca)" }}
                    >
                      <animateMotion
                        dur="2.9s"
                        begin="0.4s"
                        repeatCount="indefinite"
                        path="M 100,75 L 30,112"
                      />
                      <animate
                        attributeName="opacity"
                        values="0;1;0"
                        keyTimes="0;0.1;1"
                        dur="2.9s"
                        begin="0.4s"
                        repeatCount="indefinite"
                      />
                    </circle>
                    <circle
                      r="2"
                      fill="#fff"
                      style={{ filter: "drop-shadow(0 0 3px #fff)" }}
                    >
                      <animateMotion
                        dur="2.1s"
                        begin="1.1s"
                        repeatCount="indefinite"
                        path="M 100,75 L 170,38"
                      />
                      <animate
                        attributeName="opacity"
                        values="0;1;0"
                        keyTimes="0;0.1;1"
                        dur="2.1s"
                        begin="1.1s"
                        repeatCount="indefinite"
                      />
                    </circle>
                    <circle
                      r="2"
                      fill="#007AFF"
                      style={{ filter: "drop-shadow(0 0 3px #007AFF)" }}
                    >
                      <animateMotion
                        dur="2.7s"
                        begin="0.7s"
                        repeatCount="indefinite"
                        path="M 100,75 L 170,112"
                      />
                      <animate
                        attributeName="opacity"
                        values="0;1;0"
                        keyTimes="0;0.1;1"
                        dur="2.7s"
                        begin="0.7s"
                        repeatCount="indefinite"
                      />
                    </circle>

                    {/* Guideline endpoints */}
                    <circle
                      cx="30"
                      cy="38"
                      r="3"
                      fill="#09090b"
                      stroke="rgba(255,255,255,0.1)"
                      strokeWidth="1"
                    />
                    <circle
                      cx="30"
                      cy="112"
                      r="3"
                      fill="#09090b"
                      stroke="rgba(255,255,255,0.1)"
                      strokeWidth="1"
                    />
                    <circle
                      cx="170"
                      cy="38"
                      r="3"
                      fill="#09090b"
                      stroke="rgba(255,255,255,0.1)"
                      strokeWidth="1"
                    />
                    <circle
                      cx="170"
                      cy="112"
                      r="3"
                      fill="#09090b"
                      stroke="rgba(255,255,255,0.1)"
                      strokeWidth="1"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Values Wrapper (Phase 6, hidden initially) */}
        <div className="hww-values-wrapper absolute inset-0 flex flex-col justify-center items-center w-full max-w-4xl mx-auto px-4 z-30 pointer-events-none opacity-0">
          <h3 className="text-sm font-semibold tracking-widest uppercase text-muted-foreground mb-12 text-center">
            How we protect the quality
          </h3>
          {/* Editorial Values Stack (Premium Minimal Layout) */}
          <div className="hww-values-stack flex flex-col w-full max-w-4xl mx-auto border-t border-border/20">
            <div className="hww-value-item grid grid-cols-[140px_1fr] gap-8 py-8 border-b border-border/20 items-center text-left group transition-colors duration-300 hover:bg-card-deep/10">
              <span className="font-mono text-xs text-primary/70 tracking-widest font-bold transition-transform duration-300 group-hover:translate-x-1">
                01 — SOURCE
              </span>
              <span className="text-sm md:text-base lg:text-lg font-medium tracking-tight text-foreground transition-colors duration-300 group-hover:text-primary">
                Everything built in-house — no outsourcing, no black boxes
              </span>
            </div>
            <div className="hww-value-item grid grid-cols-[140px_1fr] gap-8 py-8 border-b border-border/20 items-center text-left group transition-colors duration-300 hover:bg-card-deep/10">
              <span className="font-mono text-xs text-primary/70 tracking-widest font-bold transition-transform duration-300 group-hover:translate-x-1">
                02 — STANDARDS
              </span>
              <span className="text-sm md:text-base lg:text-lg font-medium tracking-tight text-foreground transition-colors duration-300 group-hover:text-primary">
                Quality and care in every single line of code
              </span>
            </div>
            <div className="hww-value-item grid grid-cols-[140px_1fr] gap-8 py-8 border-b border-border/20 items-center text-left group transition-colors duration-300 hover:bg-card-deep/10">
              <span className="font-mono text-xs text-primary/70 tracking-widest font-bold transition-transform duration-300 group-hover:translate-x-1">
                03 — ETHOS
              </span>
              <span className="text-sm md:text-base lg:text-lg font-medium tracking-tight text-foreground transition-colors duration-300 group-hover:text-primary">
                No gatekeeping, no ego, just building what you need
              </span>
            </div>
          </div>
        </div>

        {/* Closing CTA Wrapper (Phase 7, hidden initially) */}
        <div className="hww-cta-wrapper absolute inset-0 flex flex-col justify-center items-center w-full max-w-4xl mx-auto px-4 z-30 pointer-events-none opacity-0">
          {/* CTA Content */}
          <div className="hww-cta-content text-center max-w-3xl">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 tracking-tight leading-[1.05]">
              Have a{" "}
              <span className="inline-flex items-center justify-center gap-3 px-6 py-2 mx-2 text-4xl md:text-5xl lg:text-6xl font-mono uppercase tracking-[0.05em] font-bold bg-accent/10 border border-accent/30 text-accent rounded-full align-middle transform -rotate-1">
                <Image
                  src="/logo.png"
                  alt=""
                  width={48}
                  height={48}
                  className="w-10 h-10 md:w-12 md:h-12 object-contain rounded-md"
                />
                Volvox
              </span>{" "}
              project in mind?
            </h2>
            <p className="text-base md:text-lg lg:text-xl text-muted-foreground mb-12 leading-relaxed max-w-2xl mx-auto">
              It starts with a call — no forms, no gatekeeping, just a
              conversation about what you're trying to build.
            </p>
            <Button
              variant="accent"
              size="lg"
              noMorph
              asChild
              className="pointer-events-auto rounded-full pl-8 pr-3 py-3 h-auto group transition-all duration-300 hover:shadow-[0_4px_20px_oklch(from_var(--accent)_l_c_h_/_0.4)]"
            >
              <a
                href="mailto:bill@volvox.dev"
                className="flex items-center gap-4 text-accent-foreground font-semibold"
                onClick={() => trackMetaPixelEvent("Lead")}
              >
                <span>Start a conversation</span>
                <span className="w-10 h-10 rounded-full bg-accent-foreground/10 flex items-center justify-center transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
                  <svg
                    className="w-5 h-5 text-accent-foreground"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
                    />
                  </svg>
                </span>
              </a>
            </Button>
          </div>
        </div>
      </div>

      {/* MOBILE VIEW (static, clean, linear scrollable layout matching the design aesthetic) */}
      <div className="md:hidden w-full flex flex-col px-6 py-16 gap-16 relative z-20">
        {/* Phase 1: Header */}
        <div className="text-center flex flex-col gap-4">
          <span className="font-mono text-xs text-primary tracking-widest uppercase font-bold">
            Our Process
          </span>
          <h2 className="text-4xl font-extrabold uppercase tracking-tight text-foreground">
            How we work
          </h2>
          <p className="text-lg text-muted-foreground mt-2 max-w-md mx-auto leading-relaxed">
            No black box. Just an honest look at how a project with Volvox
            actually goes, from the first call to long after launch.
          </p>
        </div>

        {/* Phase 2: Steps vertical flow */}
        <div className="flex flex-col gap-12 relative">
          {/* Subtle timeline track indicator line */}
          <div className="absolute left-[20px] top-4 bottom-4 w-[1px] bg-border/25 z-0" />

          {steps.map((step, i) => (
            <div key={i} className="flex gap-6 relative z-10 items-start">
              {/* Step number marker */}
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-card border border-border/30 shadow-md flex items-center justify-center font-mono text-xs font-bold text-primary">
                {String(i + 1).padStart(2, "0")}
              </div>

              {/* Step card detail with Double-Bezel Architecture */}
              <div className="flex-grow flex flex-col gap-4">
                <div className="w-full aspect-[4/3] p-1.5 rounded-[1.5rem] bg-card/25 border border-border/20 shadow-lg relative overflow-hidden">
                  <div className="w-full h-full rounded-[calc(1.5rem-0.375rem)] overflow-hidden bg-card border border-border/10 flex items-center justify-center">
                    <img
                      src={step.img}
                      alt={step.title}
                      className="w-full h-full object-contain p-6"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <span className="font-mono text-[10.5px] uppercase tracking-wider text-primary/75 font-semibold">
                    {step.step}
                  </span>
                  <h3 className="text-xl font-bold text-foreground leading-tight">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.desc}
                  </p>
                  {step.tag && (
                    <span className="text-xs font-semibold text-primary mt-1">
                      {step.tag}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Phase 3: What powers our process (Bento layout) */}
        <div className="flex flex-col gap-8">
          <div className="text-center flex flex-col gap-2">
            <span className="font-mono text-xs text-primary tracking-widest uppercase font-bold">
              Engineering Hub
            </span>
            <h3 className="text-2xl font-bold text-foreground">
              What powers our process
            </h3>
          </div>

          <div className="flex flex-col gap-6">
            {/* Bento Card 1: Our Stack */}
            <div className="p-1.5 rounded-[1.5rem] bg-card-deep/20 border border-border/20">
              <div className="rounded-[calc(1.5rem-0.375rem)] bg-card border border-border/10 p-6 flex flex-col gap-4 shadow-sm">
                <h4 className="text-lg font-bold">Our stack</h4>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  No fixed template — we choose what's right for the project.
                  Most commonly:
                </p>
                <p className="font-mono text-xs font-bold text-primary">
                  React, Next.js, TypeScript, .NET / C#
                </p>
              </div>
            </div>

            {/* Bento Card 2: Our Team */}
            <div className="p-1.5 rounded-[1.5rem] bg-card-deep/20 border border-border/20">
              <div className="rounded-[calc(1.5rem-0.375rem)] bg-card border border-border/10 p-6 flex flex-col gap-4 shadow-sm">
                <h4 className="text-lg font-bold">Our team</h4>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Volvox is a flexible group. The team dynamically flexes based
                  on what a project actually needs — developers, designers, and
                  support.
                </p>
              </div>
            </div>

            {/* Bento Card 3: Communication */}
            <div className="p-1.5 rounded-[1.5rem] bg-card-deep/20 border border-border/20">
              <div className="rounded-[calc(1.5rem-0.375rem)] bg-card border border-border/10 p-6 flex flex-col gap-4 shadow-sm">
                <h4 className="text-lg font-bold">How we communicate</h4>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Discord is our default hub where you can watch us build in
                  real-time, but we adapt our communication to whatever works
                  best for your team.
                </p>
                <p className="font-mono text-xs font-bold text-primary">
                  Discord, Slack, Email, Calls
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Phase 4: Values Stack */}
        <div className="flex flex-col gap-6 border-t border-border/20 pt-12">
          <h3 className="text-sm font-semibold tracking-wider uppercase text-muted-foreground text-center">
            How we protect quality
          </h3>
          <div className="flex flex-col divide-y divide-border/20">
            <div className="py-4 text-left">
              <span className="font-mono text-[10px] text-primary/70 tracking-widest font-bold block mb-1">
                01 — SOURCE
              </span>
              <span className="text-sm font-medium text-foreground">
                Everything built in-house — no outsourcing, no black boxes
              </span>
            </div>
            <div className="py-4 text-left">
              <span className="font-mono text-[10px] text-primary/70 tracking-widest font-bold block mb-1">
                02 — STANDARDS
              </span>
              <span className="text-sm font-medium text-foreground">
                Quality and care in every single line of code
              </span>
            </div>
            <div className="py-4 text-left">
              <span className="font-mono text-[10px] text-primary/70 tracking-widest font-bold block mb-1">
                03 — ETHOS
              </span>
              <span className="text-sm font-medium text-foreground">
                No gatekeeping, no ego, just building what you need
              </span>
            </div>
          </div>
        </div>

        {/* Phase 5: CTA */}
        <div className="text-center flex flex-col gap-6 pt-8">
          <h2 className="text-3xl font-bold tracking-tight text-foreground leading-tight">
            Have a project in mind?
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto">
            It starts with a call — no forms, no gatekeeping, just a
            conversation about what you're trying to build.
          </p>
          <Button
            variant="accent"
            size="lg"
            noMorph
            asChild
            className="rounded-full w-full py-3 h-auto justify-center"
          >
            <a
              href="mailto:bill@volvox.dev"
              className="flex items-center gap-3 justify-center text-accent-foreground font-semibold"
              onClick={() => trackMetaPixelEvent("Lead")}
            >
              <span>Start a conversation</span>
              <svg
                className="w-4 h-4 text-accent-foreground"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
                />
              </svg>
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
