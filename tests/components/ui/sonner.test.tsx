import { render } from "@testing-library/react";
import { Toaster } from "@/components/ui/sonner";

// Mock the theme provider
jest.mock("@/components/providers/theme-provider", () => ({
  useTheme: () => ({
    theme: "light",
  }),
}));

// Mock sonner library
jest.mock("sonner", () => ({
  Toaster: ({
    theme,
    className,
    style,
    ...props
  }: {
    theme?: string;
    className?: string;
    style?: React.CSSProperties;
    [key: string]: unknown;
  }) => (
    <div
      data-testid="sonner-toaster"
      data-theme={theme}
      className={className}
      style={style}
      {...props}
    />
  ),
}));

describe("Toaster", () => {
  it("renders with theme from context", () => {
    const { getByTestId } = render(<Toaster />);
    const toaster = getByTestId("sonner-toaster");
    expect(toaster).toHaveAttribute("data-theme", "light");
  });

  it("renders with toaster group class", () => {
    const { getByTestId } = render(<Toaster />);
    const toaster = getByTestId("sonner-toaster");
    expect(toaster).toHaveClass("toaster", "group");
  });

  it("applies CSS custom properties for theming", () => {
    const { getByTestId } = render(<Toaster />);
    const toaster = getByTestId("sonner-toaster");
    expect(toaster).toHaveStyle({
      "--normal-bg": "var(--popover)",
      "--normal-text": "var(--popover-foreground)",
      "--normal-border": "var(--border)",
    });
  });

  it("passes additional props to Sonner", () => {
    const { getByTestId } = render(<Toaster position="top-right" />);
    const toaster = getByTestId("sonner-toaster");
    expect(toaster).toHaveAttribute("position", "top-right");
  });
});

describe("Toaster integration", () => {
  it("renders toaster component", () => {
    const { getByTestId } = render(<Toaster />);
    expect(getByTestId("sonner-toaster")).toBeInTheDocument();
  });

  it("can accept custom duration prop", () => {
    const { getByTestId } = render(<Toaster duration={5000} />);
    const toaster = getByTestId("sonner-toaster");
    expect(toaster).toHaveAttribute("duration", "5000");
  });
});
