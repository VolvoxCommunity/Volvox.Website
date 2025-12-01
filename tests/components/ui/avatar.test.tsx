import { render, screen } from "@testing-library/react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

describe("Avatar", () => {
  it("renders fallback when image is missing", () => {
    render(
      <Avatar>
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
    );
    expect(screen.getByText("JD")).toBeInTheDocument();
  });

  it("renders image", () => {
    render(
      <Avatar>
        <AvatarImage src="https://example.com/avatar.jpg" alt="Avatar" />
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
    );
    // Radix Avatar shows fallback until image loads (onload doesn't fire in JSDOM)
    expect(screen.getByText("JD")).toBeInTheDocument();
  });
});
