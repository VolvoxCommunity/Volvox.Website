import { render, screen } from "@testing-library/react";
import { Footer } from "@/components/footer";
import { CookieConsentProvider } from "@/components/providers/cookie-consent-provider";

/**
 * Wrapper component that provides required context for Footer tests.
 */
function FooterWithProviders() {
  return (
    <CookieConsentProvider>
      <Footer />
    </CookieConsentProvider>
  );
}

describe("Footer", () => {
  it("renders privacy policy link", () => {
    render(<FooterWithProviders />);
    expect(
      screen.getByRole("link", { name: "Privacy Policy" })
    ).toBeInTheDocument();
  });

  it("renders terms of service link", () => {
    render(<FooterWithProviders />);
    expect(
      screen.getByRole("link", { name: "Terms of Service" })
    ).toBeInTheDocument();
  });

  it("renders cookie settings button", () => {
    render(<FooterWithProviders />);
    expect(
      screen.getByRole("button", { name: "Cookie Settings" })
    ).toBeInTheDocument();
  });

  it("renders copyright year", () => {
    render(<FooterWithProviders />);
    const year = new Date().getFullYear().toString();
    expect(
      screen.getByText((content) => content.includes(year))
    ).toBeInTheDocument();
  });
});
