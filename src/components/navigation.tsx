"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";
import { cn } from "@/lib/utils";
import { Moon, Sun, List, DiscordLogo, X } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/providers/theme-provider";
import confettiLib from "canvas-confetti";
import Image from "next/image";
import { DISCORD_URL } from "@/lib/constants";
import { motion, AnimatePresence } from "framer-motion";

interface NavigationProps {
  onNavigate?: (section: string) => void;
  currentSection?: string;
  linkMode?: boolean;
}

export function Navigation(props: NavigationProps) {
  const { onNavigate, currentSection, linkMode = false } = props;
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  // Initialize keyboard shortcuts
  useKeyboardShortcuts({
    shortcuts: [
      {
        key: "h",
        description: "Go to Home",
        action: () => (onNavigate ? onNavigate("home") : router.push("/")),
      },
      {
        key: "p",
        description: "Go to Products",
        action: () =>
          onNavigate ? onNavigate("products") : router.push("/#products"),
      },
      {
        key: "b",
        description: "Go to Blog",
        action: () => (onNavigate ? onNavigate("blog") : router.push("/#blog")),
      },
      {
        key: "c",
        description: "Go to Community",
        action: () =>
          onNavigate ? onNavigate("mentorship") : router.push("/#mentorship"),
      },
      {
        key: "t",
        description: "Go to Team",
        action: () => router.push("/team"),
      },
      {
        key: "a",
        description: "Go to About",
        action: () =>
          onNavigate ? onNavigate("about") : router.push("/#about"),
      },
    ],
  });
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isIsland, setIsIsland] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Island logic (desktop)
      setIsIsland(currentScrollY > 100);

      // Always visible
      setIsVisible(true);

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!navRef.current) return;
    const rect = navRef.current.getBoundingClientRect();
    navRef.current.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
    navRef.current.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
  };

  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

  const handleDiscordClick = (e: React.MouseEvent) => {
    void confettiLib({
      particleCount: 100,
      spread: 70,
      origin: {
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      },
    });
  };

  const navItems = [
    { id: "home", label: "Home", href: "/" },
    { id: "products", label: "Products", href: "/#products" },
    { id: "blog", label: "Blog", href: "/#blog" },
    { id: "mentorship", label: "Community", href: "/#mentorship" },
    { id: "team", label: "Team", href: "/team" },
    { id: "about", label: "About", href: "/#about" },
  ];

  const handleNavigate = (section: string) => {
    if (onNavigate) onNavigate(section);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Fixed Wrapper - acts as page banner */}
      <header
        role="banner"
        className={cn(
          "fixed top-0 left-0 w-full flex justify-center z-[1000] pointer-events-none transition-transform duration-300 ease-in-out",
          isVisible ? "translate-y-0" : "md:-translate-y-full translate-y-0"
        )}
      >
        {/* Nav Container */}
        <nav
          ref={navRef}
          onMouseMove={handleMouseMove}
          aria-label="Main navigation"
          className={cn(
            "pointer-events-auto relative flex items-center justify-between overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]",
            "w-full py-2 px-3 bg-transparent",
            isIsland
              ? "group md:w-[90%] md:max-w-[850px] md:mt-6 md:py-3 md:px-5 md:rounded-full md:bg-background/50 md:backdrop-blur-xl md:border md:border-foreground/[0.08] md:shadow-[0_10px_30px_-5px_rgba(0,0,0,0.1)]"
              : "md:w-full md:max-w-full md:py-6 md:px-10 md:border-b md:border-border/5"
          )}
        >
          {/* Mobile Progressive Blur Background */}
          <div className="absolute inset-0 md:hidden z-[-1] pointer-events-none">
            {/* Layer 1 - Base blur that fades completely */}
            <div className="absolute inset-0 backdrop-blur-[18px] [mask-image:linear-gradient(to_bottom,black_0%,transparent_100%)]" />
            {/* Layer 2 - Medium blur fading at 60% */}
            <div className="absolute inset-0 backdrop-blur-[24px] [mask-image:linear-gradient(to_bottom,black_0%,transparent_60%)]" />
            {/* Layer 3 - Strong blur fading at 30% */}
            <div className="absolute inset-0 backdrop-blur-[30px] [mask-image:linear-gradient(to_bottom,black_0%,transparent_30%)]" />
            {/* Background tint overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-background/85 via-background/35 to-transparent" />
          </div>

          {/* Spotlight Effect (Desktop Only) */}
          <div
            className={cn(
              "absolute inset-0 pointer-events-none z-0 opacity-0 transition-opacity duration-300 hidden md:block",
              isIsland ? "group-hover:opacity-100 hover:opacity-100" : ""
            )}
            style={{
              background: `radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), oklch(from var(--primary) l c h / 0.15), transparent 40%)`,
            }}
          />

          {/* Brand */}
          <Link href="/" className="flex items-center gap-3 z-[2] no-underline">
            <Image
              src="/logo.png"
              alt="Volvox Logo"
              width={32}
              height={32}
              className="w-8 h-8 object-contain rounded-md"
              priority
            />
            {/* Logo Text Hidden on Mobile */}
            <span className="font-[family-name:var(--font-jetbrains-mono)] font-bold text-lg text-foreground hidden md:block">
              Volvox
            </span>
          </Link>

          {/* Desktop Links */}
          <ul
            className={cn(
              "hidden md:flex z-[2] list-none",
              isIsland ? "gap-1 bg-foreground/5 p-1 rounded-full" : "gap-8"
            )}
          >
            {navItems.map((item) => (
              <li key={item.id}>
                {linkMode || item.id === "team" ? (
                  <Link
                    href={item.href}
                    className={cn(
                      "inline-block no-underline text-sm font-medium py-2 px-4 rounded-full transition-all duration-300",
                      currentSection === item.id
                        ? "opacity-100 bg-foreground/5 text-foreground"
                        : "opacity-60 text-foreground hover:opacity-100 hover:bg-foreground/5"
                    )}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleNavigate(item.id)}
                    className={cn(
                      "inline-block text-sm font-medium py-2 px-4 rounded-full transition-all duration-300 cursor-pointer bg-transparent border-none",
                      currentSection === item.id
                        ? "opacity-100 bg-foreground/5 text-foreground"
                        : "opacity-60 text-foreground hover:opacity-100 hover:bg-foreground/5"
                    )}
                  >
                    {item.label}
                  </button>
                )}
              </li>
            ))}
          </ul>

          {/* Actions */}
          <div className="flex items-center gap-2 z-[2]">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full"
              aria-label="Toggle theme"
              data-testid="nav-theme-toggle"
            >
              {theme === "light" ? (
                <Moon weight="fill" className="h-5 w-5" />
              ) : (
                <Sun weight="fill" className="h-5 w-5" />
              )}
            </Button>

            <Button
              className="hidden md:flex items-center gap-2 bg-[#5865F2] hover:bg-[#4752c4] text-white py-2.5 px-5 font-semibold text-sm cursor-pointer transition-transform duration-300 no-underline border-none"
              onClick={(e) => {
                handleDiscordClick(e);
                window.open(DISCORD_URL, "_blank", "noopener,noreferrer");
              }}
              data-testid="nav-discord-cta"
            >
              <DiscordLogo weight="fill" className="h-5 w-5" />
              Join
            </Button>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden rounded-full"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              data-testid="nav-mobile-open"
            >
              <List className="h-6 w-6" />
            </Button>
          </div>
        </nav>
      </header>

      {/* Custom Animated Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: "-100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "-100%" }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className="fixed inset-0 z-[2000] bg-background flex flex-col pointer-events-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-border/5">
              <div className="flex items-center gap-3">
                <Image
                  src="/logo.png"
                  alt="Volvox Logo"
                  width={32}
                  height={32}
                  className="w-8 h-8 object-contain rounded-md"
                />
                <span className="font-[family-name:var(--font-jetbrains-mono)] font-bold text-lg text-foreground">
                  Volvox
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileOpen(false)}
                className="rounded-full"
                aria-label="Close menu"
              >
                <X weight="bold" className="w-6 h-6" />
              </Button>
            </div>

            {/* Menu Items */}
            <div className="flex flex-col p-6 gap-6 overflow-y-auto">
              {navItems.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                >
                  {linkMode || item.id === "team" ? (
                    <Link
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className="text-3xl font-bold tracking-tight block py-2"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleNavigate(item.id)}
                      className="text-left text-3xl font-bold tracking-tight block py-2 bg-transparent border-none cursor-pointer w-full"
                    >
                      {item.label}
                    </button>
                  )}
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-4 pt-6 border-t border-border/10"
              >
                <a
                  href={DISCORD_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-xl font-semibold text-[#5865F2]"
                >
                  <DiscordLogo weight="fill" className="w-8 h-8" />
                  Join Community
                </a>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
