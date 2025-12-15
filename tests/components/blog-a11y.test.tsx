/* eslint-disable @typescript-eslint/no-unused-vars */
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
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
  whileHover?: unknown;
  whileInView?: unknown;
  viewport?: unknown;
  initial?: unknown;
  animate?: unknown;
  exit?: unknown;
  transition?: unknown;
  [key: string]: unknown;
}

jest.mock("framer-motion", () => ({
  motion: {
    div: ({
      children,
      whileHover,
      whileInView,
      viewport,
      initial,
      animate,
      exit,
      transition,
      ...props
    }: MotionProps) => (
      <div {...(props as React.HTMLAttributes<HTMLDivElement>)}>{children}</div>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

jest.mock("react-markdown", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

jest.mock("rehype-highlight", () => () => {});
jest.mock("remark-gfm", () => () => {});

// Mock Dialog components to make sure they render in JSDOM environment without issues
jest.mock("@/components/ui/dialog", () => {
  return {
    Dialog: ({ open, children }: { open: boolean; children: React.ReactNode }) => (
      <>{open && <div role="dialog">{children}</div>}</>
    ),
    DialogContent: ({ children }: { children: React.ReactNode }) => (
      <div>{children}</div>
    ),
    DialogHeader: ({ children }: { children: React.ReactNode }) => (
      <div>{children}</div>
    ),
    DialogTitle: ({ children }: { children: React.ReactNode }) => (
      <h2>{children}</h2>
    ),
  };
});

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

  it("renders blog cards as accessible buttons", () => {
    render(<Blog posts={[mockPost]} />);

    // Check if the card has role="button" and proper label
    const cardButton = screen.getByRole("button", {
      name: /Read post: Accessible Blog Post/i,
    });

    expect(cardButton).toBeInTheDocument();
    expect(cardButton).toHaveAttribute("tabIndex", "0");
  });

  it("opens the blog post dialog on Enter key press", async () => {
    render(<Blog posts={[mockPost]} />);

    const cardButton = screen.getByRole("button", {
      name: /Read post: Accessible Blog Post/i,
    });

    // Simulate Enter key press
    fireEvent.keyDown(cardButton, { key: "Enter", code: "Enter" });

    // Check if dialog content appears
    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
      // Check for content that is unique to the dialog content (like the body text)
      expect(screen.getByText(/Some accessible content/)).toBeInTheDocument();
    });
  });

  it("opens the blog post dialog on Space key press", async () => {
    render(<Blog posts={[mockPost]} />);

    const cardButton = screen.getByRole("button", {
      name: /Read post: Accessible Blog Post/i,
    });

    // Simulate Space key press
    fireEvent.keyDown(cardButton, { key: " ", code: "Space" });

    // Check if dialog content appears
    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });
  });
});
