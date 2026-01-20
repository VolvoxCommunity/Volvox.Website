"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// --- 1. MATERIAL DESIGN TOKENS ---
const MATERIAL_THEME = {
  "--ease-standard": "cubic-bezier(0.2, 0, 0, 1)",
  "--shadow-elevation-1":
    "0px 1px 2px 0px rgba(0, 0, 0, 0.3), 0px 1px 3px 1px rgba(0, 0, 0, 0.15)",
  "--shadow-elevation-2":
    "0px 1px 2px 0px rgba(0, 0, 0, 0.3), 0px 2px 6px 2px rgba(0, 0, 0, 0.15)",
  "--ripple-hover-opacity": "0.16",
  "--ripple-pressed-opacity": "0.32",
} as React.CSSProperties;

// --- 2. RIPPLE & PHYSICS LOGIC ---
const PRESS_GROW_MS = 50;

// CRITICAL FIX: Increased Minimum Press Time
// We hold the 'pressed' state for at least 450ms.
// This gives the CSS transition (300ms) enough time to fully morph
// the shape before reverting, even on quick taps.
const MINIMUM_PRESS_MS = 280;

const INITIAL_ORIGIN_SCALE = 0.2;
const PADDING = 10;
const SOFT_EDGE_MINIMUM_SIZE = 75;
const SOFT_EDGE_CONTAINER_RATIO = 0.35;
const TOUCH_DELAY_MS = 150;

enum RippleState {
  INACTIVE,
  TOUCH_DELAY,
  HOLDING,
  WAITING_FOR_CLICK,
}

