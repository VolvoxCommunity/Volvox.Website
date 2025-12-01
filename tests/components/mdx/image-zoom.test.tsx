import { render, screen, fireEvent } from "@testing-library/react";
import { ImageZoom } from "@/components/mdx/image-zoom";

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
}));

describe("ImageZoom", () => {
  it("renders thumbnail", () => {
    render(<ImageZoom src="/img.jpg" alt="Alt" />);
    const btn = screen.getByRole("button", { name: /Expand image/i });
    expect(btn).toBeInTheDocument();
    const img = screen.getByRole("img", { name: "Alt" });
    expect(img).toHaveAttribute("src", "/img.jpg");
  });

  it("opens dialog on click", () => {
    render(<ImageZoom src="/img.jpg" alt="Alt" />);
    const btn = screen.getByRole("button", { name: /Expand image/i });
    fireEvent.click(btn);
    // Dialog should open.
    expect(screen.getByLabelText("Close")).toBeInTheDocument();
  });
});
