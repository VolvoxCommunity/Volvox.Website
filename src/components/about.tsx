"use client";

import { useGSAP } from "@gsap/react";
import {
  ArrowRight,
  Code,
  GithubLogo,
  Heart,
  Lightbulb,
  Sparkle,
  Target,
} from "@phosphor-icons/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { type JSX, useRef } from "react";
import { Spotlight } from "@/components/ui/spotlight";
import { GITHUB_URL } from "@/lib/constants";
import { cn } from "@/lib/utils";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * Renders the "About Volvox" section as a modern, high-end Bento Grid.
 */
export function About(): JSX.Element {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // Respect reduced-motion: skip entrance animations, keep final states.
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      // Reveal header elements on scroll
      gsap.fromTo(
        [".about-header", ".about-subtext"],
        { opacity: 0, y: 30, filter: "blur(8px)" },
        {
          scrollTrigger: {
            trigger: ".about-header",
            start: "top 92%",
            end: "top 72%",
            scrub: 1,
          },
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          stagger: 0.08,
          ease: "power2.out",
        },
      );

      // Reveal bento cards on scroll with staggered delays and slight scales
      gsap.fromTo(
        ".about-bento-card",
        { opacity: 0, y: 60, scale: 0.96, filter: "blur(8px)" },
        {
          scrollTrigger: {
            trigger: ".about-bento-grid",
            start: "top 90%",
            end: "top 62%",
            scrub: 1,
          },
          opacity: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
          stagger: 0.08,
          ease: "power3.out",
        },
      );
    },
    { scope: containerRef },
  );

  return (
    <section
      ref={containerRef}
      id="about"
      data-testid="about-section"
      aria-label="About Volvox"
      className="py-32 md:py-48 px-4 bg-background relative overflow-hidden"
    >
      {/* Ambient Radial Glowing Orbs (Ethereal Glass Vibe) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-10 opacity-30">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[130px] transform-gpu" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[120px] transform-gpu" />
      </div>

      <div className="container mx-auto max-w-6xl relative z-20">
        <div className="text-center mb-24">
          <h2 className="about-header text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter text-foreground mb-6 leading-[0.95]">
            About Volvox
          </h2>
          <p className="about-subtext text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            A community-driven company building the future of software
            development through mentorship and open source.
          </p>
        </div>

        <div className="about-bento-grid grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(190px,auto)]">
          {/* Item 1: Our Story (Large) */}
          <BentoCard
            className="md:col-span-2 md:row-span-2"
            title="Our Story"
            icon={<Sparkle weight="fill" />}
            description={
              <>
                <p className="mb-4">
                  Founded in 2020 by{" "}
                  <span className="text-foreground font-semibold">
                    Bill Chirico
                  </span>
                  , Volvox began with a simple mission: build exceptional
                  software while empowering the next generation of engineers.
                </p>
                <p>
                  Today, we stand at the intersection of professional
                  development and education. We prove daily that building great,
                  production-ready products and fostering active, community-wide
                  learning are complementary forces that drive real digital
                  innovation.
                </p>
              </>
            }
            illustration={
              <div className="absolute right-4 bottom-4 opacity-5 group-hover:opacity-10 group-hover:scale-105 group-hover:rotate-[15deg] transition-all duration-1000 ease-out text-primary">
                <Sparkle size={180} weight="fill" />
              </div>
            }
          />

          {/* Item 2: Mission */}
          <BentoCard
            className="md:col-span-1"
            title="Our Mission"
            icon={<Target weight="fill" />}
            description="To create world-class software solutions while cultivating a new generation of talented developers."
            gradient="from-primary/10 to-transparent"
          />

          {/* Item 3: Values */}
          <BentoCard
            className="md:col-span-1"
            title="Our Values"
            icon={<Heart weight="fill" />}
            description="Excellence in craft, generosity in teaching, and a commitment to open source."
            gradient="from-secondary/10 to-transparent"
          />

          {/* Item 4: Dev */}
          <BentoCard
            className="md:col-span-1"
            title="Development"
            icon={<Code weight="fill" />}
            description="Building innovative products from web apps to developer tools."
          />

          {/* Item 5: Community */}
          <BentoCard
            className="md:col-span-1"
            title="Community"
            icon={<Lightbulb weight="fill" />}
            description="Pairing aspiring developers with experienced engineers."
          />

          {/* Item 6: CTA */}
          <BentoCard
            className="md:col-span-1 border-primary/20"
            title="Join Us"
            icon={<GithubLogo weight="fill" />}
            description="Check out our open source projects on GitHub."
            href={GITHUB_URL}
            cta="View GitHub"
          />
        </div>
      </div>
    </section>
  );
}

interface BentoCardProps {
  className?: string;
  title: string;
  description: React.ReactNode;
  icon?: React.ReactNode;
  illustration?: React.ReactNode;
  gradient?: string;
  href?: string;
  cta?: string;
}

function BentoCard({
  className,
  title,
  description,
  icon,
  illustration,
  gradient,
  href,
  cta,
}: BentoCardProps) {
  const Content = (
    <div className="relative z-10 h-full flex flex-col justify-between">
      <div className="flex flex-col">
        <div className="flex items-center gap-4 mb-5">
          {icon && (
            <div className="p-2.5 rounded-xl bg-card border border-border/20 text-foreground shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] transition-colors group-hover:border-primary/30 group-hover:text-primary">
              {icon}
            </div>
          )}
          <h3 className="text-xl font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
            {title}
          </h3>
        </div>

        <div className="text-muted-foreground text-sm leading-relaxed max-w-xl">
          {description}
        </div>
      </div>

      {cta && (
        <div className="mt-8 flex items-center justify-between text-primary font-mono text-xs uppercase tracking-widest font-semibold transition-colors group-hover:text-primary-deep">
          <span>{cta}</span>
          <span className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center transition-all duration-500 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:bg-primary/25">
            <ArrowRight weight="bold" className="w-4 h-4 text-primary" />
          </span>
        </div>
      )}
    </div>
  );

  const Container = href ? "a" : "div";
  const props = href
    ? { href, target: "_blank", rel: "noopener noreferrer" }
    : {};

  return (
    <Container
      {...props}
      className={cn(
        className,
        "about-bento-card block h-full active:scale-[0.985] transition-all duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)]",
      )}
    >
      <div className="h-full p-1.5 rounded-[2.2rem] bg-card-deep/30 dark:bg-card-deep/10 border border-border/30 hover:border-primary/20 transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] shadow-2xl group">
        <Spotlight
          className="relative h-full flex flex-col justify-between rounded-[calc(2.2rem-0.375rem)] border border-border/10 bg-card p-6 overflow-hidden transition-all duration-500 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]"
          fill="oklch(from var(--primary) l c h / 0.12)"
        >
          {/* Background Gradient overlay */}
          {gradient && (
            <div
              className={cn(
                "absolute inset-0 bg-gradient-to-br opacity-20 pointer-events-none transition-opacity duration-500 group-hover:opacity-30",
                gradient,
              )}
            />
          )}

          {/* Background Decorative Illustration */}
          {illustration && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
              {illustration}
            </div>
          )}

          {/* Inner Content wrapper */}
          {Content}
        </Spotlight>
      </div>
    </Container>
  );
}
