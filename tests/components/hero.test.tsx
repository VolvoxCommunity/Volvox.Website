import { render, screen, fireEvent } from "@testing-library/react";
import { Hero } from "@/components/hero";
import confettiLib from "canvas-confetti";

jest.mock("canvas-confetti", () => jest.fn(() => Promise.resolve()));

describe("Hero", () => {
  it("renders correctly", () => {
    render(<Hero onNavigate={jest.fn()} />);
    expect(screen.getByText("Volvox")).toBeInTheDocument();
  });

  it("renders Explore Products as link to /#products", () => {
    render(<Hero onNavigate={jest.fn()} />);
    const link = screen.getByRole("link", { name: /Explore Products/i });
    expect(link).toHaveAttribute("href", "/#products");
  });

  it("calls onNavigate when Join as Mentee clicked", () => {
    const onNavigate = jest.fn();
    render(<Hero onNavigate={onNavigate} />);

    fireEvent.click(screen.getByText("Join as Mentee"));
    expect(onNavigate).toHaveBeenCalledWith("mentorship");
  });

  it("triggers confetti on title click with expected arguments", () => {
    render(<Hero onNavigate={jest.fn()} />);
    fireEvent.click(screen.getByText("Volvox"));
    expect(confettiLib).toHaveBeenCalledWith(
      expect.objectContaining({
        particleCount: 100,
        spread: 70,
        origin: expect.objectContaining({
          x: expect.any(Number) as number,
          y: expect.any(Number) as number,
        }) as { x: number; y: number },
      })
    );
  });
});
