"use client";

import Link from "next/link";
import Image from "next/image";
import { version } from "../../package.json";
import { CookieSettingsButton } from "@/components/cookie-consent-banner";
import { DiscordLogo, GithubLogo, ArrowUpRight } from "@phosphor-icons/react";
import { motion } from "framer-motion";
import { DISCORD_URL } from "@/lib/constants";

const footerLinks = {
  product: [
    { label: "Blog", href: "/blog" },
    { label: "Mentorship", href: "/#mentorship" },
    { label: "About", href: "/#about" },
  ],
  resources: [
    { label: "Documentation", href: "https://github.com/VolvoxCommunity" },
    { label: "GitHub", href: "https://github.com/VolvoxCommunity" },
    { label: "Discord", href: DISCORD_URL },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
};

const socialLinks = [
  { icon: DiscordLogo, href: DISCORD_URL, label: "Discord" },
  {
    icon: GithubLogo,
    href: "https://github.com/VolvoxCommunity",
    label: "GitHub",
  },
];

export function Footer() {
  return (
    <footer
      className="relative overflow-hidden bg-background m-2 rounded-[25px]"
      data-testid="footer"
    >
      {/* Background gradient */}

      {/* Animated Wave Background */}
      <div className="absolute inset-0 pointer-events-none opacity-30 text-primary hidden md:block">
        <svg
          className="w-full h-full"
          viewBox="0 0 1440 400"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          aria-hidden="true"
          focusable="false"
        >
          <title>Decorative wave background</title>
          {/* Wave 1: Tight curve */}
          <motion.path
            d="M720 0 C900 50, 1000 200, 1440 400"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 0.6 }}
            viewport={{ once: true }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
          {/* Wave 2: Opposing curve, entangling */}
          <motion.path
            d="M720 0 C600 100, 1200 250, 1440 350"
            stroke="currentColor"
            strokeWidth="1"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 0.4 }}
            viewport={{ once: true }}
            transition={{ duration: 2.2, ease: "easeInOut", delay: 0.1 }}
          />
          {/* Wave 3: Wide sweep */}
          <motion.path
            d="M680 0 C800 150, 900 300, 1440 200"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 0.8 }}
            viewport={{ once: true }}
            transition={{ duration: 2.4, ease: "easeInOut", delay: 0.05 }}
          />
          {/* Wave 4: Bottom filler */}
          <motion.path
            d="M750 0 C850 80, 1300 100, 1440 300"
            stroke="currentColor"
            strokeWidth="1"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 0.5 }}
            viewport={{ once: true }}
            transition={{ duration: 2.1, ease: "easeInOut", delay: 0.15 }}
          />
        </svg>
      </div>

      {/* Top border with gradient */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="container mx-auto max-w-7xl px-6 pt-20 pb-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
          {/* Brand Column */}
          <motion.div
            className="lg:col-span-5 space-y-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Link href="/" className="inline-flex items-center gap-3 group">
              <Image
                src="/logo.png"
                alt="Volvox Logo"
                width={40}
                height={40}
                className="w-10 h-10 rounded-lg"
              />
              <span className="font-[family-name:var(--font-jetbrains-mono)] font-bold text-2xl text-foreground group-hover:text-primary transition-colors">
                Volvox
              </span>
            </Link>

            <p className="text-muted-foreground max-w-sm leading-relaxed">
              Building exceptional software and empowering the next generation
              of developers through open-source and mentorship.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-white/5 border border-white/10 text-muted-foreground hover:text-foreground hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={social.label}
                >
                  <social.icon weight="fill" className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Links Columns */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h4 className="font-semibold text-foreground mb-4 text-sm uppercase tracking-wider">
              Product
            </h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors duration-200 text-sm inline-flex items-center gap-1 group"
                  >
                    {link.label}
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h4 className="font-semibold text-foreground mb-4 text-sm uppercase tracking-wider">
              Resources
            </h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    target={link.href.startsWith("http") ? "_blank" : undefined}
                    rel={
                      link.href.startsWith("http")
                        ? "noopener noreferrer"
                        : undefined
                    }
                    className="text-muted-foreground hover:text-foreground transition-colors duration-200 text-sm inline-flex items-center gap-1 group"
                  >
                    {link.label}
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h4 className="font-semibold text-foreground mb-4 text-sm uppercase tracking-wider">
              Legal
            </h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors duration-200 text-sm inline-flex items-center gap-1 group"
                  >
                    {link.label}
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                  </Link>
                </li>
              ))}
              <li>
                <CookieSettingsButton />
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          className="pt-8 border-t border-white/5"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Volvox. All rights reserved.
            </p>

            <div className="flex items-center gap-4 text-xs text-muted-foreground/60">
              <span>v{version}</span>
              <span className="hidden md:inline">•</span>
              <span className="hidden md:inline">
                Built with ❤️ by the Volvox team
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
