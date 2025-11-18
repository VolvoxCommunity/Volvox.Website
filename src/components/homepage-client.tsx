"use client";

import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";
import { Navigation } from "@/components/navigation";
import { Hero } from "@/components/hero";
import { Products } from "@/components/products";
import { Blog } from "@/components/blog";
import { Mentorship } from "@/components/mentorship";
import { About } from "@/components/about";
import { Footer } from "@/components/footer";
import { AnimatedBackground } from "@/components/animated-background";
import type { BlogPost, Product } from "@/lib/types";

interface HomepageClientProps {
  blogPosts: BlogPost[];
  products: Product[];
}

export function HomepageClient({ blogPosts, products }: HomepageClientProps) {
  const [currentSection, setCurrentSection] = useState("home");

  const handleNavigate = (section: string) => {
    setCurrentSection(section);

    if (section === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
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
      }
    }
  };

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
          <Mentorship mentors={[]} mentees={[]} />
          <About />
        </main>

        <Footer />
      </div>

      <Toaster />
    </div>
  );
}
