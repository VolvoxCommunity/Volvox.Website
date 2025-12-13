"use client";

import { useState } from "react";
import { CaretDown } from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import type { FaqItem } from "@/lib/types";

interface ProductFaqProps {
  faq: FaqItem[];
}

/**
 * FAQ section with accordion-style expandable items.
 */
export function ProductFaq({ faq }: ProductFaqProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (faq.length === 0) {
    return null;
  }

  return (
    <section id="faq" className="py-16 px-4">
      <div className="container mx-auto max-w-4xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-8">
          Frequently Asked Questions
        </h2>
        <div className="space-y-3">
          {faq.map((item, idx) => (
            <div
              key={idx}
              className="border border-border/50 rounded-lg overflow-hidden bg-card/50"
            >
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/50 transition-colors"
                aria-expanded={openIndex === idx}
              >
                <span className="font-medium pr-4">{item.question}</span>
                <CaretDown
                  weight="bold"
                  className={cn(
                    "h-5 w-5 flex-shrink-0 transition-transform duration-200",
                    openIndex === idx && "rotate-180"
                  )}
                />
              </button>
              <AnimatePresence>
                {openIndex === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="px-4 pb-4 text-muted-foreground">
                      {item.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
