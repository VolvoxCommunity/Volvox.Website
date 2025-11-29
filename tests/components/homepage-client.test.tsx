import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { HomepageClient } from "@/components/homepage-client";
import { useRouter } from "next/navigation";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

const mockNavigation = jest.fn();
jest.mock("@/components/navigation", () => ({
  Navigation: (props: any) => {
    mockNavigation(props);
    return (
      <div>
        <button onClick={() => props.onNavigate("products")}>Nav Products</button>
        Navigation
      </div>
    );
  },
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
    mockNavigation.mockClear();
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

  it("updates section on scroll", () => {
    jest.spyOn(document, "getElementById").mockImplementation((id) => {
      if (id === "products") {
        return {
          offsetTop: 500,
          offsetHeight: 1000,
        } as any;
      }
      return null;
    });

    render(<HomepageClient {...mockProps} />);

    expect(mockNavigation).toHaveBeenLastCalledWith(expect.objectContaining({ currentSection: "home" }));

    // Simulate scroll to products
    // window.scrollY is read-only in some environments, need to define property?
    Object.defineProperty(window, "scrollY", { value: 600, writable: true });

    act(() => {
        fireEvent.scroll(window);
    });

    expect(mockNavigation).toHaveBeenLastCalledWith(expect.objectContaining({ currentSection: "products" }));
  });
});
