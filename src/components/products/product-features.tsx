"use client";

import { CheckCircle } from "@phosphor-icons/react";
import { motion } from "framer-motion";

interface ProductFeaturesProps {
  features: string[];
}

interface FeatureItem {
  feature: string;
  key: string;
}

export function buildFeatureItems(features: string[]): FeatureItem[] {
  const occurrenceCounts = new Map<string, number>();

  return features.map((feature) => {
    const occurrence = occurrenceCounts.get(feature) ?? 0;
    occurrenceCounts.set(feature, occurrence + 1);

    return {
      feature,
      key: `${feature.length}:${feature}:${occurrence}`,
    };
  });
}

/**
 * Features section displaying product capabilities as an animated checklist.
 */
export function ProductFeatures({ features }: ProductFeaturesProps) {
  if (features.length === 0) {
    return null;
  }

  const featureItems = buildFeatureItems(features);

  return (
    <section id="features" className="py-16 px-4 scroll-mt-32">
      <div className="container mx-auto max-w-4xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-8">Features</h2>
        <ul className="grid gap-4 md:grid-cols-2">
          {featureItems.map(({ feature, key }, idx) => (
            <motion.li
              key={key}
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
