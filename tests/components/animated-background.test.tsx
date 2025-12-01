import { render } from "@testing-library/react";
import { AnimatedBackground } from "@/components/animated-background";

describe("AnimatedBackground", () => {
  let originalGetContext: typeof HTMLCanvasElement.prototype.getContext;

  beforeEach(() => {
    originalGetContext = HTMLCanvasElement.prototype.getContext;
    // Mock getContext to return a minimal 2D context
    (HTMLCanvasElement.prototype.getContext as unknown) = jest.fn(() => ({
      fillRect: jest.fn(),
      clearRect: jest.fn(),
      getImageData: jest.fn(() => ({ data: [] })),
      putImageData: jest.fn(),
      createImageData: jest.fn(),
      createRadialGradient: jest.fn(() => ({
        addColorStop: jest.fn(),
      })),
      setTransform: jest.fn(),
      drawImage: jest.fn(),
      save: jest.fn(),
      restore: jest.fn(),
      scale: jest.fn(),
      rotate: jest.fn(),
      translate: jest.fn(),
      transform: jest.fn(),
      beginPath: jest.fn(),
      moveTo: jest.fn(),
      lineTo: jest.fn(),
      bezierCurveTo: jest.fn(),
      quadraticCurveTo: jest.fn(),
      arc: jest.fn(),
      fill: jest.fn(),
      stroke: jest.fn(),
      fillStyle: "",
      strokeStyle: "",
    }));
  });

  afterEach(() => {
    HTMLCanvasElement.prototype.getContext = originalGetContext;
  });
  it("renders canvas", () => {
    const { container } = render(<AnimatedBackground />);
    expect(container.querySelector("canvas")).toBeInTheDocument();
  });
});
