import { code, list, p, step } from "../../text-blocks";
import type { StepCopy } from "../../types";
import { exampleCode } from "./shared";

/**
 * API Gateway module, English step text. SERVER ONLY.
 * Beginner: explained as if to a five-year-old, with an everyday example.
 * Advanced: the technical detail, with a worked example.
 * Source: docs/modules/api-gateway.md (generated from these files for review).
 */
export const enSteps: Readonly<Record<string, StepCopy>> = {
  // ----- Chapter 1: The request -----------------------------------------------------------
  "meet-the-client": step(
    "Meet the client",
    "The browser on the left lights up. Everything else waits for it to ask.",
    {
      body: [
        p(
          "This is the browser: the app on your computer or phone. You open the shop’s website because you want to see your orders.",
        ),
        p(
          "But your orders are not inside your computer. They are kept on the shop’s computers, far away. So the browser has to ask for them. Asking is called sending a request.",
        ),
        p(
          "The browser knows only one address to ask: api.shop.example. It doesn’t know what is behind that address, and it doesn’t need to.",
        ),
      ],
      example: [
        p(
          "When you want a pizza, you don’t walk into the kitchen. You call one phone number. Who answers, who cooks and who drives is the restaurant’s business, not yours. The browser works the same way: one number to call, and the shop sorts out the rest.",
        ),
      ],
    },
    {
      body: [
        p(
          "The client is a single-page app served from shop.example, calling an API on a different origin, api.shop.example. Because the request carries an Authorization header, it is not a CORS “simple request”: the browser first sends an OPTIONS preflight, and only sends the real request if the API answers with matching Access-Control-Allow-* headers. The preflight result can be cached (Access-Control-Max-Age), so it is usually paid once per session, not per call.",
        ),
        p(
          "The client is deliberately unaware of the topology behind the API. One host, one auth scheme and one error format keep it simple, and let the backend change without a client release.",
        ),
      ],
      example: [
        p(
          "Before the first call, the browser sends this preflight and gets permission back. For the next 600 seconds it skips the preflight for the same request.",
        ),
        code("http", "Preflight and answer", exampleCode.preflight),
      ],
    },
  ),

  "anatomy-of-a-request": step(
    "Anatomy of an HTTP request",
    "A blue packet appears next to the browser. That packet is the request. Click it to read what is inside.",
    {
      body: [
        p("Before anything moves, the browser writes the request. A request has four parts:"),
        list(
          ["Method", "what you want to do. GET means “please give me”."],
          ["Path", "which thing you want. Here: my open orders."],
          [
            "Headers",
            "little notes, like “this is who I am” (the token) and “please answer in a way I can read”.",
          ],
          ["Body", "something you send along. A GET request has none, because it only asks."],
        ),
      ],
      example: [
        p(
          "It is like posting a letter. The first line says what you want: “please send me…” (the method). The address says where it goes (the path). On the back you write who it is from (the headers). And sometimes there is something inside the envelope (the body).",
        ),
      ],
    },
    {
      body: [
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
      example: [
        p(
          "Over HTTP/2 the start line becomes pseudo-headers: :method GET, :scheme https, :authority api.shop.example, :path /api/orders?status=open. The long Authorization value is sent in full once; later requests on the same connection refer to it in the HPACK table with a byte or two.",
        ),
      ],
    },
  ),

  "across-the-network": step(
    "Across the network",
    "The blue packet travels from the browser, past two internet stops, to the gateway.",
    {
      body: [
        p(
          "Now the request travels across the internet. First the browser has to find out where api.shop.example lives. It asks DNS, which works like the contacts on a phone: you know the name, and DNS gives you the number.",
        ),
        p(
          "Then the browser and the shop agree on a secret code, so nobody on the way can read or change the request. That is what the padlock in the address bar means.",
        ),
        p("On its way, the request hops through many computers, one after another."),
      ],
      example: [
        p(
          "Think of sending a parcel to a friend in another city. The post office looks up the address, the box is sealed so nobody can peek, and it passes through a few sorting centres. The further away your friend lives, the longer it takes, even when everything goes well.",
        ),
        p(
          "That is why the browser keeps the road open after the first trip, and uses it again for the next requests.",
        ),
      ],
    },
    {
      body: [
        p(
          "A cold request pays for DNS resolution, a TCP handshake (1 round trip) and a TLS 1.3 handshake (1 more round trip) before the first byte of HTTP. HTTP/3 runs over QUIC, which merges the transport and TLS handshakes into a single round trip, and both TLS 1.3 and QUIC support 0-RTT resumption (only safe for idempotent requests, because 0-RTT data can be replayed).",
        ),
        p(
          "In practice the connection is warm: HTTP/2 or HTTP/3 multiplexes many requests over one connection, so the per-request cost is one network round trip. Real deployments usually put a CDN or a load balancer in front of the gateway; this scene leaves them out to keep the focus on the gateway.",
        ),
      ],
      example: [
        {
          type: "table",
          caption: "A user about 1,000 km away (one round trip ≈ 30 ms)",
          columns: ["Request", "Time"],
          rows: [
            ["Cold: DNS + TCP + TLS 1.3 + request", "~20 + 30 + 30 + 30 ms"],
            ["Cold over HTTP/3 (QUIC)", "~20 + 30 + 30 ms"],
          ],
          footer: ["Warm connection (most requests)", "~30 ms"],
        },
      ],
    },
  ),

  // ----- Chapter 2: The gateway -----------------------------------------------------------
  "one-front-door": step(
    "One front door",
    "The first light on the gateway, TLS, turns on. Behind it, the services wait their turn.",
    {
      body: [
        p(
          "The request arrives at the API gateway. The gateway is the front door of the whole system. Every request from outside comes in here, and nowhere else.",
        ),
        p(
          "Behind the door are the services that do the real work. They never talk to the outside world themselves.",
        ),
        p(
          "First, the gateway opens the sealed envelope (the TLS light), so it can read the request.",
        ),
      ],
      example: [
        p(
          "Think of a big hotel. Guests don’t wander the corridors looking for a room. They go to the reception desk. Reception checks who they are, makes sure they are allowed in, and tells them where to go. The gateway is that reception desk, for requests.",
        ),
      ],
    },
    {
      body: [
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
      example: [
        p(
          "An Envoy listener on port 443 holds the certificate for api.shop.example and terminates TLS. Its route table sends /api/orders/* to the orders cluster and /api/users/* to the users cluster. Clients never see orders.internal, so the team can split, merge or move services without a client release.",
        ),
      ],
    },
  ),

  authentication: step(
    "Authentication",
    "The second light on the gateway, Authentication, turns on. The dashed line to the identity provider glows: the key the gateway checks with came from there earlier.",
    {
      body: [
        p(
          "Before the gateway lets your request in, it checks your pass. The pass is called a token. You got it from the identity provider when you signed in.",
        ),
        p("The gateway asks three questions about the token:"),
        list("Is it real?", "Is it still valid?", "Is it meant for this API?"),
        p("If all three answers are yes, the request may go on."),
      ],
      example: [
        p(
          "Think of a school trip to a museum. At the door, a guard looks at your ticket. Is it a real ticket, not one you drew yourself? Is it for today, not last week? Is it for this museum, not the zoo? If all three answers are yes, you can go in.",
        ),
        p(
          "The guard doesn’t phone the ticket office for every child. They know what the real stamp looks like. The gateway is the same: it checks the token’s signature itself, without asking the identity provider.",
        ),
      ],
    },
    {
      body: [
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
      example: [
        p(
          "The token’s header names key k1. The gateway finds k1 in its cached JWKS, verifies the signature, then checks the claims below: the issuer and audience match, the scope includes orders:read, and it expires in 3 minutes 40 seconds. The request goes on with X-User-Id: u_7f3a.",
        ),
        code("json", "Token header and claims (decoded)", exampleCode.tokenClaims),
      ],
    },
  ),

  "rate-limiting": step(
    "Rate limiting",
    "The third light, Rate limit, turns on. The badge on the gateway goes from 58 to 57 of 60 left.",
    {
      body: [
        p(
          "Every app gets an allowance: for example, 60 requests every minute. Each request uses one. The allowance slowly fills up again over time. The badge on the gateway shows how many are left.",
        ),
        p(
          "Why? If a broken app sends thousands of requests, or someone tries to flood the shop, they run out of allowance and are stopped at the door. The services behind it stay safe. Normal apps never notice the limit.",
        ),
      ],
      example: [
        p(
          "At a fun fair, you get a cup with 60 tokens for the rides. Each ride costs one token, and a helper drops one new token into your cup every second. If you spend tokens faster than they come back, your cup is empty and you have to wait.",
        ),
        p("The gateway works exactly like this. The idea is even called a “token bucket”."),
      ],
    },
    {
      body: [
        p(
          "A common algorithm is the token bucket: a bucket of capacity b refills at rate r; each request takes a token or is rejected. It allows short bursts up to b while enforcing an average of r. Sliding-window counters are the main alternative.",
        ),
        list(
          "Limits are keyed by API key, user or IP, and often differ by route or plan.",
          "Because the gateway runs as several replicas, counters live in a shared, fast store (typically Redis, not drawn). That is one network round trip, so some gateways trade exactness for speed with local counters that sync periodically.",
          "Rejected requests get 429 Too Many Requests with Retry-After. The IETF draft RateLimit and RateLimit-Policy headers also tell clients their remaining allowance.",
        ),
      ],
      example: [
        p(
          "With b = 60 and r = 1 token per second, a client that was idle for a minute can send 60 requests at once, then about one per second. In Redis the gateway keeps two numbers per client (tokens left, time of the last refill) and updates them in one atomic step, so all gateway replicas share the same count.",
        ),
      ],
    },
  ),

  "validation-and-routing": step(
    "Validation and routing",
    "The last two lights, Validation and Routing, turn on. Then the request goes to Orders service #1. Click the packet to see what the gateway added.",
    {
      body: [
        p(
          "Two last checks at the door. First: is the request written correctly? If something is missing or makes no sense, the gateway answers straight away with an error. The services never see broken requests.",
        ),
        p(
          "Then: where should it go? The gateway has a list that says “anything about orders goes to the Orders service”. There are two copies of the Orders service, so the gateway picks one, to share the work fairly. Here it picks copy #1.",
        ),
      ],
      example: [
        p(
          "At the post office, the clerk first checks that your parcel has an address and a stamp. If not, it comes straight back to you. If it is fine, the clerk reads the address and puts the parcel in the right bag. When two vans go to the same town, the clerk fills them in turn, so neither van gets too full.",
        ),
      ],
    },
    {
      body: [
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
      example: [
        p(
          "A typo, ?status=opne, never reaches a service: the gateway answers 400 with a problem+json body. The correct request matches the /api/orders route, and “least requests” picks orders-1, which has 3 requests in flight against 5 on orders-2.",
        ),
        code("http", "The answer to a malformed request", exampleCode.badRequest),
      ],
    },
  ),

  // ----- Chapter 3: The backend -----------------------------------------------------------
  "business-logic": step(
    "Business logic",
    "Orders service #1 lights up, then sends a small request to the Users service and gets an answer back.",
    {
      body: [
        p(
          "The request finally reaches the Orders service. This service knows the shop’s rules about orders. It already knows who is asking, because the gateway checked the pass and wrote your name on the request. So it follows the rule: you may only see your own orders.",
        ),
        p(
          "It also needs your name and delivery address, so it asks the Users service. That question stays inside the building. It never goes back out through the front door.",
        ),
      ],
      example: [
        p(
          "In a school, the front office checks every visitor. Once you are inside, your teacher doesn’t check your visitor badge again. But the teacher still decides what you may see: your own test results, not your friend’s. And if the teacher needs your address, they ask the school office down the hall, not the front gate.",
        ),
      ],
    },
    {
      body: [
        p(
          "This is where authorization by data happens: the gateway proved who the caller is; the service decides what they may see (only orders where user_id = u_7f3a).",
        ),
        p(
          "The call to the Users service is east–west traffic. It does not go through the gateway; in many systems a service mesh adds mTLS, retries and metrics to these calls. Every internal call needs its own timeout, shorter than the gateway’s, or one slow dependency can tie up the whole chain (see scenario “Timeout, then retry”).",
        ),
      ],
      example: [
        p(
          "The gateway allows 2 s for the whole call. Orders gives itself 1.5 s and gives the Users call 300 ms, with one retry. If Users hangs, Orders stops waiting after 300 ms and can still answer without the delivery address, instead of holding the request until the gateway gives up.",
        ),
      ],
    },
  ),

  "querying-the-database": step(
    "Querying the database",
    "A request goes from Orders service #1 to PostgreSQL. The database lights up, and the answer comes back.",
    {
      body: [
        p(
          "Your orders are kept in a database: a very tidy store of information. The Orders service asks it a clear question: “Give me this person’s open orders, newest first, at most 20.”",
        ),
        p("The database answers fast because it has an index."),
      ],
      example: [
        p(
          "Think of a big book with an index at the back. To find every page about dinosaurs, you don’t read the whole book. You look up “dinosaurs” in the index and jump straight to pages 12, 47 and 103. The database’s index does the same: it jumps straight to your open orders.",
        ),
      ],
    },
    {
      body: [
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
      example: [
        p(
          "With 5 million orders in the table, EXPLAIN shows the difference the index makes. Because the index is already sorted by created_at, the database also skips the sort step.",
        ),
        code("sql", "EXPLAIN, without and with the index", exampleCode.explain),
      ],
    },
  ),

  "building-the-response": step(
    "Building the response",
    "Orders service #1 lights up while it builds the answer. A green packet appears: that is the response. Click it to read it.",
    {
      body: [
        p(
          "The Orders service now has everything it needs: your orders from the database, and your name from the Users service. It puts them together into one answer, called the response.",
        ),
        p(
          "The answer is written in JSON, a simple way of writing information that every program can read. On top it puts a status code: 200 means “OK, here is what you asked for”.",
        ),
      ],
      example: [
        p(
          "Like a waiter bringing your food: the kitchen puts everything on one tray, and the waiter says “here you go” (that is the 200). If the kitchen had run out of something, the waiter would tell you, with a different message.",
        ),
      ],
    },
    {
      body: [
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
      example: [
        p(
          "With 45 open orders, the response would hold the newest 20 and a nextCursor. The next request sends ?cursor=… and the query continues with WHERE created_at < … instead of OFFSET 20, so an order placed in between does not shift the pages or show up twice.",
        ),
      ],
    },
  ),

  // ----- Chapter 4: The return trip -------------------------------------------------------
  "response-flows-back": step(
    "The response flows back",
    "The green packet travels back: from Orders to the gateway, then across the internet to the browser.",
    {
      body: [
        p(
          "The answer goes back the way the request came: to the gateway, then across the internet to your browser. Your browser shows your two open orders.",
        ),
        p(
          "On the way out, the gateway does a few small jobs: it squeezes the answer so it travels faster, adds safety notes for the browser, and writes down how the request went.",
        ),
      ],
      example: [
        p(
          "When a shop sends you a parcel, it packs things tightly so the box is small, puts a “fragile” sticker on it, and writes the parcel number in its records, in case you call to ask where it is.",
        ),
      ],
    },
    {
      body: [
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
      example: [
        p(
          "Brotli shrinks the 1.8 KB JSON body to about 450 bytes. The access log line below carries the same request id (9c1e…) as the traces in the gateway, Orders and Users, so one search finds the request everywhere.",
        ),
        code("text", "The gateway’s access log line", exampleCode.accessLog),
      ],
    },
  ),

  "full-lifecycle": step(
    "The full lifecycle",
    "The whole journey plays again, faster: there and back, through every light on the gateway.",
    {
      body: [
        p(
          "That was one request, from start to finish. It crossed the internet twice, passed five checks at the front door, and visited two services and a database. And it all took less than a tenth of a second: faster than a blink.",
        ),
        p(
          "Most of that time went into travelling across the internet. The gateway’s checks took about one thousandth of a second. That is why a front door is worth having: a lot of safety, for a tiny cost.",
        ),
      ],
      example: [
        p(
          "Think of asking for a book at a library where the books are kept in the back. You hand your slip to the desk, the librarian checks your card, a helper fetches the book from the shelves, and brings it to you. Most of the waiting is the walking, not the checking.",
        ),
      ],
    },
    {
      body: [
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
      example: [
        p(
          "The same request from a user on another continent (about 150 ms each way) takes about 310 ms, while the work inside the data centre stays at about 11 ms. Moving only the gateway closer to the user would not help much, because the services are still far away. That is why read-heavy APIs cache responses at the edge.",
        ),
      ],
    },
  ),

  // ----- Scenario: 401 Unauthorized -------------------------------------------------------
  "401-expired-token": step(
    "An expired token arrives",
    "The request reaches the gateway, and the Authentication light turns red. The badge shows 401.",
    {
      body: [
        p(
          "This time the pass is too old: it expired a few minutes ago. The gateway sees that straight away and stops the request at the door. No service is bothered.",
        ),
      ],
      example: [
        p(
          "It is like trying to enter the museum with last week’s ticket. The guard says no at the door. Nobody inside even knows you tried.",
        ),
      ],
    },
    {
      body: [
        p(
          "exp is in the past, so the signature check doesn’t matter. The gateway answers immediately; failing at the edge protects services and keeps error handling uniform.",
        ),
      ],
      example: [
        p(
          "exp was 10:07:20 and the time is 10:11:20: the token expired 4 minutes ago. Gateways usually allow a small clock difference between machines (often 30 to 60 seconds) when checking exp and nbf; 4 minutes is far beyond it.",
        ),
      ],
    },
  ),

  "401-gateway-answers": step(
    "The gateway answers 401",
    "A red packet travels back to the browser. Click it to read the gateway’s answer.",
    {
      body: [
        p(
          "The gateway sends back a short answer: 401. It means “I can’t let you in: your pass is not valid”. It also says why: the pass expired.",
        ),
      ],
      example: [
        p(
          "The museum guard doesn’t just say “no”. They say “your ticket has expired, please get a new one”. Now you know exactly what to do.",
        ),
      ],
    },
    {
      body: [
        p(
          "401 means “not authenticated” (missing, invalid or expired credentials). 403 would mean “authenticated, but not allowed”. The WWW-Authenticate header tells the client which scheme and what went wrong.",
        ),
      ],
      example: [
        p(
          "A valid token without the orders:read scope gets 403 instead. The client must not refresh and retry then: a new token would carry the same permissions.",
        ),
        code("http", "403: authenticated, but not allowed", exampleCode.forbidden),
      ],
    },
  ),

  "401-refresh-and-retry": step(
    "Refresh and try again",
    "The browser quietly asks the identity provider for a new pass, gets it, and sends the request again. This time it goes through.",
    {
      body: [
        p(
          "The app keeps a second, longer-lasting pass, called a refresh token. It uses it to get a fresh pass from the identity provider, then asks again. You never notice any of this.",
        ),
      ],
      example: [
        p(
          "Imagine you have a yearly membership card for the museum. When your day ticket runs out, you show the card at the ticket office, get a new day ticket in a second, and walk back in.",
        ),
      ],
    },
    {
      body: [
        p(
          "The client uses its refresh token at the identity provider’s token endpoint (the OAuth 2.0 refresh token grant), then retries once. A second 401 means the session is over: send the user to sign in.",
        ),
      ],
      example: [
        p(
          "If a page sends 5 requests at once and all 5 get 401, a naive client refreshes 5 times. A good client runs one refresh, lets the other requests wait for it, then retries each of them once. With refresh token rotation, the identity provider also replaces the refresh token on every use, and treats reuse of an old one as a sign of theft.",
        ),
      ],
    },
  ),

  // ----- Scenario: 429 Too Many Requests --------------------------------------------------
  "429-burst": step(
    "A burst of requests",
    "Five packets rush from the browser, one after another. The badge counts down to 0 of 60 left.",
    {
      body: [
        p(
          "A bug makes the app send the same request again and again, very fast. Each one uses up part of the allowance, and soon nothing is left.",
        ),
      ],
      example: [
        p(
          "Back at the fun fair: someone spends all their ride tokens in one go. The helper adds only one token a second, so their cup is quickly empty.",
        ),
      ],
    },
    {
      body: [
        p(
          "The token bucket is empty: the burst exceeded capacity b faster than the refill rate r could replace tokens.",
        ),
      ],
      example: [
        p(
          "A typical cause: a React effect with a wrong dependency list runs again after every render and calls fetch each time. Five renders in one second spend five tokens, and a refill of one per second can’t keep up.",
        ),
      ],
    },
  ),

  "429-too-many": step(
    "The gateway answers 429",
    "Another request arrives with nothing left. The Rate limit light turns red, the badge shows 429, and a red packet goes back.",
    {
      body: [
        p(
          "With the allowance used up, the gateway answers 429. It means “too many requests, please slow down”. It also says when to try again: in 20 seconds. The services and the database never even notice the rush.",
        ),
      ],
      example: [
        p(
          "The fun fair helper says: “No tokens left. Come back in 20 seconds, when your cup has some again.” The rides keep running normally for everyone else.",
        ),
      ],
    },
    {
      body: [
        p(
          "Rejection is cheap (no upstream call), which is the point: overload is absorbed at the edge. Retry-After gives the client a concrete wait.",
        ),
      ],
      example: [
        p(
          "Answering 429 costs the gateway microseconds. Had the burst reached Orders, every request would have held a database connection; with a pool of 20 connections, a few hundred requests would make every other user queue behind the faulty client.",
        ),
      ],
    },
  ),

  "429-back-off": step(
    "Back off and retry",
    "The browser shows “waiting 20 s”. Then it sends one request, and the badge shows the allowance has filled up again.",
    {
      body: [
        p(
          "A well-behaved app does what it is told: it waits 20 seconds, then tries once. By then the allowance has filled up again, and the request goes through.",
        ),
      ],
      example: [
        p(
          "Waiting your turn at the fun fair: after a short wait your cup has tokens again, and you can ride.",
        ),
      ],
    },
    {
      body: [
        p(
          "Clients must honour Retry-After and deduplicate the burst at the source (the real fix is the bug). Retrying immediately in a loop just keeps the bucket empty.",
        ),
      ],
      example: [
        p(
          "In TanStack Query, retryDelay can read Retry-After from the error and wait exactly that long, and retry can skip other 4xx errors entirely, because sending the same bad request again won’t fix it. Fixing the effect that caused the burst is still the real cure.",
        ),
      ],
    },
  ),

  // ----- Scenario: Timeout, then retry ----------------------------------------------------
  "timeout-slow-service": step(
    "The service is slow",
    "Orders service #1 turns amber: it is slow. The gateway’s badge shows how long it has waited, until it gives up after 2 seconds.",
    {
      body: [
        p(
          "Orders service #1 is stuck and doesn’t answer. The gateway won’t wait forever: after 2 seconds, it gives up.",
        ),
      ],
      example: [
        p(
          "You ring a friend’s doorbell, and nobody comes. You don’t stand there all day: after a little while, you go and try something else.",
        ),
      ],
    },
    {
      body: [
        p(
          "The gateway’s upstream timeout (2 s here) bounds how long a client waits and how long the gateway holds resources. Without timeouts, slow services exhaust connection pools upstream, and one slow dependency becomes an outage.",
        ),
      ],
      example: [
        p(
          "Without a timeout, each stuck request holds a gateway connection and an Orders worker. At 200 requests per second, a service that hangs for 30 seconds ties up 6,000 requests at once. Few pools are that large, so even healthy routes start to fail.",
        ),
      ],
    },
  ),

  "timeout-gateway-answers": step(
    "The gateway answers 504",
    "A red packet goes back to the browser, and the gateway’s badge shows 504.",
    {
      body: [
        p(
          "The gateway tells the browser 504. It means “the service behind me didn’t answer in time”. That is much better than leaving you waiting with a spinning wheel.",
        ),
      ],
      example: [
        p(
          "A receptionist who says “sorry, the person you want isn’t answering, please try again in a moment” is more helpful than one who leaves you waiting in the lobby forever.",
        ),
      ],
    },
    {
      body: [
        p(
          "504 is the gateway reporting an upstream timeout. (502 would mean the upstream answered with something invalid; 503 that no upstream could take the request.)",
        ),
      ],
      example: [
        p(
          "Could the gateway retry by itself? For a GET with time to spare, yes: once, on another instance. Here the 2 s budget is already used up, so it answers 504 and leaves the decision to the client.",
        ),
      ],
    },
  ),

  "timeout-retry-with-backoff": step(
    "Retry with backoff",
    "The browser waits (“retry in 1 s”), then asks again. This time the gateway sends the request to Orders service #2, which answers quickly.",
    {
      body: [
        p(
          "The app waits a moment and asks again. This time the gateway sends the request to the other copy of the Orders service, which is healthy and answers quickly.",
        ),
        p(
          "If it fails again, the app waits a bit longer before each new try: first about 1 second, then 2, then 4. Waiting longer each time is called backoff.",
        ),
      ],
      example: [
        p(
          "When a friend doesn’t pick up the phone, you call again after a minute, then after five minutes, then after an hour. You don’t call a hundred times in a row: that wouldn’t help, and it would be annoying.",
        ),
      ],
    },
    {
      body: [
        p(
          "Retries use exponential backoff with jitter (for example up to 0.5 s, then 1 s, then 2 s, each randomised) so thousands of clients don’t retry in lockstep. Only retry safe or idempotent requests: GET is fine; a POST that creates an order needs an idempotency key, or it might be created twice.",
        ),
      ],
      example: [
        p(
          "With “full jitter”, attempt 1 waits a random time between 0 and 0.5 s, attempt 2 between 0 and 1 s, attempt 3 between 0 and 2 s; then the client stops and shows an error. Placing an order sends an Idempotency-Key, so if the first attempt did succeed, the retry returns the same order instead of creating a second one.",
        ),
        code("http", "A retry-safe POST", exampleCode.idempotentPost),
      ],
    },
  ),

  // ----- Scenario: 503, rerouted ----------------------------------------------------------
  "503-instance-down": step(
    "An instance goes down",
    "Orders service #1 goes dark: it has crashed. The lines from the gateway pulse as it checks on both copies.",
    {
      body: [
        p(
          "One copy of the Orders service has crashed. The gateway notices, because it checks on every copy regularly, a bit like asking “are you OK?” every few seconds.",
        ),
      ],
      example: [
        p(
          "A teacher takes the register every morning. When a child doesn’t answer “here”, the teacher knows they are away and doesn’t give them a job that day.",
        ),
      ],
    },
    {
      body: [
        p(
          "Active health checks (a failing /healthz) and passive outlier detection (consecutive 5xx responses) eject the instance from the load-balancing pool.",
        ),
      ],
      example: [
        p(
          "An active check that calls /healthz every 5 s and needs 3 failures takes about 15 s to notice a crash. Passive detection is faster: after 5 errors in a row, the instance is taken out of rotation at once, for 30 s, then tried again.",
        ),
      ],
    },
  ),

  "503-routed-around": step(
    "Routed around it",
    "The Routing light turns on and sends the request to Orders service #2. The answer comes back to the browser as usual.",
    {
      body: [
        p(
          "The gateway simply sends the request to the healthy copy. You get your orders, and you never know anything went wrong. That is why systems run more than one copy of each service.",
        ),
      ],
      example: [
        p(
          "When one checkout at the supermarket closes, the staff send you to the next one that is open. You still pay for your shopping, maybe a little more slowly.",
        ),
      ],
    },
    {
      body: [
        p(
          "Redundancy only helps if the router knows who is healthy. The gateway may also retry a failed attempt once on another instance, within a retry budget, so retries can’t multiply load during an incident.",
        ),
      ],
      example: [
        p(
          "Losing one of two instances halves capacity. If each instance handles 300 requests per second and traffic peaks at 400, the survivor is overloaded. That is why capacity is planned as “N+1”: enough instances that losing one still covers the peak.",
        ),
      ],
    },
  ),

  "503-all-down": step(
    "If every instance is down",
    "Orders service #2 goes dark too. The Routing light turns red, the badge shows 503, and a red packet goes back.",
    {
      body: [
        p(
          "Now both copies are down. With nowhere to send the request, the gateway answers honestly and quickly: 503. It means “not available right now, try again in 30 seconds”.",
        ),
      ],
      example: [
        p(
          "If every checkout is closed, someone at the door tells you “sorry, we’re closed for a few minutes”, so you don’t queue for nothing.",
        ),
      ],
    },
    {
      body: [
        p(
          "Failing fast with 503 (often via a circuit breaker) gives the service room to recover. The client should back off as in the timeout scenario.",
        ),
      ],
      example: [
        p(
          "A circuit breaker on the orders route opens when half the requests fail within 10 s. While it is open, the gateway answers 503 at once, without calling Orders. After 30 s it lets a few test requests through (“half-open”), and closes again when they succeed.",
        ),
      ],
    },
  ),
};
