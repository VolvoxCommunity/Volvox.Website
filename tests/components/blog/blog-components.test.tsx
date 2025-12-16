import { render, screen, fireEvent, act } from "@testing-library/react";
import { BackToPostsButton } from "@/components/blog/back-to-posts-button";
import { BlogContentWrapper } from "@/components/blog/blog-content-wrapper";
import { BlogNavigation } from "@/components/blog/blog-navigation";
import { BlogPostHeader } from "@/components/blog/blog-post-header";
import { HeadingWithAnchor } from "@/components/blog/heading-with-anchor";
import { ReadingProgress } from "@/components/blog/reading-progress";
import { ScrollReveal } from "@/components/blog/scroll-reveal";
import { TableOfContents } from "@/components/blog/table-of-contents";

// Mock next/image
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: Record<string, unknown>) => {
    const { alt = "", fill, priority, sizes, loading, ...rest } = props;
    void fill;
    void priority;
    void sizes;
    void loading;
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        alt={alt as string}
        {...(rest as React.ImgHTMLAttributes<HTMLImageElement>)}
      />
    );
  },
}));

// Mock next/link
jest.mock("next/link", () => ({
  __esModule: true,
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>,
}));

// Mock framer-motion
interface MotionProps {
  children?: React.ReactNode;
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

// Mock theme provider
const mockSetTheme = jest.fn();
jest.mock("@/components/providers/theme-provider", () => ({
  useTheme: () => ({
    theme: "light",
    setTheme: mockSetTheme,
  }),
}));

// Mock Navigation component
jest.mock("@/components/navigation", () => ({
  Navigation: ({ linkMode }: { linkMode?: boolean }) => (
    <nav data-testid="navigation" data-link-mode={linkMode}>
      Mock Navigation
    </nav>
  ),
}));

describe("Blog Components", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    const mockIntersectionObserver = jest.fn();
    mockIntersectionObserver.mockReturnValue({
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    });
    window.IntersectionObserver = mockIntersectionObserver;

    Object.defineProperty(window, "matchMedia", {
      value: jest.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
      writable: true,
    });
  });

  describe("BackToPostsButton", () => {
    beforeEach(() => {
      Object.defineProperty(window, "scrollY", {
        value: 0,
        writable: true,
      });
    });

    it("is hidden initially", () => {
      render(<BackToPostsButton />);
      expect(screen.queryByText("Back to All Posts")).not.toBeInTheDocument();
    });

    it("becomes visible after scrolling", () => {
      render(<BackToPostsButton />);
      act(() => {
        Object.defineProperty(window, "scrollY", {
          value: 400,
          writable: true,
        });
        window.dispatchEvent(new Event("scroll"));
      });
      expect(screen.getByText("Back to All Posts")).toBeInTheDocument();
    });
  });

  describe("BlogContentWrapper", () => {
    it("renders children", () => {
      render(
        <BlogContentWrapper>
          <div>Test Content</div>
        </BlogContentWrapper>
      );
      expect(screen.getByText("Test Content")).toBeInTheDocument();
    });
  });

  describe("BlogNavigation", () => {
    it("renders navigation with link mode", () => {
      render(<BlogNavigation />);
      const nav = screen.getByTestId("navigation");
      expect(nav).toHaveAttribute("data-link-mode", "true");
    });
  });

  describe("BlogPostHeader", () => {
    it("renders back to home link", () => {
      render(<BlogPostHeader />);
      expect(screen.getByText("Back to Home")).toBeInTheDocument();
    });

    it("renders Volvox branding", () => {
      render(<BlogPostHeader />);
      expect(screen.getByText("Volvox")).toBeInTheDocument();
    });

    it("calls setTheme when theme toggle is clicked", () => {
      render(<BlogPostHeader />);
      const toggleButton = screen.getByRole("button", {
        name: /switch to dark mode/i,
      });
      fireEvent.click(toggleButton);
      expect(mockSetTheme).toHaveBeenCalledWith("dark");
    });
  });

  describe("HeadingWithAnchor", () => {
    const mockWriteText = jest.fn().mockResolvedValue(undefined);

    beforeEach(() => {
      Object.assign(navigator, {
        clipboard: {
          writeText: mockWriteText,
        },
      });
    });

    it("renders heading with correct tag", () => {
      render(<HeadingWithAnchor as="h2">Test Heading</HeadingWithAnchor>);
      expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
        "Test Heading"
      );
    });

    it("generates id from text content", () => {
      render(<HeadingWithAnchor as="h2">My Test Heading</HeadingWithAnchor>);
      const heading = screen.getByRole("heading");
      expect(heading).toHaveAttribute("id", "my-test-heading");
    });

    it("copies link to clipboard on button click", () => {
      render(<HeadingWithAnchor as="h2">Test</HeadingWithAnchor>);
      const copyButton = screen.getByRole("button", {
        name: /copy link to heading/i,
      });
      fireEvent.click(copyButton);
      expect(mockWriteText).toHaveBeenCalled();
    });
  });

  describe("ReadingProgress", () => {
    beforeEach(() => {
      Object.defineProperty(document.documentElement, "scrollHeight", {
        value: 2000,
        configurable: true,
      });
      Object.defineProperty(window, "innerHeight", {
        value: 800,
        configurable: true,
      });
      Object.defineProperty(window, "scrollY", {
        value: 0,
        writable: true,
        configurable: true,
      });
    });

    it("renders progress bar", () => {
      render(<ReadingProgress />);
      expect(document.querySelector(".fixed")).toBeInTheDocument();
    });

    it("updates progress on scroll", () => {
      render(<ReadingProgress />);

      // Find the progress bar inner element (the one with width style)
      const progressBar = document.querySelector(".fixed > div") as HTMLElement;
      expect(progressBar).toBeInTheDocument();

      // Initially at 0% (scrollY is 0)
      expect(progressBar.style.width).toBe("0%");

      // Simulate scrolling to 50% (scrollY = 600 for scrollHeight 2000 - innerHeight 800 = 1200)
      act(() => {
        Object.defineProperty(window, "scrollY", {
          value: 600,
          writable: true,
          configurable: true,
        });
        window.dispatchEvent(new Event("scroll"));
      });

      // Progress should be 50%
      expect(progressBar.style.width).toBe("50%");
    });

    it("clamps progress to 100% at bottom of page", () => {
      render(<ReadingProgress />);

      const progressBar = document.querySelector(".fixed > div") as HTMLElement;

      // Scroll past the end
      act(() => {
        Object.defineProperty(window, "scrollY", {
          value: 1500,
          writable: true,
          configurable: true,
        });
        window.dispatchEvent(new Event("scroll"));
      });

      // Progress should be clamped to 100%
      expect(progressBar.style.width).toBe("100%");
    });
  });

  describe("ScrollReveal", () => {
    it("renders children", () => {
      render(
        <ScrollReveal>
          <div>Reveal Content</div>
        </ScrollReveal>
      );
      expect(screen.getByText("Reveal Content")).toBeInTheDocument();
    });

    it("clamps delay to max value", () => {
      render(
        <ScrollReveal delay={10000}>
          <div>Content</div>
        </ScrollReveal>
      );
      const wrapper = screen.getByText("Content").parentElement;
      expect(wrapper).toHaveStyle("transition-delay: 5000ms");
    });
  });

  describe("TableOfContents", () => {
    beforeEach(() => {
      document.body.innerHTML = "";
    });

    it("returns null when no article element", () => {
      const { container } = render(<TableOfContents />);
      expect(container.firstChild).toBeNull();
    });

    it("renders TOC when 3+ headings exist", async () => {
      document.body.innerHTML = `
        <article>
          <h2 id="heading-1">Heading 1</h2>
          <h2 id="heading-2">Heading 2</h2>
          <h3 id="heading-3">Heading 3</h3>
        </article>
      `;

      render(<TableOfContents />);

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      expect(screen.getByText("On This Page")).toBeInTheDocument();
    });
  });
});
