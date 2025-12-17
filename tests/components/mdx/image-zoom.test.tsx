/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import { render, screen, fireEvent } from "@testing-library/react";
import { ImageZoom } from "@/components/mdx/image-zoom";
import type { ReactNode } from "react";

interface ImageMockProps {
  [key: string]: unknown;
}

interface DialogMockProps {
  open?: boolean;
  children: ReactNode;
}

interface DialogContentMockProps {
  children: ReactNode;
}

// Mock next/image
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: ImageMockProps) => <img {...props} />,
}));

// Mock dialog component since Radix UI can be complex in tests
jest.mock("@/components/ui/dialog", () => ({
  Dialog: ({ open, children }: DialogMockProps) =>
    open ? <div data-testid="dialog">{children}</div> : null,
  DialogContent: ({ children }: DialogContentMockProps) => (
    <div data-testid="dialog-content">{children}</div>
  ),
}));

describe("ImageZoom", () => {
  it("renders next/image when width and height are provided", () => {
    render(
      <ImageZoom src="/test.jpg" alt="Test Image" width={100} height={100} />
    );
    // Should render the button and image inside
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("width", "100");
    expect(img).toHaveAttribute("height", "100");
    expect(img).toHaveAttribute("src", "/test.jpg");
  });

  it("renders standard img tag when dimensions are missing", () => {
    render(<ImageZoom src="/test.jpg" alt="Test Image" />);
    const img = screen.getByRole("img");
    expect(img).not.toHaveAttribute("width"); // Should not have explicit numeric width attribute from next/image logic
    expect(img).toHaveAttribute("src", "/test.jpg");
  });

  it("renders caption if provided", () => {
    render(<ImageZoom src="/test.jpg" alt="Alt Text" caption="My Caption" />);
    expect(screen.getByText("My Caption")).toBeInTheDocument();
  });

  it("falls back to alt text as caption if caption missing", () => {
    render(<ImageZoom src="/test.jpg" alt="Alt Text" />);
    expect(screen.getByText("Alt Text")).toBeInTheDocument();
  });

  it("opens dialog on click", () => {
    render(<ImageZoom src="/test.jpg" alt="Test Image" />);
    expect(screen.queryByTestId("dialog")).not.toBeInTheDocument();

    const button = screen.getByLabelText("Expand image: Test Image");
    fireEvent.click(button);

    expect(screen.getByTestId("dialog")).toBeInTheDocument();
  });

  it("renders correct image in dialog (with dimensions)", () => {
    render(
      <ImageZoom src="/test.jpg" alt="Test Image" width={200} height={200} />
    );

    // Open dialog
    fireEvent.click(screen.getByLabelText("Expand image: Test Image"));

    // Check dialog content
    const dialogContent = screen.getByTestId("dialog-content");
    const zoomedImg = dialogContent.querySelector("img");
    expect(zoomedImg).toHaveAttribute("width", "200");
  });

  it("renders correct image in dialog (without dimensions)", () => {
    render(<ImageZoom src="/test.jpg" alt="Test Image" />);

    // Open dialog
    fireEvent.click(screen.getByLabelText("Expand image: Test Image"));

    // Check dialog content
    const dialogContent = screen.getByTestId("dialog-content");
    const zoomedImg = dialogContent.querySelector("img");
    expect(zoomedImg).not.toHaveAttribute("width"); // No numeric width
  });
});
