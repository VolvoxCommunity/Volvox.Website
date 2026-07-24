"use client";

import { useEffect, useRef } from "react";

interface ChannelTag {
  id: string;
  label: string;
  brandColor: string;
  lightBrandColor: string;
  phaseOffset: number;
  yRatio: number; // Vertical anchor on canvas (0.3 - 0.7)
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  vx: number;
  vy: number;
  bars: number[]; // Mini audio spectrum bar heights
}

export function CommunicateCanvas(): React.JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animFrameId: number;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let time = 0;

    // Pointer state for dynamic wave interaction
    const mouse = {
      x: -1000,
      y: -1000,
      targetX: -1000,
      targetY: -1000,
      active: false,
    };

    // Accessibility check
    const reducedMotionQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    let isReducedMotion = reducedMotionQuery.matches;

    const handleMotionChange = (e: MediaQueryListEvent) => {
      isReducedMotion = e.matches;
      if (!isReducedMotion) {
        animFrameId = requestAnimationFrame(render);
      }
    };
    reducedMotionQuery.addEventListener("change", handleMotionChange);

    // Channel Tags Data
    const channels: ChannelTag[] = [
      {
        id: "discord",
        label: "#discord",
        brandColor: "#5865F2",
        lightBrandColor: "#404EED",
        phaseOffset: 0,
        yRatio: 0.32,
        x: 0,
        y: 0,
        targetX: 0,
        targetY: 0,
        vx: 0,
        vy: 0,
        bars: [0.4, 0.8, 0.5],
      },
      {
        id: "slack",
        label: "#slack",
        brandColor: "#ECB22E",
        lightBrandColor: "#E01E5A",
        phaseOffset: Math.PI * 0.5,
        yRatio: 0.52,
        x: 0,
        y: 0,
        targetX: 0,
        targetY: 0,
        vx: 0,
        vy: 0,
        bars: [0.7, 0.3, 0.9],
      },
      {
        id: "email",
        label: "#email",
        brandColor: "#10B981",
        lightBrandColor: "#059669",
        phaseOffset: Math.PI,
        yRatio: 0.38,
        x: 0,
        y: 0,
        targetX: 0,
        targetY: 0,
        vx: 0,
        vy: 0,
        bars: [0.3, 0.6, 0.4],
      },
      {
        id: "calls",
        label: "#calls",
        brandColor: "#007AFF",
        lightBrandColor: "#0056B3",
        phaseOffset: Math.PI * 1.5,
        yRatio: 0.68,
        x: 0,
        y: 0,
        targetX: 0,
        targetY: 0,
        vx: 0,
        vy: 0,
        bars: [0.8, 0.5, 0.7],
      },
    ];

    // Theme values detector
    const getThemeColors = () => {
      const computed = getComputedStyle(container);
      const isDark = document.documentElement.classList.contains("dark");

      return {
        primary:
          computed.getPropertyValue("--primary").trim() ||
          (isDark ? "#40a3ff" : "#0068d9"),
        foreground:
          computed.getPropertyValue("--foreground").trim() ||
          (isDark ? "#ffffff" : "#09090b"),
        cardBg: isDark ? "rgba(18, 22, 28, 0.85)" : "rgba(255, 255, 255, 0.92)",
        border: isDark ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.08)",
        gridLine: isDark ? "rgba(255, 255, 255, 0.04)" : "rgba(0, 0, 0, 0.04)",
        isDark,
      };
    };

    // Resize Handler with High-DPI scaling
    const updateSize = () => {
      const rect = container.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      // Set initial tag positions horizontally across the canvas
      const padX = Math.min(width * 0.15, 60);
      const availableW = width - padX * 2;
      const stepX = availableW / (channels.length - 1);

      channels.forEach((ch, idx) => {
        const initialX = padX + idx * stepX;
        const initialY = height * ch.yRatio;

        if (ch.x === 0 && ch.y === 0) {
          ch.x = initialX;
          ch.y = initialY;
        }
        ch.targetX = initialX;
        ch.targetY = initialY;
      });
    };

    updateSize();

    const resizeObserver = new ResizeObserver(() => {
      updateSize();
    });
    resizeObserver.observe(container);

    // Pointer Interaction Handlers
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.targetX = e.clientX - rect.left;
      mouse.targetY = e.clientY - rect.top;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
      mouse.targetX = -1000;
      mouse.targetY = -1000;
    };

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);

    // Draw Helper: Squircle / Rounded Rect
    const drawSquircle = (
      c: CanvasRenderingContext2D,
      x: number,
      y: number,
      w: number,
      h: number,
      r: number,
    ) => {
      c.beginPath();
      if (typeof c.roundRect === "function") {
        c.roundRect(x - w / 2, y - h / 2, w, h, r);
      } else {
        // Fallback for legacy browsers
        const hW = w / 2;
        const hH = h / 2;
        c.moveTo(x - hW + r, y - hH);
        c.lineTo(x + hW - r, y - hH);
        c.arcTo(x + hW, y - hH, x + hW, y - hH + r, r);
        c.lineTo(x + hW, y + hH - r);
        c.arcTo(x + hW, y + hH, x + hW - r, y + hH, r);
        c.lineTo(x - hW + r, y + hH);
        c.arcTo(x - hW, y + hH, x - hW, y + hH - r, r);
        c.lineTo(x - hW, y - hH + r);
        c.arcTo(x - hW, y - hH, x - hW + r, y - hH, r);
        c.closePath();
      }
    };

    // Calculate organic wave elevation at position X
    const getWaveY = (
      x: number,
      t: number,
      freq: number,
      amp: number,
      phase: number,
    ) => {
      const baseWave =
        Math.sin(x * freq + t + phase) * amp +
        Math.cos(x * freq * 1.8 - t * 0.7) * (amp * 0.35);

      // Mouse proximity wave deflection effect
      let mouseDistFactor = 0;
      if (mouse.active) {
        const dx = x - mouse.x;
        const dist = Math.abs(dx);
        if (dist < 120) {
          const dy = mouse.y - height / 2;
          mouseDistFactor =
            Math.cos((dist / 120) * (Math.PI / 2)) * (dy * 0.35);
        }
      }

      return height / 2 + baseWave + mouseDistFactor;
    };

    // Main 60fps Render Loop
    const render = () => {
      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      const colors = getThemeColors();
      time += isReducedMotion ? 0 : 0.025;

      // Smooth mouse target tracking
      mouse.x += (mouse.targetX - mouse.x) * 0.1;
      mouse.y += (mouse.targetY - mouse.y) * 0.1;

      // 1. Center baseline
      ctx.strokeStyle = colors.gridLine;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.stroke();

      // 2. Render Layered Multi-Frequency Wave Ribbons
      const ribbonConfigs = [
        {
          color: colors.isDark ? "#5865F2" : "#404EED",
          freq: 0.012,
          amp: 18,
          phase: time,
          alpha: 0.35,
        },
        {
          color: colors.isDark ? "#10B981" : "#059669",
          freq: 0.009,
          amp: 24,
          phase: time * 0.8 + 1.5,
          alpha: 0.25,
        },
        {
          color: colors.isDark ? "#007AFF" : "#0056B3",
          freq: 0.015,
          amp: 14,
          phase: time * 1.2 + 3.0,
          alpha: 0.3,
        },
      ];

      ribbonConfigs.forEach((cfg) => {
        ctx.beginPath();
        ctx.moveTo(0, height / 2);

        for (let x = 0; x <= width; x += 4) {
          const y = getWaveY(x, cfg.phase, cfg.freq, cfg.amp, 0);
          ctx.lineTo(x, y);
        }

        // Horizontal gradient stroke fading at left/right edges
        const strokeGrad = ctx.createLinearGradient(0, 0, width, 0);
        strokeGrad.addColorStop(0, "transparent");
        strokeGrad.addColorStop(0.15, cfg.color);
        strokeGrad.addColorStop(0.85, cfg.color);
        strokeGrad.addColorStop(1, "transparent");

        ctx.strokeStyle = strokeGrad;
        ctx.globalAlpha = cfg.alpha;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Fill subtle gradient under the wave with edge fade
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.closePath();

        const grad = ctx.createLinearGradient(0, height / 2 - 30, 0, height);
        grad.addColorStop(0, cfg.color);
        grad.addColorStop(1, "transparent");

        ctx.fillStyle = grad;
        ctx.globalAlpha = cfg.alpha * 0.2;
        ctx.fill();
        ctx.globalAlpha = 1.0;
      });

      // 3. Update & Draw Floating Channel Tags
      channels.forEach((ch, idx) => {
        // Calculate dynamic wave anchor point for this tag
        const currentWaveY = getWaveY(
          ch.targetX,
          time * 0.9 + ch.phaseOffset,
          0.011,
          20,
          ch.phaseOffset,
        );

        if (isReducedMotion) {
          ch.x = ch.targetX;
          ch.y = currentWaveY;
        } else {
          // Subtle hover floating motion
          const floatOffset = Math.sin(time * 1.5 + idx * 1.8) * 3;
          const targetYWithFloat = currentWaveY + floatOffset;

          // Mouse attraction/repulsion physics
          let pushX = 0;
          let pushY = 0;
          if (mouse.active) {
            const dx = ch.x - mouse.x;
            const dy = ch.y - mouse.y;
            const dist = Math.hypot(dx, dy);
            if (dist < 90 && dist > 0) {
              const force = (1 - dist / 90) * 12;
              pushX = (dx / dist) * force;
              pushY = (dy / dist) * force;
            }
          }

          // Spring physics position integration
          const k = 0.08;
          const damping = 0.82;

          const ax = (ch.targetX + pushX - ch.x) * k;
          const ay = (targetYWithFloat + pushY - ch.y) * k;

          ch.vx = (ch.vx + ax) * damping;
          ch.vy = (ch.vy + ay) * damping;

          ch.x += ch.vx;
          ch.y += ch.vy;
        }

        // Draw connecting audio-spectrum vertical stem line to baseline
        ctx.strokeStyle = colors.isDark ? ch.brandColor : ch.lightBrandColor;
        ctx.globalAlpha = 0.3;
        ctx.lineWidth = 1;
        ctx.setLineDash([2, 3]);
        ctx.beginPath();
        ctx.moveTo(ch.x, ch.y);
        ctx.lineTo(ch.x, height / 2);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.globalAlpha = 1.0;

        // Render Tag Squircle Glass Pill
        ctx.save();
        ctx.translate(ch.x, ch.y);

        const pillW = 82;
        const pillH = 28;
        const pillR = 14;

        // Glass background
        drawSquircle(ctx, 0, 0, pillW, pillH, pillR);
        ctx.fillStyle = colors.cardBg;
        ctx.fill();

        // Border with channel accent hint
        ctx.strokeStyle = colors.isDark ? ch.brandColor : ch.lightBrandColor;
        ctx.lineWidth = 1.2;
        ctx.globalAlpha = colors.isDark ? 0.6 : 0.8;
        ctx.stroke();
        ctx.globalAlpha = 1.0;

        // Channel Label Text
        ctx.fillStyle = colors.foreground;
        ctx.font = "600 11px var(--font-geist-mono), ui-monospace, monospace";
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.fillText(ch.label, -pillW / 2 + 10, 0);

        // Animated Mini 3-Bar Spectrum Visualizer inside the pill
        const barStartX = pillW / 2 - 18;
        const barColor = colors.isDark ? ch.brandColor : ch.lightBrandColor;

        ch.bars.forEach((b, bIdx) => {
          // Dynamic height modulation
          const barHeight = isReducedMotion
            ? 8 * b
            : Math.max(3, Math.sin(time * 4 + idx + bIdx * 1.2) * 6 * b + 6);

          const bx = barStartX + bIdx * 4;
          const by = -barHeight / 2;

          ctx.fillStyle = barColor;
          ctx.fillRect(bx, by, 2.5, barHeight);
        });

        ctx.restore();
      });

      ctx.restore();

      if (!isReducedMotion) {
        animFrameId = requestAnimationFrame(render);
      }
    };

    render();

    // Clean unmount
    return () => {
      cancelAnimationFrame(animFrameId);
      resizeObserver.disconnect();
      reducedMotionQuery.removeEventListener("change", handleMotionChange);
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-full flex items-center justify-center relative overflow-hidden select-none"
      style={{ minHeight: "128px" }}
    >
      <canvas
        ref={canvasRef}
        className="block w-full h-full pointer-events-auto cursor-crosshair"
      />
    </div>
  );
}
