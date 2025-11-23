import Link from "next/link";
import { AnchorHTMLAttributes } from "react";
import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Render an anchor or Next.js Link with consistent styling and correct behavior for internal vs external URLs.
 *
 * Renders a plain <a> when `href` is falsy, a Next.js <Link> for internal targets (href starting with "/" or "#"), and an external <a> that opens in a new tab with an external-link icon for other URLs. Applies shared styling and forwards remaining anchor props.
 *
 * @param href - Destination URL; when falsy a plain anchor is rendered. Internal targets start with "/" or "#".
 * @param className - Additional CSS class names merged with the component's base styles.
 * @param children - Link contents.
 * @returns A React element: a Next.js Link for internal targets, a normal anchor that opens in a new tab for external targets, or a plain anchor if no `href` is provided.
 */
export function CustomLink({
  href,
  className,
  children,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement>) {
  if (!href) {
    return (
      <a className={className} {...props}>
        {children}
      </a>
    );
  }

  const isInternal =
    (href.startsWith("/") && !href.startsWith("//")) || href.startsWith("#");

  if (isInternal) {
    return (
      <Link
        href={href}
        className={cn(
          "font-medium text-primary underline underline-offset-4 decoration-border hover:decoration-primary transition-colors",
          className
        )}
        {...props}
      >
        {children}
      </Link>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "font-medium text-primary underline underline-offset-4 decoration-border hover:decoration-primary transition-colors inline-flex items-center gap-1",
        className
      )}
      {...props}
    >
      {children}
      <ExternalLink className="h-3 w-3 inline-block" aria-hidden="true" />
    </a>
  );
}
