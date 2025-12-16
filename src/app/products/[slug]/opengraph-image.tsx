import {
  generateProductSocialImage,
  getLogoData,
  getProductScreenshotData,
} from "@/lib/social-images";
import { getExtendedProductBySlug } from "@/lib/content";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Volvox Product";

/**
 * Generates a dynamic OpenGraph image for each product page.
 * Features product name, tagline, tech stack, hero screenshot, and Volvox branding
 * with a gradient background and enhanced visual design.
 */
export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getExtendedProductBySlug(slug);
  const logoData = getLogoData();

  // Get the first screenshot (hero) if available
  const screenshotFilename = product?.screenshots?.[0];
  const screenshotData =
    screenshotFilename && product
      ? getProductScreenshotData(slug, screenshotFilename)
      : null;

  const productData = product
    ? {
        name: product.name,
        tagline: product.tagline,
        techStack: product.techStack,
        screenshotData,
      }
    : null;

  return generateProductSocialImage(productData, logoData);
}
