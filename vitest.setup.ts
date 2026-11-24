import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { createElement, type ReactNode } from "react";
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

if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = () => {};
}

if (!Element.prototype.getAnimations) {
  // Base UI waits for exit animations via the Web Animations API.
  Element.prototype.getAnimations = () => [];
}

// jsdom has no canvas: report "no WebGL" quietly (instead of a "not implemented" error), so
// studio tests exercise the static fallback. The 3D scene is tested in the browser (e2e).
HTMLCanvasElement.prototype.getContext = (() =>
  null) as typeof HTMLCanvasElement.prototype.getContext;

/* Next.js router APIs are not available outside the framework; tests control the route. */
vi.mock("next/navigation", () => ({
  useParams: vi.fn(() => ({ conceptSlug: "api-gateway" })),
  usePathname: vi.fn(() => "/learn/api-gateway"),
  useRouter: vi.fn(() => ({ push: vi.fn(), replace: vi.fn(), prefetch: vi.fn(), back: vi.fn() })),
  notFound: vi.fn(),
}));

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    prefetch: _prefetch,
    ...props
  }: { href: string; children?: ReactNode; prefetch?: boolean } & Record<string, unknown>) =>
    createElement("a", { href, ...props }, children),
}));

afterEach(async () => {
  cleanup();
  window.localStorage.clear();
  const [{ useProgressStore }, { usePreferencesStore }] = await Promise.all([
    import("@/features/progress/progress-store"),
    import("@/features/preferences/preferences-store"),
  ]);
  useProgressStore.setState({ concepts: {} });
  usePreferencesStore.setState({
    explanationLevel: "beginner",
    locale: "en",
    playbackSpeed: 1,
    panelLayouts: {},
    lastConceptId: undefined,
  });
});
