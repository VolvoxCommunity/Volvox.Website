import { render, screen, fireEvent, act } from "@testing-library/react";
import {
  CookieConsentProvider,
  useCookieConsent,
} from "@/components/providers/cookie-consent-provider";

// Test component to access context
function ConsentConsumer() {
  const {
    consent,
    showBanner,
    acceptAll,
    declineAll,
    updateConsent,
    resetConsent,
    openSettings,
    closeSettings,
    isSettingsOpen,
  } = useCookieConsent();

  return (
    <div>
      <span data-testid="has-consented">{consent.hasConsented.toString()}</span>
      <span data-testid="analytics">{consent.analytics.toString()}</span>
      <span data-testid="advertising">{consent.advertising.toString()}</span>
      <span data-testid="performance">{consent.performance.toString()}</span>
      <span data-testid="show-banner">{showBanner.toString()}</span>
      <span data-testid="settings-open">{isSettingsOpen.toString()}</span>
      <button type="button" onClick={acceptAll}>Accept All</button>
      <button type="button" onClick={declineAll}>Decline All</button>
      <button type="button" onClick={() => updateConsent({ analytics: true })}>
        Enable Analytics
      </button>
      <button type="button" onClick={resetConsent}>Reset</button>
      <button type="button" onClick={openSettings}>Open Settings</button>
      <button type="button" onClick={closeSettings}>Close Settings</button>
    </div>
  );
}

