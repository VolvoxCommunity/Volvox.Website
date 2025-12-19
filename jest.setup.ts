/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unused-vars, @typescript-eslint/no-require-imports */
import "@testing-library/jest-dom";

// Mock ResizeObserver for Radix UI components
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock @upstash/redis to avoid ESM import issues
jest.mock("@upstash/redis", () => ({
  Redis: jest.fn().mockImplementation(() => ({
    get: jest.fn(),
    mget: jest.fn(),
    incr: jest.fn(),
  })),
}));

// Mock framer-motion to avoid props passing to DOM
jest.mock("framer-motion", () => {
  const React = require("react");
  const actual = jest.requireActual("framer-motion");

  const createMockComponent = (tag: string) => {
    const Component = React.forwardRef(
      (
        {
          children,
          whileHover,
          whileTap,
          whileInView,
          viewport,
          initial,
          animate,
          exit,
          variants,
          transition,
          ...props
        }: any,
        ref: any
      ) => {
        return React.createElement(tag, { ...props, ref }, children);
      }
    );
    Component.displayName = `Motion${tag}`;
    return Component;
  };

  return {
    ...actual,
    motion: new Proxy(
      {},
      {
        get: (_target, prop) => {
          if (typeof prop === "string") {
            return createMockComponent(prop);
          }
          return actual.motion[prop];
        },
      }
    ),
    AnimatePresence: ({ children }: any) => children,
  };
});
