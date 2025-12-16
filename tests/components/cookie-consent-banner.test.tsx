import { render, screen, fireEvent } from "@testing-library/react";
import {
  CookieConsentBanner,
  CookieSettingsButton,
} from "@/components/cookie-consent-banner";

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

// Mock phosphor icons
jest.mock("@phosphor-icons/react", () => ({
  X: () => <span data-testid="x-icon">X</span>,
  Cookie: () => <span data-testid="cookie-icon">Cookie</span>,
  Gear: () => <span data-testid="gear-icon">Gear</span>,
}));

// Mock UI components
jest.mock("@/components/ui/button", () => ({
  Button: ({
    children,
    onClick,
    variant,
    size,
    className,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    variant?: string;
    size?: string;
    className?: string;
  }) => (
    <button
      type="button"
      onClick={onClick}
      data-variant={variant}
      data-size={size}
      className={className}
    >
      {children}
    </button>
  ),
}));

jest.mock("@/components/ui/dialog", () => ({
  Dialog: ({
    children,
    open,
    onOpenChange,
  }: {
    children: React.ReactNode;
    open: boolean;
    onOpenChange: (open: boolean) => void;
  }) =>
    open ? (
      <div data-testid="dialog" onClick={() => onOpenChange(false)}>
        {children}
      </div>
    ) : null,
  DialogContent: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <div data-testid="dialog-content" className={className}>
      {children}
    </div>
  ),
  DialogHeader: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dialog-header">{children}</div>
  ),
  DialogTitle: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <h2 data-testid="dialog-title" className={className}>
      {children}
    </h2>
  ),
  DialogDescription: ({ children }: { children: React.ReactNode }) => (
    <p data-testid="dialog-description">{children}</p>
  ),
}));

// Mock consent context
const mockConsent = {
  analytics: false,
  advertising: false,
  performance: false,
  necessary: true,
};

const mockContext = {
  consent: mockConsent,
  showBanner: true,
  acceptAll: jest.fn(),
  declineAll: jest.fn(),
  updateConsent: jest.fn(),
  isSettingsOpen: false,
  openSettings: jest.fn(),
  closeSettings: jest.fn(),
};

jest.mock("@/components/providers/cookie-consent-provider", () => ({
  useCookieConsent: () => mockContext,
}));

