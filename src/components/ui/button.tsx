"use client";

import { ComponentProps, useRef, MouseEvent } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[colors,opacity,box-shadow] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive relative overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 before:absolute before:inset-0 before:rounded-md before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300 before:pointer-events-none before:bg-[radial-gradient(circle_150px_at_var(--mouse-x,50%)_var(--mouse-y,50%),rgba(255,255,255,0.15),transparent)]",
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60 before:absolute before:inset-0 before:rounded-md before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300 before:pointer-events-none before:bg-[radial-gradient(circle_150px_at_var(--mouse-x,50%)_var(--mouse-y,50%),rgba(255,255,255,0.15),transparent)]",
        outline:
          "border bg-background shadow-xs hover:bg-secondary hover:text-secondary-foreground dark:bg-input/30 dark:border-input before:absolute before:inset-0 before:rounded-md before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300 before:pointer-events-none before:bg-[radial-gradient(circle_150px_at_var(--mouse-x,50%)_var(--mouse-y,50%),rgba(var(--secondary-rgb,139,92,246),0.08),transparent)] dark:before:bg-[radial-gradient(circle_150px_at_var(--mouse-x,50%)_var(--mouse-y,50%),rgba(var(--secondary-rgb,139,92,246),0.12),transparent)]",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80 before:absolute before:inset-0 before:rounded-md before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300 before:pointer-events-none before:bg-[radial-gradient(circle_150px_at_var(--mouse-x,50%)_var(--mouse-y,50%),rgba(255,255,255,0.15),transparent)]",
        accent:
          "bg-accent text-accent-foreground shadow-xs hover:bg-accent/90 before:absolute before:inset-0 before:rounded-md before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300 before:pointer-events-none before:bg-[radial-gradient(circle_150px_at_var(--mouse-x,50%)_var(--mouse-y,50%),rgba(255,255,255,0.15),transparent)]",
        ghost:
          "hover:bg-secondary hover:text-secondary-foreground dark:hover:bg-secondary/50 before:absolute before:inset-0 before:rounded-md before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300 before:pointer-events-none before:bg-[radial-gradient(circle_120px_at_var(--mouse-x,50%)_var(--mouse-y,50%),rgba(var(--secondary-rgb,139,92,246),0.08),transparent)]",
        link: "text-secondary underline-offset-4 hover:underline overflow-visible before:hidden",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

/**
 * Interactive button component with various variants and sizes.
 * Supports rendering as a child component via `asChild` prop.
 *
 * @param props - Button properties including variant, size, and asChild
 * @returns Button element or the child element enhanced with button styles
 *
 * @example
 * ```tsx
 * <Button variant="default" size="lg" onClick={handleClick}>
 *   Click Me
 * </Button>
 * ```
 */
function Button({
  className,
  variant,
  size,
  asChild = false,
  onMouseMove,
  ...props
}: ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    buttonRef.current.style.setProperty("--mouse-x", `${x}px`);
    buttonRef.current.style.setProperty("--mouse-y", `${y}px`);

    if (onMouseMove) {
      onMouseMove(e);
    }
  };

  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      ref={buttonRef}
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      onMouseMove={handleMouseMove}
      {...props}
    />
  );
}

export { Button, buttonVariants };
