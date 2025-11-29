import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { HomepageClient } from "@/components/homepage-client";
import { useRouter } from "next/navigation";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/components/navigation", () => ({
  Navigation: ({ onNavigate }: any) => (
    <div>
      <button onClick={() => onNavigate("products")}>Nav Products</button>
      Navigation
    </div>
  ),
}));
jest.mock("@/components/hero", () => ({
  Hero: ({ onNavigate }: any) => (
    <div>
       <button onClick={() => onNavigate("products")}>Hero Products</button>
       Hero
    </div>
  ),
}));
jest.mock("@/components/products", () => ({ Products: () => <div>Products Section</div> }));
jest.mock("@/components/blog", () => ({ Blog: () => <div>Blog Section</div> }));
jest.mock("@/components/mentorship", () => ({ Mentorship: () => <div>Mentorship Section</div> }));
jest.mock("@/components/about", () => ({ About: () => <div>About Section</div> }));
jest.mock("@/components/footer", () => ({ Footer: () => <div>Footer</div> }));
jest.mock("@/components/animated-background", () => ({ AnimatedBackground: () => <div>Background</div> }));
jest.mock("@/components/ui/sonner", () => ({ Toaster: () => <div>Toaster</div> }));

describe("HomepageClient", () => {
  const mockProps = {
    blogPosts: [],
    products: [],
    mentors: [],
    mentees: [],
  };

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: jest.fn(),
    });
    window.scrollTo = jest.fn();
    Element.prototype.getBoundingClientRect = jest.fn(() => ({
      top: 100,
      bottom: 200,
      height: 100,
    } as any));
  });

  it("renders all sections", () => {
    render(<HomepageClient {...mockProps} />);
    expect(screen.getByText("Navigation")).toBeInTheDocument();
    expect(screen.getByText("Hero")).toBeInTheDocument();
    expect(screen.getByText("Products Section")).toBeInTheDocument();
    expect(screen.getByText("Blog Section")).toBeInTheDocument();
    expect(screen.getByText("Mentorship Section")).toBeInTheDocument();
    expect(screen.getByText("About Section")).toBeInTheDocument();
    expect(screen.getByText("Footer")).toBeInTheDocument();
  });

  it("navigates to section", () => {
    const push = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push });

    const productEl = document.createElement("div");
    productEl.id = "products";
    document.body.appendChild(productEl);

    render(<HomepageClient {...mockProps} />);

    fireEvent.click(screen.getByText("Nav Products"));

    expect(window.scrollTo).toHaveBeenCalled();
    expect(push).toHaveBeenCalledWith("#products", { scroll: false });

    document.body.removeChild(productEl);
  });
});
