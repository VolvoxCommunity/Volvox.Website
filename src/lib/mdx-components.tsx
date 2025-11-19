import { Callout, CodeBlock, ImageZoom } from "@/components/mdx";
import { HeadingWithAnchor } from "@/components/blog/heading-with-anchor";

export const mdxComponents = {
  // Custom components that can be used directly in MDX
  Callout,

  // Headings with anchor links
  h2: (props: any) => <HeadingWithAnchor as="h2" {...props} />,
  h3: (props: any) => <HeadingWithAnchor as="h3" {...props} />,

  // Override default HTML elements
  pre: ({ children, ...props }: any) => {
    // Extract the code element and its props
    const codeElement = children?.props;
    const className = codeElement?.className || "";
    const filename = codeElement?.filename;

    return (
      <CodeBlock className={className} filename={filename}>
        {children}
      </CodeBlock>
    );
  },

  code: ({ children, className, ...props }: any) => {
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

  img: ({ src, alt, width, height, ...props }: any) => {
    // Use caption from data attribute if provided
    const caption = props["data-caption"];

    return (
      <ImageZoom
        src={src || ""}
        alt={alt || ""}
        width={width}
        height={height}
        caption={caption}
      />
    );
  },

  // Enhanced table styling
  table: ({ children, ...props }: any) => (
    <div className="overflow-x-auto my-6">
      <table className="min-w-full" {...props}>
        {children}
      </table>
    </div>
  ),

  // Task lists
  li: ({ children, ...props }: any) => {
    // Check if this is a task list item
    if (typeof children === "object" && children?.props?.type === "checkbox") {
      return (
        <li className="flex items-start gap-2 list-none" {...props}>
          {children}
        </li>
      );
    }
    return <li {...props}>{children}</li>;
  },
};
