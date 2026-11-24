import { type CategoryDefinition, ref } from "../types";

export const cachingArchitecture: CategoryDefinition = {
  id: "caching-architecture",
  title: "Caching Architecture",
  description:
    "Keeping copies of data closer to where they are needed, at every layer from the browser to the database, and keeping those copies correct.",
  icon: "caching",
  order: 9,
  concepts: [
    ref("browser-caching"),
    {
      id: "http-cache-control",
      title: "HTTP Cache-Control",
      keywords: ["max-age", "no-store", "headers"],
    },
    {
      id: "etag",
      title: "ETag",
      keywords: ["304", "If-None-Match", "conditional request"],
    },
    {
      id: "cdn-caching",
      title: "CDN Caching",
      keywords: ["edge cache", "purge"],
    },
    {
      id: "reverse-proxy-caching",
      title: "Reverse Proxy Caching",
      keywords: ["NGINX", "Varnish"],
    },
    {
      id: "application-cache",
      title: "Application Cache",
      keywords: ["memoization"],
    },
    {
      id: "in-memory-caching",
      title: "In-Memory Caching",
      keywords: ["Redis", "Memcached"],
    },
    {
      id: "service-worker-cache",
      title: "Service Worker Cache",
      keywords: ["Cache API", "Workbox"],
    },
    {
      id: "cache-first-strategy",
      title: "Cache-First Strategy",
    },
    {
      id: "network-first-strategy",
      title: "Network-First Strategy",
    },
    {
      id: "stale-while-revalidate",
      title: "Stale-While-Revalidate",
      keywords: ["SWR"],
    },
    ref("cache-invalidation"),
    {
      id: "cache-expiration",
      title: "Cache Expiration",
      keywords: ["TTL", "LRU", "eviction"],
    },
    {
      id: "distributed-caching",
      title: "Distributed Caching",
      keywords: ["distributed cache", "Redis cluster"],
    },
  ],
};
