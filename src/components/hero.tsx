"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, GithubLogo, DiscordLogo } from "@phosphor-icons/react";
import { motion } from "framer-motion";
import Link from "next/link";
import confettiLib from "canvas-confetti";

interface HeroProps {
  onNavigate: (section: string) => void;
}

/**
 * Render the hero section for the Volvox landing page.
 *
 * Clicking the main title or the Discord link emits a confetti animation at the click position.
 *
 * @param onNavigate - Callback invoked with a section identifier (e.g., `"products"`, `"mentorship"`) when an action requests navigation
 * @returns A React element representing the hero section
 */
export function Hero({ onNavigate }: HeroProps) {
  const handleTitleClick = (e: React.MouseEvent) => {
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;

    const promise = confettiLib({
      particleCount: 100,
      spread: 70,
      origin: { x, y },
    });

    if (promise) {
      promise.catch((err) => {
        console.error("Confetti animation failed:", err);
      });
    }
  };

  const handleDiscordClick = (e: React.MouseEvent) => {
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;

    const promise = confettiLib({
      particleCount: 100,
      spread: 70,
      origin: { x, y },
    });

    if (promise) {
      promise.catch((err) => {
        console.error("Confetti animation failed:", err);
      });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4">
      <div className="container mx-auto max-w-6xl text-center py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-6"
        >
          <div className="group inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 hover:bg-secondary/10 hover:border-secondary/20 transition-colors duration-300">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75 group-hover:bg-secondary transition-colors duration-300"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary group-hover:bg-secondary transition-colors duration-300"></span>
            </span>
            <span className="text-sm font-medium text-primary group-hover:text-secondary transition-colors duration-300">
              Building the future of software development
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8"
        >
          <motion.h1
            className="text-7xl md:text-8xl lg:text-9xl font-extrabold tracking-tight text-primary cursor-pointer"
            whileHover={{
              scale: 1.05,
              textShadow: "0 0 30px oklch(0.32 0.14 264.5 / 0.5)",
            }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            onClick={handleTitleClick}
          >
            Volvox
          </motion.h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-xl md:text-2xl font-medium mb-8 text-muted-foreground max-w-3xl mx-auto leading-relaxed"
        >
          A software development company and open-source learning community. We
          build exceptional products while mentoring the next generation of
          developers.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
        >
          <Button
            size="lg"
            asChild
            className="group text-base px-8 py-6 h-auto font-semibold shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <Link href="/#products">
              <span className="relative z-10 flex items-center gap-2">
                Explore Products
                <ArrowRight
                  weight="bold"
                  className="h-5 w-5 transition-transform group-hover:translate-x-1"
                />
              </span>
            </Link>
          </Button>

          <Button
            size="lg"
            variant="outline"
            onClick={() => onNavigate("mentorship")}
            className="group text-base px-8 py-6 h-auto border-2 hover:bg-secondary/10 hover:border-secondary transition-[colors,box-shadow] duration-300 font-semibold shadow-md hover:shadow-lg"
          >
            Join as Mentee
            <ArrowRight
              weight="bold"
              className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1"
            />
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex gap-8 justify-center items-center"
        >
          <a
            href="https://github.com/VolvoxCommunity"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-secondary transition-colors duration-300"
          >
            <GithubLogo
              weight="fill"
              className="h-5 w-5 transition-transform group-hover:scale-110"
            />
            <span className="font-medium">GitHub</span>
          </a>
          <div className="h-4 w-px bg-border" />
          <a
            href="https://discord.gg/8ahXACdamN"
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleDiscordClick}
            className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-secondary transition-colors duration-300"
          >
            <DiscordLogo
              weight="fill"
              className="h-5 w-5 transition-transform group-hover:scale-110"
            />
            <span className="font-medium">Discord</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
