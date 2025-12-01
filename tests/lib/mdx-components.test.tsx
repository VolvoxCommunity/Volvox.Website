import { render, screen } from "@testing-library/react";
import { mdxComponents } from "@/lib/mdx-components";
import type { ReactNode } from "react";

interface MockCalloutProps {
  children: ReactNode;
}

interface MockCodeBlockProps {
  children: ReactNode;
  className?: string;
  filename?: string;
}

interface MockImageZoomProps {
  src: string;
  alt: string;
}

interface MockCustomLinkProps {
  children: ReactNode;
  href: string;
}

interface MockHeadingProps {
  as: string;
  children: ReactNode;
}

jest.mock("@/components/mdx", () => ({
  Callout: ({ children }: MockCalloutProps) => <div>Callout: {children}</div>,
  CodeBlock: ({ children, className, filename }: MockCodeBlockProps) => (
    <div data-testid="codeblock" className={className} data-filename={filename}>
      {children}
    </div>
  ),
  // eslint-disable-next-line @next/next/no-img-element
  ImageZoom: ({ src, alt }: MockImageZoomProps) => <img src={src} alt={alt} />,
  CustomLink: ({ children, href }: MockCustomLinkProps) => (
    <a href={href}>{children}</a>
  ),
}));

jest.mock("@/components/blog/heading-with-anchor", () => ({
  HeadingWithAnchor: ({ as, children }: MockHeadingProps) => (
    <div data-testid={`heading-${as}`}>{children}</div>
  ),
}));

describe("mdxComponents", () => {
  it("renders a", () => {
    const Component = mdxComponents.a;
    render(<Component href="/foo">Link</Component>);
    expect(screen.getByText("Link")).toHaveAttribute("href", "/foo");
  });

  it("renders h2", () => {
    const Component = mdxComponents.h2;
    render(<Component>Heading</Component>);
    expect(screen.getByTestId("heading-h2")).toHaveTextContent("Heading");
  });

  it("renders h3", () => {
    const Component = mdxComponents.h3;
    render(<Component>Heading</Component>);
    expect(screen.getByTestId("heading-h3")).toHaveTextContent("Heading");
  });

  it("renders pre with code block", () => {
    const Component = mdxComponents.pre;
    const code = <code className="language-js">console.log(1)</code>;
    render(<Component>{code}</Component>);
    const block = screen.getByTestId("codeblock");
    expect(block).toHaveClass("language-js");
  });

  it("renders pre with filename", () => {
    const Component = mdxComponents.pre;
    // The mdx-components.tsx extracts 'filename' from children.props.filename
    // So we need to pass filename as a prop, not data-filename
    const CodeWithFilename = (props: {
      className?: string;
      filename?: string;
    }) => <code {...props}>console.log(1)</code>;
    render(
      <Component>
        <CodeWithFilename className="language-js" filename="test.js" />
      </Component>
    );
    const block = screen.getByTestId("codeblock");
    expect(block).toHaveAttribute("data-filename", "test.js");
  });

  it("renders code inline", () => {
    const Component = mdxComponents.code;
    render(<Component>inline</Component>);
    expect(screen.getByText("inline").tagName).toBe("CODE");
  });

  it("renders code block (if used directly)", () => {
    const Component = mdxComponents.code;
    render(<Component className="language-js">block</Component>);
    expect(screen.getByText("block").tagName).toBe("CODE");
    expect(screen.getByText("block")).toHaveClass("language-js");
  });

  it("renders img with zoom", () => {
    const Component = mdxComponents.img;
    render(<Component src="/img.jpg" alt="Alt" />);
    expect(screen.getByRole("img")).toHaveAttribute("src", "/img.jpg");
  });

  it("renders table", () => {
    const Component = mdxComponents.table;
    render(
      <Component>
        <tbody>
          <tr>
            <td>Cell</td>
          </tr>
        </tbody>
      </Component>
    );
    expect(screen.getByRole("table")).toBeInTheDocument();
  });

  it("renders li", () => {
    const Component = mdxComponents.li;
    render(<Component>List Item</Component>);
    expect(screen.getByText("List Item").tagName).toBe("LI");
  });

  it("renders checkbox li", () => {
    const Component = mdxComponents.li;
    const checkbox = <input type="checkbox" readOnly checked />;
    render(<Component>{checkbox} Task</Component>);
    expect(screen.getByRole("checkbox")).toBeChecked();
    expect(screen.getByRole("listitem")).toHaveClass("list-none");
  });
});
