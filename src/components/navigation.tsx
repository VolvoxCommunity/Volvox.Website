"use client";

import { useState } from "react";
import {
  Moon,
  Sun,
  List,
  GithubLogo,
  DiscordLogo,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useTheme } from "@/components/providers/theme-provider";
import { motion } from "framer-motion";
import confettiLib from "canvas-confetti";

interface NavigationProps {
  onNavigate: (section: string) => void;
  currentSection: string;
}

export function Navigation({ onNavigate, currentSection }: NavigationProps) {
  const { theme, setTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  };

  const handleDiscordClick = (e: React.MouseEvent) => {
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    confettiLib({
      particleCount: 100,
      spread: 70,
      origin: { x, y },
    });
  };

  const navItems = [
    { id: "home", label: "Home" },
    { id: "products", label: "Products" },
    { id: "blog", label: "Blog" },
    { id: "mentorship", label: "Mentorship" },
    { id: "about", label: "About" },
  ];

  const handleNavigate = (section: string) => {
    onNavigate(section);
    setMobileOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/70 backdrop-blur-xl">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between h-16">
          <motion.button
            onClick={() => handleNavigate("home")}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="text-xl font-bold text-primary">Volvox</span>
          </motion.button>

          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id)}
                className={`text-sm font-medium transition-all px-4 py-2 rounded-lg relative cursor-pointer ${
                  currentSection === item.id
                    ? "text-primary bg-primary/10"
                    : "text-foreground hover:text-primary hover:bg-muted"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

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
                <a
                  href="https://github.com/VolvoxCommunity"
                  target="_blank"
                  rel="noopener noreferrer"
                >
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
                <a
                  href="https://discord.gg/8ahXACdamN"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleDiscordClick}
                >
                  <DiscordLogo weight="fill" className="h-5 w-5" />
                </a>
              </Button>
            </motion.div>

            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden rounded-full hover:bg-muted"
                >
                  <List className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64">
                <div className="flex flex-col gap-4 mt-8">
                  {navItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleNavigate(item.id)}
                      className={`text-left text-lg font-medium transition-all px-4 py-2 rounded-lg cursor-pointer ${
                        currentSection === item.id
                          ? "text-primary bg-primary/10"
                          : "text-foreground hover:text-primary hover:bg-muted"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                  <div className="border-t border-border pt-6 flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      asChild
                      className="rounded-full"
                    >
                      <a
                        href="https://github.com/VolvoxCommunity"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <GithubLogo weight="fill" className="h-5 w-5" />
                      </a>
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      asChild
                      className="rounded-full"
                    >
                      <a
                        href="https://discord.gg/8ahXACdamN"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={handleDiscordClick}
                      >
                        <DiscordLogo weight="fill" className="h-5 w-5" />
                      </a>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
