import type { MessageCode, StepLinks } from "../../types";

/**
 * Language-free parts of the API Gateway module text: the terms and message of each step, the
 * code of every message, and code used in worked examples. SERVER ONLY (see ../../text.ts).
 */

const REQUEST_LINES = [
  "GET /api/orders?status=open HTTP/1.1",
  "Host: api.shop.example",
  "Authorization: Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6ImsxIn0…",
  "Accept: application/json",
];

export const messages: Readonly<Record<string, MessageCode>> = {
  request: { language: "http", lines: REQUEST_LINES },
  "expired-request": { language: "http", lines: REQUEST_LINES },
  forwarded: {
    language: "http",
    lines: [
      "GET /orders?status=open HTTP/1.1",
      "Host: orders.internal",
      "X-User-Id: u_7f3a",
      "X-Request-Id: 9c1e…",
      "traceparent: 00-4bf9…-01",
      "Forwarded: for=203.0.113.7;proto=https",
    ],
  },
  "users-call": {
    language: "http",
    lines: ["GET /users/u_7f3a HTTP/1.1", "Host: users.internal", "traceparent: 00-4bf9…-02"],
  },
  "users-reply": {
    language: "http",
    lines: [
      "HTTP/1.1 200 OK",
      "Content-Type: application/json",
      "",
      '{ "id": "u_7f3a", "name": "Ada Lovelace", "deliveryCity": "London" }',
    ],
  },
  "sql-query": {
    language: "sql",
    lines: [
      "SELECT id, status, total_cents, created_at",
      "FROM orders",
      "WHERE user_id = $1 AND status = 'open'",
      "ORDER BY created_at DESC",
      "LIMIT 20;",
    ],
  },
  "sql-rows": {
    language: "sql",
    lines: [
      " id   | status | total_cents | created_at",
      " 1042 | open   |        4599 | 2026-11-20 09:14",
      " 1038 | open   |        1250 | 2026-11-18 17:02",
    ],
  },
  "service-response": {
    language: "http",
    lines: [
      "HTTP/1.1 200 OK",
      "Content-Type: application/json",
      "Cache-Control: private, no-store",
      "",
      '{ "orders": [',
      '  { "id": 1042, "status": "open", "totalCents": 4599 },',
      '  { "id": 1038, "status": "open", "totalCents": 1250 }',
      '], "nextCursor": null }',
    ],
  },
  "final-response": {
    language: "http",
    lines: [
      "HTTP/2 200",
      "content-type: application/json",
      "content-encoding: br",
      "vary: Accept-Encoding",
      "cache-control: private, no-store",
      "access-control-allow-origin: https://shop.example",
      "strict-transport-security: max-age=63072000",
      "x-request-id: 9c1e…",
    ],
  },
  "401-response": {
    language: "http",
    lines: [
      "HTTP/1.1 401 Unauthorized",
      'WWW-Authenticate: Bearer error="invalid_token",',
      '  error_description="The access token expired"',
    ],
  },
  "refresh-request": {
    language: "http",
    lines: [
      "POST /oauth/token HTTP/1.1",
      "Host: id.shop.example",
      "Content-Type: application/x-www-form-urlencoded",
      "",
      "grant_type=refresh_token&refresh_token=…&client_id=shop-web",
    ],
  },
  "refresh-response": {
    language: "http",
    lines: [
      "HTTP/1.1 200 OK",
      "Content-Type: application/json",
      "",
      '{ "access_token": "eyJ…", "token_type": "Bearer", "expires_in": 900 }',
    ],
  },
  "429-response": {
    language: "http",
    lines: ["HTTP/1.1 429 Too Many Requests", "Retry-After: 20"],
  },
  "504-response": { language: "http", lines: ["HTTP/1.1 504 Gateway Timeout"] },
  "503-response": {
    language: "http",
    lines: ["HTTP/1.1 503 Service Unavailable", "Retry-After: 30"],
  },
};

