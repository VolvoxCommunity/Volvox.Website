"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Code, Lightbulb, Heart, Target } from "@phosphor-icons/react";
import { motion } from "framer-motion";
import confettiLib from "canvas-confetti";

export function About() {
  const handleConfetti = (e: React.MouseEvent) => {
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    confettiLib({
      particleCount: 50,
      spread: 60,
      origin: { x, y },
      colors: ["#6446ff", "#c864ff", "#78b4ff", "#9678ff", "#b464ff"],
    }).catch((err) => {
      // Log confetti animation errors for debugging; effect is non-critical
      console.error("Confetti animation failed:", err);
    });
  };

  return (
    <section id="about" className="py-16 md:py-24 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">About Volvox</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A community-driven company building the future of software
            development.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="text-2xl">Our Story</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Founded on{" "}
                <span className="text-foreground font-medium">
                  January 2, 2020
                </span>{" "}
                by{" "}
                <span className="text-foreground font-medium">
                  Bill Chirico
                </span>
                , Volvox began with a simple mission: build exceptional software
                while empowering the next generation of developers.
              </p>
              <p>
                What started as a small software development company has evolved
                into a thriving community where experienced developers mentor
                aspiring programmers through real-world open-source projects.
              </p>
              <p>
                Today, Volvox stands at the intersection of professional
                software development and education, proving that building great
                products and fostering learning are not mutually
                exclusive—they&apos;re complementary forces that drive
                innovation.
              </p>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border-secondary/20">
              <CardHeader>
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                  <Target className="h-5 w-5 text-primary" weight="fill" />
                </div>
                <CardTitle>Our Mission</CardTitle>
                <CardDescription>
                  To create world-class software solutions while cultivating a
                  new generation of talented developers through hands-on,
                  mentorship-driven learning.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-accent/20">
              <CardHeader>
                <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center mb-2">
                  <Heart className="h-5 w-5 text-secondary" weight="fill" />
                </div>
                <CardTitle>Our Values</CardTitle>
                <CardDescription>
                  Excellence in craft, generosity in teaching, and commitment to
                  open source. We believe in building in public and sharing
                  knowledge freely.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            whileHover={{ scale: 1.02, rotate: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="text-center hover:shadow-lg transition-shadow h-full">
              <CardHeader>
                <motion.div
                  className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <Code className="h-8 w-8 text-primary" weight="fill" />
                </motion.div>
                <CardTitle className="text-xl">Software Development</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We build innovative products that solve real problems, from
                  web applications to developer tools, always with a focus on
                  quality and user experience.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02, rotate: -1 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="text-center hover:shadow-lg transition-shadow h-full">
              <CardHeader>
                <motion.div
                  className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-4"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <Lightbulb className="h-8 w-8 text-secondary" weight="fill" />
                </motion.div>
                <CardTitle className="text-xl">Learning Community</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Our mentorship program pairs aspiring developers with
                  experienced engineers, providing real-world experience through
                  open-source contributions.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="mt-12 text-center">
          <a
            href="https://github.com/VolvoxCommunity"
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={handleConfetti}
            className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-primary/10 border border-primary/20 transition-colors duration-300 hover:bg-secondary/10 hover:border-secondary/20 hover:text-secondary group cursor-pointer"
          >
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75 group-hover:bg-secondary transition-colors duration-300"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-primary group-hover:bg-secondary transition-colors duration-300"></span>
            </span>
            <span className="text-base font-medium text-primary group-hover:text-secondary transition-colors duration-300">
              From Volvox with ❤️
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
