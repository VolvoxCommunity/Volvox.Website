import type {
  HTMLAttributes,
  ImgHTMLAttributes,
  ReactElement,
  AnchorHTMLAttributes,
} from "react";
import { isValidElement } from "react";
import { Callout, CodeBlock, ImageZoom, CustomLink } from "@/components/mdx";
import { HeadingWithAnchor } from "@/components/blog/heading-with-anchor";

// Type guard to check if a value is a React element with props
function isReactElementWithProps(
  value: unknown
): value is ReactElement<{ className?: string; filename?: string }> {
  return (
    isValidElement(value) &&
    typeof value.props === "object" &&
    value.props !== null
  );
}

// Type guard for checkbox input elements
function isCheckboxElement(
  value: unknown
): value is ReactElement<{ type: string }> {
  return (
    isValidElement(value) &&
    typeof value.props === "object" &&
    value.props !== null &&
    "type" in value.props
  );
}

// Extended img props to include data-caption
interface ImgPropsWithCaption extends ImgHTMLAttributes<HTMLImageElement> {
  "data-caption"?: string;
}

export const mdxComponents = {
  // Custom components that can be used directly in MDX
  Callout,

  // Custom link component
  a: (props: AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <CustomLink {...props} />
  ),

  // Headings with anchor links
  h2: (props: HTMLAttributes<HTMLHeadingElement>) => (
    <HeadingWithAnchor as="h2" {...props} />
  ),
  h3: (props: HTMLAttributes<HTMLHeadingElement>) => (
    <HeadingWithAnchor as="h3" {...props} />
  ),

  // Override default HTML elements
  pre: ({ children }: HTMLAttributes<HTMLPreElement>) => {
    // Extract the code element and its props
    const className = isReactElementWithProps(children)
      ? children.props.className || ""
      : "";
    const filename = isReactElementWithProps(children)
      ? children.props.filename
      : undefined;

    return (
      <CodeBlock className={className} filename={filename}>
        {children}
      </CodeBlock>
    );
  },

  code: ({ children, className, ...props }: HTMLAttributes<HTMLElement>) => {
    // Inline code (not in pre)
    if (!className) {
      return <code {...props}>{children}</code>;
    }
    // Code block (will be wrapped by pre)
    return (
      <code className={className} {...props}>
        {children}
      </code>
    );
  },

  img: ({ src, alt, width, height, ...props }: ImgPropsWithCaption) => {
    // Use caption from data attribute if provided
    const caption = props["data-caption"];
    const srcString = typeof src === "string" ? src : "unknown";

    // Development warning for accessibility: missing or generic alt text
    if (process.env.NODE_ENV === "development") {
      const genericAltPatterns =
        /^(image|photo|picture|img|graphic|icon|banner|screenshot)$/i;
      if (!alt || alt.trim() === "") {
        console.warn(
          `[A11Y Warning] Image missing alt text: ${srcString}\n` +
            'Add descriptive alt text for screen readers, or use alt="" for decorative images.'
        );
      } else if (genericAltPatterns.test(alt.trim())) {
        console.warn(
          `[A11Y Warning] Image has generic alt text "${alt}": ${srcString}\n` +
            "Use descriptive alt text that conveys the image's meaning or purpose."
        );
      }
    }

    return (
      <ImageZoom
        src={srcString}
        alt={alt || ""}
        width={
          typeof width === "string"
            ? Number.parseInt(width, 10) || undefined
            : width
        }
        height={
          typeof height === "string"
            ? Number.parseInt(height, 10) || undefined
            : height
        }
        caption={caption}
      />
    );
  },

  // Enhanced table styling
  table: ({ children, ...props }: HTMLAttributes<HTMLTableElement>) => (
    <div className="overflow-x-auto my-6">
      <table className="min-w-full" {...props}>
        {children}
      </table>
    </div>
  ),

  // Task lists
  li: ({ children, ...props }: HTMLAttributes<HTMLLIElement>) => {
    // Check if this is a task list item
    // In Markdown task lists, children is typically an array like [checkbox, text]
    const childArray = Array.isArray(children) ? children : [children];
    const firstChild = childArray[0] as unknown;

    if (isCheckboxElement(firstChild) && firstChild.props.type === "checkbox") {
      return (
        <li className="flex items-start gap-2 list-none" {...props}>
          {children}
        </li>
      );
    }
    return <li {...props}>{children}</li>;
  },
};
