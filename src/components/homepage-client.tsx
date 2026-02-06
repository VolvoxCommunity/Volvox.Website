"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Toaster } from "@/components/ui/sonner";
import { Navigation } from "@/components/navigation";
import { Hero } from "@/components/hero";
import { Products } from "@/components/products";
import { Blog } from "@/components/blog";
import { Mentorship } from "@/components/mentorship";
import { About } from "@/components/about";
import { Footer } from "@/components/footer";
import { IntroSection } from "@/components/intro-section";
import { AnimatedBackground } from "@/components/animated-background";
import type { BlogPost, TeamMember, ExtendedProduct } from "@/lib/types";

interface HomepageClientProps {
  blogPosts: BlogPost[];
  teamMembers: TeamMember[];
  products: ExtendedProduct[];
}

/**
 * Render the scrolling homepage and manage section navigation, deep-link scrolling,
 * and filter state for blog posts and products.
 *
 * Handles in-page navigation (including URL hash on initial load), updates the active
 * navigation section based on scroll position, and renders the page sections with
 * optional filtering capabilities.
 *
 * @param blogPosts - Prefetched blog posts to display in the Blog section.
 * @param teamMembers - Prefetched team members to display in the Mentorship section.
 * @param products - Prefetched products to display in the Products section.
 * @returns The rendered homepage JSX element.
 */
export function HomepageClient({
  blogPosts,
  teamMembers,
  products,
}: HomepageClientProps) {
  const [currentSection, setCurrentSection] = useState("home");
  const [pendingHash, setPendingHash] = useState<string | null>(null);
  const [introFinished, setIntroFinished] = useState(false);

  const router = useRouter();

  // Memoize callback to prevent unnecessary effect re-runs in IntroSection
  const handleIntroComplete = useCallback(() => setIntroFinished(true), []);

  const handleNavigate = useCallback(
    (section: string) => {
      // Defer navigation if intro is still playing
      if (!introFinished && section !== "home") {
        setPendingHash(section);
        return;
      }

      setCurrentSection(section);

      if (section === "home") {
        window.scrollTo({ top: 0, behavior: "smooth" });
        router.push("/", { scroll: false });
      } else {
        const element = document.getElementById(section);
        if (element) {
          const offset = 80;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - offset;

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });
          router.push(`#${section}`, { scroll: false });
        }
      }
    },
    [router, introFinished]
  );

  // Handle URL hash on initial load or intro completion
  useEffect(() => {
    if (!introFinished) return;

    const hash = pendingHash || window.location.hash.slice(1);
    if (hash) {
      const startTime = performance.now();
      const timeout = 2000;
      let animationFrameId: number | undefined;

      const checkAndScroll = () => {
        const element = document.getElementById(hash);
        if (element) {
          handleNavigate(hash);
          if (pendingHash) setPendingHash(null);
        } else if (performance.now() - startTime < timeout) {
          animationFrameId = requestAnimationFrame(checkAndScroll);
        }
      };

      animationFrameId = requestAnimationFrame(checkAndScroll);

      return () => {
        if (animationFrameId !== undefined) {
          cancelAnimationFrame(animationFrameId);
        }
      };
    }
  }, [introFinished, pendingHash, handleNavigate]);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["products", "blog", "mentorship", "about"];
      const scrollPosition = window.scrollY + 200;

      if (window.scrollY < 300) {
        setCurrentSection("home");
        return;
      }

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setCurrentSection(section);
            return;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen relative">
      <div className="fixed inset-0 pointer-events-none z-0">
        <AnimatedBackground />
      </div>

      <div className="relative z-10">
        <Navigation
          onNavigate={handleNavigate}
          currentSection={currentSection}
        />

        <main id="main-content">
          <IntroSection onComplete={handleIntroComplete} />
          <Hero onNavigate={handleNavigate} />

          <Products products={products || []} />
          <Blog posts={blogPosts || []} />
          <Mentorship teamMembers={teamMembers || []} />
          <About />
        </main>

        <Footer />
      </div>

      <Toaster />
    </div>
  );
}
