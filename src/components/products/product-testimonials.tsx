"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Quotes } from "@phosphor-icons/react";
import type { Testimonial } from "@/lib/types";

interface ProductTestimonialsProps {
  testimonials: Testimonial[];
}

/**
 * Testimonials section displaying user feedback in card format.
 */
export function ProductTestimonials({
  testimonials,
}: ProductTestimonialsProps) {
  if (testimonials.length === 0) {
    return null;
  }

  return (
    <section id="testimonials" className="py-16 px-4">
      <div className="container mx-auto max-w-4xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-8">
          What People Are Saying
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          {testimonials.map((testimonial, idx) => (
            <motion.div
              key={testimonial.quote}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="p-6 rounded-xl bg-card/50 border border-border/50"
            >
              <Quotes weight="fill" className="h-8 w-8 text-primary/30 mb-4" />
              <p className="text-base leading-relaxed mb-4">
                {testimonial.quote}
              </p>
              <div className="flex items-center gap-3">
                {testimonial.avatar ? (
                  <Image
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-semibold text-primary">
                      {testimonial.name.charAt(0)}
                    </span>
                  </div>
                )}
                <div>
                  <div className="font-medium">{testimonial.name}</div>
                  {testimonial.role && (
                    <div className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
