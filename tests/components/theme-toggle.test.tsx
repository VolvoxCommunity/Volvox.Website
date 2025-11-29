import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeToggle } from "@/components/theme-toggle";
import { useTheme } from "@/components/providers/theme-provider";

jest.mock("@/components/providers/theme-provider", () => ({
  useTheme: jest.fn(),
}));

describe("ThemeToggle", () => {
  it("toggles theme from light to dark", () => {
    const setTheme = jest.fn();
    (useTheme as jest.Mock).mockReturnValue({ theme: "light", setTheme });

    render(<ThemeToggle />);
    fireEvent.click(screen.getByRole("button"));
    expect(setTheme).toHaveBeenCalledWith("dark");
  });

  it("toggles theme from dark to light", () => {
    const setTheme = jest.fn();
    (useTheme as jest.Mock).mockReturnValue({ theme: "dark", setTheme });

    render(<ThemeToggle />);
    fireEvent.click(screen.getByRole("button"));
    expect(setTheme).toHaveBeenCalledWith("light");
  });
});
