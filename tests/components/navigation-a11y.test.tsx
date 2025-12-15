import React from "react";
import { render, screen } from "@testing-library/react";
import { Navigation } from "@/components/navigation";
import { useTheme } from "@/components/providers/theme-provider";

jest.mock("@/components/providers/theme-provider", () => ({
  useTheme: jest.fn(),
}));

jest.mock("canvas-confetti", () => jest.fn());

// Mock Next.js Image
jest.mock("next/image", () => ({
  __esModule: true,
  // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
  default: (props: React.ComponentProps<"img">) => <img {...props} />,
}));

// Mock framer-motion to render children directly
jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: React.ComponentProps<"div">) => (
      <div {...props}>{children}</div>
    ),
    button: ({ children, ...props }: React.ComponentProps<"button">) => (
      <button {...props}>{children}</button>
    ),
  },
}));

describe("Navigation Accessibility", () => {
  beforeEach(() => {
    (useTheme as jest.Mock).mockReturnValue({
      theme: "light",
      setTheme: jest.fn(),
    });
  });

  it("has accessible names for social links and theme toggle", () => {
    render(<Navigation />);

    // Theme toggle
    expect(
      screen.getByRole("button", { name: /toggle theme/i })
    ).toBeInTheDocument();

    // GitHub link
    expect(screen.getByRole("link", { name: /github/i })).toBeInTheDocument();

    // Discord link
    expect(screen.getByRole("link", { name: /discord/i })).toBeInTheDocument();
  });

  it("has accessible name for mobile menu trigger", () => {
    // We might need to adjust viewport or just check existence since standard render doesn't hide based on CSS classes
    render(<Navigation />);

    // Mobile menu trigger
    expect(
      screen.getByRole("button", { name: /open menu/i })
    ).toBeInTheDocument();
  });
});
