import { render, screen, fireEvent } from "@testing-library/react";
import { Navigation } from "@/components/navigation";
import { useTheme } from "@/components/providers/theme-provider";
import confettiLib from "canvas-confetti";

jest.mock("@/components/providers/theme-provider", () => ({
  useTheme: jest.fn(),
}));

jest.mock("canvas-confetti", () => jest.fn());

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
}));

describe("Navigation", () => {
  beforeEach(() => {
    (useTheme as jest.Mock).mockReturnValue({ theme: "light", setTheme: jest.fn() });
  });

  it("renders correctly", () => {
    render(<Navigation />);
    expect(screen.getAllByText("VOLVOX")).toHaveLength(1);
    // Only desktop visible initially
    expect(screen.getAllByText("Home")).toHaveLength(1);
  });

  it("calls onNavigate", () => {
    const onNavigate = jest.fn();
    render(<Navigation onNavigate={onNavigate} />);

    // Click the desktop one (usually first)
    const buttons = screen.getAllByText("Products");
    fireEvent.click(buttons[0]);
    expect(onNavigate).toHaveBeenCalledWith("products");
  });

  it("renders links in linkMode", () => {
    render(<Navigation linkMode />);
    const links = screen.getAllByRole("link", { name: /Products/i });
    expect(links.length).toBeGreaterThan(0);
    expect(links[0]).toHaveAttribute("href", "/#products");
  });
});
