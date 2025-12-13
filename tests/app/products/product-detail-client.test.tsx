import { render, screen } from "@testing-library/react";
import { ProductDetailClient } from "@/app/products/[slug]/product-detail-client";
import type { ExtendedProduct } from "@/lib/types";

// Mock all child components
jest.mock("@/components/animated-background", () => ({
  AnimatedBackground: () => (
    <div data-testid="animated-background">Animated Background</div>
  ),
}));

jest.mock("@/components/blog/blog-navigation", () => ({
  BlogNavigation: () => <nav data-testid="blog-navigation">Navigation</nav>,
}));

jest.mock("@/components/footer", () => ({
  Footer: () => <footer data-testid="footer">Footer</footer>,
}));

jest.mock("@/components/products/product-hero", () => ({
  ProductHero: ({ product }: { product: ExtendedProduct }) => (
    <div data-testid="product-hero">{product.name}</div>
  ),
}));

jest.mock("@/components/products/product-toc", () => ({
  ProductToc: ({ sections }: { sections: { id: string; label: string }[] }) => (
    <nav data-testid="product-toc">
      {sections.map((s) => (
        <span key={s.id}>{s.label}</span>
      ))}
    </nav>
  ),
}));

jest.mock("@/components/products/product-features", () => ({
  ProductFeatures: ({ features }: { features: string[] }) => (
    <div data-testid="product-features">{features.length} features</div>
  ),
}));

jest.mock("@/components/products/product-faq", () => ({
  ProductFaq: ({ faq }: { faq: { question: string; answer: string }[] }) =>
    faq.length > 0 ? <div data-testid="product-faq">FAQ</div> : null,
}));

jest.mock("@/components/products/product-testimonials", () => ({
  ProductTestimonials: ({
    testimonials,
  }: {
    testimonials: { name: string; quote: string }[];
  }) =>
    testimonials.length > 0 ? (
      <div data-testid="product-testimonials">Testimonials</div>
    ) : null,
}));

jest.mock("@/components/products/product-changelog", () => ({
  ProductChangelog: ({ content }: { content: string | null }) =>
    content ? <div data-testid="product-changelog">Changelog</div> : null,
}));

jest.mock("@/components/products/product-screenshots", () => ({
  ProductScreenshots: ({ screenshots }: { screenshots: string[] }) =>
    screenshots.length > 1 ? (
      <div data-testid="product-screenshots">Screenshots</div>
    ) : null,
}));

describe("ProductDetailClient", () => {
  const mockProduct: ExtendedProduct = {
    id: "550e8400-e29b-41d4-a716-446655440000",
    name: "Test Product",
    slug: "test-product",
    tagline: "A great product",
    description: "Short description",
    longDescription: "This is a long description for the overview section.",
    features: ["Feature 1", "Feature 2"],
    techStack: ["React"],
    links: {},
    screenshots: ["hero.png", "screen1.png"],
    faq: [{ question: "Q1?", answer: "A1" }],
    testimonials: [{ name: "John", quote: "Great!" }],
  };

  it("renders the page structure", () => {
    render(<ProductDetailClient product={mockProduct} changelog={null} />);

    expect(screen.getByTestId("animated-background")).toBeInTheDocument();
    expect(screen.getByTestId("blog-navigation")).toBeInTheDocument();
    expect(screen.getByTestId("product-hero")).toBeInTheDocument();
    expect(screen.getByTestId("footer")).toBeInTheDocument();
  });

  it("renders product name in hero", () => {
    render(<ProductDetailClient product={mockProduct} changelog={null} />);
    expect(screen.getByText("Test Product")).toBeInTheDocument();
  });

  it("renders overview section with long description", () => {
    render(<ProductDetailClient product={mockProduct} changelog={null} />);
    // Overview appears in both TOC and section heading
    expect(screen.getAllByText("Overview")).toHaveLength(2);
    expect(
      screen.getByText("This is a long description for the overview section.")
    ).toBeInTheDocument();
  });

  it("renders features section", () => {
    render(<ProductDetailClient product={mockProduct} changelog={null} />);
    expect(screen.getByTestId("product-features")).toBeInTheDocument();
  });

  it("renders FAQ when product has FAQ items", () => {
    render(<ProductDetailClient product={mockProduct} changelog={null} />);
    expect(screen.getByTestId("product-faq")).toBeInTheDocument();
  });

  it("renders testimonials when product has testimonials", () => {
    render(<ProductDetailClient product={mockProduct} changelog={null} />);
    expect(screen.getByTestId("product-testimonials")).toBeInTheDocument();
  });

  it("renders changelog when provided", () => {
    render(
      <ProductDetailClient product={mockProduct} changelog="# Changelog" />
    );
    expect(screen.getByTestId("product-changelog")).toBeInTheDocument();
  });

  it("does not render changelog when null", () => {
    render(<ProductDetailClient product={mockProduct} changelog={null} />);
    expect(screen.queryByTestId("product-changelog")).not.toBeInTheDocument();
  });

  it("renders screenshots when more than one", () => {
    render(<ProductDetailClient product={mockProduct} changelog={null} />);
    expect(screen.getByTestId("product-screenshots")).toBeInTheDocument();
  });

  it("does not render screenshots when only hero image", () => {
    const productWithOneScreenshot = {
      ...mockProduct,
      screenshots: ["hero.png"],
    };
    render(
      <ProductDetailClient
        product={productWithOneScreenshot}
        changelog={null}
      />
    );
    expect(screen.queryByTestId("product-screenshots")).not.toBeInTheDocument();
  });

  it("builds correct TOC sections", () => {
    render(
      <ProductDetailClient product={mockProduct} changelog="# Changelog" />
    );
    const toc = screen.getByTestId("product-toc");

    expect(toc).toHaveTextContent("Overview");
    expect(toc).toHaveTextContent("Screenshots");
    expect(toc).toHaveTextContent("Features");
    expect(toc).toHaveTextContent("Changelog");
    expect(toc).toHaveTextContent("FAQ");
    expect(toc).toHaveTextContent("Testimonials");
  });

  it("excludes optional TOC sections when not present", () => {
    const minimalProduct = {
      ...mockProduct,
      screenshots: ["hero.png"],
      faq: [],
      testimonials: [],
    };
    render(<ProductDetailClient product={minimalProduct} changelog={null} />);
    const toc = screen.getByTestId("product-toc");

    expect(toc).toHaveTextContent("Overview");
    expect(toc).toHaveTextContent("Features");
    expect(toc).not.toHaveTextContent("Screenshots");
    expect(toc).not.toHaveTextContent("Changelog");
    expect(toc).not.toHaveTextContent("FAQ");
    expect(toc).not.toHaveTextContent("Testimonials");
  });
});
