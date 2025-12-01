import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Callout } from "@/components/mdx/callout";
import { CustomLink } from "@/components/mdx/link";
import { CodeBlock } from "@/components/mdx/code-block";

jest.mock("next/image", () => ({
  __esModule: true,
  // eslint-disable-next-line @next/next/no-img-element
  default: (props: any) => <img alt="" {...props} />,
}));

describe("MDX Components", () => {
  it("Callout renders", () => {
    render(<Callout>Content Body</Callout>);
    expect(screen.getByText("Content Body")).toBeInTheDocument();
    expect(screen.getByText("Info")).toBeInTheDocument();
  });

  it("CustomLink renders internal link", () => {
    render(<CustomLink href="/foo">Link</CustomLink>);
    expect(screen.getByText("Link")).toHaveAttribute("href", "/foo");
  });

  it("CustomLink renders external link", () => {
    render(<CustomLink href="http://example.com">Ext</CustomLink>);
    const link = screen.getByText("Ext");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("CodeBlock renders code", () => {
    render(<CodeBlock className="language-js">const a = 1;</CodeBlock>);
    expect(screen.getByText("const a = 1;")).toBeInTheDocument();
    expect(screen.getByText("js")).toBeInTheDocument();
  });

  it("CodeBlock copy button", async () => {
    const writeText = jest.fn();
    Object.assign(navigator, {
      clipboard: { writeText },
    });

    render(<CodeBlock>const a = 1;</CodeBlock>);
    const copyBtn = screen.getByLabelText("Copy code");
    fireEvent.click(copyBtn);
    expect(writeText).toHaveBeenCalledWith("const a = 1;");
  });
});
