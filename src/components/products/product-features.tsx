"use client";

import { CheckCircle } from "@phosphor-icons/react";
import { motion } from "framer-motion";

interface ProductFeaturesProps {
  features: string[];
}

/**
 * Features section displaying product capabilities as an animated checklist.
 */
export function ProductFeatures({ features }: ProductFeaturesProps) {
  return (
    <section id="features" className="py-16 px-4 scroll-mt-32">
      <div className="container mx-auto max-w-4xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-8">Features</h2>
        <ul className="grid gap-4 md:grid-cols-2">
          {features.map((feature, idx) => (
            <motion.li
              key={feature}
              className="flex items-start gap-3 p-4 rounded-lg bg-card/50 border border-border/50"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <CheckCircle
                weight="fill"
                className="h-6 w-6 text-primary mt-0.5 flex-shrink-0"
              />
              <span className="text-base leading-relaxed">{feature}</span>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
