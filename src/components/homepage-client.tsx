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
import { AnimatedBackground } from "@/components/animated-background";
import type { BlogPost, ExtendedProduct, Mentor, Mentee } from "@/lib/types";

interface HomepageClientProps {
  blogPosts: BlogPost[];
  products: ExtendedProduct[];
  mentors: Mentor[];
  mentees: Mentee[];
}

/**
 * Render the scrolling homepage and manage section navigation and deep-link scrolling.
 *
 * Handles in-page navigation (including URL hash on initial load), updates the active
 * navigation section based on scroll position, and renders the page sections.
 *
 * @param blogPosts - Prefetched blog posts to display in the Blog section.
 * @param products - Prefetched products to display in the Products section.
 * @param mentors - Prefetched mentors to display in the Mentorship section.
 * @param mentees - Prefetched mentees to display in the Mentorship section.
 * @returns The rendered homepage JSX element.
 */
export function HomepageClient({
  blogPosts,
  products,
  mentors,
  mentees,
}: HomepageClientProps) {
  const [currentSection, setCurrentSection] = useState("home");
  const router = useRouter();

  const handleNavigate = useCallback(
    (section: string) => {
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
    [router]
  );

  // Handle URL hash on initial load
  useEffect(() => {
    const hash = window.location.hash.slice(1); // Remove the '#'
    if (hash) {
      const startTime = performance.now();
      const timeout = 2000; // 2 seconds timeout
      let animationFrameId: number | undefined;

      const checkAndScroll = () => {
        const element = document.getElementById(hash);
        if (element) {
          handleNavigate(hash);
        } else if (performance.now() - startTime < timeout) {
          animationFrameId = requestAnimationFrame(checkAndScroll);
        } else {
          console.warn(
            `Volvox: Could not find element with id '${hash}' to scroll to.`
          );
        }
      };

      animationFrameId = requestAnimationFrame(checkAndScroll);

      return () => {
        if (animationFrameId !== undefined) {
          cancelAnimationFrame(animationFrameId);
        }
      };
    }
  }, [handleNavigate]);

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

        <main>
          <Hero onNavigate={handleNavigate} />
          <Products products={products || []} />
          <Blog posts={blogPosts || []} />
          <Mentorship mentors={mentors || []} mentees={mentees || []} />
          <About />
        </main>

        <Footer />
      </div>

      <Toaster />
    </div>
  );
}
