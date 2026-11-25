import type { MessageCode, StepLinks } from "../../types";

/**
 * Language-free parts of the Retry and Exponential Backoff module text: each step's terms and
 * message, the code of every message, and code used in worked examples. SERVER ONLY (see
 * ../../text.ts).
 */

const KEY = "7f3a9c2e-4b1d-4e8a-9f60-2d5c1b8e3a47";

/** Each shopper pays for their own order. */
const ORDERS = {
  a: { order: 1042, amount: "12400.00", payment: "pay_81f2" },
  b: { order: 1043, amount: "3250.00", payment: "pay_3b7d" },
  c: { order: 1044, amount: "8900.00", payment: "pay_c41e" },
} as const;

const body = (order: number, amount: string) =>
  `{"orderId":${order},"amount":"${amount}","currency":"LKR"}`;

const payment = (order: number, amount: string, headers: string[] = []): string[] => [
  "POST /payments HTTP/1.1",
  "Host: api.shop.example",
  "Content-Type: application/json",
  ...headers,
  "",
  body(order, amount),
];

const insert = (order: number, amount: string): string[] => [
  "INSERT INTO charges (order_id, amount, currency, card)",
  `VALUES (${order}, ${amount}, 'LKR', 'tok_card_…')`,
  "RETURNING id;",
];

const created = (order: number, id: string, headers: string[] = []): string[] => [
  "HTTP/1.1 201 Created",
  "Content-Type: application/json",
  `Location: /payments/${id}`,
  ...headers,
  "",
  `{"id":"${id}","orderId":${order},"status":"succeeded"}`,
];

const UNAVAILABLE = [
  "HTTP/1.1 503 Service Unavailable",
  "Content-Type: application/json",
  "",
  '{"error":"service_unavailable","message":"Please try again shortly."}',
];

const RETRY_AFTER = [
  "HTTP/1.1 503 Service Unavailable",
  "Retry-After: 5",
  "Content-Type: application/json",
  "",
  '{"error":"service_unavailable","message":"Restarting. Please try again in 5 seconds."}',
];

const KEYED = payment(1042, "12400.00", [`Idempotency-Key: ${KEY}`]);

const perShopper = Object.fromEntries(
  Object.entries(ORDERS).flatMap(([x, { order, amount, payment: id }]) => [
    [`pay-${x}`, { language: "http", lines: payment(order, amount) }],
    [`charge-${x}`, { language: "sql", lines: insert(order, amount) }],
    [`charged-${x}`, { language: "text", lines: [`id = ${id}   (1 row inserted)`] }],
    [`created-${x}`, { language: "http", lines: created(order, id) }],
  ]),
) as Record<string, MessageCode>;

export const messages: Readonly<Record<string, MessageCode>> = {
  // The shoppers' payments, the charges and the answers (one set per shopper).
  ...perShopper,
  unavailable: { language: "http", lines: UNAVAILABLE },
  "retry-after": { language: "http", lines: RETRY_AFTER },
  "gave-up": {
    language: "text",
    lines: [
      "attempt 4 of 4 failed (503): stop retrying",
      "UI: “Payment didn’t go through. You weren’t charged. Please try again in a few minutes.”",
    ],
  },

  // Step 7: the answer is lost, and the retry charges again.
  "lost-response": {
    language: "text",
    lines: [
      'HTTP/1.1 201 Created   {"id":"pay_81f2","status":"succeeded"}',
      "connection reset on the way back: the app never sees this answer",
    ],
  },
  "charge-again": { language: "sql", lines: insert(1042, "12400.00") },
  "charged-again": {
    language: "text",
    lines: ["id = pay_9c07   (1 row inserted: a second charge for order 1042)"],
  },
  "created-again": { language: "http", lines: created(1042, "pay_9c07") },

  // Step 8: the same retry, with an idempotency key.
  "keyed-request": { language: "http", lines: KEYED },
  "keyed-retry": { language: "http", lines: KEYED },
  "store-key": {
    language: "sql",
    lines: [
      "BEGIN;",
      ...insert(1042, "12400.00"),
      "INSERT INTO idempotency_keys (key, request_hash, response, expires_at)",
      `VALUES ('${KEY}', 'sha256:9e1b…',`,
      `        '{"id":"pay_81f2",…}', now() + interval '24 hours');`,
      "COMMIT;",
    ],
  },
  "key-stored": {
    language: "text",
    lines: ["charge pay_81f2 and its key saved together (one transaction)"],
  },
  "key-lookup": {
    language: "sql",
    lines: ["SELECT request_hash, response FROM idempotency_keys", `WHERE key = '${KEY}';`],
  },
  "key-found": {
    language: "text",
    lines: [
      "found: saved 2.4 s ago, same request_hash",
      'response = 201 {"id":"pay_81f2","status":"succeeded"}',
    ],
  },
  replayed: {
    language: "http",
    lines: created(1042, "pay_81f2", ["Idempotent-Replayed: true"]),
  },

  // Scenario: retries multiply.
  "db-timeout": {
    language: "text",
    lines: ["query timed out after 2,000 ms (Payments DB overloaded)"],
  },
};

