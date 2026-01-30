"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * AnimatedBackground Component
 *
 * Implements a "Spline Depth Horizon" + Particle System effect.
 * Layers:
 * 1. Background (Solid/Theme based)
 * 2. Noise Grain Overlay (SVG Filter)
 * 3. Phong Lighting (Radial Gradient)
 * 4. Depth Horizon Gradient (Radial Gradient simulating a horizon)
 * 5. Particle System (Canvas based, floating particles)
 */
export function AnimatedBackground({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  // Initial mount check to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width: number = window.innerWidth;
    let height: number = window.innerHeight;
    let animationFrameId: number;
    const particles: Particle[] = [];
    let resizeTimeout: NodeJS.Timeout;

    // Configuration
    const config = {
      maxParticles: 150,
      spawnWidth: 800,
      spawnHeight: 400,
      size: 1.2,
      colorA: "rgb(50, 100, 255)",
      colorB: "rgb(255, 255, 255)",
    };

    // Helper to get CSS variable value
    const getCssVar = (name: string) => {
      if (typeof window === "undefined") return "";
      return getComputedStyle(document.documentElement)
        .getPropertyValue(name)
        .trim();
    };

    // Update config colors from CSS variables
    const updateColors = () => {
      const color1 = getCssVar("--particle-color-1");
      const color2 = getCssVar("--particle-color-2");

      if (color1) config.colorA = color1;
      if (color2) config.colorB = color2;
    };

    class Particle {
      x: number;
      y: number;
      vy: number;
      vx: number;
      color: string;
      initialSize: number;
      age: number;
      life: number;
      wobble: number;

      constructor() {
        // 1. WIDTH: Spread across spawnWidth center
        const offsetX = (Math.random() - 0.5) * config.spawnWidth;
        this.x = width / 2 + offsetX;

        // 2. HEIGHT: Spread across bottom spawnHeight
        const offsetY = Math.random() * config.spawnHeight;
        this.y = height - offsetY;

        // 3. MOVEMENT: Slow drift up
        this.vy = -0.2 - Math.random() * 0.3;
        this.vx = (Math.random() - 0.5) * 0.1;

        // Color selection
        this.color = Math.random() > 0.5 ? config.colorA : config.colorB;
        this.initialSize = Math.random() * config.size;

        this.age = 0;
        this.life = 120 + Math.random() * 80;
        this.wobble = Math.random() * Math.PI * 2;
      }

      update() {
        this.y += this.vy;
        this.x += this.vx;
        this.x += Math.sin(this.age * 0.05 + this.wobble) * 0.1;
        this.age++;
      }

      draw(ctx: CanvasRenderingContext2D) {
        const lifePercent = this.age / this.life;
        let opacity = 0;

        // Fade In (0-20%) -> Hold -> Fade Out (50-100%)
        if (lifePercent < 0.2) {
          opacity = lifePercent / 0.2;
        } else if (lifePercent < 0.5) {
          opacity = 1;
        } else {
          opacity = 1 - (lifePercent - 0.5) / 0.5;
        }

        // Safety Kill: If it floats higher than the spawn area + buffer
        if (this.y < height - (config.spawnHeight + 100)) {
          opacity = 0;
        }

        if (opacity <= 0) return;

        ctx.globalAlpha = opacity;
        ctx.fillStyle = this.color;

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.initialSize, 0, Math.PI * 2);
        ctx.fill();

        ctx.globalAlpha = 1.0;
      }
    }

    const init = () => {
      resize();
      updateColors();

      for (let i = 0; i < config.maxParticles; i++) {
        const p = new Particle();
        p.age = Math.random() * p.life;
        particles.push(p);
      }
    };

    const resize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        width = canvas.width = parent.clientWidth;
        height = canvas.height = parent.clientHeight;
      } else {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
      }
    };

    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        resize();
        updateColors(); // Re-fetch colors
      }, 200);
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Maintain density
      if (particles.length < config.maxParticles) {
        particles.push(new Particle());
      } else if (Math.random() < 0.1) {
        particles.push(new Particle());
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.update();
        p.draw(ctx);

        if (p.age >= p.life || p.y < height - (config.spawnHeight + 150)) {
          particles.splice(i, 1);
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener("resize", handleResize);
    init();
    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      clearTimeout(resizeTimeout);
    };
  }, [mounted]);

  if (!mounted) return <div className="fixed inset-0 bg-background" />;

  return (
    <div
      ref={containerRef}
      className={cn(
        "absolute inset-0 w-full h-full -z-10 overflow-hidden bg-background",
        className
      )}
      data-testid="animated-background"
    >
      <style jsx global>{`
        @keyframes custom-fade-in {
          from {
            opacity: 0;
            transform: translateY(200px);
          }
          to {
            opacity: 1;
            transform: translateY(0px);
          }
        }
        .animate-fade-in {
          animation: custom-fade-in 3s 1s ease-out forwards;
          opacity: 0;
        }
      `}</style>

      {/* LAYER 1: Noise Grain */}
      <div
        className="absolute inset-0 z-0 opacity-[0.05] dark:opacity-[0.08] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* LAYER 2: Phong Lighting - Kept mix-blend-screen for lighting effect, should be fine if opacity is low */}
      <div
        className="absolute inset-0 opacity-10 z-10 pointer-events-none mix-blend-screen"
        style={{
          background: `radial-gradient(
                circle 100vh at 50% -20%, 
                rgb(255, 255, 255) 0%, 
                transparent 50%
            )`,
        }}
      />

      {/* LAYER 3: Depth Horizon Gradient - Removed mix-blend-screen */}
      <div
        className="absolute inset-0 w-full h-full z-20 animate-fade-in"
        style={{
          background: `radial-gradient(
                circle 300vh at 50% -200vh, 
                rgba(0,0,0,0) 0%,
                rgba(0,0,0,0) 89%, 
                var(--bg-depth-gradient-from) 96%, 
                var(--bg-depth-gradient-to) 99%, 
                rgba(255,255,255,0.8) 115%
            )`,
        }}
      />

      {/* LAYER 4: Particle Canvas - Removed mix-blend-screen */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full z-30 pointer-events-none animate-fade-in"
      />
    </div>
  );
}
