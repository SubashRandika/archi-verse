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
      keywords: ["CWV", "web vitals"],
    },
    {
      id: "largest-contentful-paint",
      title: "Largest Contentful Paint (LCP)",
      keywords: ["LCP"],
    },
    {
      id: "interaction-to-next-paint",
      title: "Interaction to Next Paint (INP)",
      keywords: ["INP", "responsiveness"],
    },
    {
      id: "cumulative-layout-shift",
      title: "Cumulative Layout Shift (CLS)",
      keywords: ["CLS"],
    },
    {
      id: "code-splitting",
      title: "Code Splitting",
      keywords: ["chunks"],
    },
    {
      id: "lazy-loading",
      title: "Lazy Loading",
      keywords: ["React.lazy"],
    },
    {
      id: "dynamic-imports",
      title: "Dynamic Imports",
      keywords: ["import()"],
    },
    {
      id: "tree-shaking",
      title: "Tree Shaking",
      keywords: ["dead code elimination"],
    },
    {
      id: "bundle-optimization",
      title: "Bundle Optimization",
      keywords: ["minification", "bundle analyzer"],
    },
    {
      id: "image-optimization",
      title: "Image Optimization",
      keywords: ["AVIF", "WebP", "srcset", "responsive images"],
    },
    {
      id: "content-delivery-networks",
      title: "Content Delivery Networks (CDN)",
      keywords: ["CDN", "edge"],
    },
    {
      id: "browser-caching",
      title: "Browser Caching",
      keywords: ["browser cache", "HTTP cache"],
    },
    {
      id: "memory-management",
      title: "Memory Management",
      keywords: ["garbage collection", "memory leaks"],
    },
    {
      id: "virtualization",
      title: "Virtualization",
      keywords: ["windowing", "virtual list"],
    },
    {
      id: "debouncing-and-throttling",
      title: "Debouncing and Throttling",
      keywords: ["debounce", "throttle"],
    },
    {
      id: "prefetching",
      title: "Prefetching",
      keywords: ["preload", "prefetch"],
    },
    {
      id: "performance-budgets",
      title: "Performance Budgets",
    },
    {
      id: "real-user-monitoring",
      title: "Real User Monitoring (RUM)",
      keywords: ["RUM", "field data"],
    },
  ],
};
