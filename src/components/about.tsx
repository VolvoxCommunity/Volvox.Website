"use client";

import { ArrowRight, Code, GithubLogo, Heart } from "@phosphor-icons/react";
import { motion, type Variants } from "framer-motion";
import Image from "next/image";
import type { JSX } from "react";
import { Button } from "@/components/ui/button";

import { GITHUB_URL } from "@/lib/constants";
import { cn } from "@/lib/utils";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40, filter: "blur(8px)", scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    scale: 1,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

/**
 * Renders the "About Volvox" section as a modern, high-end Bento Grid.
 */
export function About(): JSX.Element {
  return (
    <section
      id="about"
      data-testid="about-section"
      aria-label="About Volvox"
      className="py-16 md:py-24 px-4 bg-background relative overflow-hidden md:min-h-screen md:flex md:flex-col md:justify-center"
    >
      <div className="container mx-auto max-w-6xl relative z-20">
        <div className="text-center mb-10 md:mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-3xl md:text-4xl font-editorial italic font-medium tracking-tight text-foreground text-balance leading-tight"
          >
            About Volvox
          </motion.h2>
        </div>

        {/* Compact 12-Column Bento Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="about-bento-grid grid grid-cols-1 md:grid-cols-12 gap-4"
        >
          {/* 1. Our Story (8 Cols) */}
          <BentoCard variants={itemVariants} className="md:col-span-8">
            <span className="text-muted-foreground text-[10px] font-mono font-bold uppercase tracking-[0.2em] mb-2 block">
              Our Story
            </span>
            <h3 className="font-editorial italic font-medium text-foreground text-xl md:text-2xl mb-2 leading-tight flex items-center gap-2 flex-wrap">
              <span>Founded in 2020 by Bill Chirico</span>
              <Image
                src="https://github.com/BillChirico.png"
                alt="Bill Chirico"
                width={24}
                height={24}
                className="w-6 h-6 rounded-full inline-block object-cover ring-1 ring-border"
              />
              <span>.</span>
            </h3>
            <p className="text-muted-foreground text-xs md:text-sm leading-relaxed text-pretty max-w-2xl">
              What began as a mission to build exceptional software has evolved
              into a vibrant ecosystem. We stand at the intersection of
              professional engineering and open-source education, proving that
              production-ready products and community learning are complementary
              forces.
            </p>
            <div className="mt-4 flex items-center gap-3">
              <div className="flex -space-x-2">
                <Image
                  src="https://github.com/EleftheriaBatsou.png"
                  alt="Eleftheria"
                  width={24}
                  height={24}
                  className="w-6 h-6 rounded-full object-cover ring-2 ring-background"
                />
                <Image
                  src="https://github.com/rabden.png"
                  alt="Hossain Jahed"
                  width={24}
                  height={24}
                  className="w-6 h-6 rounded-full object-cover ring-2 ring-background"
                />
                <Image
                  src="https://github.com/MohsinCoding.png"
                  alt="Mohsin"
                  width={24}
                  height={24}
                  className="w-6 h-6 rounded-full object-cover ring-2 ring-background"
                />
              </div>
              <span className="text-muted-foreground text-xs font-mono font-medium">
                Growing since 2020
              </span>
            </div>
          </BentoCard>

          {/* 2. Mission (4 Cols - Primary Tinted) */}
          <BentoCard
            variants={itemVariants}
            className="md:col-span-4 bg-primary/10 border-primary/20"
          >
            <span className="text-primary/70 text-[10px] font-mono font-bold uppercase tracking-[0.2em] mb-2 block">
              The Mission
            </span>
            <h3 className="font-editorial italic font-medium text-foreground text-lg md:text-xl mb-3 leading-tight text-balance">
              Cultivating talent while building world-class solutions.
            </h3>
            <div className="mt-auto pt-2">
              <div className="h-1 w-full bg-primary/10 rounded-full overflow-hidden">
                <div className="h-full w-2/3 bg-primary" />
              </div>
              <span className="text-muted-foreground text-[10px] font-mono mt-1.5 block">
                Active Mentorship Phase
              </span>
            </div>
          </BentoCard>

          {/* 3. Values (5 Cols) */}
          <BentoCard variants={itemVariants} className="md:col-span-5">
            <span className="text-muted-foreground text-[10px] font-mono font-bold uppercase tracking-[0.2em] mb-3 block">
              Our Values
            </span>
            <ul className="space-y-3">
              <li className="flex gap-3 items-start">
                <Heart
                  weight="fill"
                  className="w-4 h-4 text-primary shrink-0 mt-0.5"
                />
                <div>
                  <span className="text-foreground block text-xs font-bold">
                    Generosity in Teaching
                  </span>
                  <span className="text-muted-foreground block text-[11px] leading-snug">
                    Knowledge is the only resource that grows when shared.
                  </span>
                </div>
              </li>
              <li className="flex gap-3 items-start">
                <Code
                  weight="fill"
                  className="w-4 h-4 text-primary shrink-0 mt-0.5"
                />
                <div>
                  <span className="text-foreground block text-xs font-bold">
                    Open Source Commitment
                  </span>
                  <span className="text-muted-foreground block text-[11px] leading-snug">
                    Our best work belongs to the global community.
                  </span>
                </div>
              </li>
            </ul>
          </BentoCard>

          {/* 4. Community (3 Cols) */}
          <BentoCard
            variants={itemVariants}
            className="md:col-span-3 items-center text-center justify-center"
          >
            <span className="font-editorial italic font-medium text-foreground text-3xl sm:text-4xl">
              ∞
            </span>
            <span className="text-foreground text-xs font-bold mt-1">
              Community Driven
            </span>
            <p className="text-muted-foreground text-[11px] leading-tight mt-0.5">
              Peer-to-peer growth model
            </p>
          </BentoCard>

          {/* 5. Join Us / GitHub CTA (4 Cols) */}
          <BentoCard
            variants={itemVariants}
            className="md:col-span-4 border-primary/30 bg-card-deep/40 hover:border-primary/50 transition-colors"
          >
            <span className="text-primary text-[10px] font-mono font-bold uppercase tracking-[0.2em] mb-2 block">
              Open Future
            </span>
            <h3 className="font-editorial italic font-medium text-foreground text-base mb-2">
              Ready to build together?
            </h3>
            <p className="text-muted-foreground text-xs leading-relaxed mb-4">
              Join our community on GitHub and start contributing to real-world
              projects.
            </p>
            <Button
              asChild
              variant="secondary"
              size="sm"
              className="mt-auto gap-2 rounded-full px-4 py-1.5 text-xs font-bold w-fit group"
            >
              <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
                <GithubLogo weight="fill" className="w-3.5 h-3.5" />
                <span>View GitHub</span>
                <ArrowRight
                  weight="bold"
                  className="w-3 h-3 transition-transform group-hover:translate-x-0.5"
                />
              </a>
            </Button>
          </BentoCard>
        </motion.div>
      </div>
    </section>
  );
}

function BentoCard({
  className,
  children,
  variants,
}: {
  className?: string;
  children: React.ReactNode;
  variants?: Variants;
}) {
  return (
    <motion.div
      variants={variants}
      className={cn(
        "about-bento-card rounded-[1.8rem] bg-card-deep/20 border border-border/30 p-1 transition-all duration-300 hover:border-border/60 hover:shadow-xl hover:shadow-primary/5",
        className,
      )}
    >
      <div className="w-full h-full rounded-[calc(1.8rem-0.25rem)] bg-card border border-border/10 p-5 flex flex-col justify-between shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
        {children}
      </div>
    </motion.div>
  );
}
