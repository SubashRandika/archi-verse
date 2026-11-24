import type { MessageCode, StepLinks } from "../../types";

/**
 * Language-free parts of the Backend for Frontend module text: each step's terms and message,
 * the code of every message, and code used in worked examples. SERVER ONLY (see ../../text.ts).
 */

const MOBILE_ANSWER = [
  "HTTP/1.1 200 OK",
  "Content-Type: application/json",
  "Content-Length: 4113",
  "",
  '{"order":{"id":1042,"status":"On its way","total":"LKR 12,400",',
  ' "items":[{"name":"Desk lamp","qty":1},{"name":"USB-C cable","qty":2}]},',
  ' "deliverTo":"Colombo",',
  ' "suggestions":[{"id":88,"name":"Lamp bulb"},{"id":91,"name":"Cable clips"},{"id":17,"name":"Desk mat"}]}',
];

export const messages: Readonly<Record<string, MessageCode>> = {
  // Chapter 1: the general-purpose APIs, called by the apps themselves.
  "orders-request": {
    language: "http",
    lines: [
      "GET /orders/1042 HTTP/1.1",
      "Host: api.shop.example",
      "Authorization: Bearer eyJhbGci…",
    ],
  },
  "orders-response": {
    language: "http",
    lines: [
      "HTTP/1.1 200 OK",
      "Content-Type: application/json",
      "Content-Length: 21504",
      "",
      '{"id":1042,"userId":"u_7f3a","status":"SHIPPED","currency":"LKR",',
      ' "items":[{"sku":"LMP-204","name":"Desk lamp","qty":1,"unitPrice":9800,',
      '   "images":["https://img.shop.example/lmp-204/1600.jpg", …],"taxLines":[…]}, …],',
      ' "statusHistory":[…], "payments":[…], "createdAt":"2026-11-20T09:12:44Z", …}',
    ],
  },
  "users-request": {
    language: "http",
    lines: [
      "GET /users/u_7f3a/address HTTP/1.1",
      "Host: api.shop.example",
      "Authorization: Bearer eyJhbGci…",
    ],
  },
  "users-response": {
    language: "http",
    lines: [
      "HTTP/1.1 200 OK",
      "Content-Type: application/json",
      "Content-Length: 3072",
      "",
      '{"userId":"u_7f3a","line1":"42 Galle Road","city":"Colombo","postcode":"00300",',
      ' "country":"LK","phones":[…],"deliveryPreferences":{…},"updatedAt":"…"}',
    ],
  },
  "recommendations-request": {
    language: "http",
    lines: [
      "GET /recommendations?for=1042 HTTP/1.1",
      "Host: api.shop.example",
      "Authorization: Bearer eyJhbGci…",
    ],
  },
  "recommendations-response": {
    language: "http",
    lines: [
      "HTTP/1.1 200 OK",
      "Content-Type: application/json",
      "Content-Length: 14336",
      "",
      '{"for":1042,"products":[{"id":88,"name":"Lamp bulb","price":950,',
      '  "images":["https://img.shop.example/88/1200.jpg", …],"rating":4.6,…}, …12 products]}',
    ],
  },
  "delivery-request": {
    language: "http",
    lines: [
      "GET /orders/1042/delivery HTTP/1.1",
      "Host: api.shop.example",
      "Authorization: Bearer eyJhbGci…",
    ],
  },
  "delivery-response": {
    language: "http",
    lines: [
      "HTTP/1.1 200 OK",
      "Content-Type: application/json",
      "",
      '{"orderId":1042,"carrier":"…","estimatedDelivery":"2026-11-26"}',
    ],
  },

  // Chapter 2: each app asks its own BFF for its screen.
  "web-screen-request": {
    language: "http",
    lines: ["GET /web/order-details/1042 HTTP/1.1", "Host: shop.example", "Cookie: sid=9c1e…"],
  },
  "mobile-screen-request": {
    language: "http",
    lines: [
      "GET /app/v3/order-screen/1042 HTTP/1.1",
      "Host: api.shop.example",
      "Authorization: Bearer eyJhbGci…",
    ],
  },
  "bff-orders-request": {
    language: "http",
    lines: ["GET /orders/1042 HTTP/1.1", "Host: orders.internal"],
  },
  "bff-users-request": {
    language: "http",
    lines: ["GET /users/u_7f3a/address HTTP/1.1", "Host: users.internal"],
  },
  "bff-recommendations-request": {
    language: "http",
    lines: ["GET /recommendations?for=1042&limit=3 HTTP/1.1", "Host: recommendations.internal"],
  },
  "web-response": {
    language: "http",
    lines: [
      "HTTP/1.1 200 OK",
      "Content-Type: application/json",
      "Content-Length: 38912",
      "",
      '{"order":{"id":1042,"status":"On its way","placed":"20 Nov 2026","total":"LKR 12,400",',
      ' "items":[{"name":"Desk lamp","qty":1,"price":"LKR 9,800","image":"…/lmp-204/800.jpg"}, …]},',
      ' "deliverTo":{"name":"…","lines":["42 Galle Road","Colombo 00300"]},',
      ' "suggestions":[…12 products with images]}',
    ],
  },
  "mobile-response": { language: "http", lines: MOBILE_ANSWER },

  // Scenario: one service is slow.
  "partial-response": {
    language: "http",
    lines: [
      "HTTP/1.1 200 OK",
      "Content-Type: application/json",
      "",
      '{"order":{"id":1042,"status":"On its way","total":"LKR 12,400","items":[…]},',
      ' "deliverTo":"Colombo",',
      ' "suggestions":null, "missing":["suggestions"]}',
    ],
  },
  "late-response": {
    language: "text",
    lines: [
      "recommendations answered after 1,240 ms (budget 200 ms)",
      "the screen was already answered without it: result dropped",
    ],
  },

  // Scenario: a web-only change.
  "web-response-v2": {
    language: "http",
    lines: [
      "HTTP/1.1 200 OK",
      "Content-Type: application/json",
      "",
      '{"order":{"id":1042,"status":"On its way","estimatedDelivery":"Thursday 26 Nov", …},',
      ' "deliverTo":{…}, "suggestions":[…]}',
    ],
  },
};