const useMaterialRipple = (disabled = false) => {
  const [hovered, setHovered] = React.useState(false);
  const [pressed, setPressed] = React.useState(false);
  const rippleRef = React.useRef<HTMLDivElement>(null);
  const stateRef = React.useRef(RippleState.INACTIVE);
  const rippleStartEventRef = React.useRef<React.PointerEvent | null>(null);
  const growAnimationRef = React.useRef<Animation | null>(null);
  const initialSizeRef = React.useRef(0);
  const rippleScaleRef = React.useRef("");
  const rippleSizeRef = React.useRef("");

  const determineRippleSize = () => {
    if (!rippleRef.current) return;
    const { height, width } = rippleRef.current.getBoundingClientRect();
    const maxDim = Math.max(height, width);
    const softEdgeSize = Math.max(
      SOFT_EDGE_CONTAINER_RATIO * maxDim,
      SOFT_EDGE_MINIMUM_SIZE
    );

    const initialSize = Math.floor(maxDim * INITIAL_ORIGIN_SCALE);
    const hypotenuse = Math.sqrt(width ** 2 + height ** 2);
    const maxRadius = hypotenuse + PADDING;

    initialSizeRef.current = initialSize;
    const rippleScale = (maxRadius + softEdgeSize) / initialSize;
    rippleScaleRef.current = `${rippleScale}`;
    rippleSizeRef.current = `${initialSize}px`;
  };

  const getTranslationCoordinates = (event?: React.PointerEvent) => {
    if (!rippleRef.current)
      return { startPoint: { x: 0, y: 0 }, endPoint: { x: 0, y: 0 } };
    const { height, width, left, top } =
      rippleRef.current.getBoundingClientRect();
    const endPoint = {
      x: (width - initialSizeRef.current) / 2,
      y: (height - initialSizeRef.current) / 2,
    };

    let startPoint;
    if (event) {
      startPoint = {
        x: event.clientX - left,
        y: event.clientY - top,
      };
    } else {
      startPoint = {
        x: width / 2,
        y: height / 2,
      };
    }

    startPoint = {
      x: startPoint.x - initialSizeRef.current / 2,
      y: startPoint.y - initialSizeRef.current / 2,
    };

    return { startPoint, endPoint };
  };

  const startPressAnimation = (event?: React.PointerEvent) => {
    if (!rippleRef.current) return;

    setPressed(true);
    growAnimationRef.current?.cancel();

    determineRippleSize();
    const { startPoint, endPoint } = getTranslationCoordinates(event);

    const rippleEffect = rippleRef.current.querySelector(".ripple-effect");
    if (!rippleEffect) return;

    growAnimationRef.current = rippleEffect.animate(
      {
        top: [0, 0],
        left: [0, 0],
        height: [rippleSizeRef.current, rippleSizeRef.current],
        width: [rippleSizeRef.current, rippleSizeRef.current],
        transform: [
          `translate(${startPoint.x}px, ${startPoint.y}px) scale(1)`,
          `translate(${endPoint.x}px, ${endPoint.y}px) scale(${rippleScaleRef.current})`,
        ],
      },
      {
        duration: PRESS_GROW_MS,
        easing: "cubic-bezier(0.2, 0, 0, 1)",
        fill: "forwards",
      }
    );
  };

  const endPressAnimation = async () => {
    rippleStartEventRef.current = null;
    stateRef.current = RippleState.INACTIVE;

    const animation = growAnimationRef.current;
    let pressAnimationPlayState = Infinity;

    if (animation && typeof animation.currentTime === "number") {
      pressAnimationPlayState = animation.currentTime;
    }

    // Logic: If the animation hasn't run for at least MINIMUM_PRESS_MS,
    // we wait the remaining time before setting pressed = false.
    if (pressAnimationPlayState < MINIMUM_PRESS_MS) {
      await new Promise((resolve) => {
        setTimeout(resolve, MINIMUM_PRESS_MS - pressAnimationPlayState);
      });
    }

    if (growAnimationRef.current !== animation) {
      return;
    }

    setPressed(false);
  };

  const handlePointerDown = async (event: React.PointerEvent) => {
    if (disabled) return;
    rippleStartEventRef.current = event;

    if (event.pointerType !== "touch") {
      stateRef.current = RippleState.WAITING_FOR_CLICK;
      startPressAnimation(event);
      return;
    }

    stateRef.current = RippleState.TOUCH_DELAY;
    await new Promise((resolve) => setTimeout(resolve, TOUCH_DELAY_MS));

    if (stateRef.current === RippleState.TOUCH_DELAY) {
      stateRef.current = RippleState.HOLDING;
      startPressAnimation(event);
    }
  };

  const handlePointerUp = () => {
    if (disabled) return;
    if (stateRef.current === RippleState.HOLDING) {
      stateRef.current = RippleState.WAITING_FOR_CLICK;
      return;
    }
    if (stateRef.current === RippleState.TOUCH_DELAY) {
      stateRef.current = RippleState.WAITING_FOR_CLICK;
      startPressAnimation(rippleStartEventRef.current || undefined);
    }
  };

  const handlePointerLeave = () => {
    setHovered(false);
    if (stateRef.current !== RippleState.INACTIVE) {
      void endPressAnimation();
    }
  };

  const handlePointerEnter = (e: React.PointerEvent) => {
    if (disabled || e.pointerType === "touch") return;
    setHovered(true);
  };

  const handleClick = () => {
    if (disabled) return;
    if (stateRef.current === RippleState.WAITING_FOR_CLICK) {
      void endPressAnimation();
    } else if (stateRef.current === RippleState.INACTIVE) {
      startPressAnimation();
      void endPressAnimation();
    }
  };

  return {
    rippleRef,
    hovered,
    pressed,
    events: {
      onPointerDown: handlePointerDown,
      onPointerUp: handlePointerUp,
      onPointerEnter: handlePointerEnter,
      onPointerLeave: handlePointerLeave,
      onClick: handleClick,
      onKeyDown: (e: React.KeyboardEvent) => {
        if (e.key === "Enter" || e.key === " ") {
          handleClick();
        }
      },
    },
  };
};

const Ripple = React.forwardRef<
  HTMLDivElement,
  { hovered: boolean; pressed: boolean }
>(({ hovered, pressed }, ref) => {
  return (
    <div
      ref={ref}
      className="absolute inset-0 overflow-hidden rounded-[inherit] pointer-events-none z-0"
      aria-hidden="true"
    >
      <div
        className={cn(
          "absolute inset-0 bg-current transition-opacity duration-200",
          hovered ? "opacity-[var(--ripple-hover-opacity)]" : "opacity-0"
        )}
      />
      <span
        className={cn(
          "ripple-effect absolute rounded-full opacity-0",
          "bg-[radial-gradient(circle,currentColor_45%,transparent_100%)]"
        )}
        style={{
          transition: "opacity 375ms linear",
          opacity: pressed ? "var(--ripple-pressed-opacity)" : "0",
        }}
      />
    </div>
  );
});
Ripple.displayName = "Ripple";

