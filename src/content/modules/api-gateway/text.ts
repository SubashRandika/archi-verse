import type { ExplanationBlock, LevelText, ModuleText, StepText } from "../types";

/**
 * API Gateway module text. SERVER ONLY: read by the inspector route and delivered as route
 * data (never imported by client components; enforced by ESLint).
 * Source: docs/modules/api-gateway.md (approved 2026-11-24).
 */

const p = (text: string): ExplanationBlock => ({ type: "paragraph", text });
const callout = (text: string): ExplanationBlock => ({ type: "callout", text });
const list = (...items: (string | [term: string, text: string])[]): ExplanationBlock => ({
  type: "list",
  items: items.map((item) =>
    typeof item === "string" ? { text: item } : { term: item[0], text: item[1] },
  ),
});
const step = (
  beginner: ExplanationBlock[],
  advanced: ExplanationBlock[],
  terms: string[],
  message?: string,
): StepText => ({ explanation: { beginner, advanced } satisfies LevelText, terms, message });

const REQUEST_LINES = [
  "GET /api/orders?status=open HTTP/1.1",
  "Host: api.shop.example",
  "Authorization: Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6ImsxIn0…",
  "Accept: application/json",
];

export const apiGatewayText: ModuleText = {
  messages: {
    request: { caption: "The request the browser sends", language: "http", lines: REQUEST_LINES },
    "expired-request": {
      caption: "The same request, with a token that expired 4 minutes ago",
      language: "http",
      lines: REQUEST_LINES,
    },
    forwarded: {
      caption: "The request the gateway forwards to Orders",
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
      caption: "Orders asks the Users service (inside the system)",
      language: "http",
      lines: ["GET /users/u_7f3a HTTP/1.1", "Host: users.internal", "traceparent: 00-4bf9…-02"],
    },
    "users-reply": {
      caption: "The Users service answers",
      language: "http",
      lines: [
        "HTTP/1.1 200 OK",
        "Content-Type: application/json",
        "",
        '{ "id": "u_7f3a", "name": "Ada Lovelace", "deliveryCity": "London" }',
      ],
    },
    "sql-query": {
      caption: "The query Orders sends to PostgreSQL",
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
      caption: "PostgreSQL returns two rows",
      language: "sql",
      lines: [
        " id   | status | total_cents | created_at",
        " 1042 | open   |        4599 | 2026-11-20 09:14",
        " 1038 | open   |        1250 | 2026-11-18 17:02",
      ],
    },
    "service-response": {
      caption: "The response the Orders service builds",
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
      caption: "The response the browser receives",
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
      caption: "The gateway's answer",
      language: "http",
      lines: [
        "HTTP/1.1 401 Unauthorized",
        'WWW-Authenticate: Bearer error="invalid_token",',
        '  error_description="The access token expired"',
      ],
    },
    "refresh-request": {
      caption: "The app asks the identity provider for a new access token",
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
      caption: "A fresh access token",
      language: "http",
      lines: [
        "HTTP/1.1 200 OK",
        "Content-Type: application/json",
        "",
        '{ "access_token": "eyJ…", "token_type": "Bearer", "expires_in": 900 }',
      ],
    },
    "429-response": {
      caption: "The gateway's answer",
      language: "http",
      lines: ["HTTP/1.1 429 Too Many Requests", "Retry-After: 20"],
    },
    "504-response": {
      caption: "The gateway's answer",
      language: "http",
      lines: ["HTTP/1.1 504 Gateway Timeout"],
    },
    "503-response": {
      caption: "The gateway's answer",
      language: "http",
      lines: ["HTTP/1.1 503 Service Unavailable", "Retry-After: 30"],
    },
  },

  steps: {
    // ----- Chapter 1: The request ---------------------------------------------------------
    "meet-the-client": step(
      [
        p(
          "The browser is where the story starts. The shop’s web page needs your open orders, but the orders don’t live in the browser: they live on servers somewhere else. So the page has to ask for them, by sending a request over the internet.",
        ),
        p(
          "The page only knows one address for everything it needs: api.shop.example. Behind that single address sit several separate services. Which one actually answers is not the browser’s problem. That is exactly the job of the API gateway you will meet in step 4.",
        ),
      ],
      [
        p(
          "The client is a single-page app served from shop.example, calling an API on a different origin, api.shop.example. Because the request carries an Authorization header, it is not a CORS “simple request”: the browser first sends an OPTIONS preflight, and only sends the real request if the API answers with matching Access-Control-Allow-* headers. The preflight result can be cached (Access-Control-Max-Age), so it is usually paid once per session, not per call.",
        ),
        p(
          "The client is deliberately unaware of the topology behind the API. One host, one auth scheme and one error format keep it simple, and let the backend change without a client release.",
        ),
      ],
      ["client", "origin", "cors-preflight"],
    ),

    "anatomy-of-a-request": step(
      [
        p(
          "Before anything moves, the browser writes a request. Think of it as a letter: an address on the envelope, a few notes about who is asking, and sometimes something inside.",
        ),
        list(
          ["Method", "what you want to do. GET means “please give me”."],
          ["Path", "which thing you want, here the list of open orders."],
          [
            "Headers",
            "extra notes, such as who you are (the token) and which format you can read.",
          ],
          ["Body", "the contents of the letter. A GET request has none."],
        ),
        callout("The blue packet in the scene is this request. Click it to read it."),
      ],
      [
        p(
          "An HTTP request is a method, a target, header fields and an optional body. HTTP/2 and HTTP/3 keep these semantics but encode them as binary frames: the method and path travel as pseudo-headers (:method, :path), and header fields are compressed with HPACK or QPACK.",
        ),
        list(
          [
            "Safe and idempotent",
            "GET must not change server state. That is what lets gateways, CDNs and clients cache it and retry it (scenario “Timeout, then retry”).",
          ],
          [
            "Authorization",
            "carries a signed JWT. The gateway verifies it in step 5 without calling the identity provider.",
          ],
          [
            "Accept",
            "starts content negotiation. A server that cannot produce JSON should answer 406 Not Acceptable.",
          ],
        ),
      ],
      ["http-method", "header", "bearer-token", "idempotent"],
      "request",
    ),

    "across-the-network": step(
      [
        p(
          "The request now crosses the internet. First the browser looks up where api.shop.example lives (DNS, the internet’s phone book). Then it opens a secure connection: the two sides agree on secret keys so nobody along the way can read or change the request. That is the padlock in your address bar.",
        ),
        p(
          "The trip passes through many routers, and distance matters: even at the speed of light in fibre, crossing a continent takes tens of milliseconds. That is why the browser keeps the connection open and reuses it for the next requests, instead of starting over each time.",
        ),
      ],
      [
        p(
          "A cold request pays for DNS resolution, a TCP handshake (1 round trip) and a TLS 1.3 handshake (1 more round trip) before the first byte of HTTP. HTTP/3 runs over QUIC, which merges the transport and TLS handshakes into a single round trip, and both TLS 1.3 and QUIC support 0-RTT resumption (only safe for idempotent requests, because 0-RTT data can be replayed).",
        ),
        p(
          "In practice the connection is warm: HTTP/2 or HTTP/3 multiplexes many requests over one connection, so the per-request cost is one network round trip. Real deployments usually put a CDN or a load balancer in front of the gateway; this scene leaves them out to keep the focus on the gateway.",
        ),
      ],
      ["dns", "tls", "rtt"],
      "request",
    ),

    // ----- Chapter 2: The gateway ---------------------------------------------------------
    "one-front-door": step(
      [
        p(
          "The API gateway is the front door of the whole system. Every request from the outside comes in here first, and nowhere else.",
        ),
        p(
          "Think of a hotel reception desk. Guests never wander the corridors looking for the right room: reception checks who they are, makes sure they are allowed in, and sends them to the right place. The gateway does the same for requests.",
        ),
        p(
          "Its first job is to unwrap the secure connection (the TLS station lighting up), so it can read the request and decide what to do with it.",
        ),
      ],
      [
        p(
          "An API gateway is a reverse proxy that is the single entry point for client (“north–south”) traffic. It terminates TLS and applies cross-cutting concerns once, before any service is involved: authentication, rate limiting, validation, routing, observability. Services stay focused on business logic, and the internal topology stays private.",
        ),
        list(
          [
            "vs. load balancer",
            "a load balancer spreads connections across instances; a gateway also understands the API (paths, methods, identities). Many gateways include load balancing.",
          ],
          [
            "vs. service mesh",
            "a mesh handles service-to-service (“east–west”) traffic inside the system. Gateway and mesh are complementary.",
          ],
          [
            "Availability",
            "the gateway is on every request’s path, so it runs as several identical, stateless replicas. Shared state such as rate-limit counters lives in a separate store.",
          ],
        ),
      ],
      ["reverse-proxy", "tls-termination", "north-south"],
      "request",
    ),

    authentication: step(
      [
        p(
          "Next, the gateway checks the pass. The token in the request was issued by the identity provider when you signed in. The gateway checks three things:",
        ),
        list(
          "it is genuine: signed by the identity provider, and not changed since;",
          "it is still valid: tokens expire after a short time, often minutes;",
          "it was meant for this API, not some other system.",
        ),
        p(
          "Notice what does not happen: the gateway does not phone the identity provider to ask. It keeps a copy of the provider’s public keys and checks the signature itself, which takes a fraction of a millisecond.",
        ),
      ],
      [
        p(
          "The token is a JWT signed with the identity provider’s private key (for example RS256 or ES256). The gateway selects the public key by the token’s kid from a cached JWKS document (refreshed periodically and on an unknown kid, which supports key rotation), verifies the signature, then checks claims: exp and nbf (time), iss (issuer) and aud (audience).",
        ),
        list(
          [
            "Self-contained vs. opaque tokens",
            "an opaque token would need an introspection call to the identity provider per request (or a cache). JWTs avoid the round trip, at the cost of not being revocable before they expire, which is why they are short-lived.",
          ],
          [
            "Authentication vs. authorization",
            "the gateway usually does coarse checks (valid user, required scope such as orders:read). “May this user see order 1042?” is business logic and belongs in the Orders service (step 8).",
          ],
          [
            "Identity downstream",
            "on success the gateway forwards the caller’s identity to the service, for example an X-User-Id header or the validated token itself.",
          ],
        ),
      ],
      ["jwt", "jwks", "claims", "authn-authz"],
      "request",
    ),

    "rate-limiting": step(
      [
        p(
          "Every client gets an allowance, for example 60 requests per minute. Each request uses one unit; the allowance refills steadily over time. The badge on the gateway shows what is left.",
        ),
        p(
          "This protects everyone. A buggy app stuck in a loop, or someone trying to overload the system, runs out of allowance and gets turned away at the door, before reaching any service or database. Well-behaved clients never notice the limit.",
        ),
      ],
      [
        p(
          "A common algorithm is the token bucket: a bucket of capacity b refills at rate r; each request takes a token or is rejected. It allows short bursts up to b while enforcing an average of r. Sliding-window counters are the main alternative.",
        ),
        list(
          "Limits are keyed by API key, user or IP, and often differ by route or plan.",
          "Because the gateway runs as several replicas, counters live in a shared, fast store (typically Redis, not drawn). That is one network round trip, so some gateways trade exactness for speed with local counters that sync periodically.",
          "Rejected requests get 429 Too Many Requests with Retry-After. The IETF draft RateLimit and RateLimit-Policy headers also tell clients their remaining allowance.",
        ),
      ],
      ["token-bucket", "429", "retry-after"],
      "request",
    ),

    "validation-and-routing": step(
      [
        p(
          "Two last checks at the door. First, is the request well formed? A missing value or a nonsense parameter is answered straight away with an error, so services never see garbage.",
        ),
        p(
          "Then the gateway looks up where the request should go. Its route table says: anything under /api/orders goes to the Orders service. There are two copies of the Orders service running, so the gateway picks one, here copy #1, to share the work fairly.",
        ),
      ],
      [
        p(
          "Validation checks the request against the API contract (typically the OpenAPI document): path and query parameters, body schema, size limits. Rejecting early with 400 Bad Request is cheap and keeps malformed input away from services.",
        ),
        p(
          "Routing matches host, path and method to an upstream cluster, then a load-balancing policy (round robin, least requests) picks a healthy instance. Health comes from active checks (probing a /healthz endpoint) and passive ones (watching for errors). The gateway also enriches the request before forwarding it (see the message below).",
        ),
        p(
          "The traceparent header (W3C Trace Context) ties the gateway’s log line to every span the request produces inside the system.",
        ),
      ],
      ["route-table", "load-balancing", "health-check", "trace-context"],
      "forwarded",
    ),

    // ----- Chapter 3: The backend ---------------------------------------------------------
    "business-logic": step(
      [
        p(
          "Finally the request reaches the Orders service, which knows the shop’s rules. It already knows who is asking, because the gateway checked the pass and passed the name along. So it applies the rules: you may only see your own orders.",
        ),
        p(
          "To show your name and delivery address next to the orders, it asks the Users service. That call stays inside the system: it never goes back out through the front door.",
        ),
      ],
      [
        p(
          "This is where authorization by data happens: the gateway proved who the caller is; the service decides what they may see (only orders where user_id = u_7f3a).",
        ),
        p(
          "The call to the Users service is east–west traffic. It does not go through the gateway; in many systems a service mesh adds mTLS, retries and metrics to these calls. Every internal call needs its own timeout, shorter than the gateway’s, or one slow dependency can tie up the whole chain (see scenario “Timeout, then retry”).",
        ),
      ],
      ["business-logic", "east-west", "timeout-budget"],
      "users-call",
    ),

    "querying-the-database": step(
      [
        p(
          "The orders themselves are stored in a database. The Orders service asks it a precise question: “give me the open orders of this user, newest first, at most 20”.",
        ),
        p(
          "The database can answer quickly because it keeps an index, like the index at the back of a book: instead of reading every order ever placed, it jumps straight to this user’s open ones.",
        ),
      ],
      [
        list(
          [
            "Index",
            "a composite index on (user_id, status, created_at) serves the filter and the sort, so the query reads a handful of rows instead of scanning the table.",
          ],
          [
            "Connection pool",
            "opening a PostgreSQL connection is expensive (a process per connection), so services reuse connections from a pool (in-process, or PgBouncer).",
          ],
          [
            "Parameters",
            "$1 is a bound parameter, not string concatenation. That prevents SQL injection and lets the database reuse the query plan.",
          ],
          [
            "Scaling reads",
            "heavy read traffic can move to read replicas, accepting slightly stale data (eventual consistency).",
          ],
        ),
      ],
      ["index", "connection-pool", "sql-injection"],
      "sql-query",
    ),

    "building-the-response": step(
      [
        p(
          "The Orders service now has everything: the orders from the database and the customer details from the Users service. It packs them into a reply in JSON, a simple text format every program can read, with a status code on top: 200 OK means “here is what you asked for”.",
        ),
      ],
      [
        list(
          [
            "Status codes",
            "are part of the contract: 2xx success, 4xx the client must change something, 5xx the server failed.",
          ],
          [
            "Cache-Control: private, no-store",
            "personal data must not be stored by shared caches.",
          ],
          [
            "Pagination",
            "a cursor (nextCursor) is more robust than page numbers when new orders arrive between requests.",
          ],
        ),
      ],
      ["status-code", "json", "pagination"],
      "service-response",
    ),

    // ----- Chapter 4: The return trip -----------------------------------------------------
    "response-flows-back": step(
      [
        p(
          "The reply travels back the way the request came: to the gateway, then across the internet to your browser, which finally shows your two open orders.",
        ),
        p(
          "On the way out, the gateway adds a few finishing touches: it shrinks the reply so it travels faster, adds the headers browsers need for security, and writes down how the request went, so the team can spot problems.",
        ),
      ],
      [
        p("The gateway does not change the meaning of the response, but it often:"),
        list(
          "compresses it (Brotli or gzip, chosen from Accept-Encoding, with Vary: Accept-Encoding);",
          "adds CORS headers (Access-Control-Allow-Origin: https://shop.example) and security headers (Strict-Transport-Security, X-Content-Type-Options);",
          "records an access log line, latency and status metrics, and closes the trace span.",
        ),
        p(
          "Status codes pass through unchanged, except errors the gateway raises itself: 401, 429, 502, 503, 504.",
        ),
      ],
      ["compression", "access-log", "observability"],
      "final-response",
    ),

    "full-lifecycle": step(
      [
        p(
          "That was one request, start to finish. It crossed the internet twice, passed five checks at the front door, visited two services and a database, and still took well under a tenth of a second.",
        ),
        p(
          "Where did the time go? Mostly into travelling: crossing the internet, there and back. The gateway’s checks took about a millisecond. That is why gateways are worth having: one front door for safety and order, at a very small cost.",
        ),
        callout("Ready for what happens when things go wrong? Try the scenarios."),
      ],
      [
        {
          type: "table",
          caption:
            "Illustrative latency: a user about 1,000 km from the data centre, on a warm connection",
          columns: ["Segment", "Time"],
          rows: [
            ["Browser → gateway (network, one way)", "~15 ms"],
            ["Gateway: auth 0.2, rate limit 1, validate and route 0.2", "~1.5 ms"],
            ["Gateway → Orders (same data centre)", "~0.5 ms"],
            ["Orders logic, including the Users call", "~4 ms"],
            ["Database query (indexed)", "~3 ms"],
            ["Response: JSON, back to the gateway, compression", "~2 ms"],
            ["Gateway → browser (network, one way)", "~15 ms"],
          ],
          footer: ["Total", "~41 ms"],
        },
        p(
          "The network is about three quarters of the total, which is why connection reuse, CDNs and fewer round trips matter more than shaving the gateway. Tail latency (p99) is driven by the slowest dependency on the path, which is what timeouts and retries (the scenarios) manage.",
        ),
      ],
      ["latency", "tail-latency"],
    ),

    // ----- Scenario: 401 Unauthorized -----------------------------------------------------
    "401-expired-token": step(
      [
        p(
          "The pass expired a few minutes ago. The gateway refuses it at the door. No service is bothered.",
        ),
      ],
      [
        p(
          "exp is in the past, so the signature check doesn’t matter. The gateway answers immediately; failing at the edge protects services and keeps error handling uniform.",
        ),
      ],
      ["jwt", "claims"],
      "expired-request",
    ),
    "401-gateway-answers": step(
      [p("The browser is told “your pass is no good”, and exactly why.")],
      [
        p(
          "401 means “not authenticated” (missing, invalid or expired credentials). 403 would mean “authenticated, but not allowed”. The WWW-Authenticate header tells the client which scheme and what went wrong.",
        ),
      ],
      ["401", "authn-authz"],
      "401-response",
    ),
    "401-refresh-and-retry": step(
      [p("The app quietly gets a fresh pass and asks again. You never notice.")],
      [
        p(
          "The client uses its refresh token at the identity provider’s token endpoint (the OAuth 2.0 refresh token grant), then retries once. A second 401 means the session is over: send the user to sign in.",
        ),
      ],
      ["refresh-token"],
      "refresh-request",
    ),

    // ----- Scenario: 429 Too Many Requests ------------------------------------------------
    "429-burst": step(
      [p("A bug makes the app send the same request again and again. Each one uses up allowance.")],
      [
        p(
          "The token bucket is empty: the burst exceeded capacity b faster than the refill rate r could replace tokens.",
        ),
      ],
      ["token-bucket"],
      "request",
    ),
    "429-too-many": step(
      [
        p(
          "The gateway says “slow down, try again in 20 seconds”. The services and the database never feel the burst.",
        ),
      ],
      [
        p(
          "Rejection is cheap (no upstream call), which is the point: overload is absorbed at the edge. Retry-After gives the client a concrete wait.",
        ),
      ],
      ["429", "retry-after"],
      "429-response",
    ),
    "429-back-off": step(
      [p("A well-behaved app waits as told, then tries once.")],
      [
        p(
          "Clients must honour Retry-After and deduplicate the burst at the source (the real fix is the bug). Retrying immediately in a loop just keeps the bucket empty.",
        ),
      ],
      ["retry-after", "backoff"],
      "request",
    ),

    // ----- Scenario: Timeout, then retry --------------------------------------------------
    "timeout-slow-service": step(
      [p("Orders #1 is stuck. The gateway will not wait forever: after 2 seconds it gives up.")],
      [
        p(
          "The gateway’s upstream timeout (2 s here) bounds how long a client waits and how long the gateway holds resources. Without timeouts, slow services exhaust connection pools upstream, and one slow dependency becomes an outage.",
        ),
      ],
      ["timeout-budget"],
      "forwarded",
    ),
    "timeout-gateway-answers": step(
      [p("The browser is told “the server behind me didn’t answer in time”.")],
      [
        p(
          "504 is the gateway reporting an upstream timeout. (502 would mean the upstream answered with something invalid; 503 that no upstream could take the request.)",
        ),
      ],
      ["status-code"],
      "504-response",
    ),
    "timeout-retry-with-backoff": step(
      [p("The app waits a moment and tries again. This time a healthy copy answers.")],
      [
        p(
          "Retries use exponential backoff with jitter (for example up to 0.5 s, then 1 s, then 2 s, each randomised) so thousands of clients don’t retry in lockstep. Only retry safe or idempotent requests: GET is fine; a POST that creates an order needs an idempotency key, or it might be created twice.",
        ),
      ],
      ["backoff", "idempotent"],
      "request",
    ),

    // ----- Scenario: 503, rerouted --------------------------------------------------------
    "503-instance-down": step(
      [
        p(
          "One copy of the Orders service has crashed. The gateway notices, because it checks on every copy regularly.",
        ),
      ],
      [
        p(
          "Active health checks (a failing /healthz) and passive outlier detection (consecutive 5xx responses) eject the instance from the load-balancing pool.",
        ),
      ],
      ["health-check"],
    ),
    "503-routed-around": step(
      [
        p(
          "The gateway simply sends the request to the healthy copy. You never notice anything happened. This is why systems run more than one copy.",
        ),
      ],
      [
        p(
          "Redundancy only helps if the router knows who is healthy. The gateway may also retry a failed attempt once on another instance, within a retry budget, so retries can’t multiply load during an incident.",
        ),
      ],
      ["load-balancing", "health-check"],
      "forwarded",
    ),
    "503-all-down": step(
      [
        p(
          "With no healthy copy left, the gateway answers honestly: “unavailable, try again in 30 seconds”, instead of letting you wait.",
        ),
      ],
      [
        p(
          "Failing fast with 503 (often via a circuit breaker) gives the service room to recover. The client should back off as in the timeout scenario.",
        ),
      ],
      ["status-code", "retry-after"],
      "503-response",
    ),
  },

  components: {
    browser: {
      name: "Browser",
      kind: "Client",
      purpose: {
        beginner: "The app you use. It asks the system for data and shows it to you.",
        advanced:
          "A single-page app on its own origin, calling the API over HTTPS with a bearer token.",
      },
      howItWorks:
        "fetch sends HTTPS requests over a reused HTTP/2 or HTTP/3 connection. Cross-origin calls that carry credentials are preceded by a CORS preflight.",
      responsibilities: [
        "Render the user interface",
        "Keep the access and refresh tokens",
        "Call the API",
        "Handle errors: refresh on 401, back off on 429, 503 and 504",
      ],
      inputs: ["User actions", "API responses"],
      outputs: ["API requests"],
      talksTo: ["API gateway", "Identity provider (sign-in and refresh only)"],
      technologies: ["React", "Vue", "Angular", "fetch", "TanStack Query"],
      examples: ["A React single-page app calling a REST API", "A mobile app using the same API"],
      advantages: ["Rich, responsive interface", "Works offline-first if designed to"],
      limitations: [
        "Runs on an untrusted device: never trust its input",
        "Never put secrets in it",
      ],
    },
    gateway: {
      name: "API Gateway",
      kind: "Edge component",
      purpose: {
        beginner:
          "The front door of the system. Every request from the app passes through it first, so it can check who is asking, stop abuse and send the request to the right service, much like a hotel reception desk that checks your key card and points you to the right room.",
        advanced:
          "A reverse proxy that acts as the single entry point for client traffic. It terminates TLS, authenticates requests, enforces rate limits and routes each request to the right upstream service, so cross-cutting concerns live in one place instead of in every service.",
      },
      howItWorks:
        "Each request passes five stations in order: TLS (decrypt), authentication (verify the token), rate limit (check the allowance), validation (check the shape) and routing (pick a healthy instance). On the way back it compresses the response, adds headers and records logs and metrics.",
      responsibilities: [
        "Terminate TLS",
        "Authenticate requests (JWT validation)",
        "Enforce rate limits and quotas",
        "Validate requests before they reach services",
        "Route and load-balance to upstream services",
        "Emit logs, metrics and traces for every request",
      ],
      inputs: ["HTTPS requests from clients"],
      outputs: ["Requests to upstream services", "Responses back to clients"],
      talksTo: ["Browser", "Identity provider (keys only)", "Orders service"],
      technologies: ["Kong", "Envoy", "NGINX", "AWS API Gateway", "Azure API Management", "Apigee"],
      examples: [
        "Netflix’s edge gateway (Zuul) routes device requests to backend services",
        "AWS API Gateway in front of Lambda functions",
      ],
      advantages: [
        "One place for cross-cutting concerns",
        "Hides the internal service topology from clients",
        "Simpler clients: one host, one auth scheme",
      ],
      limitations: [
        "Adds a network hop and some latency",
        "Must be redundant, or it becomes a single point of failure",
        "Business logic tends to creep in over time",
      ],
    },
    identity: {
      name: "Identity provider",
      kind: "Security service",
      purpose: {
        beginner: "The office that issues passes after you sign in.",
        advanced:
          "An OAuth 2.0 / OpenID Connect authorization server that issues signed tokens and publishes its public keys (JWKS).",
      },
      howItWorks:
        "After sign-in it issues a short-lived JWT access token and a longer-lived refresh token. Anyone with its public keys can verify its tokens offline, so it is not called on every request.",
      responsibilities: [
        "Authenticate users (password, MFA, SSO)",
        "Issue access and refresh tokens",
        "Publish its signing keys and rotate them",
      ],
      inputs: ["Sign-in and token requests"],
      outputs: ["Tokens", "Public keys (JWKS)"],
      talksTo: ["Browser (sign-in, refresh)", "API gateway (fetches its keys now and then)"],
      technologies: ["Auth0", "Okta", "Microsoft Entra ID", "Keycloak", "AWS Cognito"],
      examples: [
        "Signing in with Google or Microsoft (OpenID Connect)",
        "Keycloak issuing tokens for an internal app",
      ],
      advantages: ["One place for identity", "Tokens can be verified offline"],
      limitations: [
        "Short-lived tokens can’t be revoked instantly",
        "Critical for sign-in, so it must be highly available",
      ],
    },
    "orders-1": {
      name: "Orders service",
      kind: "Backend service (instance #1 of 2)",
      purpose: {
        beginner: "The department that knows everything about orders.",
        advanced:
          "A domain service owning the orders data and rules, running as several stateless instances.",
      },
      howItWorks:
        "Receives requests already authenticated by the gateway (the caller’s identity in a header), queries PostgreSQL through a connection pool, and calls the Users service with its own timeout.",
      responsibilities: [
        "Enforce order rules (who may see what)",
        "Read and write orders",
        "Combine data from other services",
        "Return API responses",
      ],
      inputs: ["Requests from the gateway", "Data from the Users service and PostgreSQL"],
      outputs: ["API responses", "Queries", "Internal requests"],
      talksTo: ["API gateway", "Users service", "PostgreSQL"],
      technologies: ["Node.js", "Java / Spring", "Go", ".NET", "A /healthz endpoint"],
      examples: ["An e-commerce service owning carts and orders"],
      advantages: ["Independent deploys and scaling", "Clear ownership of orders"],
      limitations: [
        "Calls between services add latency",
        "New failure modes: timeouts, partial outages",
      ],
    },
    "orders-2": {
      name: "Orders service",
      kind: "Backend service (instance #2 of 2)",
      purpose: {
        beginner: "A second copy of the Orders service, ready to share the work.",
        advanced:
          "An identical, stateless instance. The gateway load-balances across both and routes around one that fails.",
      },
      howItWorks:
        "Same code and database as instance #1. Because instances keep no state between requests, any of them can answer any request.",
      responsibilities: ["Share the load", "Take over when the other instance fails"],
      inputs: ["Requests from the gateway"],
      outputs: ["API responses"],
      talksTo: ["API gateway", "Users service", "PostgreSQL"],
      technologies: ["Container orchestration (Kubernetes, ECS)", "Autoscaling"],
      examples: ["Two to dozens of replicas behind one route"],
      advantages: ["Redundancy", "Horizontal scaling"],
      limitations: ["Only works if instances are stateless", "Needs health checks to be useful"],
    },
    users: {
      name: "Users service",
      kind: "Backend service",
      purpose: {
        beginner: "The department that keeps customer details.",
        advanced: "The domain service owning user profiles, called internally by other services.",
      },
      howItWorks:
        "Serves profile data to other services over internal (east–west) calls that never pass the gateway.",
      responsibilities: ["Store and return user profiles", "Own user data and its rules"],
      inputs: ["Internal requests"],
      outputs: ["User profiles"],
      talksTo: ["Orders service (and other services)"],
      technologies: ["Node.js", "Java / Spring", "Go", ".NET"],
      examples: ["A profile service used by checkout, emails and support tools"],
      advantages: ["A single source of truth for users"],
      limitations: [
        "Every service that needs user data now depends on it (consider caching, or copying the few fields needed)",
      ],
    },
    postgres: {
      name: "PostgreSQL",
      kind: "Data store (the Orders database)",
      purpose: {
        beginner: "The filing cabinet where orders are kept safely.",
        advanced: "A relational database providing transactions (ACID), indexes and SQL.",
      },
      howItWorks:
        "Queries use indexes to find rows quickly. Each write is logged before it is acknowledged (the write-ahead log), so it survives crashes.",
      responsibilities: [
        "Store orders durably",
        "Answer queries quickly",
        "Keep data consistent under concurrent writes",
      ],
      inputs: ["SQL queries"],
      outputs: ["Rows"],
      talksTo: ["Orders service only: each service owns its database"],
      technologies: [
        "PostgreSQL",
        "Amazon RDS / Aurora",
        "Azure Database",
        "Cloud SQL",
        "PgBouncer",
      ],
      examples: [
        "An orders table indexed by user and status",
        "A read replica serving reporting queries",
      ],
      advantages: ["Strong consistency", "Flexible queries"],
      limitations: [
        "Scaling writes beyond one primary is hard (sharding)",
        "Connections are expensive",
      ],
    },
  },

  glossary: {
    client: {
      term: "Client",
      definition: "The program that sends requests, here the browser app.",
    },
    origin: {
      term: "Origin",
      definition: "Scheme, host and port of a URL. Different origins are isolated by the browser.",
    },
    "cors-preflight": {
      term: "CORS preflight",
      definition:
        "An OPTIONS request the browser sends first, asking whether a cross-origin call is allowed.",
    },
    "http-method": {
      term: "HTTP method",
      definition: "The action a request asks for, such as GET or POST.",
    },
    header: {
      term: "Header",
      definition: "A named piece of extra information sent with a message.",
    },
    "bearer-token": {
      term: "Bearer token",
      definition: "A pass that proves who you are. Whoever holds it is trusted.",
    },
    idempotent: {
      term: "Idempotent",
      definition: "Repeating the request has the same effect as sending it once.",
    },
    dns: {
      term: "DNS",
      definition: "The system that turns names like api.shop.example into IP addresses.",
    },
    tls: {
      term: "TLS",
      definition: "The protocol that encrypts and authenticates a connection (the “S” in HTTPS).",
    },
    rtt: {
      term: "Round trip (RTT)",
      definition: "The time for a message to reach the other side and an answer to come back.",
    },
    "reverse-proxy": {
      term: "Reverse proxy",
      definition: "A server that receives requests on behalf of other servers and forwards them.",
    },
    "tls-termination": {
      term: "TLS termination",
      definition: "Decrypting the connection at the edge so the request can be inspected.",
    },
    "north-south": {
      term: "North–south traffic",
      definition: "Traffic between clients outside the system and the system.",
    },
    jwt: {
      term: "JWT",
      definition:
        "JSON Web Token: signed claims about a user that anyone with the public key can verify.",
    },
    jwks: {
      term: "JWKS",
      definition:
        "JSON Web Key Set: the public keys an identity provider publishes to verify its tokens.",
    },
    claims: {
      term: "Claims",
      definition: "The statements inside a token, such as who it is for and when it expires.",
    },
    "authn-authz": {
      term: "Authentication vs. authorization",
      definition: "Who are you? (authentication) versus what may you do? (authorization).",
    },
    "token-bucket": {
      term: "Token bucket",
      definition:
        "A rate-limiting algorithm: a bucket of tokens refills steadily; each request takes one.",
    },
    "429": {
      term: "429 Too Many Requests",
      definition: "The status code for a client that exceeded its rate limit.",
    },
    "401": {
      term: "401 Unauthorized",
      definition: "The status code for missing, invalid or expired credentials.",
    },
    "retry-after": {
      term: "Retry-After",
      definition: "A response header telling the client how long to wait before trying again.",
    },
    "route-table": {
      term: "Route table",
      definition: "The gateway’s rules mapping hosts and paths to backend services.",
    },
    "load-balancing": {
      term: "Load balancing",
      definition: "Spreading requests across several instances of a service.",
    },
    "health-check": {
      term: "Health check",
      definition: "A regular probe that tells the router whether an instance can take traffic.",
    },
    "trace-context": {
      term: "Trace context",
      definition: "Headers (traceparent) that link every step of one request across services.",
    },
    "business-logic": {
      term: "Business logic",
      definition: "The rules specific to the product, such as who may see which orders.",
    },
    "east-west": {
      term: "East–west traffic",
      definition: "Traffic between services inside the system.",
    },
    "timeout-budget": {
      term: "Timeout budget",
      definition:
        "How long each call may take, shrinking deeper in the chain so callers give up in order.",
    },
    index: {
      term: "Index",
      definition: "A database structure that finds matching rows without scanning the whole table.",
    },
    "connection-pool": {
      term: "Connection pool",
      definition: "A set of open database connections reused across requests.",
    },
    "sql-injection": {
      term: "SQL injection",
      definition: "An attack that smuggles SQL into a query through unescaped input.",
    },
    "status-code": {
      term: "Status code",
      definition:
        "The three-digit result of an HTTP request: 2xx success, 4xx client error, 5xx server error.",
    },
    json: { term: "JSON", definition: "A simple text format for structured data." },
    pagination: {
      term: "Pagination",
      definition: "Returning a large list in pages, with a way to ask for the next one.",
    },
    compression: {
      term: "Compression",
      definition: "Shrinking a response (gzip, Brotli) so it travels faster.",
    },
    "access-log": {
      term: "Access log",
      definition: "One line per request recording who called what, the status and the latency.",
    },
    observability: {
      term: "Observability",
      definition: "Logs, metrics and traces that let a team see what the system is doing.",
    },
    latency: { term: "Latency", definition: "How long a request takes from start to finish." },
    "tail-latency": {
      term: "Tail latency (p99)",
      definition: "The latency the slowest 1% of requests exceed.",
    },
    "refresh-token": {
      term: "Refresh token",
      definition:
        "A longer-lived token used only to get new access tokens from the identity provider.",
    },
    backoff: {
      term: "Exponential backoff",
      definition:
        "Waiting longer after each failed attempt, with randomness (jitter) to spread retries.",
    },
  },
};
