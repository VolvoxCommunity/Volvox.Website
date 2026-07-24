"use client";

import { useEffect, useRef } from "react";

interface StackItem {
  name: string;
  category: string;
  accentLight: string;
  accentDark: string;
}

const STACK_ITEMS: StackItem[] = [
  {
    name: "React",
    category: "UI Architecture",
    accentLight: "#0068d9",
    accentDark: "#40a3ff",
  },
  {
    name: "Next.js",
    category: "App Platform",
    accentLight: "#171717",
    accentDark: "#f5f5f5",
  },
  {
    name: "TypeScript",
    category: "Type System",
    accentLight: "#3178c6",
    accentDark: "#589fff",
  },
  {
    name: ".NET / C#",
    category: "Core Backend",
    accentLight: "#9b3fca",
    accentDark: "#d28aff",
  },
];

export function StackCanvas({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    // Check reduced motion
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let isReducedMotion = motionQuery.matches;

    let animFrameId: number;
    let width = 0;
    let height = 0;

    // Mouse tracking for subtle 3D parallax tilt
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    // Dark mode detection
    let isDark = document.documentElement.classList.contains("dark");

    const updateTheme = () => {
      isDark = document.documentElement.classList.contains("dark");
    };

    const themeObserver = new MutationObserver(updateTheme);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    const handleMotionChange = (e: MediaQueryListEvent) => {
      isReducedMotion = e.matches;
      if (isReducedMotion) {
        cancelAnimationFrame(animFrameId);
        render(0);
      } else {
        animFrameId = requestAnimationFrame(loop);
      }
    };
    motionQuery.addEventListener("change", handleMotionChange);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      targetMouseX = x * 18; // max shift in px
      targetMouseY = y * 10;
    };

    const handleMouseLeave = () => {
      targetMouseX = 0;
      targetMouseY = 0;
    };

    const parentEl = canvas.parentElement;
    if (parentEl) {
      parentEl.addEventListener("mousemove", handleMouseMove);
      parentEl.addEventListener("mouseleave", handleMouseLeave);
    }

    const resize = () => {
      if (!parentEl) return;
      const rect = parentEl.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const resizeObserver = new ResizeObserver(resize);
    if (parentEl) resizeObserver.observe(parentEl);
    resize();

    // Helper: Rounded Rectangle
    const drawRoundRect = (
      x: number,
      y: number,
      w: number,
      h: number,
      r: number,
    ) => {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + w - r, y);
      ctx.quadraticCurveTo(x + w, y, x + w, y + r);
      ctx.lineTo(x + w, y + h - r);
      ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      ctx.lineTo(x + r, y + h);
      ctx.quadraticCurveTo(x, y + h, x, y + h - r);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.closePath();
    };

    const render = (time: number) => {
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse interpolation
      mouseX += (targetMouseX - mouseX) * 0.08;
      mouseY += (targetMouseY - mouseY) * 0.08;

      const itemCount = STACK_ITEMS.length;
      const cardWidth = Math.min(width * 0.88, 220);
      const cardHeight = 26;
      const baseGap = 6;
      const totalHeight = itemCount * cardHeight + (itemCount - 1) * baseGap;
      const startY = (height - totalHeight) / 2;

      // Cycle for adaptive morphing phase (every ~4.5 seconds)
      const cycle = isReducedMotion ? 0 : time * 0.001;
      const morphFactor = isReducedMotion
        ? 0
        : Math.sin(cycle * 0.8) * 0.5 + 0.5; // 0 to 1

      // Specular sheen position traversing diagonally across the canvas
      const sheenX = isReducedMotion
        ? -100
        : ((time * 0.07) % (width + 300)) - 150;

      // Colors based on theme
      const glassBg = isDark
        ? "rgba(22, 27, 38, 0.78)"
        : "rgba(255, 255, 255, 0.88)";
      const borderBase = isDark
        ? "rgba(255, 255, 255, 0.12)"
        : "rgba(0, 0, 0, 0.08)";
      const borderHighlight = isDark
        ? "rgba(255, 255, 255, 0.28)"
        : "rgba(255, 255, 255, 0.9)";
      const shadowColor = isDark
        ? "rgba(0, 0, 0, 0.45)"
        : "rgba(0, 104, 217, 0.08)";
      const textColor = isDark ? "#f3f4f6" : "#111827";
      const subTextColor = isDark ? "#9ca3af" : "#6b7280";

      // Render slabs from back to front (bottom to top in stack)
      for (let i = 0; i < itemCount; i++) {
        const item = STACK_ITEMS[i];

        // Micro motion calculations
        const wave = isReducedMotion ? 0 : Math.sin(cycle * 1.5 + i * 0.9);
        const floatX = isReducedMotion
          ? 0
          : Math.sin(cycle * 1.2 + i * 1.4) * 3 + mouseX * (1 - i * 0.15);
        const floatY = isReducedMotion ? 0 : wave * 2 + mouseY * (1 - i * 0.15);

        // Adaptive expansion / stagger offset during morph factor
        const spreadOffset = (i - 1.5) * (morphFactor * 2.5);

        const x = (width - cardWidth) / 2 + floatX;
        const y = startY + i * (cardHeight + baseGap) + floatY + spreadOffset;

        // Perspective / depth scale effect
        const depthRatio = 0.96 + i * 0.02; // slight scale for depth
        const currentW = cardWidth * depthRatio;
        const currentX = x + (cardWidth - currentW) / 2;

        ctx.save();

        // 1. Slab Shadow
        ctx.shadowColor = shadowColor;
        ctx.shadowBlur = isDark ? 12 : 8;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = isDark ? 6 : 4;

        // 2. Slab Glass Fill Gradient
        drawRoundRect(currentX, y, currentW, cardHeight, 7);

        const fillGrad = ctx.createLinearGradient(
          currentX,
          y,
          currentX + currentW,
          y + cardHeight,
        );
        fillGrad.addColorStop(0, glassBg);
        fillGrad.addColorStop(
          1,
          isDark ? "rgba(15, 20, 30, 0.88)" : "rgba(245, 247, 250, 0.96)",
        );
        ctx.fillStyle = fillGrad;
        ctx.fill();

        // Clear shadow for border/text drawing
        ctx.shadowColor = "transparent";

        // 3. Hairline Glass Border
        const borderGrad = ctx.createLinearGradient(
          currentX,
          y,
          currentX + currentW,
          y + cardHeight,
        );
        borderGrad.addColorStop(0, borderHighlight);
        borderGrad.addColorStop(0.5, borderBase);
        borderGrad.addColorStop(1, borderBase);

        ctx.lineWidth = 1;
        ctx.strokeStyle = borderGrad;
        ctx.stroke();

        // 4. Specular Edge Highlight / Glint
        const glintGrad = ctx.createLinearGradient(
          sheenX,
          y,
          sheenX + 80,
          y + cardHeight,
        );
        const accent = isDark ? item.accentDark : item.accentLight;
        glintGrad.addColorStop(0, "rgba(255,255,255,0)");
        glintGrad.addColorStop(0.5, `${accent}44`); // 27% opacity
        glintGrad.addColorStop(1, "rgba(255,255,255,0)");

        ctx.strokeStyle = glintGrad;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // 5. Tech Accent Indicator Dot
        const dotX = currentX + 14;
        const dotY = y + cardHeight / 2;
        ctx.beginPath();
        ctx.arc(dotX, dotY, 3, 0, Math.PI * 2);
        ctx.fillStyle = accent;
        ctx.fill();

        // Active glow ring on accent dot
        if (!isReducedMotion) {
          ctx.beginPath();
          ctx.arc(dotX, dotY, 5 + wave * 0.5, 0, Math.PI * 2);
          ctx.strokeStyle = `${accent}55`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        // 6. Tech Name Label
        ctx.font = `600 11.5px var(--font-mono, monospace)`;
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.fillStyle = textColor;
        ctx.fillText(item.name, currentX + 26, y + cardHeight / 2 + 0.5);

        // 7. Tech Category Tag
        ctx.font = `400 9px var(--font-sans, sans-serif)`;
        ctx.textAlign = "right";
        ctx.fillStyle = subTextColor;
        ctx.fillText(
          item.category,
          currentX + currentW - 12,
          y + cardHeight / 2 + 0.5,
        );

        ctx.restore();
      }

      // 8. Connecting Architectural Guide Line (Subtle Glass Spine)
      ctx.save();
      const spineX = (width - cardWidth) / 2 + cardWidth - 28 + mouseX * 0.5;
      const spineTop = startY - 4;
      const spineBottom = startY + itemCount * (cardHeight + baseGap);

      const spineGrad = ctx.createLinearGradient(
        spineX,
        spineTop,
        spineX,
        spineBottom,
      );
      spineGrad.addColorStop(0, "transparent");
      spineGrad.addColorStop(
        0.5,
        isDark ? "rgba(64, 163, 255, 0.25)" : "rgba(0, 104, 217, 0.2)",
      );
      spineGrad.addColorStop(1, "transparent");

      ctx.beginPath();
      ctx.setLineDash([3, 3]);
      ctx.moveTo(spineX, spineTop);
      ctx.lineTo(spineX, spineBottom);
      ctx.strokeStyle = spineGrad;
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();
    };

    const loop = (time: number) => {
      render(time);
      animFrameId = requestAnimationFrame(loop);
    };

    if (isReducedMotion) {
      render(0);
    } else {
      animFrameId = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(animFrameId);
      themeObserver.disconnect();
      resizeObserver.disconnect();
      motionQuery.removeEventListener("change", handleMotionChange);
      if (parentEl) {
        parentEl.removeEventListener("mousemove", handleMouseMove);
        parentEl.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, []);

  return (
    <canvas ref={canvasRef} className={`w-full h-full block ${className}`} />
  );
}
