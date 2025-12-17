import { render, screen } from "@testing-library/react";
import { ProductFeatures } from "@/components/products/product-features";

// Mock framer-motion to avoid animation issues in tests
jest.mock("framer-motion", () => ({
  motion: {
    li: ({ children, className, ...props }: any) => (
      <li className={className} data-testid="motion-li" {...props}>
        {children}
      </li>
    ),
  },
}));

describe("ProductFeatures", () => {
  const mockFeatures = ["Feature 1", "Feature 2", "Feature 3"];

  it("renders list of features", () => {
    render(<ProductFeatures features={mockFeatures} />);

    expect(screen.getByText("Features")).toBeInTheDocument();
    expect(screen.getByText("Feature 1")).toBeInTheDocument();
    expect(screen.getByText("Feature 2")).toBeInTheDocument();
    expect(screen.getByText("Feature 3")).toBeInTheDocument();

    // Check if correct number of items rendered
    const items = screen.getAllByTestId("motion-li");
    expect(items).toHaveLength(3);
  });

  it("renders nothing when features array is empty", () => {
    const { container } = render(<ProductFeatures features={[]} />);
    expect(container).toBeEmptyDOMElement();
  });
});
