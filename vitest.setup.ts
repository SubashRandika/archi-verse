import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

/* jsdom lacks these browser APIs; components rely on them (layout mode, scroll areas). */
if (!window.matchMedia) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn((query: string) => ({
      // Default to the desktop layout, the product's primary target.
      matches: query.includes("min-width"),
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

if (!("ResizeObserver" in window)) {
  class ResizeObserverStub {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  Object.defineProperty(window, "ResizeObserver", { writable: true, value: ResizeObserverStub });
}

if (!Element.prototype.getAnimations) {
  // Base UI waits for exit animations via the Web Animations API.
  Element.prototype.getAnimations = () => [];
}

afterEach(() => {
  cleanup();
  window.localStorage.clear();
});
