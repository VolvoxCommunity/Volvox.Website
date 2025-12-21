/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any */
import "@testing-library/jest-dom";
import React from "react";

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

// Mock framer-motion to remove animation props from DOM elements
jest.mock("framer-motion", () => ({
  motion: {
    div: ({
      whileTap,
      whileHover,
      whileInView,
      exit,
      layout,
      layoutId,
      viewport,
      initial,
      animate,
      transition,
      variants,
      ...props
    }: any) => React.createElement("div", props),
    section: ({
      whileTap,
      whileHover,
      whileInView,
      exit,
      layout,
      layoutId,
      viewport,
      initial,
      animate,
      transition,
      variants,
      ...props
    }: any) => React.createElement("section", props),
    h1: ({
      whileTap,
      whileHover,
      whileInView,
      exit,
      layout,
      layoutId,
      viewport,
      initial,
      animate,
      transition,
      variants,
      ...props
    }: any) => React.createElement("h1", props),
    h2: ({
      whileTap,
      whileHover,
      whileInView,
      exit,
      layout,
      layoutId,
      viewport,
      initial,
      animate,
      transition,
      variants,
      ...props
    }: any) => React.createElement("h2", props),
    p: ({
      whileTap,
      whileHover,
      whileInView,
      exit,
      layout,
      layoutId,
      viewport,
      initial,
      animate,
      transition,
      variants,
      ...props
    }: any) => React.createElement("p", props),
    span: ({
      whileTap,
      whileHover,
      whileInView,
      exit,
      layout,
      layoutId,
      viewport,
      initial,
      animate,
      transition,
      variants,
      ...props
    }: any) => React.createElement("span", props),
    a: ({
      whileTap,
      whileHover,
      whileInView,
      exit,
      layout,
      layoutId,
      viewport,
      initial,
      animate,
      transition,
      variants,
      ...props
    }: any) => React.createElement("a", props),
    button: ({
      whileTap,
      whileHover,
      whileInView,
      exit,
      layout,
      layoutId,
      viewport,
      initial,
      animate,
      transition,
      variants,
      ...props
    }: any) => React.createElement("button", props),
    li: ({
      whileTap,
      whileHover,
      whileInView,
      exit,
      layout,
      layoutId,
      viewport,
      initial,
      animate,
      transition,
      variants,
      ...props
    }: any) => React.createElement("li", props),
    ul: ({
      whileTap,
      whileHover,
      whileInView,
      exit,
      layout,
      layoutId,
      viewport,
      initial,
      animate,
      transition,
      variants,
      ...props
    }: any) => React.createElement("ul", props),
  },
  AnimatePresence: ({ children }: any) =>
    React.createElement(React.Fragment, null, children as React.ReactNode),
}));
