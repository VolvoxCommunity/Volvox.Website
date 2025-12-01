import { renderHook, act } from "@testing-library/react";
import { useIsMobile } from "@/hooks/use-mobile";

interface MockMediaQueryList {
  matches: boolean;
  media: string;
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
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })
    );

    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);
  });

  it("updates when media query changes", () => {
    let changeHandler: (() => void) | null = null;

    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 500,
    });

    const addEventListener = jest.fn((event: string, handler: () => void) => {
      if (event === "change") {
        changeHandler = handler;
      }
    });

    window.matchMedia = jest.fn().mockImplementation(
      (query: string): MockMediaQueryList => ({
        matches: true,
        media: query,
        addEventListener,
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })
    );

    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(true);

    // Simulate resize to desktop
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 1024,
    });

    act(() => {
      changeHandler?.();
    });

    expect(result.current).toBe(false);
  });

  it("removes event listener on unmount", () => {
    const removeEventListener = jest.fn();

    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 500,
    });

    window.matchMedia = jest.fn().mockImplementation(
      (query: string): MockMediaQueryList => ({
        matches: true,
        media: query,
        addEventListener: jest.fn(),
        removeEventListener,
        dispatchEvent: jest.fn(),
      })
    );

    const { unmount } = renderHook(() => useIsMobile());
    unmount();

    expect(removeEventListener).toHaveBeenCalledWith(
      "change",
      expect.any(Function)
    );
  });
});