describe("CookieConsentProvider", () => {
  const originalLocalStorage = window.localStorage;
  let mockStorage: Record<string, string>;
  let mockGetItem: jest.Mock;
  let mockSetItem: jest.Mock;
  let mockRemoveItem: jest.Mock;

  beforeEach(() => {
    mockStorage = {};
    mockGetItem = jest.fn((key: string) => mockStorage[key] || null);
    mockSetItem = jest.fn((key: string, value: string) => {
      mockStorage[key] = value;
    });
    mockRemoveItem = jest.fn((key: string) => {
      delete mockStorage[key];
    });

    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: mockGetItem,
        setItem: mockSetItem,
        removeItem: mockRemoveItem,
        clear: jest.fn(),
      },
      writable: true,
    });
  });

  afterEach(() => {
    Object.defineProperty(window, "localStorage", {
      value: originalLocalStorage,
      writable: true,
    });
  });

  it("renders children", () => {
    render(
      <CookieConsentProvider>
        <div data-testid="child">Child</div>
      </CookieConsentProvider>
    );
    expect(screen.getByTestId("child")).toBeInTheDocument();
  });

  it("shows banner when user has not consented", () => {
    render(
      <CookieConsentProvider>
        <ConsentConsumer />
      </CookieConsentProvider>
    );
    expect(screen.getByTestId("show-banner")).toHaveTextContent("true");
  });

  it("hides banner when user has consented", () => {
    mockStorage["volvox-cookie-consent"] = JSON.stringify({
      hasConsented: true,
      essential: true,
      analytics: true,
      advertising: false,
      performance: true,
      timestamp: new Date().toISOString(),
    });

    render(
      <CookieConsentProvider>
        <ConsentConsumer />
      </CookieConsentProvider>
    );
    expect(screen.getByTestId("show-banner")).toHaveTextContent("false");
  });

  it("reads consent from localStorage", () => {
    mockStorage["volvox-cookie-consent"] = JSON.stringify({
      hasConsented: true,
      essential: true,
      analytics: true,
      advertising: false,
      performance: true,
      timestamp: "2024-01-01T00:00:00.000Z",
    });

    render(
      <CookieConsentProvider>
        <ConsentConsumer />
      </CookieConsentProvider>
    );

    expect(screen.getByTestId("analytics")).toHaveTextContent("true");
    expect(screen.getByTestId("advertising")).toHaveTextContent("false");
    expect(screen.getByTestId("performance")).toHaveTextContent("true");
  });

  it("acceptAll enables all consent options", () => {
    render(
      <CookieConsentProvider>
        <ConsentConsumer />
      </CookieConsentProvider>
    );

    act(() => {
      fireEvent.click(screen.getByText("Accept All"));
    });

    expect(mockSetItem).toHaveBeenCalled();
    const calls = mockSetItem.mock.calls as [string, string][];
    const savedConsent = JSON.parse(calls[0][1]) as Record<string, unknown>;
    expect(savedConsent.hasConsented).toBe(true);
    expect(savedConsent.analytics).toBe(true);
    expect(savedConsent.advertising).toBe(true);
    expect(savedConsent.performance).toBe(true);
  });

  it("declineAll disables non-essential cookies", () => {
    render(
      <CookieConsentProvider>
        <ConsentConsumer />
      </CookieConsentProvider>
    );

    act(() => {
      fireEvent.click(screen.getByText("Decline All"));
    });

    expect(mockSetItem).toHaveBeenCalled();
    const calls = mockSetItem.mock.calls as [string, string][];
    const savedConsent = JSON.parse(calls[0][1]) as Record<string, unknown>;
    expect(savedConsent.hasConsented).toBe(true);
    expect(savedConsent.essential).toBe(true);
    expect(savedConsent.analytics).toBe(false);
    expect(savedConsent.advertising).toBe(false);
    expect(savedConsent.performance).toBe(false);
  });

  it("updateConsent updates specific preferences", () => {
    render(
      <CookieConsentProvider>
        <ConsentConsumer />
      </CookieConsentProvider>
    );

    act(() => {
      fireEvent.click(screen.getByText("Enable Analytics"));
    });

    expect(mockSetItem).toHaveBeenCalled();
    const calls = mockSetItem.mock.calls as [string, string][];
    const savedConsent = JSON.parse(calls[0][1]) as Record<string, unknown>;
    expect(savedConsent.analytics).toBe(true);
    expect(savedConsent.hasConsented).toBe(true);
  });

  it("resetConsent removes consent from localStorage", () => {
    mockStorage["volvox-cookie-consent"] = JSON.stringify({
      hasConsented: true,
      essential: true,
      analytics: true,
      advertising: true,
      performance: true,
      timestamp: new Date().toISOString(),
    });

    render(
      <CookieConsentProvider>
        <ConsentConsumer />
      </CookieConsentProvider>
    );

    act(() => {
      fireEvent.click(screen.getByText("Reset"));
    });

    expect(mockRemoveItem).toHaveBeenCalledWith("volvox-cookie-consent");
  });

  it("openSettings sets isSettingsOpen to true", () => {
    render(
      <CookieConsentProvider>
        <ConsentConsumer />
      </CookieConsentProvider>
    );

    expect(screen.getByTestId("settings-open")).toHaveTextContent("false");

    act(() => {
      fireEvent.click(screen.getByText("Open Settings"));
    });

    expect(screen.getByTestId("settings-open")).toHaveTextContent("true");
  });

  it("closeSettings sets isSettingsOpen to false", () => {
    render(
      <CookieConsentProvider>
        <ConsentConsumer />
      </CookieConsentProvider>
    );

    act(() => {
      fireEvent.click(screen.getByText("Open Settings"));
    });
    expect(screen.getByTestId("settings-open")).toHaveTextContent("true");

    act(() => {
      fireEvent.click(screen.getByText("Close Settings"));
    });
    expect(screen.getByTestId("settings-open")).toHaveTextContent("false");
  });

  it("acceptAll closes settings modal", () => {
    render(
      <CookieConsentProvider>
        <ConsentConsumer />
      </CookieConsentProvider>
    );

    act(() => {
      fireEvent.click(screen.getByText("Open Settings"));
    });
    expect(screen.getByTestId("settings-open")).toHaveTextContent("true");

    act(() => {
      fireEvent.click(screen.getByText("Accept All"));
    });
    expect(screen.getByTestId("settings-open")).toHaveTextContent("false");
  });

  it("declineAll closes settings modal", () => {
    render(
      <CookieConsentProvider>
        <ConsentConsumer />
      </CookieConsentProvider>
    );

    act(() => {
      fireEvent.click(screen.getByText("Open Settings"));
    });

    act(() => {
      fireEvent.click(screen.getByText("Decline All"));
    });
    expect(screen.getByTestId("settings-open")).toHaveTextContent("false");
  });
});

describe("useCookieConsent", () => {
  it("throws error when used outside provider", () => {
    const consoleError = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    expect(() => {
      render(<ConsentConsumer />);
    }).toThrow("useCookieConsent must be used within a CookieConsentProvider");

    consoleError.mockRestore();
  });
});
