"use client";

import { motion, useInView, Variants } from "framer-motion";
import { useRef } from "react";

const childVariants: Variants = {
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      damping: 12,
      stiffness: 100,
    },
  },
  hidden: {
    opacity: 0,
    y: 20,
    transition: {
      type: "spring",
      damping: 12,
      stiffness: 100,
    },
  },
};

interface TextRevealProps {
  text: string;
  className?: string;
  variant?: "word" | "char";
  delay?: number;
  duration?: number;
  once?: boolean;
}

export function TextReveal({
  text,
  className = "",
  variant = "word",
  delay = 0,
  duration = 0.5,
  once = true,
}: TextRevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.5, once });

  const items =
    variant === "word" ? text.split(" ").filter(Boolean) : text.split("");

  const container: Variants = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: {
        staggerChildren: items.length > 0 ? duration / items.length : 0,
        delayChildren: delay * i,
      },
    }),
  };

  return (
    <motion.span
      ref={ref}
      style={{ display: "inline-block" }}
      variants={container}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className={className}
    >
      {items.map((item, index) => (
        <motion.span
          variants={childVariants}
          style={{
            display: "inline-block",
            marginRight: variant === "word" ? "0.25em" : "0",
          }}
          key={index}
        >
          {item}
        </motion.span>
      ))}
    </motion.span>
  );
}
