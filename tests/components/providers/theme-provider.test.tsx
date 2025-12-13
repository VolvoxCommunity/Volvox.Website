import { render, screen, act, fireEvent } from "@testing-library/react";
import { ThemeProvider, useTheme } from "@/components/providers/theme-provider";

// Test component to access theme context
function ThemeConsumer() {
  const { theme, setTheme } = useTheme();
  return (
    <div>
      <span data-testid="current-theme">{theme}</span>
      <button onClick={() => setTheme("dark")}>Set Dark</button>
      <button onClick={() => setTheme("light")}>Set Light</button>
      <button onClick={() => setTheme("system")}>Set System</button>
    </div>
  );
}

describe("ThemeProvider", () => {
  const originalMatchMedia = window.matchMedia;
  const originalLocalStorage = window.localStorage;

  beforeEach(() => {
    // Mock localStorage
    const storage: Record<string, string> = {};
    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: jest.fn((key: string) => storage[key] || null),
        setItem: jest.fn((key: string, value: string) => {
          storage[key] = value;
        }),
        removeItem: jest.fn((key: string) => {
          delete storage[key];
        }),
        clear: jest.fn(() => {
          Object.keys(storage).forEach((key) => delete storage[key]);
        }),
      },
      writable: true,
    });

    // Mock matchMedia
    Object.defineProperty(window, "matchMedia", {
      value: jest.fn().mockImplementation((query: string) => ({
        matches: query === "(prefers-color-scheme: dark)",
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

    // Clean up document classes
    document.documentElement.classList.remove("light", "dark");
  });

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
    Object.defineProperty(window, "localStorage", {
      value: originalLocalStorage,
      writable: true,
    });
  });

  it("renders children", () => {
    render(
      <ThemeProvider>
        <div data-testid="child">Child Content</div>
      </ThemeProvider>
    );
    expect(screen.getByTestId("child")).toBeInTheDocument();
  });

  it("uses default theme of system", async () => {
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );

    // Wait for mount effect
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(screen.getByTestId("current-theme")).toHaveTextContent("system");
  });

  it("uses provided default theme", async () => {
    render(
      <ThemeProvider defaultTheme="dark">
        <ThemeConsumer />
      </ThemeProvider>
    );

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(screen.getByTestId("current-theme")).toHaveTextContent("dark");
  });

  it("reads theme from localStorage on mount", async () => {
    (window.localStorage.getItem as jest.Mock).mockReturnValue("light");

    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(window.localStorage.getItem).toHaveBeenCalledWith("volvox-theme");
    expect(screen.getByTestId("current-theme")).toHaveTextContent("light");
  });

  it("uses custom storage key", async () => {
    (window.localStorage.getItem as jest.Mock).mockReturnValue("dark");

    render(
      <ThemeProvider storageKey="custom-theme">
        <ThemeConsumer />
      </ThemeProvider>
    );

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(window.localStorage.getItem).toHaveBeenCalledWith("custom-theme");
  });

  it("updates theme when setTheme is called", async () => {
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    const darkButton = screen.getByText("Set Dark");
    fireEvent.click(darkButton);

    expect(screen.getByTestId("current-theme")).toHaveTextContent("dark");
    expect(window.localStorage.setItem).toHaveBeenCalledWith(
      "volvox-theme",
      "dark"
    );
  });

  it("adds dark class to document when theme is dark", async () => {
    render(
      <ThemeProvider defaultTheme="dark">
        <ThemeConsumer />
      </ThemeProvider>
    );

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  it("adds light class to document when theme is light", async () => {
    render(
      <ThemeProvider defaultTheme="light">
        <ThemeConsumer />
      </ThemeProvider>
    );

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(document.documentElement.classList.contains("light")).toBe(true);
  });

  it("uses system preference when theme is system", async () => {
    // System prefers dark (mocked above)
    render(
      <ThemeProvider defaultTheme="system">
        <ThemeConsumer />
      </ThemeProvider>
    );

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  it("removes previous theme class when changing themes", async () => {
    render(
      <ThemeProvider defaultTheme="light">
        <ThemeConsumer />
      </ThemeProvider>
    );

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(document.documentElement.classList.contains("light")).toBe(true);

    const darkButton = screen.getByText("Set Dark");
    fireEvent.click(darkButton);

    expect(document.documentElement.classList.contains("light")).toBe(false);
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });
});

describe("useTheme", () => {
  it("uses default context values when used outside ThemeProvider", () => {
    // The context has initial values so it doesn't throw
    // Instead, it returns the default values
    render(<ThemeConsumer />);
    // Default theme is "system"
    expect(screen.getByTestId("current-theme")).toHaveTextContent("system");
  });
});
