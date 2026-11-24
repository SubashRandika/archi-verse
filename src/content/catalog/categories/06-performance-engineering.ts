import type { CategoryDefinition } from "../types";

export const performanceEngineering: CategoryDefinition = {
  id: "performance-engineering",
  title: "Performance Engineering & Scalability",
  description:
    "Measuring and improving how fast an application loads and responds, and keeping it fast as it grows.",
  icon: "performance",
  order: 6,
  concepts: [
    {
      id: "core-web-vitals",
      title: "Core Web Vitals",
      summary:
        "Google's user-centred performance metrics for loading (LCP), responsiveness (INP) and visual stability (CLS).",
      keywords: ["CWV", "web vitals"],
    },
    {
      id: "largest-contentful-paint",
      title: "Largest Contentful Paint (LCP)",
      summary:
        "The time until the largest visible element, often a hero image or heading, is rendered. Good is 2.5 seconds or less.",
      keywords: ["LCP"],
    },
    {
      id: "interaction-to-next-paint",
      title: "Interaction to Next Paint (INP)",
      summary:
        "How quickly the page visibly responds to interactions throughout a visit. Good is 200 milliseconds or less.",
      keywords: ["INP", "responsiveness"],
    },
    {
      id: "cumulative-layout-shift",
      title: "Cumulative Layout Shift (CLS)",
      summary:
        "How much visible content moves unexpectedly while the page is in use. Good is 0.1 or less.",
      keywords: ["CLS"],
    },
    {
      id: "code-splitting",
      title: "Code Splitting",
      summary:
        "Breaking a JavaScript bundle into smaller chunks that load only when they are needed.",
      keywords: ["chunks"],
    },
    {
      id: "lazy-loading",
      title: "Lazy Loading",
      summary:
        "Deferring the loading of code, images or components until they are actually needed.",
      keywords: ["React.lazy"],
    },
    {
      id: "dynamic-imports",
      title: "Dynamic Imports",
      summary:
        "Loading a JavaScript module on demand with import(), which bundlers turn into a separate chunk.",
      keywords: ["import()"],
    },
    {
      id: "tree-shaking",
      title: "Tree Shaking",
      summary: "Removing unused exports from a bundle by statically analysing ES module imports.",
      keywords: ["dead code elimination"],
    },
    {
      id: "bundle-optimization",
      title: "Bundle Optimization",
      summary:
        "Reducing the size and number of JavaScript and CSS files through minification, compression, deduplication and analysis.",
      keywords: ["minification", "bundle analyzer"],
    },
    {
      id: "image-optimization",
      title: "Image Optimization",
      summary:
        "Serving images in the right format, size and quality for each device, and loading them at the right moment.",
      keywords: ["AVIF", "WebP", "srcset", "responsive images"],
    },
    {
      id: "content-delivery-networks",
      title: "Content Delivery Networks (CDN)",
      summary:
        "Geographically distributed servers that deliver content from a location close to each user.",
      keywords: ["CDN", "edge"],
    },
    {
      id: "browser-caching",
      title: "Browser Caching",
      summary:
        "The browser storing responses locally, so repeat visits need fewer network requests or none at all.",
      keywords: ["browser cache", "HTTP cache"],
    },
    {
      id: "memory-management",
      title: "Memory Management",
      summary:
        "How JavaScript allocates and garbage-collects memory, and how to find and fix leaks in long-lived applications.",
      keywords: ["garbage collection", "memory leaks"],
    },
    {
      id: "virtualization",
      title: "Virtualization",
      summary:
        "Rendering only the visible part of a long list or grid, so thousands of rows stay fast.",
      keywords: ["windowing", "virtual list"],
    },
    {
      id: "debouncing-and-throttling",
      title: "Debouncing and Throttling",
      summary:
        "Limiting how often a function runs: debouncing waits for a pause, throttling runs it at most once per interval.",
      keywords: ["debounce", "throttle"],
    },
    {
      id: "prefetching",
      title: "Prefetching",
      summary:
        "Loading resources or data the user is likely to need next, before they ask for them.",
      keywords: ["preload", "prefetch"],
    },
    {
      id: "performance-budgets",
      title: "Performance Budgets",
      summary:
        "Agreed limits on metrics such as bundle size or LCP, checked in CI so performance does not quietly regress.",
    },
    {
      id: "real-user-monitoring",
      title: "Real User Monitoring (RUM)",
      summary:
        "Collecting performance data from real users' browsers, as opposed to measuring in a lab.",
      keywords: ["RUM", "field data"],
    },
  ],
};
