import Link from "next/link";
import { AnchorHTMLAttributes } from "react";
import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

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

  const isInternal = href.startsWith("/") || href.startsWith("#");

  if (isInternal) {
    return (
      <Link
        href={href}
        className={cn(
          "font-medium underline underline-offset-4 decoration-border hover:decoration-primary transition-colors",
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
        "font-medium underline underline-offset-4 decoration-border hover:decoration-primary transition-colors inline-flex items-center gap-0.5",
        className
      )}
      {...props}
    >
      {children}
      <ExternalLink
        className="h-3 w-3 inline-block ml-0.5"
        aria-hidden="true"
      />
    </a>
  );
}
