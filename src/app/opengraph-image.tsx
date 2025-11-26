import { ImageResponse } from "next/og";
import {
  socialImageConfig,
  HomeSocialImageContent,
} from "@/lib/social-images";

export const runtime = socialImageConfig.runtime;
export const alt = "Volvox - Software Development & Learning Community";
export const size = socialImageConfig.size;
export const contentType = socialImageConfig.contentType;

/**
 * Generates a static OpenGraph image for the homepage.
 * Features Volvox branding with gradient background.
 *
 * @returns ImageResponse with branded social preview image
 */
export default function Image() {
  return new ImageResponse(<HomeSocialImageContent />, size);
}
