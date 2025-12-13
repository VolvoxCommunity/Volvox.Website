"use client";

import { useState } from "react";
import Image from "next/image";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X } from "lucide-react";

interface ImageZoomProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  caption?: string;
}

/**
 * Renders a thumbnail image that opens a centered, zoomable dialog when activated.
 *
 * The thumbnail is keyboard- and mouse-interactive (Enter/Space or click) and displays
 * an optional caption. When `width` and `height` are provided, the image is rendered
 * with those dimensions to preserve aspect ratio; otherwise a responsive fallback image is used.
 *
 * @param src - Image source URL
 * @param alt - Alternative text used for accessibility and as a fallback caption
 * @param width - Optional explicit image width used for sizing when provided together with `height`
 * @param height - Optional explicit image height used for sizing when provided together with `width`
 * @param caption - Optional caption displayed below the thumbnail (falls back to `alt` when omitted)
 * @returns A React element that renders the interactive thumbnail and zoom dialog
 */
export function ImageZoom({
  src,
  alt,
  width,
  height,
  caption,
}: ImageZoomProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Thumbnail */}
      <figure className="my-8">
        <button
          type="button"
          className="relative rounded-lg overflow-hidden border border-border shadow-sm cursor-zoom-in hover:shadow-md transition-shadow duration-200 w-full"
          onClick={() => setIsOpen(true)}
          aria-label={`Expand image: ${alt}`}
        >
          {width && height ? (
            <Image
              src={src}
              alt={alt}
              width={width}
              height={height}
              className="w-full h-auto"
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={src} alt={alt} className="w-full h-auto" />
          )}
        </button>
        {(caption || alt) && (
          <figcaption className="mt-3 text-center text-sm text-muted-foreground italic">
            {caption || alt}
          </figcaption>
        )}
      </figure>

      {/* Zoom Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent
          className="max-w-7xl w-[95vw] h-[95vh] p-0 bg-background/95 backdrop-blur-lg"
          showCloseButton={false}
        >
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 z-50 rounded-full bg-background/80 p-3 border border-border hover:bg-background transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </button>
          <div className="relative flex items-center justify-center w-full h-full p-8">
            {width && height ? (
              <Image
                src={src}
                alt={alt}
                width={width}
                height={height}
                className="max-w-full max-h-full object-contain"
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={src}
                alt={alt}
                className="max-w-full max-h-full object-contain"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
