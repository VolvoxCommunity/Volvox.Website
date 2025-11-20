import type { HTMLAttributes, ImgHTMLAttributes } from "react";
import { Callout, CodeBlock, ImageZoom } from "@/components/mdx";
import { HeadingWithAnchor } from "@/components/blog/heading-with-anchor";

export const mdxComponents = {
  // Custom components that can be used directly in MDX
  Callout,

  // Headings with anchor links
  h2: (props: HTMLAttributes<HTMLHeadingElement>) => (
    <HeadingWithAnchor as="h2" {...props} />
  ),
  h3: (props: HTMLAttributes<HTMLHeadingElement>) => (
    <HeadingWithAnchor as="h3" {...props} />
  ),

  // Override default HTML elements
  pre: ({ children, ...props }: HTMLAttributes<HTMLPreElement>) => {
    // Extract the code element and its props
    const codeElement = (children as any)?.props;
    const className = codeElement?.className || "";
    const filename = codeElement?.filename;

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

  img: ({ src, alt, width, height, ...props }: ImgHTMLAttributes<HTMLImageElement>) => {
    // Use caption from data attribute if provided
    const caption = (props as any)["data-caption"];

    return (
      <ImageZoom
        src={src || ""}
        alt={alt || ""}
        width={typeof width === "string" ? parseInt(width) : width}
        height={typeof height === "string" ? parseInt(height) : height}
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
    if (typeof children === "object" && (children as any)?.props?.type === "checkbox") {
      return (
        <li className="flex items-start gap-2 list-none" {...props}>
          {children}
        </li>
      );
    }
    return <li {...props}>{children}</li>;
  },
};
