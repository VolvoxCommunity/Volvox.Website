import { render, screen } from "@testing-library/react";
import { ConditionalAnalytics } from "@/components/conditional-analytics";

// Mock Vercel Analytics
jest.mock("@vercel/analytics/react", () => ({
  Analytics: () => <div data-testid="vercel-analytics">Vercel Analytics</div>,
}));

// Mock Vercel Speed Insights
jest.mock("@vercel/speed-insights/next", () => ({
  SpeedInsights: () => <div data-testid="speed-insights">Speed Insights</div>,
}));

// Mock Google Analytics
jest.mock("@next/third-parties/google", () => ({
  GoogleAnalytics: ({ gaId }: { gaId: string }) => (
    <div data-testid="google-analytics" data-ga-id={gaId}>
      Google Analytics
    </div>
  ),
}));

// Mock cookie consent provider
const mockConsent = {
  analytics: false,
  performance: false,
  advertising: false,
  necessary: true,
};

jest.mock("@/components/providers/cookie-consent-provider", () => ({
  useCookieConsent: () => ({
    consent: mockConsent,
  }),
}));

describe("ConditionalAnalytics", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
    mockConsent.analytics = false;
    mockConsent.performance = false;
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("renders nothing when no consent given", () => {
    const { container } = render(<ConditionalAnalytics />);
    expect(container.firstChild).toBeNull();
  });

  it("renders Vercel Analytics when analytics consent given", () => {
    mockConsent.analytics = true;
    render(<ConditionalAnalytics />);
    expect(screen.getByTestId("vercel-analytics")).toBeInTheDocument();
  });

  it("renders Speed Insights when performance consent given", () => {
    mockConsent.performance = true;
    render(<ConditionalAnalytics />);
    expect(screen.getByTestId("speed-insights")).toBeInTheDocument();
  });

  it("renders both when both consents given", () => {
    mockConsent.analytics = true;
    mockConsent.performance = true;
    render(<ConditionalAnalytics />);
    expect(screen.getByTestId("vercel-analytics")).toBeInTheDocument();
    expect(screen.getByTestId("speed-insights")).toBeInTheDocument();
  });

  it("renders Google Analytics in production with consent and GA ID", () => {
    Object.defineProperty(process.env, "NODE_ENV", {
      value: "production",
      writable: true,
      configurable: true,
    });
    process.env.NEXT_PUBLIC_GA_ID = "G-12345";
    mockConsent.analytics = true;

    render(<ConditionalAnalytics />);
    expect(screen.getByTestId("google-analytics")).toBeInTheDocument();
  });

  it("does not render Google Analytics without analytics consent", () => {
    Object.defineProperty(process.env, "NODE_ENV", {
      value: "production",
      writable: true,
      configurable: true,
    });
    process.env.NEXT_PUBLIC_GA_ID = "G-12345";
    mockConsent.analytics = false;

    render(<ConditionalAnalytics />);
    expect(screen.queryByTestId("google-analytics")).not.toBeInTheDocument();
  });
});
