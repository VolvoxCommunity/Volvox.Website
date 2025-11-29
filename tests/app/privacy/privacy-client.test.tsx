import { render, screen, fireEvent } from "@testing-library/react";
import { PrivacyClient } from "@/app/privacy/privacy-client";
import { useRouter } from "next/navigation";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/components/navigation", () => ({
  Navigation: ({ onNavigate }: any) => (
    <div>
      <button onClick={() => onNavigate("home")}>Nav Home</button>
      <button onClick={() => onNavigate("about")}>Nav About</button>
    </div>
  ),
}));
jest.mock("@/components/animated-background", () => ({ AnimatedBackground: () => <div>BG</div> }));
jest.mock("@/components/footer", () => ({ Footer: () => <div>Footer</div> }));

describe("PrivacyClient", () => {
  it("renders correctly", () => {
    (useRouter as jest.Mock).mockReturnValue({ push: jest.fn() });
    render(<PrivacyClient />);
    expect(screen.getByText("Privacy Policy")).toBeInTheDocument();
    expect(screen.getByText("BG")).toBeInTheDocument();
    expect(screen.getByText("Footer")).toBeInTheDocument();
  });

  it("navigates home", () => {
    const push = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push });
    render(<PrivacyClient />);
    fireEvent.click(screen.getByText("Nav Home"));
    expect(push).toHaveBeenCalledWith("/");
  });

  it("navigates to section", () => {
    const push = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push });
    render(<PrivacyClient />);
    fireEvent.click(screen.getByText("Nav About"));
    expect(push).toHaveBeenCalledWith("/#about");
  });
});
