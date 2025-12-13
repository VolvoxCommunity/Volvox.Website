import { render, screen, fireEvent } from "@testing-library/react";
import { ProductHero } from "@/components/products/product-hero";
import { ProductFeatures } from "@/components/products/product-features";
import { ProductFaq } from "@/components/products/product-faq";
import { ProductTestimonials } from "@/components/products/product-testimonials";
import { ProductChangelog } from "@/components/products/product-changelog";
import { ProductScreenshots } from "@/components/products/product-screenshots";
import { ProductToc } from "@/components/products/product-toc";
import type { ExtendedProduct, FaqItem, Testimonial } from "@/lib/types";

// Mock next/image - filter out Next.js-specific props
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: Record<string, unknown>) => {
    const { alt = "", fill, priority, sizes, loading, ...rest } = props;
    void fill;
    void priority;
    void sizes;
    void loading;
    // eslint-disable-next-line @next/next/no-img-element
    return (
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
  children: React.ReactNode;
  [key: string]: unknown;
}

jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: MotionProps) => (
      <div {...(props as React.HTMLAttributes<HTMLDivElement>)}>{children}</div>
    ),
    li: ({ children, ...props }: MotionProps) => (
      <li {...(props as React.LiHTMLAttributes<HTMLLIElement>)}>{children}</li>
    ),
    button: ({ children, onClick, ...props }: MotionProps) => (
      <button
        type="button"
        onClick={onClick as () => void}
        {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
      >
        {children}
      </button>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

// Mock react-markdown
jest.mock("react-markdown", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="markdown-content">{children}</div>
  ),
}));
jest.mock("remark-gfm", () => () => {});

// Mock image-utils
jest.mock("@/lib/image-utils", () => ({
  resolveProductImagePath: (screenshot: string, slug: string) => {
    if (!screenshot) return null;
    return `/products/${slug}/${screenshot}`;
  },
}));

// Mock constants
jest.mock("@/lib/constants", () => ({
  NAV_HEIGHT: 64,
}));

describe("Product Components", () => {
  const mockProduct: ExtendedProduct = {
    id: "550e8400-e29b-41d4-a716-446655440000",
    name: "Test Product",
    slug: "test-product",
    tagline: "The best test product ever",
    description: "A great product for testing",
    longDescription: "An even longer description for testing purposes",
    features: ["Feature 1", "Feature 2", "Feature 3"],
    techStack: ["React", "TypeScript"],
    links: {
      github: "https://github.com/test/product",
      demo: "https://demo.example.com",
      appStore: "https://apps.apple.com/app/test",
      playStore: "https://play.google.com/store/apps/test",
    },
    screenshots: ["hero.png", "screen1.png", "screen2.png"],
    faq: [
      { question: "What is this?", answer: "A test product" },
      { question: "How does it work?", answer: "It just works" },
    ],
    testimonials: [
      { name: "John Doe", role: "Developer", quote: "Amazing product!" },
      { name: "Jane Smith", quote: "Love it!" },
    ],
  };

  describe("ProductHero", () => {
    it("renders product name and tagline", () => {
      render(<ProductHero product={mockProduct} />);
      expect(screen.getByText("Test Product")).toBeInTheDocument();
      expect(
        screen.getByText("The best test product ever")
      ).toBeInTheDocument();
    });

    it("renders App Store badge when link provided", () => {
      render(<ProductHero product={mockProduct} />);
      const appStoreLink = screen.getByLabelText(
        "Download Test Product on the App Store"
      );
      expect(appStoreLink).toBeInTheDocument();
    });

    it("renders fallback when no hero image", () => {
      const productNoImage = { ...mockProduct, screenshots: [] };
      render(<ProductHero product={productNoImage} />);
      expect(screen.getByText("T")).toBeInTheDocument();
    });
  });

  describe("ProductFeatures", () => {
    it("renders all features", () => {
      render(<ProductFeatures features={mockProduct.features} />);
      expect(screen.getByText("Features")).toBeInTheDocument();
      expect(screen.getByText("Feature 1")).toBeInTheDocument();
    });
  });

  describe("ProductFaq", () => {
    const faqItems: FaqItem[] = mockProduct.faq;

    it("renders FAQ section", () => {
      render(<ProductFaq faq={faqItems} />);
      expect(
        screen.getByText("Frequently Asked Questions")
      ).toBeInTheDocument();
    });

    it("expands answer on click", () => {
      render(<ProductFaq faq={faqItems} />);
      const questionButton = screen.getByText("What is this?");
      fireEvent.click(questionButton);
      expect(screen.getByText("A test product")).toBeInTheDocument();
    });

    it("returns null when faq is empty", () => {
      const { container } = render(<ProductFaq faq={[]} />);
      expect(container.firstChild).toBeNull();
    });
  });

  describe("ProductTestimonials", () => {
    const testimonials: Testimonial[] = mockProduct.testimonials;

    it("renders testimonials section", () => {
      render(<ProductTestimonials testimonials={testimonials} />);
      expect(screen.getByText("What People Are Saying")).toBeInTheDocument();
    });

    it("renders initials fallback when no avatar", () => {
      render(<ProductTestimonials testimonials={testimonials} />);
      expect(screen.getByText("JD")).toBeInTheDocument();
    });

    it("returns null when testimonials is empty", () => {
      const { container } = render(<ProductTestimonials testimonials={[]} />);
      expect(container.firstChild).toBeNull();
    });
  });

  describe("ProductChangelog", () => {
    it("renders changelog content", () => {
      render(<ProductChangelog content="# Changelog" />);
      expect(screen.getByTestId("markdown-content")).toBeInTheDocument();
    });

    it("returns null when content is null", () => {
      const { container } = render(<ProductChangelog content={null} />);
      expect(container.firstChild).toBeNull();
    });
  });

  describe("ProductScreenshots", () => {
    it("renders screenshots section", () => {
      render(
        <ProductScreenshots
          slug="test-product"
          screenshots={mockProduct.screenshots}
          productName="Test Product"
        />
      );
      expect(screen.getByText("Screenshots")).toBeInTheDocument();
    });

    it("returns null when no screenshots", () => {
      const { container } = render(
        <ProductScreenshots
          slug="test-product"
          screenshots={[]}
          productName="Test Product"
        />
      );
      expect(container.firstChild).toBeNull();
    });
  });

  describe("ProductToc", () => {
    const sections = [
      { id: "overview", label: "Overview" },
      { id: "features", label: "Features" },
    ];

    beforeEach(() => {
      const mockIntersectionObserver = jest.fn();
      mockIntersectionObserver.mockReturnValue({
        observe: jest.fn(),
        unobserve: jest.fn(),
        disconnect: jest.fn(),
      });
      window.IntersectionObserver = mockIntersectionObserver;
    });

    it("renders TOC navigation", () => {
      render(<ProductToc sections={sections} />);
      expect(screen.getByText("Overview")).toBeInTheDocument();
      expect(screen.getByText("Features")).toBeInTheDocument();
    });

    it("renders back link", () => {
      render(<ProductToc sections={sections} />);
      expect(screen.getByText("Back to Products")).toBeInTheDocument();
    });
  });
});
