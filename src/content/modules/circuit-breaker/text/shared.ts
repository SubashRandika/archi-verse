import type { MessageCode, StepLinks } from "../../types";

/**
 * Language-free parts of the Circuit Breaker module text: each step's terms and message, the
 * code of every message, and code used in worked examples. SERVER ONLY (see ../../text.ts).
 */

const PAYMENTS_REQUEST = [
  "GET /payments?orderIds=1042,1043 HTTP/1.1",
  "Host: payments.internal",
  "traceparent: 00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01",
];

export const messages: Readonly<Record<string, MessageCode>> = {
  "orders-request": {
    language: "http",
    lines: [
      "GET /api/orders?status=open HTTP/1.1",
      "Host: api.shop.example",
      "Authorization: Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6ImsxIn0…",
    ],
  },
  "orders-response": {
    language: "http",
    lines: [
      "HTTP/1.1 200 OK",
      "Content-Type: application/json",
      "",
      '{"orders":[{"id":1042,"paymentStatus":"paid"},{"id":1043,"paymentStatus":"pending"}]}',
    ],
  },
  "payments-request": { language: "http", lines: PAYMENTS_REQUEST },
  "payments-response": {
    language: "http",
    lines: [
      "HTTP/1.1 200 OK",
      "Content-Type: application/json",
      "",
      '[{"orderId":1042,"status":"paid"},{"orderId":1043,"status":"pending"}]',
    ],
  },
  timeout: {
    language: "text",
    lines: [
      "GET http://payments.internal/payments?orderIds=1042,1043",
      "java.net.http.HttpTimeoutException: request timed out after 2000 ms",
      "CircuitBreaker 'payments': call failed, counted as a failure",
    ],
  },
  rejected: {
    language: "text",
    lines: [
      "io.github.resilience4j.circuitbreaker.CallNotPermittedException:",
      "CircuitBreaker 'payments' is OPEN and does not permit further calls",
      "(answered in 0.02 ms, Payments was not called)",
    ],
  },
  "fallback-response": {
    language: "http",
    lines: [
      "HTTP/1.1 200 OK",
      "Content-Type: application/json",
      "",
      '{"orders":[{"id":1042,"paymentStatus":"unknown"},{"id":1043,"paymentStatus":"unknown"}],',
      ' "degraded":["payments"]}',
    ],
  },
  "profile-request": {
    language: "http",
    lines: [
      "GET /api/me HTTP/1.1",
      "Host: api.shop.example",
      "Authorization: Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6ImsxIn0…",
    ],
  },
  "unavailable-response": {
    language: "http",
    lines: [
      "HTTP/1.1 503 Service Unavailable",
      "Retry-After: 10",
      "Content-Type: application/problem+json",
      "",
      '{"title":"Service unavailable","detail":"No free workers. Try again shortly."}',
    ],
  },
};

export const steps: Readonly<Record<string, StepLinks>> = {
  // Main path
  "healthy-chain": {
    terms: ["dependency", "synchronous-call", "circuit-breaker"],
    message: "payments-request",
  },
  "everyone-waits": {
    terms: ["cascading-failure", "thread-pool", "timeout", "littles-law"],
    message: "payments-request",
  },
  "meet-the-breaker": {
    terms: ["closed-state", "open-state", "half-open-state"],
    message: "payments-request",
  },
  "failures-add-up": {
    terms: ["failure-threshold", "sliding-window", "slow-call"],
    message: "timeout",
  },
  "breaker-trips": { terms: ["trip", "wait-duration"] },
  "fail-fast": {
    terms: ["fail-fast", "fallback", "graceful-degradation"],
    message: "fallback-response",
  },
  "half-open": { terms: ["trial-call", "probe"], message: "payments-response" },
  "closed-again": {
    terms: ["bulkhead", "retry-with-backoff", "service-mesh"],
    message: "orders-response",
  },
  // Scenario: without a breaker
  "queue-grows": { terms: ["thread-pool", "cascading-failure"], message: "payments-request" },
  "unrelated-pages-fail": {
    terms: ["service-unavailable", "cascading-failure"],
    message: "unavailable-response",
  },
  "retry-storm": {
    terms: ["retry-storm", "retry-with-backoff"],
    message: "unavailable-response",
  },
  // Scenario: the trial call fails
  "still-sick": { terms: ["half-open-state", "trial-call"], message: "timeout" },
  "open-again": { terms: ["wait-duration", "fallback"], message: "rejected" },
};

/** Code shown in the worked examples (the same in every language). */
export const exampleCode = {
  healthyCall: [
    "GET /payments?orderIds=1042,1043 HTTP/1.1   →   200 OK in 38 ms",
    '[{"orderId":1042,"status":"paid"},{"orderId":1043,"status":"pending"}]',
  ],
  threads: [
    "in flight = arrival rate × time per call     (Little's law)",
    "healthy:   20 req/s × 0.04 s =   0.8 threads busy",
    "timeout:   20 req/s × 2 s    =  40   threads busy   (of 50)",
    "no limit:  20 req/s × 10 s   = 200   threads needed (of 50)",
  ],
  config: [
    "slidingWindowType=COUNT_BASED   slidingWindowSize=5   minimumNumberOfCalls=5",
    "failureRateThreshold=100        slowCallRateThreshold=100   slowCallDurationThreshold=2s",
    "waitDurationInOpenState=30s     permittedNumberOfCallsInHalfOpenState=1",
  ],
  window: ["✓ ✓ ✗ ✓ ✗ ✗ ✓ ✗ ✗ ✗   →   6 of 10 failed = 60 %  ≥ 50 %   →   trip"],
  trip: [
    "12:04:17.302 WARN CircuitBreaker 'payments' changed state from CLOSED to OPEN",
    "             (failure rate 100.0 %, 5 of 5 calls)",
    'resilience4j_circuitbreaker_state{name="payments",state="open"} 1',
  ],
  fallback: [
    "HTTP/1.1 200 OK",
    "Content-Type: application/json",
    "",
    '{"orders":[{"id":1042,"paymentStatus":"unknown"},{"id":1043,"paymentStatus":"unknown"}],',
    ' "degraded":["payments"]}',
  ],
  halfOpen: [
    "12:04:17  CLOSED → OPEN        5 of 5 calls failed",
    "12:04:47  OPEN → HALF_OPEN     wait of 30 s over, 1 trial call permitted",
    "12:04:47  trial call           200 OK in 45 ms",
    "12:04:47  HALF_OPEN → CLOSED   window reset",
  ],
  noBreaker: [
    "12:04:20  orders  threads busy 50/50, queue 120/100 → rejecting",
    "12:04:21  lb      orders-1 health check failed (timeout) → removed",
    "12:04:23  orders  GET /api/me → 503 (no free workers)",
  ],
  retryStorm: [
    "users × retries = load",
    "1,000 × 1 try               =  1,000 requests",
    "1,000 × 3 retries, at once  =  4,000 requests, all in the same second",
    "1,000 × 3 retries, backoff 1 s, 2 s, 4 s + jitter  →  spread over 7 s",
  ],
  reopen: [
    "12:04:47  OPEN → HALF_OPEN    trial call permitted",
    "12:04:49  trial call          timed out after 2000 ms",
    "12:04:49  HALF_OPEN → OPEN    wait 30 s (next: 60 s, then 120 s, capped)",
  ],
} as const;