describe("CookieConsentBanner", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockContext.showBanner = true;
    mockContext.isSettingsOpen = false;
    mockConsent.analytics = false;
    mockConsent.advertising = false;
    mockConsent.performance = false;
  });

  describe("Banner display", () => {
    it("renders banner when showBanner is true", () => {
      render(<CookieConsentBanner />);
      expect(screen.getByText("Cookie Preferences")).toBeInTheDocument();
    });

    it("does not render banner when showBanner is false", () => {
      mockContext.showBanner = false;
      render(<CookieConsentBanner />);
      expect(screen.queryByText("Cookie Preferences")).not.toBeInTheDocument();
    });

    it("renders privacy policy link", () => {
      render(<CookieConsentBanner />);
      const privacyLink = screen.getByRole("link", { name: "Privacy Policy" });
      expect(privacyLink).toHaveAttribute("href", "/privacy");
    });

    it("renders Cookie icon", () => {
      render(<CookieConsentBanner />);
      expect(screen.getAllByTestId("cookie-icon")[0]).toBeInTheDocument();
    });
  });

  describe("Banner actions", () => {
    it("calls acceptAll when Accept All button is clicked", () => {
      render(<CookieConsentBanner />);
      const acceptButton = screen.getByText("Accept All");
      fireEvent.click(acceptButton);
      expect(mockContext.acceptAll).toHaveBeenCalled();
    });

    it("calls declineAll when Decline All button is clicked", () => {
      render(<CookieConsentBanner />);
      const declineButton = screen.getByText("Decline All");
      fireEvent.click(declineButton);
      expect(mockContext.declineAll).toHaveBeenCalled();
    });

    it("calls declineAll when X button is clicked", () => {
      render(<CookieConsentBanner />);
      const closeButton = screen.getByLabelText("Decline all cookies");
      fireEvent.click(closeButton);
      expect(mockContext.declineAll).toHaveBeenCalled();
    });

    it("calls openSettings when Customize button is clicked", () => {
      render(<CookieConsentBanner />);
      const customizeButton = screen.getByText("Customize");
      fireEvent.click(customizeButton);
      expect(mockContext.openSettings).toHaveBeenCalled();
    });
  });

  describe("Settings dialog", () => {
    beforeEach(() => {
      mockContext.isSettingsOpen = true;
    });

    it("renders settings dialog when isSettingsOpen is true", () => {
      render(<CookieConsentBanner />);
      expect(screen.getByTestId("dialog")).toBeInTheDocument();
      expect(screen.getByText("Cookie Settings")).toBeInTheDocument();
    });

    it("renders all cookie toggle categories", () => {
      render(<CookieConsentBanner />);
      expect(screen.getByText("Essential Cookies")).toBeInTheDocument();
      expect(screen.getByText("Analytics Cookies")).toBeInTheDocument();
      expect(screen.getByText("Advertising Cookies")).toBeInTheDocument();
      expect(screen.getByText("Performance Cookies")).toBeInTheDocument();
    });

    it("renders toggle descriptions", () => {
      render(<CookieConsentBanner />);
      expect(
        screen.getByText(/Required for basic website functionality/)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Help us understand how visitors interact/)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Used to deliver relevant advertisements/)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Help us monitor and improve website performance/)
      ).toBeInTheDocument();
    });

    it("essential cookies toggle is disabled", () => {
      render(<CookieConsentBanner />);
      const essentialToggle = screen.getByLabelText("Toggle Essential Cookies");
      expect(essentialToggle).toBeDisabled();
    });

    it("analytics toggle can be toggled", () => {
      render(<CookieConsentBanner />);
      const analyticsToggle = screen.getByLabelText("Toggle Analytics Cookies");
      expect(analyticsToggle).toHaveAttribute("aria-checked", "false");
      fireEvent.click(analyticsToggle);
      expect(analyticsToggle).toHaveAttribute("aria-checked", "true");
    });

    it("advertising toggle can be toggled", () => {
      render(<CookieConsentBanner />);
      const advertisingToggle = screen.getByLabelText(
        "Toggle Advertising Cookies"
      );
      expect(advertisingToggle).toHaveAttribute("aria-checked", "false");
      fireEvent.click(advertisingToggle);
      expect(advertisingToggle).toHaveAttribute("aria-checked", "true");
    });

    it("performance toggle can be toggled", () => {
      render(<CookieConsentBanner />);
      const performanceToggle = screen.getByLabelText(
        "Toggle Performance Cookies"
      );
      expect(performanceToggle).toHaveAttribute("aria-checked", "false");
      fireEvent.click(performanceToggle);
      expect(performanceToggle).toHaveAttribute("aria-checked", "true");
    });

    it("calls updateConsent when Save Preferences is clicked", () => {
      render(<CookieConsentBanner />);
      const saveButton = screen.getByText("Save Preferences");
      fireEvent.click(saveButton);
      expect(mockContext.updateConsent).toHaveBeenCalledWith({
        analytics: false,
        advertising: false,
        performance: false,
      });
    });

    it("saves toggled preferences when Save Preferences is clicked", () => {
      render(<CookieConsentBanner />);
      // Toggle analytics
      const analyticsToggle = screen.getByLabelText("Toggle Analytics Cookies");
      fireEvent.click(analyticsToggle);
      // Toggle performance
      const performanceToggle = screen.getByLabelText(
        "Toggle Performance Cookies"
      );
      fireEvent.click(performanceToggle);
      // Save
      const saveButton = screen.getByText("Save Preferences");
      fireEvent.click(saveButton);
      expect(mockContext.updateConsent).toHaveBeenCalledWith({
        analytics: true,
        advertising: false,
        performance: true,
      });
    });

    it("calls acceptAll in dialog when Accept All is clicked", () => {
      render(<CookieConsentBanner />);
      // Find Accept All in dialog (there are two, one in banner and one in dialog)
      const dialogAcceptButton = screen.getAllByText("Accept All")[1];
      fireEvent.click(dialogAcceptButton);
      expect(mockContext.acceptAll).toHaveBeenCalled();
    });

    it("calls declineAll in dialog when Decline All is clicked", () => {
      render(<CookieConsentBanner />);
      // Find Decline All in dialog (there are two, one in banner and one in dialog)
      const dialogDeclineButton = screen.getAllByText("Decline All")[1];
      fireEvent.click(dialogDeclineButton);
      expect(mockContext.declineAll).toHaveBeenCalled();
    });

    it("renders privacy policy link in dialog", () => {
      render(<CookieConsentBanner />);
      const privacyLinks = screen.getAllByRole("link", {
        name: "Privacy Policy",
      });
      expect(privacyLinks.length).toBe(2); // One in banner, one in dialog
      expect(privacyLinks[1]).toHaveAttribute("href", "/privacy");
    });
  });

  describe("Initial state from consent", () => {
    it("uses consent values for initial toggle state", () => {
      mockConsent.analytics = true;
      mockConsent.advertising = true;
      mockContext.isSettingsOpen = true;
      render(<CookieConsentBanner />);

      const analyticsToggle = screen.getByLabelText("Toggle Analytics Cookies");
      const advertisingToggle = screen.getByLabelText(
        "Toggle Advertising Cookies"
      );
      const performanceToggle = screen.getByLabelText(
        "Toggle Performance Cookies"
      );

      expect(analyticsToggle).toHaveAttribute("aria-checked", "true");
      expect(advertisingToggle).toHaveAttribute("aria-checked", "true");
      expect(performanceToggle).toHaveAttribute("aria-checked", "false");
    });
  });
});

describe("CookieSettingsButton", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders button text", () => {
    render(<CookieSettingsButton />);
    expect(screen.getByText("Cookie Settings")).toBeInTheDocument();
  });

  it("calls openSettings when clicked", () => {
    render(<CookieSettingsButton />);
    const button = screen.getByText("Cookie Settings");
    fireEvent.click(button);
    expect(mockContext.openSettings).toHaveBeenCalled();
  });
});
