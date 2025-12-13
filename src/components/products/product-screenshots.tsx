"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface ProductScreenshotsProps {
  slug: string;
  screenshots: string[];
  productName: string;
}

/**
 * Screenshot gallery with lightbox functionality.
 */
export function ProductScreenshots({
  slug,
  screenshots,
  productName,
}: ProductScreenshotsProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Filter out hero image (index 0) - gallery only shows additional screenshots
  const galleryImages = screenshots.slice(1);

  if (galleryImages.length === 0) {
    return null;
  }

  return (
    <section id="screenshots" className="py-16 px-4">
      <div className="container mx-auto max-w-4xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-8">Screenshots</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {galleryImages.map((screenshot, idx) => {
            const imagePath = `/images/product/${slug}/${screenshot}`;
            return (
              <motion.button
                key={screenshot}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => setSelectedImage(imagePath)}
                className="relative aspect-video rounded-lg overflow-hidden bg-muted border border-border/50 hover:border-primary/50 transition-colors cursor-zoom-in"
              >
                <Image
                  src={imagePath}
                  alt={`${productName} screenshot ${idx + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
              </motion.button>
            );
          })}
        </div>

        {/* Lightbox */}
        <Dialog
          open={!!selectedImage}
          onOpenChange={() => setSelectedImage(null)}
        >
          <DialogContent
            className="max-w-4xl p-0 bg-black/95 border-none"
            showCloseButton={false}
          >
            <VisuallyHidden>
              <DialogTitle>Screenshot Preview</DialogTitle>
              <DialogDescription>
                Full size screenshot of {productName}
              </DialogDescription>
            </VisuallyHidden>
            <button
              type="button"
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              aria-label="Close"
            >
              <X className="h-5 w-5 text-white" />
            </button>
            <AnimatePresence>
              {selectedImage && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="relative aspect-video"
                >
                  <Image
                    src={selectedImage}
                    alt="Screenshot preview"
                    fill
                    className="object-contain"
                    sizes="100vw"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}