export const steps: Readonly<Record<string, StepLinks>> = {
  "meet-the-client": { terms: ["client", "origin", "cors-preflight"] },
  "anatomy-of-a-request": {
    terms: ["http-method", "header", "bearer-token", "idempotent"],
    message: "request",
  },
  "across-the-network": { terms: ["dns", "tls", "rtt"], message: "request" },
  "one-front-door": {
    terms: ["reverse-proxy", "tls-termination", "north-south"],
    message: "request",
  },
  authentication: { terms: ["jwt", "jwks", "claims", "authn-authz"], message: "request" },
  "rate-limiting": { terms: ["token-bucket", "429", "retry-after"], message: "request" },
  "validation-and-routing": {
    terms: ["route-table", "load-balancing", "health-check", "trace-context"],
    message: "forwarded",
  },
  "business-logic": {
    terms: ["business-logic", "east-west", "timeout-budget"],
    message: "users-call",
  },
  "querying-the-database": {
    terms: ["index", "connection-pool", "sql-injection"],
    message: "sql-query",
  },
  "building-the-response": {
    terms: ["status-code", "json", "pagination"],
    message: "service-response",
  },
  "response-flows-back": {
    terms: ["compression", "access-log", "observability"],
    message: "final-response",
  },
  "full-lifecycle": { terms: ["latency", "tail-latency"] },

  "401-expired-token": { terms: ["jwt", "claims"], message: "expired-request" },
  "401-gateway-answers": { terms: ["401", "authn-authz"], message: "401-response" },
  "401-refresh-and-retry": { terms: ["refresh-token"], message: "refresh-request" },

  "429-burst": { terms: ["token-bucket"], message: "request" },
  "429-too-many": { terms: ["429", "retry-after"], message: "429-response" },
  "429-back-off": { terms: ["retry-after", "backoff"], message: "request" },

  "timeout-slow-service": { terms: ["timeout-budget"], message: "forwarded" },
  "timeout-gateway-answers": { terms: ["status-code"], message: "504-response" },
  "timeout-retry-with-backoff": { terms: ["backoff", "idempotent"], message: "request" },

  "503-instance-down": { terms: ["health-check"] },
  "503-routed-around": { terms: ["load-balancing", "health-check"], message: "forwarded" },
  "503-all-down": { terms: ["status-code", "retry-after"], message: "503-response" },
};

/** Code shown in worked examples (Advanced level), the same in every language. */
export const exampleCode = {
  preflight: [
    "OPTIONS /api/orders?status=open HTTP/1.1",
    "Origin: https://shop.example",
    "Access-Control-Request-Method: GET",
    "Access-Control-Request-Headers: authorization",
    "",
    "HTTP/1.1 204 No Content",
    "Access-Control-Allow-Origin: https://shop.example",
    "Access-Control-Allow-Headers: authorization",
    "Access-Control-Max-Age: 600",
  ],
  tokenClaims: [
    '{ "alg": "RS256", "kid": "k1" }',
    "{",
    '  "iss": "https://id.shop.example",',
    '  "aud": "api.shop.example",',
    '  "sub": "u_7f3a",',
    '  "scope": "orders:read",',
    '  "exp": 1795515300',
    "}",
  ],
  badRequest: [
    "HTTP/1.1 400 Bad Request",
    "Content-Type: application/problem+json",
    "",
    '{ "title": "Invalid query parameter",',
    '  "detail": "status must be open, shipped or cancelled" }',
  ],
  explain: [
    "-- Without an index",
    "Seq Scan on orders (rows=5000000)        ~800 ms",
    "-- With an index on (user_id, status, created_at DESC)",
    "Index Scan using orders_user_status (rows=2)  <1 ms",
  ],
  accessLog: [
    "2026-11-24T10:11:20Z GET /api/orders 200 41ms 450B",
    "  user=u_7f3a req=9c1e… upstream=orders-1",
  ],
  forbidden: [
    "HTTP/1.1 403 Forbidden",
    'WWW-Authenticate: Bearer error="insufficient_scope",',
    '  scope="orders:read"',
  ],
  idempotentPost: [
    "POST /api/orders HTTP/1.1",
    "Idempotency-Key: 5b2e9f0c-…",
    "Content-Type: application/json",
  ],
} as const;
