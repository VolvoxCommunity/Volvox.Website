import { useEffect, useRef } from "react";
import confettiLib from "canvas-confetti";

export function useConfettiEasterEggs(elementSelectors: string[]) {
  const cleanupFnsRef = useRef<(() => void)[]>([]);

  useEffect(() => {
    const numEasterEggs = Math.min(
      Math.floor(Math.random() * 3) + 2,
      elementSelectors.length
    );

    const shuffled = [...elementSelectors].sort(() => Math.random() - 0.5);
    const selectedSelectors = shuffled.slice(0, numEasterEggs);

    selectedSelectors.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length > 0) {
        const randomIndex = Math.floor(Math.random() * elements.length);
        const element = elements[randomIndex] as HTMLElement;

        const confettiVariations = [
          () => {
            confettiLib({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 },
            });
          },
          () => {
            const count = 200;
            const defaults = {
              origin: { y: 0.7 },
            };

            function fire(particleRatio: number, opts: confettiLib.Options) {
              confettiLib({
                ...defaults,
                ...opts,
                particleCount: Math.floor(count * particleRatio),
              });
            }

            fire(0.25, {
              spread: 26,
              startVelocity: 55,
            });
            fire(0.2, {
              spread: 60,
            });
            fire(0.35, {
              spread: 100,
              decay: 0.91,
              scalar: 0.8,
            });
            fire(0.1, {
              spread: 120,
              startVelocity: 25,
              decay: 0.92,
              scalar: 1.2,
            });
            fire(0.1, {
              spread: 120,
              startVelocity: 45,
            });
          },
          () => {
            confettiLib({
              particleCount: 150,
              angle: 60,
              spread: 55,
              origin: { x: 0 },
            });
            confettiLib({
              particleCount: 150,
              angle: 120,
              spread: 55,
              origin: { x: 1 },
            });
          },
          () => {
            const duration = 2000;
            const animationEnd = Date.now() + duration;
            const colors = ["#667eea", "#764ba2", "#f093fb", "#4facfe"];

            const frame = () => {
              confettiLib({
                particleCount: 2,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: colors,
              });
              confettiLib({
                particleCount: 2,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: colors,
              });

              if (Date.now() < animationEnd) {
                requestAnimationFrame(frame);
              }
            };
            frame();
          },
          () => {
            confettiLib({
              particleCount: 100,
              startVelocity: 30,
              spread: 360,
              ticks: 60,
              origin: {
                x: Math.random(),
                y: Math.random() - 0.2,
              },
            });
          },
          () => {
            const defaults = {
              spread: 360,
              ticks: 50,
              gravity: 0,
              decay: 0.94,
              startVelocity: 30,
            };

            confettiLib({
              ...defaults,
              particleCount: 40,
              scalar: 1.2,
              shapes: ["star"],
            });

            confettiLib({
              ...defaults,
              particleCount: 10,
              scalar: 0.75,
              shapes: ["circle"],
            });
          },
        ];

        const randomConfetti =
          confettiVariations[
            Math.floor(Math.random() * confettiVariations.length)
          ];

        const handleClick = (e: Event) => {
          e.stopPropagation();
          randomConfetti();
        };

        element.addEventListener("click", handleClick);
        element.style.cursor = "pointer";

        cleanupFnsRef.current.push(() => {
          element.removeEventListener("click", handleClick);
          element.style.cursor = "";
        });
      }
    });

    return () => {
      cleanupFnsRef.current.forEach((cleanup) => cleanup());
      cleanupFnsRef.current = [];
    };
  }, [elementSelectors]);
}
