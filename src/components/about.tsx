"use client";

import {
  Code,
  Lightbulb,
  Heart,
  Target,
  GithubLogo,
  ArrowRight,
  Sparkle,
} from "@phosphor-icons/react";
import { motion } from "framer-motion";
import { Spotlight } from "@/components/ui/spotlight";
import { cn } from "@/lib/utils";
import { GITHUB_URL } from "@/lib/constants";

/**
 * Renders the "About Volvox" section as a modern Bento Grid.
 */
export function About() {
  return (
    <section
      id="about"
      aria-label="About Volvox"
      className="py-24 px-4 bg-background relative overflow-hidden"
    >
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-4 tracking-tight"
          >
            About Volvox
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            A community-driven company building the future of software
            development through mentorship and open source.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(180px,auto)]">
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
                  software while empowering the next generation.
                </p>
                <p>
                  Today, we stand at the intersection of professional
                  development and education, proving that building great
                  products and fostering learning are complementary forces that
                  drive innovation.
                </p>
              </>
            }
            illustration={
              <div className="absolute right-0 bottom-0 opacity-10 animate-pulse">
                <Sparkle size={200} weight="fill" />
              </div>
            }
          />

          {/* Item 2: Mission */}
          <BentoCard
            className="md:col-span-1"
            title="Our Mission"
            icon={<Target weight="fill" />}
            description="To create world-class software solutions while cultivating a new generation of talented developers."
            gradient="from-primary/20 to-transparent"
          />

          {/* Item 3: Values */}
          <BentoCard
            className="md:col-span-1"
            title="Our Values"
            icon={<Heart weight="fill" />}
            description="Excellence in craft, generosity in teaching, and a commitment to open source."
            gradient="from-secondary/20 to-transparent"
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
            className="md:col-span-1 bg-primary/5 border-primary/20"
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

function BentoCard({
  className,
  title,
  description,
  icon,
  illustration,
  gradient,
  href,
  cta,
}: {
  className?: string;
  title: string;
  description: React.ReactNode;
  icon?: React.ReactNode;
  illustration?: React.ReactNode;
  gradient?: string;
  href?: string;
  cta?: string;
}) {
  const Content = (
    <div className="relative z-10 h-full flex flex-col">
      <div className="flex items-center gap-3 mb-3">
        {icon && (
          <div className="p-2 rounded-lg bg-background/50 backdrop-blur-sm border border-border/50 text-foreground">
            {icon}
          </div>
        )}
        <h3 className="text-xl font-bold text-foreground">{title}</h3>
      </div>

      <div className="text-muted-foreground text-sm leading-relaxed flex-1">
        {description}
      </div>

      {cta && (
        <div className="mt-4 flex items-center gap-2 text-primary font-medium text-sm group-hover:gap-3 transition-all">
          {cta} <ArrowRight />
        </div>
      )}
    </div>
  );

  const Container = href ? motion.a : motion.div;
  const props = href
    ? { href, target: "_blank", rel: "noopener noreferrer" }
    : {};

  return (
    <Container {...props} className={cn(className, "block h-full")}>
      <Spotlight
        className={cn(
          "group relative h-full flex flex-col justify-between rounded-3xl border border-border/40 bg-card p-6 overflow-hidden transition-all duration-300 hover:shadow-2xl"
        )}
        fill="oklch(from var(--primary) l c h / 0.15)"
      >
        {/* Background Gradient */}
        {gradient && (
          <div
            className={cn(
              "absolute inset-0 bg-gradient-to-br opacity-30",
              gradient
            )}
          />
        )}

        {/* Illustration */}
        {illustration && (
          <div className="absolute inset-0 pointer-events-none">
            {illustration}
          </div>
        )}

        {/* Content */}
        {Content}
      </Spotlight>
    </Container>
  );
}
