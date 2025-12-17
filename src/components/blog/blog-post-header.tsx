"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { GithubLogo, DiscordLogo, Moon, Sun } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/providers/theme-provider";
import { motion } from "framer-motion";
import { GITHUB_URL, DISCORD_URL } from "@/lib/constants";

/**
 * Renders the blog post header with back-to-home navigation, branding, a theme toggle, and social links.
 *
 * @returns The header JSX element containing navigation controls, logo/title, theme toggle button, and social icons.
 */
export function BlogPostHeader() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <header className="border-b border-border/50 bg-background/70 backdrop-blur-xl sticky top-0 z-40">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between h-16">
          <Button variant="ghost" asChild>
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </Button>
          <Link
            href="/"
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 flex-shrink-0">
              <Image
                src="/logo.png"
                alt="Volvox Logo"
                width={32}
                height={32}
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-xl font-bold text-primary">Volvox</span>
          </Link>
          <div className="flex items-center gap-2">
            <motion.div
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="rounded-full hover:bg-muted"
                aria-label={
                  theme === "light"
                    ? "Switch to dark mode"
                    : "Switch to light mode"
                }
              >
                {theme === "light" ? (
                  <Moon weight="fill" className="h-5 w-5" />
                ) : (
                  <Sun weight="fill" className="h-5 w-5" />
                )}
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                size="icon"
                asChild
                className="rounded-full hidden md:inline-flex hover:bg-muted"
              >
                <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
                  <GithubLogo weight="fill" className="h-5 w-5" />
                </a>
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                size="icon"
                asChild
                className="rounded-full hidden md:inline-flex hover:bg-muted"
              >
                <a href={DISCORD_URL} target="_blank" rel="noopener noreferrer">
                  <DiscordLogo weight="fill" className="h-5 w-5" />
                </a>
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </header>
  );
}