export const steps: Readonly<Record<string, StepLinks>> = {
  // Main path
  blip: {
    terms: ["transient-failure", "permanent-failure", "status-503"],
    message: "unavailable",
  },
  "try-again": { terms: ["retry", "retryable-error"], message: "pay-a" },
  storm: {
    terms: ["retry-storm", "metastable-failure", "load-amplification"],
    message: "unavailable",
  },
  backoff: { terms: ["exponential-backoff", "base-delay", "cap"], message: "pay-a" },
  jitter: { terms: ["jitter", "full-jitter", "thundering-herd"], message: "pay-b" },
  "give-up": {
    terms: ["max-attempts", "deadline", "retry-budget", "circuit-breaker"],
    message: "gave-up",
  },
  "double-charge": {
    terms: ["idempotent", "idempotent-methods", "at-least-once"],
    message: "lost-response",
  },
  "idempotency-key": {
    terms: ["idempotency-key", "exactly-once-effect"],
    message: "keyed-request",
  },
  // Scenario: the server says when
  "server-hint": { terms: ["retry-after", "status-503"], message: "retry-after" },
  "on-time": { terms: ["retry-after", "jitter"], message: "pay-b" },
  // Scenario: retries multiply
  "two-layers": { terms: ["load-amplification", "retry"], message: "db-timeout" },
  "one-layer": { terms: ["fail-fast", "retry-budget"], message: "unavailable" },
};

/** Code shown in the worked examples (the same in every language). */
export const exampleCode = {
  unavailable: UNAVAILABLE,
  isRetryable: [
    "function isRetryable(error: HttpError): boolean {",
    '  if (error.kind === "timeout" || error.kind === "network") return true;',
    "  return [408, 429, 502, 503, 504].includes(error.status);",
    "}",
  ],
  storm: [
    "normal traffic                           10 req/s   (capacity 10 req/s)",
    "each failure retried 2 more times, now  +20 req/s",
    "load on Payments                        30 req/s   → every request fails → more retries",
  ],
  backoff: [
    "attempt 1   fails (503)",
    "wait 1 s    attempt 2   fails",
    "wait 2 s    attempt 3   fails",
    "wait 4 s    attempt 4   succeeds        total wait 7 s",
    "(a 5th try would wait 8 s, then 16 s, then 30 s: the cap)",
  ],
  backoffCode: ["const delay = Math.min(1000 * 2 ** attemptIndex, 30_000); // TanStack Query"],
  jitterTable: [
    "             before attempt 2       before attempt 3",
    "             random(0, 1 s)         random(0, 2 s)",
    "Shopper A    0.4 s                  1.3 s",
    "Shopper B    0.9 s                  0.5 s",
    "Shopper C    0.7 s                  1.8 s",
  ],
  jitterCode: ["const delay = Math.random() * Math.min(capMs, baseMs * 2 ** attempt);"],
  giveUp: [
    "attempt 1   t = 0 s     503",
    "attempt 2   t = 1 s     503",
    "attempt 3   t = 3 s     503",
    "attempt 4   t = 7 s     503     → stop: max attempts reached (deadline 10 s)",
    "UI: “Payment didn’t go through. You weren’t charged. Please try again in a few minutes.”",
  ],
  doubleCharge: [
    "client    POST /payments  {orderId: 1042}  ──▶",
    "server    charge LKR 12,400 → saved as pay_81f2 → 201 Created  ──╳  (connection reset)",
    "client    timeout after 5 s → retry: POST /payments  {orderId: 1042}  ──▶",
    "server    charge LKR 12,400 → saved as pay_9c07 → 201 Created",
    "result    two charges for one order",
  ],
  keyed: KEYED,
  replayed: created(1042, "pay_81f2", ["Idempotent-Replayed: true"]),
  retryAfter: RETRY_AFTER.slice(0, 2),
  honour: [
    "Retry-After: 5          → wait 5 s + jitter random(0, 0.5 s)",
    "Retry-After: Wed, 25 Nov 2026 20:15:05 GMT  → wait until then (+ jitter)",
    "no header               → our own backoff: random(0, min(30 s, 1 s · 2^attempt))",
    "wait passes the deadline → give up now, don’t wait",
  ],
  multiply: [
    "client attempt 1 → Payments → DB ×4 → 503",
    "client attempt 2 → Payments → DB ×4 → 503",
    "client attempt 3 → Payments → DB ×4 → 503",
    "client attempt 4 → Payments → DB ×4 → 503      = 16 DB calls",
  ],
  oneLayer: [
    "client attempt 1 → Payments → DB ×1 → 503 (fail fast)",
    "client attempt 2 → Payments → DB ×1 → 503",
    "client attempt 3 → Payments → DB ×1 → 503",
    "client attempt 4 → Payments → DB ×1 → 503      = 4 DB calls",
  ],
} as const;
