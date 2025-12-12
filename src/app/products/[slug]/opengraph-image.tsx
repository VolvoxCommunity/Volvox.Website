import { generateProductSocialImage, getLogoData } from "@/lib/social-images";
import { getExtendedProductBySlug } from "@/lib/content";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Volvox Product";

/**
 * Generates a dynamic OpenGraph image for each product page.
 * Displays product name, tagline, tech stack, and Volvox branding.
 */
export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getExtendedProductBySlug(slug);
  const logoData = getLogoData();

  const productData = product
    ? {
        name: product.name,
        tagline: product.tagline,
        techStack: product.techStack,
      }
    : null;

  return generateProductSocialImage(productData, logoData);
}
