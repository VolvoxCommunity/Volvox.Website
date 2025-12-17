import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "@/components/ui/button";

describe("Button", () => {
  it("renders correctly", () => {
    render(<Button>Click me</Button>);
    expect(
      screen.getByRole("button", { name: "Click me" })
    ).toBeInTheDocument();
  });

  it("applies variant classes", () => {
    render(<Button variant="destructive">Delete</Button>);
    const button = screen.getByRole("button", { name: "Delete" });
    expect(button.className).toContain("bg-destructive");
  });

  it("handles mouse move for glow effect", () => {
    // We need to spy on onMouseMove prop if provided
    const handleMouseMove = jest.fn();
    const { getByRole } = render(<Button onMouseMove={handleMouseMove}>Glow</Button>);
    const button = getByRole("button", { name: "Glow" });

    // Mock getBoundingClientRect
    // Note: in jsdom, getBoundingClientRect returns zeros by default.
    // We override it on the element instance.
    button.getBoundingClientRect = jest.fn(() => ({
      left: 10,
      top: 10,
      width: 100,
      height: 40,
      x: 10,
      y: 10,
      bottom: 50,
      right: 110,
      toJSON: () => {},
    }));

    fireEvent.mouseMove(button, { clientX: 60, clientY: 30 });

    // 60 - 10 = 50
    // 30 - 10 = 20
    expect(button.style.getPropertyValue("--mouse-x")).toBe("50px");
    expect(button.style.getPropertyValue("--mouse-y")).toBe("20px");

    // Verify external handler is called
    expect(handleMouseMove).toHaveBeenCalled();
  });

  it("renders as child", () => {
    render(
      <Button asChild>
        <a href="/link">Link Button</a>
      </Button>
    );
    const link = screen.getByRole("link", { name: "Link Button" });
    expect(link).toBeInTheDocument();
    expect(link.className).toContain("inline-flex"); // Part of button base styles
  });

  it("renders different sizes", () => {
     render(<Button size="sm">Small</Button>);
     const btn = screen.getByRole("button", { name: "Small" });
     expect(btn.className).toContain("h-8");
  });

  it("renders icon size", () => {
     render(<Button size="icon">X</Button>);
     const btn = screen.getByRole("button", { name: "X" });
     expect(btn.className).toContain("size-9");
  });
});
