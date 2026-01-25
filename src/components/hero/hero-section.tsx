"use client";

import { useRouter } from "next/navigation";
import { useTypewriter } from "react-simple-typewriter";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface HeroSectionProps {
  onNavigate: (section: string) => void;
}

const ROLE_VARIANTS = [
  "Mentee",
  "Mentor",
  "Teacher",
  "Member",
  "Learner",
  "Sponsor",
  "Sponsee",
];

export function HeroSection({ onNavigate }: HeroSectionProps) {
  const router = useRouter();

  // Typewriter effect with automatic cycling (only the role changes)
  const [role, { isType, isDelete }] = useTypewriter({
    words: ROLE_VARIANTS,
    loop: 0, // Infinite loop
    typeSpeed: 40,
    deleteSpeed: 30,
    delaySpeed: 3000,
  });

  const isAnimating = isType || isDelete;
  const displayedText = `Join as a ${role}`;

  return (
    <section
      aria-label="Hero"
      className="hero-section relative min-h-screen md:min-h-[120vh] pt-32 md:pt-[180px] flex flex-col items-center overflow-hidden"
    >
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
          A software development company and open-source learning community. We
          build exceptional products while mentoring the next generation of
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
              variant="accent"
              onClick={() => onNavigate("mentorship")}
              className="py-6 px-8 text-base font-semibold min-w-[200px]"
              data-testid="join-button"
              aria-labelledby="join-button-live"
            >
              <span
                className="inline-flex items-center"
                aria-hidden="true"
                data-testid="typewriter-text"
              >
                <span>Join as a&nbsp;</span>
                <span>{role}</span>
                <span
                  className={cn(
                    "ml-0.5 w-[2px] h-[1.1em] bg-current inline-block",
                    isAnimating ? "animate-pulse" : "opacity-0"
                  )}
                  aria-hidden="true"
                />
              </span>
            </Button>
          </MagneticButton>
          {/* ARIA live region for screen reader announcements of dynamic button text */}
          <output
            id="join-button-live"
            aria-live="polite"
            aria-atomic="true"
            className="sr-only"
          >
            {displayedText}
          </output>
        </div>
      </div>
    </section>
  );
}
