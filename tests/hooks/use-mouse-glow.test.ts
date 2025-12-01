import { renderHook } from "@testing-library/react";
import { useMouseGlow } from "@/hooks/use-mouse-glow";

describe("useMouseGlow", () => {
  it("updates css variables", () => {
    const { result } = renderHook(() => useMouseGlow());
    const ref = result.current.buttonRef;

    const element = document.createElement("button");
    (ref as any).current = element;

    element.getBoundingClientRect = jest.fn(
      () =>
        ({
          left: 10,
          top: 10,
          width: 100,
          height: 100,
        }) as DOMRect
    );

    result.current.handleMouseMove({ clientX: 60, clientY: 60 } as any);

    // 60 - 10 = 50
    expect(element.style.getPropertyValue("--mouse-x")).toBe("50px");
    expect(element.style.getPropertyValue("--mouse-y")).toBe("50px");
  });
});
