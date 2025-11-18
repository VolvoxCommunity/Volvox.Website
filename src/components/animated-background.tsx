"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  opacity: number;
  pulseSpeed: number;
  pulsePhase: number;
}

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;
    const particles: Particle[] = [];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", handleMouseMove);

    const colors = [
      "rgba(100, 70, 255, 0.6)",
      "rgba(200, 100, 255, 0.6)",
      "rgba(120, 180, 255, 0.6)",
      "rgba(150, 120, 255, 0.6)",
      "rgba(180, 100, 255, 0.6)",
    ];

    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 4 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: Math.random() * 0.5 + 0.3,
        pulseSpeed: Math.random() * 0.02 + 0.01,
        pulsePhase: Math.random() * Math.PI * 2,
      });
    }

    const gradients = [
      {
        x: 0.2,
        y: 0.3,
        color1: "rgba(100, 70, 255, 0.15)",
        color2: "rgba(100, 70, 255, 0)",
      },
      {
        x: 0.8,
        y: 0.4,
        color1: "rgba(200, 100, 255, 0.12)",
        color2: "rgba(200, 100, 255, 0)",
      },
      {
        x: 0.5,
        y: 0.7,
        color1: "rgba(120, 180, 255, 0.1)",
        color2: "rgba(120, 180, 255, 0)",
      },
      {
        x: 0.6,
        y: 0.2,
        color1: "rgba(150, 120, 255, 0.11)",
        color2: "rgba(150, 120, 255, 0)",
      },
      {
        x: 0.3,
        y: 0.8,
        color1: "rgba(180, 100, 255, 0.09)",
        color2: "rgba(180, 100, 255, 0)",
      },
    ];

    const animate = () => {
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      time += 0.0008;

      gradients.forEach((grad, index) => {
        const offsetX = Math.sin(time + index * 2.5) * 150;
        const offsetY = Math.cos(time * 0.7 + index * 2.5) * 150;

        const x = canvas.width * grad.x + offsetX;
        const y = canvas.height * grad.y + offsetY;
        const radius = Math.min(canvas.width, canvas.height) * 0.5;

        const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
        gradient.addColorStop(0, grad.color1);
        gradient.addColorStop(1, grad.color2);

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      });

      particles.forEach((particle, index) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        const dx = mouseRef.current.x - particle.x;
        const dy = mouseRef.current.y - particle.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 150) {
          const force = (150 - dist) / 150;
          particle.x -= (dx / dist) * force * 2;
          particle.y -= (dy / dist) * force * 2;
        }

        const pulse = Math.sin(time * 5 + particle.pulsePhase) * 0.3 + 0.7;
        const finalSize = particle.size * pulse;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, finalSize, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();

        particles.forEach((otherParticle, otherIndex) => {
          if (index === otherIndex) return;

          const dx = otherParticle.x - particle.x;
          const dy = otherParticle.y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 120) {
            const opacity = (1 - distance / 120) * 0.2;
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.strokeStyle = `rgba(150, 120, 255, ${opacity})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        });
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ opacity: 0.6 }}
    />
  );
}
