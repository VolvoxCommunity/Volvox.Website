import { render, screen } from "@testing-library/react";
import { Blog } from "@/components/blog";
import type { BlogPost } from "@/lib/types";
import * as React from "react";

// Mocks
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
    const { alt = "", ...rest } = props;
    /* eslint-disable-next-line @next/next/no-img-element */
    return <img alt={alt} {...rest} />;
  },
}));

interface MotionProps {
  children: React.ReactNode;
  [key: string]: unknown;
}

jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: MotionProps) => (
      <div {...(props as React.HTMLAttributes<HTMLDivElement>)}>{children}</div>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

describe("Blog Accessibility", () => {
  const mockPost: BlogPost = {
    id: "1",
    slug: "a11y-post",
    title: "Accessible Blog Post",
    excerpt: "This is a test for accessibility.",
    date: "2023-01-01",
    author: { id: "1", name: "Palette", role: "UX", avatar: "/palette.png" },
    tags: ["a11y", "testing"],
    content: "## Content\n\nSome accessible content.",
    published: true,
    views: 0,
  };

  it("renders blog cards as accessible links", () => {
    render(<Blog posts={[mockPost]} />);

    // Check if the card is wrapped in a link with proper href
    const cardLink = screen.getByRole("link", {
      name: /Accessible Blog Post/i,
    });

    expect(cardLink).toBeInTheDocument();
    expect(cardLink).toHaveAttribute("href", "/blog/a11y-post");
  });

  it("displays post title for screen readers", () => {
    render(<Blog posts={[mockPost]} />);

    // The title should be visible and accessible
    expect(screen.getByText("Accessible Blog Post")).toBeInTheDocument();
  });

  it("displays author name", () => {
    render(<Blog posts={[mockPost]} />);

    // Author name should be visible
    expect(screen.getByText("Palette")).toBeInTheDocument();
  });

  it("renders View All Posts link", () => {
    render(<Blog posts={[mockPost]} />);

    const viewAllLink = screen.getByRole("link", { name: /View All Posts/i });
    expect(viewAllLink).toBeInTheDocument();
    expect(viewAllLink).toHaveAttribute("href", "/blog");
  });
});
