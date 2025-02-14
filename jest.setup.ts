import "@testing-library/jest-dom";
import React from "react";

// Mock Next.js router and navigation
const mockRouter = {
  push: jest.fn(),
  replace: jest.fn(),
  prefetch: jest.fn(),
  back: jest.fn(),
  pathname: "/",
  query: {},
};

const mockSearchParams = new URLSearchParams();

// Create mock functions that can be accessed and modified in individual tests
const mockUseRouter = jest.fn(() => mockRouter);
const mockUseSearchParams = jest.fn(() => mockSearchParams);
const mockUsePathname = jest.fn(() => "/");

jest.mock("next/navigation", () => ({
  useRouter: () => mockUseRouter(),
  useSearchParams: () => mockUseSearchParams(),
  usePathname: () => mockUsePathname(),
}));

// Reset all mocks before each test
beforeEach(() => {
  // Reset Next.js navigation mocks to default values
  mockUseRouter.mockImplementation(() => mockRouter);
  mockUseSearchParams.mockImplementation(() => mockSearchParams);
  mockUsePathname.mockImplementation(() => "/");

  // Clear mock function calls
  mockRouter.push.mockClear();
  mockRouter.replace.mockClear();
  mockRouter.prefetch.mockClear();
  mockRouter.back.mockClear();

  // Make mocks available globally for test files
  global.__mocks__ = {
    mockUseRouter,
    mockUseSearchParams,
    mockUsePathname,
    mockRouter,
    mockSearchParams,
  };
});

// Mock fetch API
global.fetch = jest.fn(() => Promise.resolve({ ok: true })) as jest.Mock;

// Mock Next.js Image component
jest.mock("next/image", () => {
  const React = require("react");
  return function MockImage({ src = "", alt = "", ...props }) {
    // Convert boolean props to data attributes to avoid DOM warnings
    const { unoptimized, priority, fill, ...otherProps } = props;
    const dataProps: any = {
      ...otherProps,
      "data-testid": "next-image",
    };

    // Only add data attributes if the props are true
    if (unoptimized) dataProps["data-unoptimized"] = "true";
    if (priority) dataProps["data-priority"] = "true";
    if (fill) dataProps["data-fill"] = "true";

    return React.createElement("img", { src, alt, ...dataProps });
  };
});

// Mock window.matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock window.ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock window.IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation((callback) => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
  root: null,
  rootMargin: "",
  thresholds: [],
  takeRecords: () => [],
}));

// Mock localStorage
const storageMock = {
  store: {} as { [key: string]: string },
  getItem(key: string) {
    return this.store[key] || null;
  },
  setItem(key: string, value: string) {
    this.store[key] = value;
  },
  clear() {
    this.store = {};
  },
  removeItem(key: string) {
    delete this.store[key];
  },
  key(index: number) {
    return Object.keys(this.store)[index] || null;
  },
  get length() {
    return Object.keys(this.store).length;
  },
};

Object.defineProperty(window, "localStorage", {
  value: storageMock,
});

// Suppress console errors and warnings in tests
const originalError = console.error;
const originalWarn = console.warn;

beforeAll(() => {
  console.error = (...args: any[]) => {
    if (
      /Warning: ReactDOM.render is no longer supported in React 18/.test(
        args[0],
      ) ||
      /Warning: The current testing environment is not configured to support act/.test(
        args[0],
      )
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
  console.warn = (...args: any[]) => {
    if (/Warning: React.createFactory/.test(args[0])) {
      return;
    }
    originalWarn.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
  console.warn = originalWarn;
});
