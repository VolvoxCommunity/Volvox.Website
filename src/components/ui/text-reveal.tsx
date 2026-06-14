"use client";

import { motion, useInView, type Variants } from "framer-motion";
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
  const keyedItems = items.map((item, itemIndex) => ({
    id: `${item}-${itemIndex}`,
    value: item,
  }));

  const container: Variants = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: {
        staggerChildren:
          keyedItems.length > 0 ? duration / keyedItems.length : 0,
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
      {keyedItems.map((item) => (
        <motion.span
          variants={childVariants}
          style={{
            display: "inline-block",
            marginRight: variant === "word" ? "0.25em" : "0",
          }}
          key={item.id}
        >
          {item.value}
        </motion.span>
      ))}
    </motion.span>
  );
}
