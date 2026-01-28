"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// --- 1. TUNED CONSTANTS (Physics Configuration) ---
const PRESS_GROW_MS = 450;
const MINIMUM_PRESS_MS = 300;
const INITIAL_ORIGIN_SCALE = 0.2;
const PADDING = 10;
const SOFT_EDGE_MINIMUM_SIZE = 75;
const SOFT_EDGE_CONTAINER_RATIO = 0.35;
const ANIMATION_FILL = "forwards";
const TOUCH_DELAY_MS = 150;

const EASING_STANDARD = "cubic-bezier(0.2, 0, 0, 1)";

// --- 2. TYPES & STATE MACHINE ---
enum RippleState {
  INACTIVE,
  TOUCH_DELAY,
  HOLDING,
  WAITING_FOR_CLICK,
}

// --- 3. THE HOOK (FIXED) ---
const useMaterialRipple = (disabled = false) => {
  const [hovered, setHovered] = React.useState(false);
  const [pressed, setPressed] = React.useState(false);

  const surfaceRef = React.useRef<HTMLDivElement>(null);
  const rippleEffectRef = React.useRef<HTMLDivElement>(null);

  const stateRef = React.useRef(RippleState.INACTIVE);
  const rippleStartEventRef = React.useRef<React.PointerEvent | null>(null);
  const growAnimationRef = React.useRef<Animation | null>(null);

  const initialSizeRef = React.useRef(0);
  const rippleScaleRef = React.useRef("");
  const rippleSizeRef = React.useRef("");

  const isTouch = (event: React.PointerEvent) => event.pointerType === "touch";

  const shouldReactToEvent = (event: React.PointerEvent) => {
    if (disabled || !event.isPrimary) return false;
    if (
      rippleStartEventRef.current &&
      rippleStartEventRef.current.pointerId !== event.pointerId
    ) {
      return false;
    }
    if (event.type === "pointerenter" || event.type === "pointerleave") {
      return !isTouch(event);
    }
    const isPrimaryButton = event.buttons === 1;
    return isTouch(event) || isPrimaryButton;
  };

  const determineRippleSize = () => {
    if (!surfaceRef.current) return;
    const { height, width } = surfaceRef.current.getBoundingClientRect();
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
    if (!surfaceRef.current)
      return { startPoint: { x: 0, y: 0 }, endPoint: { x: 0, y: 0 } };
    const { height, width, left, top } =
      surfaceRef.current.getBoundingClientRect();

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
    // FIXED: Always set pressed state first, regardless of refs
    setPressed(true);

    // Only run animation if refs are available (for ripple effect)
    if (!rippleEffectRef.current) return;

    growAnimationRef.current?.cancel();
    determineRippleSize();

    const { startPoint, endPoint } = getTranslationCoordinates(event);

    growAnimationRef.current = rippleEffectRef.current.animate(
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
        easing: EASING_STANDARD,
        fill: ANIMATION_FILL,
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

    if (pressAnimationPlayState < MINIMUM_PRESS_MS) {
      await new Promise((resolve) => {
        setTimeout(resolve, MINIMUM_PRESS_MS - pressAnimationPlayState);
      });
    }

    if (growAnimationRef.current !== animation) {
      return;
    }

    // Always clear pressed state
    setPressed(false);
  };

  const handlePointerDown = async (event: React.PointerEvent) => {
    if (!shouldReactToEvent(event)) return;
    rippleStartEventRef.current = event;

    if (!isTouch(event)) {
      stateRef.current = RippleState.WAITING_FOR_CLICK;
      startPressAnimation(event);
      return;
    }

    stateRef.current = RippleState.TOUCH_DELAY;
    void (await new Promise((resolve) => setTimeout(resolve, TOUCH_DELAY_MS)));

    if (stateRef.current !== RippleState.TOUCH_DELAY) {
      return;
    }

    stateRef.current = RippleState.HOLDING;
    startPressAnimation(event);
  };

  const handlePointerUp = (event: React.PointerEvent) => {
    if (!shouldReactToEvent(event)) return;
    if (stateRef.current === RippleState.HOLDING) {
      stateRef.current = RippleState.WAITING_FOR_CLICK;
      return;
    }
    if (stateRef.current === RippleState.TOUCH_DELAY) {
      stateRef.current = RippleState.WAITING_FOR_CLICK;
      startPressAnimation(rippleStartEventRef.current || undefined);
      return;
    }
  };

  const handlePointerEnter = (event: React.PointerEvent) => {
    if (!shouldReactToEvent(event)) return;
    setHovered(true);
  };

  const handlePointerLeave = (event: React.PointerEvent) => {
    if (!shouldReactToEvent(event)) return;
    setHovered(false);
    if (stateRef.current !== RippleState.INACTIVE) {
      void endPressAnimation();
    }
  };

  const handleClick = () => {
    if (disabled) return;
    if (stateRef.current === RippleState.WAITING_FOR_CLICK) {
      void endPressAnimation();
      return;
    }
    if (stateRef.current === RippleState.INACTIVE) {
      startPressAnimation();
      void endPressAnimation();
    }
  };

  return {
    surfaceRef,
    rippleEffectRef,
    hovered,
    pressed,
    events: {
      onPointerDown: handlePointerDown,
      onPointerUp: handlePointerUp,
      onPointerEnter: handlePointerEnter,
      onPointerLeave: handlePointerLeave,
      onClick: handleClick,
      onKeyDown: (e: React.KeyboardEvent) => {
        if (e.key === "Enter" || e.key === " ") void handleClick();
      },
    },
  };
};

// --- 4. RIPPLE COMPONENT ---
const Ripple = React.forwardRef<
  HTMLDivElement,
  {
    hovered: boolean;
    pressed: boolean;
    rippleEffectRef: React.RefObject<HTMLDivElement | null>;
  }
>(({ hovered, pressed, rippleEffectRef }, ref) => {
  return (
    <div
      ref={ref}
      className="absolute inset-0 overflow-hidden rounded-[inherit] pointer-events-none z-0 surface"
      aria-hidden="true"
    >
      <div
        className={cn(
          "absolute inset-0 bg-current transition-opacity duration-[15ms] linear",
          hovered ? "opacity-[0.08]" : "opacity-0"
        )}
      />
      <div
        ref={rippleEffectRef}
        className="absolute rounded-full opacity-0 bg-current"
        style={{
          background:
            "radial-gradient(closest-side, currentColor max(calc(100% - 70px), 65%), transparent 100%)",
          transition: "opacity 375ms linear",
          opacity: pressed ? "0.12" : "0",
          transitionDuration: pressed ? "105ms" : "375ms",
        }}
      />
    </div>
  );
});
Ripple.displayName = "Ripple";

// --- 5. BUTTON COMPONENT ---
const buttonVariants = cva(
  "group relative inline-flex items-center justify-center whitespace-nowrap text-sm font-medium tracking-[0.01em] transition-all duration-600 delay-50 ease-[cubic-bezier(0.2,0,0,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-38 disabled:shadow-none",
  {
    variants: {
      variant: {
        // MATERIAL VARIANTS
        filled: "bg-primary text-primary-foreground shadow-sm",
        elevated:
          "bg-card text-primary shadow-md data-[pressed=true]:shadow-none",
        tonal: "bg-secondary text-secondary-foreground shadow-none",
        outlined:
          "border border-border bg-transparent text-primary shadow-none",
        text: "bg-transparent text-primary shadow-none",
        destructive: "bg-destructive text-destructive-foreground shadow-sm",

        // LEGACY MAPPINGS
        default: "bg-primary text-primary-foreground shadow-sm",
        outline: "border border-border bg-transparent text-primary shadow-none",
        secondary: "bg-secondary text-secondary-foreground shadow-none",
        ghost: "bg-transparent text-primary shadow-none",
        link: "bg-transparent text-primary shadow-none underline hover:underline",
        accent: "bg-accent text-accent-foreground shadow-sm",
      },
      size: {
        default: "h-10 px-6",
        sm: "h-8 px-4 text-xs",
        lg: "h-12 px-8 text-base",
        icon: "h-10 w-10",
        fab: "h-14 w-14 text-base",
      },
      shape: {
        round:
          "rounded-full data-[pressed=true]:rounded-xl data-[pressed=true]:duration-0 data-[pressed=true]:delay-0",
        square:
          "rounded-xl data-[pressed=true]:rounded-xl data-[pressed=true]:duration-0 data-[pressed=true]:delay-0",
      },
    },
    defaultVariants: {
      variant: "filled",
      size: "default",
      shape: "round",
    },
  }
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  noRipple?: boolean;
  noMorph?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      shape,
      asChild = false,
      noRipple = false,
      noMorph = false,
      onClick,
      style,
      children,
      ...props
    },
    ref
  ) => {
    // Optimization: If both visual effects are disabled, disable the hook logic
    const isRippleLogicDisabled = props.disabled || (noRipple && noMorph);
    const { surfaceRef, rippleEffectRef, hovered, pressed, events } =
      useMaterialRipple(isRippleLogicDisabled);

    // Common props for both Button and Slot
    const componentProps = {
      className: cn(buttonVariants({ variant, size, shape, className })),
      style: style,
      "data-pressed": noMorph ? undefined : pressed,
      ...events,
      onClick: (e: React.MouseEvent<HTMLButtonElement>) => {
        events.onClick();
        onClick?.(e);
      },
      ...props,
    };

    // RENDER LOGIC:
    if (asChild) {
      const child = React.Children.only(children) as React.ReactElement<{
        children: React.ReactNode;
      }>;

      return (
        <Slot ref={ref} {...componentProps}>
          {React.cloneElement(child, {
            children: (
              <>
                {/* Inject Ripple inside the custom child */}
                {!noRipple && (
                  <Ripple
                    ref={surfaceRef}
                    rippleEffectRef={rippleEffectRef}
                    hovered={hovered}
                    pressed={pressed}
                  />
                )}
                {/* Wrap content to ensure z-index layering above ripple */}
                <span className="relative z-10 flex items-center gap-2 pointer-events-none">
                  {child.props.children}
                </span>
              </>
            ),
          })}
        </Slot>
      );
    }

    return (
      <button ref={ref} {...componentProps}>
        {!noRipple && (
          <Ripple
            ref={surfaceRef}
            rippleEffectRef={rippleEffectRef}
            hovered={hovered}
            pressed={pressed}
          />
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
