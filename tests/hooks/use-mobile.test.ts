import { renderHook } from "@testing-library/react";
import { useIsMobile } from "@/hooks/use-mobile";

interface MockMediaQueryList {
  matches: boolean;
  media: string;
  onchange: null;
  addListener: jest.Mock;
  removeListener: jest.Mock;
  addEventListener: jest.Mock;
  removeEventListener: jest.Mock;
  dispatchEvent: jest.Mock;
}

describe("useIsMobile", () => {
  it("returns true for mobile width", () => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 500,
    });

    window.matchMedia = jest.fn().mockImplementation(
      (query: string): MockMediaQueryList => ({
        matches: true,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })
    );

    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(true);
  });

  it("returns false for desktop width", () => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 1024,
    });

    window.matchMedia = jest.fn().mockImplementation(
      (query: string): MockMediaQueryList => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })
    );

    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);
  });
});
