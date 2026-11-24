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
      summary:
        "The response header that tells browsers and shared caches whether, where and for how long a response may be cached.",
      keywords: ["max-age", "no-store", "headers"],
    },
    {
      id: "etag",
      title: "ETag",
      summary:
        "A version identifier for a response that lets clients revalidate cheaply and get 304 Not Modified when nothing changed.",
      keywords: ["304", "If-None-Match", "conditional request"],
    },
    {
      id: "cdn-caching",
      title: "CDN Caching",
      summary:
        "Caching responses at CDN edge locations, controlled by cache keys, time-to-live values and purging.",
      keywords: ["edge cache", "purge"],
    },
    {
      id: "reverse-proxy-caching",
      title: "Reverse Proxy Caching",
      summary:
        "A server in front of the application, such as NGINX or Varnish, that caches responses for all clients.",
      keywords: ["NGINX", "Varnish"],
    },
    {
      id: "application-cache",
      title: "Application Cache",
      summary:
        "Caching computed results or query data inside the application to avoid repeating expensive work.",
      keywords: ["memoization"],
    },
    {
      id: "in-memory-caching",
      title: "In-Memory Caching",
      summary:
        "Keeping frequently used data in process memory or in a memory store such as Redis for very fast access.",
      keywords: ["Redis", "Memcached"],
    },
    {
      id: "service-worker-cache",
      title: "Service Worker Cache",
      summary:
        "The Cache Storage API, used by a service worker to store responses for offline use and fast repeat loads.",
      keywords: ["Cache API", "Workbox"],
    },
    {
      id: "cache-first-strategy",
      title: "Cache-First Strategy",
      summary:
        "Serve from the cache when possible and go to the network only on a miss, which suits versioned static assets.",
    },
    {
      id: "network-first-strategy",
      title: "Network-First Strategy",
      summary:
        "Try the network first and fall back to the cache when offline, which suits frequently changing content.",
    },
    {
      id: "stale-while-revalidate",
      title: "Stale-While-Revalidate",
      summary:
        "Serve the cached version immediately and refresh it in the background for next time.",
      keywords: ["SWR"],
    },
    ref("cache-invalidation"),
    {
      id: "cache-expiration",
      title: "Cache Expiration",
      summary:
        "Limiting how long cached data is trusted, with time-to-live values and eviction policies such as least-recently-used.",
      keywords: ["TTL", "LRU", "eviction"],
    },
    {
      id: "distributed-caching",
      title: "Distributed Caching",
      summary:
        "A cache shared by many application servers and spread across several nodes, such as a Redis cluster.",
      keywords: ["distributed cache", "Redis cluster"],
    },
  ],
};