// --- 3. CVA CONFIGURATION ---
const buttonVariants = cva(
  // CRITICAL FIX: Increased duration to 300ms to allow shape morphing to be visible
  "group relative inline-flex items-center justify-center whitespace-nowrap text-sm font-medium tracking-[0.01em] transition-all duration-300 ease-[var(--ease-standard)] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-[0.38] disabled:shadow-none",
  {
    variants: {
      variant: {
        // MATERIAL VARIANTS
        filled:
          "bg-primary text-primary-foreground shadow-[var(--shadow-elevation-1)] hover:shadow-[var(--shadow-elevation-2)] active:shadow-[var(--shadow-elevation-1)]",
        elevated:
          "bg-card text-primary shadow-[var(--shadow-elevation-1)] hover:shadow-[var(--shadow-elevation-2)] active:shadow-[var(--shadow-elevation-1)]",
        tonal: "bg-secondary text-secondary-foreground hover:shadow-none",
        outlined:
          "border border-outline bg-transparent text-primary shadow-none",
        text: "bg-transparent text-primary shadow-none",

        // LEGACY MAPPINGS
        default:
          "bg-primary text-primary-foreground shadow-[var(--shadow-elevation-1)] hover:shadow-[var(--shadow-elevation-2)] active:shadow-[var(--shadow-elevation-1)]",
        destructive:
          "bg-destructive text-destructive-foreground shadow-[var(--shadow-elevation-1)] hover:shadow-[var(--shadow-elevation-2)] active:shadow-[var(--shadow-elevation-1)]",
        outline: "border border-border bg-transparent text-primary shadow-none",
        secondary: "bg-secondary text-secondary-foreground hover:shadow-none",
        ghost: "bg-transparent text-primary shadow-none",
        link: "bg-transparent text-primary shadow-none underline-offset-4 hover:underline",
        accent:
          "bg-accent text-accent-foreground shadow-[var(--shadow-elevation-1)] hover:shadow-[var(--shadow-elevation-2)] active:shadow-[var(--shadow-elevation-1)]",
      },
      size: {
        default: "h-10 px-6",
        sm: "h-8 px-4 text-xs",
        lg: "h-12 px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "filled",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  noRipple?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      noRipple = false,
      onClick,
      style,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    const { rippleRef, hovered, pressed, events } = useMaterialRipple(
      props.disabled || noRipple
    );

    if (asChild) {
      return (
        <Comp
          className={cn(
            buttonVariants({ variant, size, className }),
            // Expressive Shape Morphing:
            // Since MINIMUM_PRESS_MS is now 450ms and transition duration is 300ms,
            // even a short click will trigger the full morph to rounded-md before reverting.
            pressed ? "rounded-lg" : "rounded-full"
          )}
          ref={ref}
          style={{ ...MATERIAL_THEME, ...style }}
          {...events}
          onClick={(e) => {
            events.onClick();
            onClick?.(e as React.MouseEvent<HTMLButtonElement>);
          }}
          {...props}
        >
          {children}
        </Comp>
      );
    }

    return (
      <button
        className={cn(
          buttonVariants({ variant, size, className }),
          // Expressive Shape Morphing:
          // Since MINIMUM_PRESS_MS is now 450ms and transition duration is 300ms,
          // even a short click will trigger the full morph to rounded-2xl before reverting.
          pressed ? "rounded-lg" : "rounded-full"
        )}
        ref={ref}
        style={{ ...MATERIAL_THEME, ...style }}
        {...events}
        onClick={(e) => {
          events.onClick();
          onClick?.(e as React.MouseEvent<HTMLButtonElement>);
        }}
        {...props}
      >
        {!noRipple && (
          <Ripple ref={rippleRef} hovered={hovered} pressed={pressed} />
        )}
        <span className="relative z-10 flex items-center gap-2 pointer-events-none">
          {children}
        </span>
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
