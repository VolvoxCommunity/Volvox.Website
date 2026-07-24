"use client";

import { useEffect, useRef } from "react";

interface TeamMemberCell {
  id: string;
  label: string;
  icon: string;
  colorKey: "primary" | "secondary" | "accent" | "muted";
  // Current render state
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  targetW: number;
  targetH: number;
  rotation: number;
  targetRot: number;
  // Phase target coordinates
  targetX: number;
  targetY: number;
}

export function TeamFluidCanvas(): React.JSX.Element {
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

    // Check reduced motion preference
    const reducedMotionQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    let isReducedMotion = reducedMotionQuery.matches;

    const handleMotionChange = (e: MediaQueryListEvent) => {
      isReducedMotion = e.matches;
    };
    reducedMotionQuery.addEventListener("change", handleMotionChange);

    // Initial cells configuration representing flexible skill sets
    const cells: TeamMemberCell[] = [
      {
        id: "dev",
        label: "DEV",
        icon: "</>",
        colorKey: "primary",
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        width: 68,
        height: 38,
        targetW: 68,
        targetH: 38,
        rotation: 0,
        targetRot: 0,
        targetX: 0,
        targetY: 0,
      },
      {
        id: "dsgn",
        label: "DSGN",
        icon: "✎",
        colorKey: "secondary",
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        width: 68,
        height: 38,
        targetW: 68,
        targetH: 38,
        rotation: 0,
        targetRot: 0,
        targetX: 0,
        targetY: 0,
      },
      {
        id: "arch",
        label: "ARCH",
        icon: "⚡",
        colorKey: "accent",
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        width: 68,
        height: 38,
        targetW: 68,
        targetH: 38,
        rotation: 0,
        targetRot: 0,
        targetX: 0,
        targetY: 0,
      },
      {
        id: "ops",
        label: "SUPP",
        icon: "◈",
        colorKey: "muted",
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        width: 64,
        height: 36,
        targetW: 64,
        targetH: 36,
        rotation: 0,
        targetRot: 0,
        targetX: 0,
        targetY: 0,
      },
    ];

    // Read CSS theme colors dynamically
    const getThemeColors = () => {
      const computed = getComputedStyle(container);
      const isDark = document.documentElement.classList.contains("dark");

      return {
        primary:
          computed.getPropertyValue("--primary").trim() ||
          (isDark ? "#40a3ff" : "#0068d9"),
        secondary:
          computed.getPropertyValue("--secondary").trim() ||
          (isDark ? "#d28aff" : "#9b3fca"),
        accent:
          computed.getPropertyValue("--accent").trim() ||
          (isDark ? "#ff9f0a" : "#ff9500"),
        muted:
          computed.getPropertyValue("--muted-foreground").trim() || "#626d7d",
        foreground:
          computed.getPropertyValue("--foreground").trim() ||
          (isDark ? "#ffffff" : "#000000"),
        border:
          computed.getPropertyValue("--border").trim() ||
          "rgba(255,255,255,0.1)",
        isDark,
      };
    };

    // Responsive Canvas Size Handler
    const updateSize = () => {
      const rect = container.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      // Set initial positions relative to canvas center
      const cx = width / 2;
      const cy = height / 2;

      cells.forEach((cell, idx) => {
        if (cell.x === 0 && cell.y === 0) {
          cell.x = cx + (idx - 1.5) * 30;
          cell.y = cy + (idx % 2 === 0 ? -15 : 15);
        }
      });
    };

    updateSize();

    const resizeObserver = new ResizeObserver(() => {
      updateSize();
    });
    resizeObserver.observe(container);

    // Animation & State Machine Variables
    let phase = 0; // 0: Unified Pod, 1: Adaptive Line, 2: Orbit Cluster
    let phaseTimer = 0;
    const PHASE_DURATION = 260; // Frames per phase (~4.3 seconds at 60fps)
    let time = 0;

    // Helper: Draw smooth rounded rectangle (squircle style)
    const drawSquircle = (
      c: CanvasRenderingContext2D,
      x: number,
      y: number,
      w: number,
      h: number,
      r: number,
    ) => {
      c.beginPath();
      c.roundRect(x - w / 2, y - h / 2, w, h, r);
    };

    // Calculate Phase Target Positions
    const updatePhaseTargets = () => {
      const cx = width / 2;
      const cy = height / 2;

      if (phase === 0) {
        // Phase 0: Unified Compact Pod (Project Alignment)
        cells[0].targetX = cx - 36;
        cells[0].targetY = cy - 14;
        cells[0].targetRot = -0.05;
        cells[0].targetW = 72;
        cells[0].targetH = 40;

        cells[1].targetX = cx + 36;
        cells[1].targetY = cy - 14;
        cells[1].targetRot = 0.05;
        cells[1].targetW = 72;
        cells[1].targetH = 40;

        cells[2].targetX = cx - 22;
        cells[2].targetY = cy + 22;
        cells[2].targetRot = 0.04;
        cells[2].targetW = 68;
        cells[2].targetH = 36;

        cells[3].targetX = cx + 42;
        cells[3].targetY = cy + 22;
        cells[3].targetRot = -0.04;
        cells[3].targetW = 64;
        cells[3].targetH = 34;
      } else if (phase === 1) {
        // Phase 1: Adaptive Horizontal Pipeline (Specialized Expansion)
        const spacing = Math.min(width * 0.22, 75);
        cells[0].targetX = cx - spacing * 1.5;
        cells[0].targetY = cy;
        cells[0].targetRot = 0;
        cells[0].targetW = 66;
        cells[0].targetH = 38;

        cells[1].targetX = cx - spacing * 0.5;
        cells[1].targetY = cy;
        cells[1].targetRot = 0;
        cells[1].targetW = 66;
        cells[1].targetH = 38;

        cells[2].targetX = cx + spacing * 0.5;
        cells[2].targetY = cy;
        cells[2].targetRot = 0;
        cells[2].targetW = 66;
        cells[2].targetH = 38;

        cells[3].targetX = cx + spacing * 1.5;
        cells[3].targetY = cy;
        cells[3].targetRot = 0;
        cells[3].targetW = 62;
        cells[3].targetH = 36;
      } else {
        // Phase 2: Fluid Triangle Formation with Central Core
        cells[0].targetX = cx;
        cells[0].targetY = cy - 28;
        cells[0].targetRot = 0;
        cells[0].targetW = 74;
        cells[0].targetH = 40;

        cells[1].targetX = cx - 45;
        cells[1].targetY = cy + 20;
        cells[1].targetRot = -0.08;
        cells[1].targetW = 70;
        cells[1].targetH = 38;

        cells[2].targetX = cx + 45;
        cells[2].targetY = cy + 20;
        cells[2].targetRot = 0.08;
        cells[2].targetW = 70;
        cells[2].targetH = 38;

        cells[3].targetX = cx;
        cells[3].targetY = cy + 26;
        cells[3].targetRot = 0;
        cells[3].targetW = 60;
        cells[3].targetH = 32;
      }
    };

    // Main Render Loop
    const render = () => {
      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      const colors = getThemeColors();
      time += 0.02;

      if (!isReducedMotion) {
        phaseTimer++;
        if (phaseTimer >= PHASE_DURATION) {
          phaseTimer = 0;
          phase = (phase + 1) % 3;
        }
      }

      updatePhaseTargets();

      // 2. Physics step & position updating for each cell
      cells.forEach((cell, i) => {
        if (isReducedMotion) {
          cell.x = cell.targetX;
          cell.y = cell.targetY;
          cell.width = cell.targetW;
          cell.height = cell.targetH;
          cell.rotation = cell.targetRot;
        } else {
          // Organic sine/cos wave float offset
          const floatX = Math.sin(time + i * 1.7) * 2.5;
          const floatY = Math.cos(time * 0.9 + i * 2.1) * 2.5;

          // Spring physics interpolation towards target
          const k = 0.08; // Spring stiffness
          const damping = 0.78; // Damping ratio

          const ax = (cell.targetX + floatX - cell.x) * k;
          const ay = (cell.targetY + floatY - cell.y) * k;

          cell.vx = (cell.vx + ax) * damping;
          cell.vy = (cell.vy + ay) * damping;

          cell.x += cell.vx;
          cell.y += cell.vy;

          // Smooth dimensions & rotation interpolation
          cell.width += (cell.targetW - cell.width) * 0.1;
          cell.height += (cell.targetH - cell.height) * 0.1;
          cell.rotation += (cell.targetRot - cell.rotation) * 0.1;
        }
      });

      // 3. Draw fluid magnetic connection bridges between nearby cells
      for (let i = 0; i < cells.length; i++) {
        for (let j = i + 1; j < cells.length; j++) {
          const c1 = cells[i];
          const c2 = cells[j];
          const dx = c2.x - c1.x;
          const dy = c2.y - c1.y;
          const dist = Math.hypot(dx, dy);

          if (dist < 85) {
            const alpha = (1 - dist / 85) * 0.25;
            ctx.strokeStyle = colors.isDark
              ? `rgba(255, 255, 255, ${alpha})`
              : `rgba(0, 104, 217, ${alpha})`;
            ctx.lineWidth = Math.max(1, (1 - dist / 85) * 3);
            ctx.beginPath();
            ctx.moveTo(c1.x, c1.y);
            ctx.lineTo(c2.x, c2.y);
            ctx.stroke();
          }
        }
      }

      // 4. Draw individual Team Cells
      cells.forEach((cell) => {
        ctx.save();
        ctx.translate(cell.x, cell.y);
        ctx.rotate(cell.rotation);

        const colorHex = colors[cell.colorKey];

        // Glassmorphic / Card Background Fill
        drawSquircle(ctx, 0, 0, cell.width, cell.height, cell.height / 2);
        ctx.fillStyle = colors.isDark
          ? "rgba(22, 27, 34, 0.85)"
          : "rgba(255, 255, 255, 0.9)";
        ctx.fill();

        // Subtle Glow Border
        ctx.strokeStyle = colorHex;
        ctx.globalAlpha = colors.isDark ? 0.45 : 0.6;
        ctx.lineWidth = 1.2;
        ctx.stroke();
        ctx.globalAlpha = 1.0;

        // Content Layout: Icon + Monospace Role Label
        ctx.fillStyle = colorHex;
        ctx.font = "bold 11px var(--font-geist-mono), monospace";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        const textStr = `${cell.icon} ${cell.label}`;
        ctx.fillText(textStr, 0, 0);

        ctx.restore();
      });

      ctx.restore();

      if (!isReducedMotion) {
        animFrameId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animFrameId);
      resizeObserver.disconnect();
      reducedMotionQuery.removeEventListener("change", handleMotionChange);
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
        className="block w-full h-full pointer-events-none"
      />
    </div>
  );
}
