import '@testing-library/jest-dom';
import { vi, beforeEach } from 'vitest';

// Reset sessionStorage before each test so persistence state doesn't bleed between tests
beforeEach(() => {
  sessionStorage.clear();
});

// jsdom does not implement matchMedia — required by WorkspaceContext resize logic
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// jsdom does not implement ResizeObserver — required by Radix UI and cmdk.
// Must be a class (not arrow function) because components call `new ResizeObserver(...)`.
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// jsdom does not implement IntersectionObserver — used by some Radix scroll components
global.IntersectionObserver = class IntersectionObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// jsdom does not implement scrollIntoView — required by cmdk CommandDialog
Element.prototype.scrollIntoView = vi.fn();
