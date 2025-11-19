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
        <div
          className="relative rounded-lg overflow-hidden border border-border shadow-sm cursor-zoom-in hover:shadow-md transition-shadow duration-200"
          onClick={() => setIsOpen(true)}
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
            <img src={src} alt={alt} className="w-full h-auto" />
          )}
        </div>
        {(caption || alt) && (
          <figcaption className="mt-3 text-center text-sm text-muted-foreground italic">
            {caption || alt}
          </figcaption>
        )}
      </figure>

      {/* Zoom Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-7xl w-[95vw] h-[95vh] p-0 bg-background/95 backdrop-blur-lg">
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 z-50 rounded-full bg-background/80 p-2 border border-border hover:bg-background transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="flex items-center justify-center w-full h-full p-8">
            {width && height ? (
              <Image
                src={src}
                alt={alt}
                width={width}
                height={height}
                className="max-w-full max-h-full object-contain"
              />
            ) : (
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
