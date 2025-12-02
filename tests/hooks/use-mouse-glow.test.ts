import { renderHook } from "@testing-library/react";
import { useMouseGlow } from "@/hooks/use-mouse-glow";
import type { MouseEvent as ReactMouseEvent } from "react";

describe("useMouseGlow", () => {
  it("updates css variables", () => {
    const { result } = renderHook(() => useMouseGlow());
    const ref = result.current.buttonRef;

    const element = document.createElement("button");
    // Assign the element to the ref's current property
    Object.defineProperty(ref, "current", {
      value: element,
      writable: true,
    });

    element.getBoundingClientRect = jest.fn(
      () =>
        ({
          left: 10,
          top: 10,
          width: 100,
          height: 100,
        }) as DOMRect
    );

    // Create a properly typed mock mouse event
    const mockEvent = {
      clientX: 60,
      clientY: 60,
    } as ReactMouseEvent<HTMLButtonElement>;

    result.current.handleMouseMove(mockEvent);

    // 60 - 10 = 50
    expect(element.style.getPropertyValue("--mouse-x")).toBe("50px");
    expect(element.style.getPropertyValue("--mouse-y")).toBe("50px");
  });
});
