"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { About } from "@/components/about";
import { AnimatedBackground } from "@/components/animated-background";
import { Blog } from "@/components/blog";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { Mentorship } from "@/components/mentorship";
import { Navigation } from "@/components/navigation";
import { Products } from "@/components/products";
import { Toaster } from "@/components/ui/sonner";
import type { BlogPost, ExtendedProduct, TeamMember } from "@/lib/types";

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
    [router],
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
            `Volvox: Could not find element with id '${hash}' to scroll to.`,
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

        <main id="main-content">
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
