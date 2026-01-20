"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { Button } from "@/components/ui/button";
import { useTypewriterEffect } from "@/hooks/use-typewriter-effect";
import {
  ShieldCheck,
  ChartLineUp,
  CheckCircle,
  AppleLogo,
  GooglePlayLogo,
  ArrowSquareOut,
} from "@phosphor-icons/react";

interface HeroProps {
  onNavigate: (section: string) => void;
}

gsap.registerPlugin(ScrollTrigger);

/** Role variants for the join button - cycles every few seconds */
const JOIN_ROLE_VARIANTS = [
  "Join as a Mentee",
  "Join as a Mentor",
  "Join as a Teacher",
  "Join as a Member",
  "Join as a Learner",
] as const;

/** Interval duration in milliseconds for cycling button text */
const TEXT_CYCLE_INTERVAL_MS = 4000;

/** Character animation speed in milliseconds */
const TYPEWRITER_CHAR_DELAY_MS = 40;

/** Pause between backspace and type phases */
const TYPEWRITER_PAUSE_MS = 200;

export function Hero({ onNavigate }: HeroProps) {
  const router = useRouter();

  // Current index for cycling through role variants
  const [roleIndex, setRoleIndex] = useState(() =>
    Math.floor(Math.random() * JOIN_ROLE_VARIANTS.length)
  );

  // Get the current target text
  const targetText = JOIN_ROLE_VARIANTS[roleIndex];

  // Use typewriter effect for character-by-character animation
  const { displayedText, isAnimating } = useTypewriterEffect(targetText, {
    characterDelay: TYPEWRITER_CHAR_DELAY_MS,
    pauseDuration: TYPEWRITER_PAUSE_MS,
    startWithText: true,
  });

  // Cycle through role variants every few seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % JOIN_ROLE_VARIANTS.length);
    }, TEXT_CYCLE_INTERVAL_MS);

    return () => clearInterval(intervalId);
  }, []);

  const productCardRef = useRef<HTMLDivElement>(null);
  const nameLineRef = useRef<HTMLSpanElement>(null);

  // Detail Section Refs
  const detailsSectionRef = useRef<HTMLDivElement>(null);
  const phoneMockupRef = useRef<HTMLDivElement>(null);
  const featureListRef = useRef<HTMLDivElement>(null);

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

      // Product Card Entrance
      tl.fromTo(
        productCardRef.current,
        {
          y: 200,
          rotationX: 15,
          scale: 0.9,
          opacity: 0,
          transformPerspective: 1000,
        },
        {
          y: 100,
          rotationX: 10,
          scale: 0.95,
          opacity: 1,
          duration: 1.5,
          ease: "power2.out",
        },
        "-=1.0"
      );

      // Scroll Parallax for Hero Card
      gsap.to(productCardRef.current, {
        scrollTrigger: {
          trigger: ".hero-section",
          start: "top top",
          end: "bottom center",
          scrub: 1,
        },
        y: -50,
        rotationX: 0,
        scale: 1,
        boxShadow: "0 40px 80px -20px hsla(0, 0%, 0%, 0.5)",
        ease: "none",
      });

      // "SOBERS" Text Reveal
      const textRevealTl = gsap.timeline({
        scrollTrigger: {
          trigger: ".product-stage",
          start: "center center",
          end: "bottom center",
          toggleActions: "play none none reverse",
        },
      });
      textRevealTl.to(nameLineRef.current, {
        opacity: 1,
        letterSpacing: "0px",
        filter: "blur(0px)",
        scale: 1,
        duration: 0.8,
        ease: "expo.out",
      });

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

      // ===========================================
      // 2. DETAILS SECTION ANIMATIONS
      // ===========================================

      // Phone Entrance (Slide from left)
      gsap.fromTo(
        phoneMockupRef.current,
        { x: -100, opacity: 0, rotationY: -15 },
        {
          scrollTrigger: {
            trigger: detailsSectionRef.current,
            start: "top 60%",
            end: "top 20%",
            scrub: 1,
          },
          x: 0,
          opacity: 1,
          rotationY: 0,
          ease: "power2.out",
        }
      );

      // Features Entrance (Stagger from right)
      gsap.fromTo(
        ".feature-item",
        { x: 50, opacity: 0 },
        {
          scrollTrigger: {
            trigger: detailsSectionRef.current,
            start: "top 60%",
            end: "bottom 80%",
            scrub: 1,
          },
          x: 0,
          opacity: 1,
          stagger: 0.2,
          ease: "power2.out",
        }
      );

      // Tech Pills Entrance
      gsap.fromTo(
        ".tech-pill",
        { scale: 0.8, opacity: 0, y: 20 },
        {
          scrollTrigger: {
            trigger: detailsSectionRef.current,
            start: "top 70%",
            end: "top 40%",
            scrub: 1,
          },
          scale: 1,
          opacity: 1,
          y: 0,
          stagger: 0.1,
          ease: "back.out(1.7)",
        }
      );
    });

    return () => ctx.revert();
  }, []);

  const features = [
    {
      icon: <ChartLineUp weight="fill" className="w-6 h-6 text-primary" />,
      title: "Sobriety Timeline",
      description: "Visual history of your journey with relapse tracking.",
    },
    {
      icon: <ShieldCheck weight="fill" className="w-6 h-6 text-primary" />,
      title: "Secure Pairing",
      description: "Encrypted sponsor-sponsee connection with invite codes.",
    },
    {
      icon: <CheckCircle weight="fill" className="w-6 h-6 text-primary" />,
      title: "Task Management",
      description: "Structured step assignments and accountability feedback.",
    },
  ];

  const techStack = [
    "React Native",
    "Expo",
    "TypeScript",
    "Node.js",
    "Supabase",
  ];

  return (
    <div className="flex flex-col w-full">
      {/* ================= HERO SECTION ================= */}
      <header className="hero-section relative min-h-screen md:min-h-[120vh] pt-32 md:pt-[180px] flex flex-col items-center overflow-hidden">
        {/* Background Glow */}
        <div
          className="hero-bg-glow absolute -top-[20%] left-1/2 -translate-x-1/2 w-[80vw] h-[80vw] -z-[1] pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, oklch(from var(--primary) l c h / 0.15) 0%, transparent 70%)",
          }}
        />

        {/* Hero Content */}
        <div className="hero-content text-center max-w-[1100px] px-4 z-[2]">
          <div className="hero-badge inline-flex items-center py-1.5 px-3 md:py-2 md:px-4 rounded-full bg-primary/10 text-primary text-xs md:text-sm font-semibold mb-6 border border-primary/20">
            Building the future of software development
          </div>

          <h1 className="hero-headline font-[family-name:var(--font-jetbrains-mono)] text-[clamp(2rem,6vw,5rem)] leading-[1.1] font-extrabold tracking-tighter mb-6 text-foreground">
            Building products. <br />
            <span className="text-aurora tracking-tighter whitespace-nowrap">
              Empowering builders.
            </span>
          </h1>

          <p className="hero-subheadline text-[clamp(0.95rem,2vw,1.25rem)] text-foreground/70 leading-relaxed mb-10 max-w-[700px] mx-auto">
            A software development company and open-source learning community.
            We build exceptional products while mentoring the next generation of
            developers.
          </p>

          <div className="hero-cta-group flex flex-col md:flex-row gap-4 justify-center mb-20 w-full md:w-auto">
            <MagneticButton>
              <Button
                onClick={() => router.push("/products")}
                className="py-6 px-8 text-base font-semibold"
              >
                Explore Products
              </Button>
            </MagneticButton>
            <MagneticButton>
              <Button
                variant="tonal"
                onClick={() => onNavigate("mentorship")}
                className="py-6 px-8 text-base font-semibold min-w-[200px]"
                data-testid="join-button"
                aria-label={targetText}
              >
                <span
                  className="inline-flex items-center"
                  aria-hidden="true"
                  data-testid="typewriter-text"
                >
                  {displayedText}
                  <span
                    className={`ml-0.5 w-[2px] h-[1.1em] bg-current inline-block ${
                      isAnimating ? "animate-pulse" : "opacity-0"
                    }`}
                    aria-hidden="true"
                  />
                </span>
              </Button>
            </MagneticButton>
          </div>
        </div>

        {/* Product Stage */}
        <div
          className="product-stage relative w-full max-w-[1200px] h-[400px] md:h-[600px] -mt-8 z-[1]"
          style={{ perspective: "1000px" }}
        >
          <div
            ref={productCardRef}
            className="product-card w-[90%] mx-auto h-full rounded-3xl bg-gradient-to-b from-card/80 to-background/90 border border-border/50 shadow-[0_20px_50px_-10px_hsla(0,0%,0%,0.3)] overflow-hidden relative opacity-0"
            style={{ transformStyle: "preserve-3d" }}
          >
            <div
              className="app-interface w-full h-full bg-cover bg-center relative"
              style={{
                backgroundImage: "url('/images/product/sobers/hero.png')",
              }}
            >
              <div className="app-overlay absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-background to-transparent pointer-events-none" />
              {/* Product Name Overlay */}
              <div className="product-name-overlay absolute inset-0 flex items-center justify-center pointer-events-none mix-blend-hard-light z-[50]">
                <span
                  ref={nameLineRef}
                  className="name-line block font-[family-name:var(--font-jetbrains-mono)] font-extrabold text-[clamp(5rem,12vw,9rem)] leading-[0.9] uppercase opacity-0 tracking-[20px] blur-[15px] scale-150 text-transparent [-webkit-text-stroke:2px_hsla(255,100%,100%,0.8)]"
                >
                  SOBERS
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ================= DETAILS SECTION ================= */}
      <section
        ref={detailsSectionRef}
        className="details-section relative min-h-screen py-16 md:py-24 flex items-center justify-center overflow-hidden bg-background"
      >
        <div className="container max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* LEFT: Phone Mockup */}
          <div
            ref={phoneMockupRef}
            className="relative w-full max-w-[350px] mx-auto lg:mr-auto perspective-[1000px] will-change-transform"
          >
            {/* Added h-[650px] to fix height collapse issue */}
            <div className="relative rounded-[30px] md:rounded-[40px] border-[6px] md:border-[8px] border-zinc-800 shadow-2xl overflow-hidden bg-black h-[450px] md:h-[710px] w-full">
              {/* Phone Screen */}
              <div
                className="w-full h-full bg-cover bg-center"
                style={{
                  backgroundImage:
                    "url('/images/product/sobers/android-screnshot.png')",
                }}
              />
              {/* Reflection */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />
            </div>
            {/* Glow behind phone */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[80%] bg-primary/20 blur-[100px] -z-10 rounded-full" />
          </div>

          {/* RIGHT: Product Details */}
          <div ref={featureListRef} className="flex flex-col justify-center">
            {/* Tech Stack Pills */}
            <div className="flex flex-wrap gap-2 mb-8">
              {techStack.map((tech) => (
                <span
                  key={tech}
                  className="tech-pill px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold border border-primary/20"
                >
                  {tech}
                </span>
              ))}
            </div>

            <h2 className="text-4xl md:text-5xl font-[family-name:var(--font-jetbrains-mono)] font-bold mb-6 text-foreground">
              Sobriety. <span className="text-primary italic">Reimagined.</span>
            </h2>
            <p className="text-lg text-foreground/70 mb-10 leading-relaxed">
              A comprehensive toolkit for recovery, built with modern technology
              to provide support when you need it most.
            </p>

            {/* Features List */}
            <div className="space-y-8 mb-12">
              {features.map((feature, idx) => (
                <div key={idx} className="feature-item flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-card border border-border flex items-center justify-center shadow-sm">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold font-[family-name:var(--font-jetbrains-mono)] mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-foreground/60">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* App Store Buttons */}
            <div className="flex flex-wrap gap-4">
              <Button
                className="h-14 px-6 rounded-xl gap-3 text-base"
                variant="default"
                onClick={() =>
                  window.open(
                    "https://apps.apple.com/app/id6755614815",
                    "_blank",
                    "noopener,noreferrer"
                  )
                }
              >
                <AppleLogo weight="fill" className="w-6 h-6" />
                <div className="flex flex-col items-start leading-none">
                  <span className="text-[10px] opacity-80 uppercase tracking-wider">
                    Download on the
                  </span>
                  <span className="font-bold">App Store</span>
                </div>
              </Button>
              <Button
                className="h-14 px-6 rounded-xl gap-3 text-base bg-foreground text-background hover:bg-foreground/90"
                variant="secondary"
                onClick={() =>
                  window.open(
                    "https://play.google.com/store/apps/details?id=com.volvox.sobers",
                    "_blank",
                    "noopener,noreferrer"
                  )
                }
              >
                <GooglePlayLogo weight="fill" className="w-6 h-6" />
                <div className="flex flex-col items-start leading-none">
                  <span className="text-[10px] opacity-80 uppercase tracking-wider">
                    Get it on
                  </span>
                  <span className="font-bold">Google Play</span>
                </div>
              </Button>
              <Button
                className="h-14 px-6 rounded-xl gap-3 text-base"
                variant="outline"
                onClick={() =>
                  window.open(
                    "https://sobers.app",
                    "_blank",
                    "noopener,noreferrer"
                  )
                }
              >
                <ArrowSquareOut weight="bold" className="w-6 h-6" />
                <span className="font-bold">Visit Website</span>
              </Button>
              <Button
                className="h-14 px-6 rounded-xl gap-3 text-base"
                variant="secondary"
                onClick={() => router.push("/products/sobers")}
              >
                <span className="font-bold">View Details</span>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
