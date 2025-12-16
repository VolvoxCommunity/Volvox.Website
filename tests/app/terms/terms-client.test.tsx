import { render, screen, fireEvent } from "@testing-library/react";
import { TermsClient } from "@/app/terms/terms-client";

// Mock next/navigation
const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock child components
jest.mock("@/components/animated-background", () => ({
  AnimatedBackground: () => (
    <div data-testid="animated-background">Animated Background</div>
  ),
}));

jest.mock("@/components/footer", () => ({
  Footer: () => <footer data-testid="footer">Footer</footer>,
}));

jest.mock("@/components/navigation", () => ({
  Navigation: ({
    onNavigate,
    currentSection,
  }: {
    onNavigate: (section: string) => void;
    currentSection: string;
  }) => (
    <nav data-testid="navigation" data-current-section={currentSection}>
      <button type="button" onClick={() => onNavigate("home")}>
        Home
      </button>
      <button type="button" onClick={() => onNavigate("products")}>
        Products
      </button>
      <button type="button" onClick={() => onNavigate("blog")}>
        Blog
      </button>
    </nav>
  ),
}));

describe("TermsClient", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the page structure", () => {
    render(<TermsClient />);

    expect(screen.getByTestId("animated-background")).toBeInTheDocument();
    expect(screen.getByTestId("navigation")).toBeInTheDocument();
    expect(screen.getByTestId("footer")).toBeInTheDocument();
  });

  it("renders Terms of Service heading", () => {
    render(<TermsClient />);
    expect(
      screen.getByRole("heading", { name: "Terms of Service" })
    ).toBeInTheDocument();
  });

  it("renders last updated date", () => {
    render(<TermsClient />);
    expect(screen.getByText(/Last updated:/)).toBeInTheDocument();
  });

  it("renders all major sections", () => {
    render(<TermsClient />);

    expect(
      screen.getByRole("heading", { name: "Agreement to Terms" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Use License" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "User Responsibilities" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Mentorship Program Terms" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Intellectual Property" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Disclaimer" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Limitation of Liability" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Contact Us" })
    ).toBeInTheDocument();
  });

  it("sets current section to terms", () => {
    render(<TermsClient />);
    const nav = screen.getByTestId("navigation");
    expect(nav).toHaveAttribute("data-current-section", "terms");
  });

  it("navigates to home page when home is selected", () => {
    render(<TermsClient />);
    const homeButton = screen.getByText("Home");
    fireEvent.click(homeButton);
    expect(mockPush).toHaveBeenCalledWith("/");
  });

  it("navigates to home page with hash for other sections", () => {
    render(<TermsClient />);
    const productsButton = screen.getByText("Products");
    fireEvent.click(productsButton);
    expect(mockPush).toHaveBeenCalledWith("/#products");
  });

  it("renders privacy policy link", () => {
    render(<TermsClient />);
    const privacyLinks = screen.getAllByRole("link", {
      name: "Privacy Policy",
    });
    expect(privacyLinks.length).toBeGreaterThan(0);
    expect(privacyLinks[0]).toHaveAttribute("href", "/privacy");
  });

  it("renders contact email link", () => {
    render(<TermsClient />);
    const emailLink = screen.getByRole("link", { name: "legal@volvox.dev" });
    expect(emailLink).toHaveAttribute("href", "mailto:legal@volvox.dev");
  });

  it("renders mobile applications section", () => {
    render(<TermsClient />);
    expect(
      screen.getByRole("heading", { name: "Mobile Applications" })
    ).toBeInTheDocument();
  });

  it("renders third-party service links", () => {
    render(<TermsClient />);
    const supabaseLink = screen.getByRole("link", {
      name: "Supabase Terms of Service",
    });
    const firebaseLink = screen.getByRole("link", {
      name: "Firebase Terms of Service",
    });

    expect(supabaseLink).toHaveAttribute("href", "https://supabase.com/terms");
    expect(firebaseLink).toHaveAttribute(
      "href",
      "https://firebase.google.com/terms"
    );
  });
});
