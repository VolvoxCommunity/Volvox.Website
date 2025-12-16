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
