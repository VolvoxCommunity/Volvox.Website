"use client";

import type { HomepageReview } from "@/lib/types";
import { HeroSection } from "./hero/hero-section";

interface HeroProps {
  reviews?: HomepageReview[];
}

export function Hero({ reviews }: HeroProps) {
  return (
    <div className="flex flex-col w-full">
      <HeroSection reviews={reviews} />
    </div>
  );
}