export const steps: Readonly<Record<string, StepLinks>> = {
  // Main path
  "one-api": {
    terms: ["general-purpose-api", "round-trip", "client-side-composition"],
    message: "orders-request",
  },
  "chatty-mobile": { terms: ["latency", "chatty-api"], message: "users-request" },
  "too-much": { terms: ["over-fetching", "under-fetching"], message: "orders-response" },
  "meet-bffs": { terms: ["bff", "experience-api", "api-gateway"] },
  aggregation: {
    terms: ["aggregation", "fan-out", "parallel-calls"],
    message: "mobile-screen-request",
  },
  shaped: { terms: ["response-shaping", "payload"], message: "mobile-response" },
  ownership: { terms: ["conways-law", "token-handler", "httponly-cookie"] },
  costs: { terms: ["code-duplication", "api-gateway", "graphql"], message: "bff-orders-request" },
  // Scenario: one service is slow
  "recommendations-slow": {
    terms: ["fan-out", "time-budget"],
    message: "bff-recommendations-request",
  },
  "partial-answer": { terms: ["partial-response", "time-budget"], message: "partial-response" },
  // Scenario: a web-only change
  "new-field": { terms: ["response-shaping", "conways-law"] },
  "web-sees-it": { terms: ["experience-api", "bff"], message: "web-response-v2" },
};

/** Code shown in the worked examples (the same in every language). */
export const exampleCode = {
  wifi: [
    "GET /orders/1042                 40 ms",
    "GET /users/u_7f3a/address        40 ms   (needs userId from the order)",
    "GET /recommendations?for=1042    40 ms",
    "total                           120 ms",
  ],
  mobile: [
    "GET /orders/1042                300 ms",
    "GET /users/u_7f3a/address       300 ms",
    "GET /recommendations?for=1042   300 ms",
    "total                           900 ms   (plus any connection setup)",
  ],
  received: [
    "/orders/1042            21 KB   (items with photos, prices, tax lines, history)",
    "/users/…/address         3 KB   (full address, phone numbers, preferences)",
    "/recommendations        14 KB   (12 products with images)",
    "received                38 KB   used ≈ 4 KB",
  ],
  paths: [
    "web     →  gateway  →  web-bff.internal     →  orders, users, recommendations",
    "mobile  →  gateway  →  mobile-bff.internal  →  orders, users, recommendations",
  ],
  timing: [
    "phone → Mobile BFF                       300 ms   (one mobile round trip)",
    "BFF → orders                              25 ms",
    "BFF → users ∥ recommendations             55 ms   (in parallel: the slower one counts)",
    "total                                   ≈ 380 ms   (was 900 ms)",
  ],
  mobileAnswer: MOBILE_ANSWER,
  tokens: [
    "without BFF:  browser holds  access_token + refresh_token   (readable by any page script)",
    "with BFF:     browser holds  Set-Cookie: sid=…; HttpOnly; Secure; SameSite=Strict",
    "              BFF holds      the tokens, and adds Authorization: Bearer … to service calls",
  ],
  budget: [
    "GET /app/v3/order-screen/1042          overall budget 600 ms",
    "  orders           required   timeout 250 ms   →  25 ms   ✓",
    "  users            required   timeout 250 ms   →  30 ms   ✓",
    "  recommendations  optional   timeout 200 ms   →  —       ✗ timed out",
  ],
  partial: [
    "HTTP/1.1 200 OK",
    "Content-Type: application/json",
    "",
    '{"order":{…}, "deliverTo":"Colombo", "suggestions":null, "missing":["suggestions"]}',
  ],
  webChange: [
    "// web-bff/src/order-details.ts",
    "  status: order.status,",
    "+ estimatedDelivery: formatDay(order.delivery.estimate),   // already in /orders/1042",
  ],
  contracts: [
    "web  v2.5   {order:{…, estimatedDelivery}, deliverTo, suggestions}   deployed today",
    "app  v3     {order:{…}, deliverTo, suggestions}                      unchanged",
    "app  v2     (still on 18 % of phones)                                unchanged",
  ],
} as const;
