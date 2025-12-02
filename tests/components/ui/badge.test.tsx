import { render, screen } from "@testing-library/react";
import { Badge } from "@/components/ui/badge";

describe("Badge", () => {
  it("renders correctly", () => {
    render(<Badge>Badge</Badge>);
    expect(screen.getByText("Badge")).toBeInTheDocument();
  });

  it("applies variant classes", () => {
    render(<Badge variant="destructive">Destructive</Badge>);
    const badge = screen.getByText("Destructive");
    expect(badge.className).toContain("bg-destructive");
  });
});
