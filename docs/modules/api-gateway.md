# Module script: API Gateway, the life of a request

- **Status:** Draft for review (Phase 5, checkpoint 1). Nothing here is implemented yet.
- **How to review:** edit this file directly, or reply with step numbers and changes. Items
  marked **Review:** are judgement calls worth a second look.
- **What happens next:** the approved text becomes typed content in
  `src/content/modules/api-gateway/`. Each step's "Scene" block becomes that step's beats.

---

## Learning objectives

After this module, the learner can:

1. Follow one HTTP request from the browser to the database and back, naming every component
   it passes and what each one does to it.
2. Explain why systems put an API gateway in front of their services, and what belongs in a
   gateway (cross-cutting concerns) versus in a service (business rules).
3. Describe how a gateway authenticates a request without calling the identity provider
   every time.
4. Explain rate limiting, request validation, routing and load balancing at the edge.
5. Tell 401, 429, 503 and 504 apart, and know which side should react and how (refresh,
   back off, retry, reroute).
6. Estimate where the time goes in a request, and why the network usually dominates.

## The running example

A learner opens the "My orders" page of an online shop. The single-page app at
`https://shop.example` asks the API for the user's open orders:

```http
GET /api/orders?status=open HTTP/1.1
Host: api.shop.example
Authorization: Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6ImsxIn0…
Accept: application/json
```

The user is already signed in: the app holds a short-lived access token (a JWT) issued by the
identity provider. The answer is a JSON list of two open orders.

## The scene

| Component         | Kind           | Role             | Notes                                                                      |
| ----------------- | -------------- | ---------------- | -------------------------------------------------------------------------- |
| Browser           | client         | Client           | The shop's single-page app                                                 |
| Internet          | 2 hop markers  | Network          | Scenery on the browser–gateway wire. Not selectable                        |
| API gateway       | gateway        | Edge component   | Five stations on top: TLS, Authentication, Rate limit, Validation, Routing |
| Identity provider | identity (new) | Security service | Idle and dimmed throughout. A dashed line to the gateway: "keys cached"    |
| Orders service #1 | service        | Backend service  | Handles the request on the main path                                       |
| Orders service #2 | service        | Backend service  | Second instance (load balancing, rerouting)                                |
| Users service     | service        | Backend service  | Called by the Orders service in step 8                                     |
| PostgreSQL        | database       | Data store       | The Orders database                                                        |

Connections: browser–gateway (through the internet hops), gateway–Orders #1, gateway–Orders #2,
Orders #1–Users service, Orders #1–PostgreSQL, Orders #2–PostgreSQL, gateway–identity provider
(dashed, idle).

Colours follow the design system: requests blue, responses green, errors rose, selection
violet, warnings (slow, retrying) amber.

---

## Chapter 1: The request

### Step 1. Meet the client

**Scene:** focus Browser. The browser pulses once (it decides to ask for data). Everything else
is visible but dimmed, so the learner sees the whole system first.

#### Beginner

> The browser is where the story starts. The shop's web page needs your open orders, but the
> orders don't live in the browser: they live on servers somewhere else. So the page has to
> ask for them, by sending a request over the internet.
>
> The page only knows one address for everything it needs: `api.shop.example`. Behind that
> single address sit several separate services. Which one actually answers is not the
> browser's problem. That is exactly the job of the API gateway you will meet in step 4.

#### Advanced

> The client is a single-page app served from `shop.example`, calling an API on a different
> origin, `api.shop.example`. Because the request carries an `Authorization` header, it is not
> a CORS "simple request": the browser first sends an `OPTIONS` preflight, and only sends the
> real request if the API answers with matching `Access-Control-Allow-*` headers. The
> preflight result can be cached (`Access-Control-Max-Age`), so it is usually paid once per
> session, not per call.
>
> The client is deliberately unaware of the topology behind the API. One host, one auth
> scheme and one error format keep it simple, and let the backend change without a client
> release.

**Terms:** Client · Origin · CORS preflight

---

### Step 2. Anatomy of an HTTP request

**Scene:** focus Browser. A request packet appears at the browser and stays there (it has not
left yet). Message in flight: the request above.

#### Beginner

> Before anything moves, the browser writes a request. Think of it as a letter: an address on
> the envelope, a few notes about who is asking, and sometimes something inside.
>
> - **Method:** what you want to do. GET means "please give me".
> - **Path:** which thing you want, here the list of open orders.
> - **Headers:** extra notes, such as who you are (the token) and which format you can read.
> - **Body:** the contents of the letter. A GET request has none.
>
> Callout: the blue packet in the scene is this request. Click it while paused to read it.

#### Advanced

> An HTTP request is a method, a target, header fields and an optional body. HTTP/2 and HTTP/3
> keep these semantics but encode them as binary frames: the method and path travel as
> pseudo-headers (`:method`, `:path`), and header fields are compressed with HPACK or QPACK.
>
> - **Safe and idempotent:** GET must not change server state. That is what lets gateways,
>   CDNs and clients cache it and retry it (scenario "Timeout").
> - **Authorization:** carries a signed JWT. The gateway verifies it in step 5 without calling
>   the identity provider.
> - **Accept:** starts content negotiation. A server that cannot produce JSON should answer
>   `406 Not Acceptable`.

**Terms:** HTTP method · Header · Bearer token · Idempotent

---

### Step 3. Across the network

**Scene:** focus Browser, Internet hops, API gateway. The request travels from the browser
through the two hops to the gateway's TLS station.

#### Beginner

> The request now crosses the internet. First the browser looks up where `api.shop.example`
> lives (DNS, the internet's phone book). Then it opens a secure connection: the two sides
> agree on secret keys so nobody along the way can read or change the request. That is the
> padlock in your address bar.
>
> The trip passes through many routers, and distance matters: even at the speed of light in
> fibre, crossing a continent takes tens of milliseconds. That is why the browser keeps the
> connection open and reuses it for the next requests, instead of starting over each time.

#### Advanced

> A cold request pays for DNS resolution, a TCP handshake (1 round trip) and a TLS 1.3
> handshake (1 more round trip) before the first byte of HTTP. HTTP/3 runs over QUIC, which
> merges the transport and TLS handshakes into a single round trip, and both TLS 1.3 and QUIC
> support 0-RTT resumption (only safe for idempotent requests, because 0-RTT data can be
> replayed).
>
> In practice the connection is warm: HTTP/2 or HTTP/3 multiplexes many requests over one
> connection, so the per-request cost is one network round trip. Real deployments usually put
> a CDN or a load balancer in front of the gateway; this scene leaves them out to keep the
> focus on the gateway.

**Terms:** DNS · TLS · Round trip (RTT)

**Review:** the CDN / load balancer in front of the gateway is mentioned but not drawn. I think
that is right for this module (it gets its own concepts later).

---

## Chapter 2: The gateway

### Step 4. One front door

**Scene:** focus API gateway; frame gateway, all three services and the identity provider. The
TLS station lights up (connection decrypted). The services pulse once, faintly, to show what
sits behind the door.

#### Beginner

> The API gateway is the front door of the whole system. Every request from the outside comes
> in here first, and nowhere else.
>
> Think of a hotel reception desk. Guests never wander the corridors looking for the right
> room: reception checks who they are, makes sure they are allowed in, and sends them to the
> right place. The gateway does the same for requests.
>
> Its first job is to unwrap the secure connection (the TLS station lighting up), so it can
> read the request and decide what to do with it.

#### Advanced

> An API gateway is a reverse proxy that is the single entry point for client ("north–south")
> traffic. It terminates TLS and applies cross-cutting concerns once, before any service is
> involved: authentication, rate limiting, validation, routing, observability. Services stay
> focused on business logic, and the internal topology stays private.
>
> - **vs. load balancer:** a load balancer spreads connections across instances; a gateway
>   also understands the API (paths, methods, identities). Many gateways include load
>   balancing.
> - **vs. service mesh:** a mesh handles service-to-service ("east–west") traffic inside the
>   system. Gateway and mesh are complementary.
> - **Availability:** the gateway is on every request's path, so it runs as several identical,
>   stateless replicas. Shared state such as rate-limit counters lives in a separate store.

**Terms:** Reverse proxy · TLS termination · North–south traffic

---

### Step 5. Authentication

**Scene:** focus API gateway, identity provider; frame both. The Authentication station
processes. The dashed gateway–identity provider line glows briefly (keys cached earlier); no
packet travels to the identity provider. The request's `Authorization` header is highlighted
in the message.

#### Beginner

> Next, the gateway checks the pass. The token in the request was issued by the identity
> provider when you signed in. The gateway checks three things:
>
> - it is genuine: signed by the identity provider, and not changed since;
> - it is still valid: tokens expire after a short time, often minutes;
> - it was meant for this API, not some other system.
>
> Notice what does _not_ happen: the gateway does not phone the identity provider to ask. It
> keeps a copy of the provider's public keys and checks the signature itself, which takes a
> fraction of a millisecond.

#### Advanced

> The token is a JWT signed with the identity provider's private key (for example RS256 or
> ES256). The gateway selects the public key by the token's `kid` from a cached JWKS document
> (refreshed periodically and on unknown `kid`, which supports key rotation), verifies the
> signature, then checks claims: `exp` and `nbf` (time), `iss` (issuer) and `aud` (audience).
>
> - **Self-contained vs. opaque tokens:** an opaque token would need an introspection call to
>   the identity provider per request (or a cache). JWTs avoid the round trip, at the cost of
>   not being revocable before they expire, which is why they are short-lived.
> - **Authentication vs. authorization:** the gateway usually does coarse checks (valid user,
>   required scope such as `orders:read`). "May this user see order 1042?" is business logic
>   and belongs in the Orders service (step 8).
> - On success the gateway forwards the caller's identity to the service (for example a
>   `X-User-Id` header, or the validated token itself).

**Terms:** JWT · JWKS · Claims · Authentication vs. authorization

**Scenario offered here:** 401 Unauthorized.

---

### Step 6. Rate limiting

**Scene:** focus API gateway. The Rate limit station processes. A small meter on the station
shows the client's allowance going from 58 to 57 (of 60 per minute). **Review:** the meter is
a new, small scene element; it can be dropped if it feels like clutter.

#### Beginner

> Every client gets an allowance, for example 60 requests per minute. Each request uses one
> unit; the allowance refills steadily over time.
>
> This protects everyone. A buggy app stuck in a loop, or someone trying to overload the
> system, runs out of allowance and gets turned away at the door, before reaching any
> service or database. Well-behaved clients never notice the limit.

#### Advanced

> A common algorithm is the token bucket: a bucket of capacity _b_ refills at rate _r_; each
> request takes a token or is rejected. It allows short bursts up to _b_ while enforcing an
> average of _r_. Sliding-window counters are the main alternative.
>
> - Limits are keyed by API key, user or IP, and often differ by route or plan.
> - Because the gateway runs as several replicas, counters live in a shared, fast store
>   (typically Redis, not drawn). That is one network round trip, so some gateways trade
>   exactness for speed with local counters that sync periodically.
> - Rejected requests get `429 Too Many Requests` with `Retry-After`. The IETF draft
>   `RateLimit` / `RateLimit-Policy` headers also tell clients their remaining allowance.

**Terms:** Token bucket · 429 Too Many Requests · Retry-After

**Scenario offered here:** 429 Too Many Requests.

---

### Step 7. Validation and routing

**Scene:** focus API gateway, Orders #1, Orders #2; frame gateway and the three services. The
Validation station, then the Routing station process. The request travels from the gateway to
Orders #1. Orders #2 stays normal (healthy, not chosen); the Users service is dimmed. Message
in flight: the forwarded request (below).

#### Beginner

> Two last checks at the door. First, is the request well formed? A missing value or a
> nonsense parameter is answered straight away with an error, so services never see garbage.
>
> Then the gateway looks up where the request should go. Its route table says: anything under
> `/api/orders` goes to the Orders service. There are two copies of the Orders service running,
> so the gateway picks one, here copy #1, to share the work fairly.

#### Advanced

> Validation checks the request against the API contract (typically the OpenAPI document):
> path and query parameters, body schema, size limits. Rejecting early with `400 Bad Request`
> is cheap and keeps malformed input away from services.
>
> Routing matches host, path and method to an upstream cluster, then a load-balancing policy
> (round robin, least requests) picks a healthy instance. Health comes from active checks
> (probing a `/healthz` endpoint) and passive ones (watching for errors). The gateway also
> enriches the request before forwarding it:
>
> ```http
> GET /orders?status=open HTTP/1.1
> Host: orders.internal
> X-User-Id: u_7f3a
> X-Request-Id: 9c1e…
> traceparent: 00-4bf9…-01
> Forwarded: for=203.0.113.7;proto=https
> ```
>
> The `traceparent` header (W3C Trace Context) ties the gateway's log line to every span the
> request produces inside the system.

**Terms:** Route table · Load balancing · Health check · Trace context

**Scenarios offered here:** 503 → rerouted; Timeout → retry with backoff.

---

## Chapter 3: The backend

### Step 8. Business logic

**Scene:** focus Orders #1, Users service. Orders #1 processes, then sends a request to the
Users service, which processes and answers (green packet back). Message in flight: `GET
/users/u_7f3a` (internal).

#### Beginner

> Finally the request reaches the Orders service, which knows the shop's rules. It already
> knows who is asking, because the gateway checked the pass and passed the name along. So it
> applies the rules: you may only see your own orders.
>
> To show your name and delivery address next to the orders, it asks the Users service.
> That call stays inside the system: it never goes back out through the front door.

#### Advanced

> This is where authorization by data happens: the gateway proved who the caller is; the
> service decides what they may see (only orders where `user_id = u_7f3a`).
>
> The call to the Users service is east–west traffic. It does not go through the gateway; in
> many systems a service mesh adds mTLS, retries and metrics to these calls. Every internal
> call needs its own timeout, shorter than the gateway's, or one slow dependency can tie up
> the whole chain (see scenario "Timeout").
>
> **Review:** an alternative is to drop the Users call and keep step 8 inside one service. I
> included it because "services call services, not via the gateway" is a common misconception
> worth showing.

**Terms:** Business logic · East–west traffic · Timeout budget

---

### Step 9. Querying the database

**Scene:** focus Orders #1, PostgreSQL. A request packet goes to PostgreSQL, which processes,
and a response packet returns. Message in flight: the SQL query.

#### Beginner

> The orders themselves are stored in a database. The Orders service asks it a precise
> question: "give me the open orders of this user, newest first, at most 20".
>
> The database can answer quickly because it keeps an index, like the index at the back of a
> book: instead of reading every order ever placed, it jumps straight to this user's open
> ones.

#### Advanced

> ```sql
> SELECT id, status, total_cents, created_at
> FROM orders
> WHERE user_id = $1 AND status = 'open'
> ORDER BY created_at DESC
> LIMIT 20;
> ```
>
> - **Index:** a composite index on `(user_id, status, created_at)` serves the filter and the
>   sort, so the query reads a handful of rows instead of scanning the table.
> - **Connection pool:** opening a PostgreSQL connection is expensive (a process per
>   connection), so services reuse connections from a pool (in-process, or PgBouncer).
> - **Parameters:** `$1` is a bound parameter, not string concatenation. That prevents SQL
>   injection and lets the database reuse the query plan.
> - **Scaling reads:** heavy read traffic can move to read replicas, accepting slightly stale
>   data (eventual consistency).

**Terms:** Index · Connection pool · SQL injection

---

### Step 10. Building the response

**Scene:** focus Orders #1. Orders #1 processes; a response packet (green) appears at it. Message
in flight: the service's response.

#### Beginner

> The Orders service now has everything: the orders from the database and the customer
> details from the Users service. It packs them into a reply in JSON, a simple text format
> every program can read, with a status code on top: `200 OK` means "here is what you asked
> for".

#### Advanced

> ```http
> HTTP/1.1 200 OK
> Content-Type: application/json
> Cache-Control: private, no-store
>
> {
>   "orders": [
>     { "id": 1042, "status": "open", "totalCents": 4599, "createdAt": "2026-11-20T09:14:00Z" },
>     { "id": 1038, "status": "open", "totalCents": 1250, "createdAt": "2026-11-18T17:02:00Z" }
>   ],
>   "nextCursor": null
> }
> ```
>
> - **Status codes** are part of the contract: 2xx success, 4xx the client must change
>   something, 5xx the server failed.
> - **Cache-Control: private, no-store:** personal data must not be stored by shared caches.
> - **Pagination:** a cursor (`nextCursor`) is more robust than page numbers when new orders
>   arrive between requests.

**Terms:** Status code · JSON · Pagination

---

## Chapter 4: The return trip

### Step 11. The response flows back

**Scene:** focus Browser, API gateway, Orders #1. The response travels Orders #1 → gateway
(processes briefly) → through the hops → browser. Message in flight: the response as the browser
receives it.

#### Beginner

> The reply travels back the way the request came: to the gateway, then across the internet
> to your browser, which finally shows your two open orders.
>
> On the way out, the gateway adds a few finishing touches: it shrinks the reply so it
> travels faster, adds the headers browsers need for security, and writes down how the
> request went, so the team can spot problems.

#### Advanced

> The gateway does not change the meaning of the response, but it often:
>
> - compresses it (Brotli or gzip, chosen from `Accept-Encoding`, with `Vary: Accept-Encoding`);
> - adds CORS headers (`Access-Control-Allow-Origin: https://shop.example`) and security
>   headers (`Strict-Transport-Security`, `X-Content-Type-Options`);
> - records an access log line, latency and status metrics, and closes the trace span.
>
> Status codes pass through unchanged, except errors the gateway raises itself: 401, 429,
> 502, 503, 504.

**Terms:** Compression · Access log · Observability

---

### Step 12. The full lifecycle

**Scene:** frame everything, nothing dimmed. The whole journey replays at double speed: request
out, every station, service, database, response back. The Step tab shows the latency
breakdown. At the end, the inspector suggests the scenarios and offers "Mark as completed".

#### Beginner

> That was one request, start to finish. It crossed the internet twice, passed five checks at
> the front door, visited two services and a database, and still took well under a tenth of a
> second.
>
> Where did the time go? Mostly into travelling: crossing the internet, there and back. The
> gateway's checks took about a millisecond. That is why gateways are worth having: one front
> door for safety and order, at a very small cost.
>
> Ready for what happens when things go wrong? Try the scenarios.

#### Advanced

> An illustrative breakdown for a user about 1,000 km from the data centre, on a warm
> connection:
>
> | Segment                                             | Time       |
> | --------------------------------------------------- | ---------- |
> | Browser → gateway (network, one way)                | ~15 ms     |
> | Gateway: auth 0.2, rate limit 1, validate/route 0.2 | ~1.5 ms    |
> | Gateway → Orders (same data centre)                 | ~0.5 ms    |
> | Orders logic, including the Users call              | ~4 ms      |
> | Database query (indexed)                            | ~3 ms      |
> | Response: JSON, back to gateway, compression        | ~2 ms      |
> | Gateway → browser (network, one way)                | ~15 ms     |
> | **Total**                                           | **~41 ms** |
>
> The network is about three quarters of the total, which is why connection reuse, CDNs and
> fewer round trips matter more than shaving the gateway. Tail latency (p99) is driven by the
> slowest dependency on the path, which is what timeouts and retries (scenarios) manage.

**Terms:** Latency · Tail latency (p99)

**Review:** the numbers are illustrative orders of magnitude, labelled as such in the UI.

---

## Scenarios

Scenarios branch from a step of the main path. Choosing one jumps to its branch point and
plays its own short sequence; the dock timeline shows the scenario's steps. "Back to the main
path" returns to the branch step. The main path itself is the success scenario.

### 401 Unauthorized (branches from step 5)

1. **An expired token arrives.** _Scene:_ request travels to the gateway; Authentication
   station processes and turns rose; a "401" badge appears on the gateway.
   - _Beginner:_ The pass expired a few minutes ago. The gateway refuses it at the door. No
     service is bothered.
   - _Advanced:_ `exp` is in the past, so signature checks are irrelevant. The gateway answers
     immediately; failing at the edge protects services and keeps error handling uniform.
2. **The gateway answers 401.** _Scene:_ a rose response packet returns to the browser.
   Message: `HTTP/1.1 401 Unauthorized` with `WWW-Authenticate: Bearer error="invalid_token",
error_description="The access token expired"`.
   - _Beginner:_ The browser is told "your pass is no good" and exactly why.
   - _Advanced:_ 401 means "not authenticated" (missing, invalid or expired credentials). 403
     would mean "authenticated, but not allowed". The `WWW-Authenticate` header tells the
     client which scheme and what went wrong.
3. **Refresh and try again.** _Scene:_ the browser exchanges its refresh token with the
   identity provider (packet browser → identity provider → browser, the only time that link is
   used), then resends the request, which passes authentication (abbreviated, green at the
   end).
   - _Beginner:_ The app quietly gets a fresh pass and asks again. You never notice.
   - _Advanced:_ The client uses its refresh token at the identity provider's token endpoint
     (OAuth 2.0 refresh grant), then retries once. A second 401 means the session is over:
     send the user to sign in.

**Review:** step 3 draws a browser–identity provider connection that exists only in this
scenario. Alternative: describe the refresh in text only.

### 429 Too Many Requests (branches from step 6)

1. **A burst of requests.** _Scene:_ five quick request packets; the rate-limit meter drains
   to 0.
   - _Beginner:_ A bug makes the app send the same request again and again. Each one uses up
     allowance.
   - _Advanced:_ The token bucket is empty: the burst exceeded capacity _b_ faster than the
     refill rate _r_ could replace tokens.
2. **The gateway answers 429.** _Scene:_ the Rate limit station turns rose, a "429" badge
   appears, rose response packets return. Message: `HTTP/1.1 429 Too Many Requests`,
   `Retry-After: 20`.
   - _Beginner:_ The gateway says "slow down, try again in 20 seconds". The services and the
     database never feel the burst.
   - _Advanced:_ Rejection is cheap (no upstream call), which is the point: overload is
     absorbed at the edge. `Retry-After` gives the client a concrete wait.
3. **Back off and retry.** _Scene:_ a short wait (amber clock), the meter refills, one request
   passes.
   - _Beginner:_ A well-behaved app waits as told, then tries once.
   - _Advanced:_ Clients must honour `Retry-After` and deduplicate the burst at the source
     (the real fix is the bug). Retrying immediately in a loop just keeps the bucket empty.

### Timeout → retry with backoff (branches from step 7)

1. **The service is slow.** _Scene:_ request reaches Orders #1, which turns amber and keeps
   processing; an amber timer on the gateway counts to 2 s.
   - _Beginner:_ Orders #1 is stuck. The gateway will not wait forever: after 2 seconds it
     gives up.
   - _Advanced:_ The gateway's upstream timeout (2 s here) bounds how long a client waits and
     how long the gateway holds resources. Without timeouts, slow services exhaust connection
     pools upstream, and one slow dependency becomes an outage.
2. **The gateway answers 504.** _Scene:_ rose response packet to the browser. Message:
   `HTTP/1.1 504 Gateway Timeout`.
   - _Beginner:_ The browser is told "the server behind me didn't answer in time".
   - _Advanced:_ 504 is the gateway reporting an upstream timeout. (502 would mean the
     upstream answered with something invalid; 503 that no upstream could take the request.)
3. **Retry with backoff.** _Scene:_ the browser waits (amber), retries; the gateway routes to
   Orders #2; the request succeeds (green response).
   - _Beginner:_ The app waits a moment and tries again. This time a healthy copy answers.
   - _Advanced:_ Retries use exponential backoff with jitter (for example up to 0.5 s, then
     1 s, then 2 s, each randomised) so thousands of clients don't retry in lockstep. Only
     retry safe or idempotent requests: GET is fine; a POST that creates an order needs an
     idempotency key, or it might be created twice.

### 503 → rerouted to a healthy instance (branches from step 7)

1. **An instance goes down.** _Scene:_ Orders #1 turns rose with a "down" badge; its health
   check (small pulses from the gateway) fails.
   - _Beginner:_ One copy of the Orders service has crashed. The gateway notices, because it
     checks on every copy regularly.
   - _Advanced:_ Active health checks (failing `/healthz`) and passive outlier detection
     (consecutive 5xx) eject the instance from the load-balancing pool.
2. **Routed around it.** _Scene:_ the request goes to Orders #2 instead and the response
   returns green.
   - _Beginner:_ The gateway simply sends the request to the healthy copy. You never notice
     anything happened. This is why systems run more than one copy.
   - _Advanced:_ Redundancy only helps if the router knows who is healthy. The gateway may
     also retry a failed attempt once on another instance, within a retry budget, so retries
     can't multiply load during an incident.
3. **If every instance is down.** _Scene:_ Orders #2 also turns rose; the gateway answers with
   a rose packet. Message: `HTTP/1.1 503 Service Unavailable`, `Retry-After: 30`.
   - _Beginner:_ With no healthy copy left, the gateway answers honestly: "unavailable, try
     again in 30 seconds", instead of letting you wait.
   - _Advanced:_ Failing fast with 503 (often via a circuit breaker) gives the service room to
     recover. The client should back off as in the timeout scenario.

---

## Components

Each component has these sections at both levels where it matters: purpose, responsibilities,
how it works, inputs and outputs, talks to, common technologies, examples, advantages,
limitations. Beginner purposes use an analogy; advanced purposes are technical.

### Browser (client)

- **Purpose:** _Beginner:_ the app you use; it asks the system for data and shows it.
  _Advanced:_ a single-page app on its own origin, calling the API over HTTPS with a bearer
  token.
- **Responsibilities:** render the UI · keep the access and refresh tokens · call the API ·
  handle errors (refresh on 401, back off on 429/503/504).
- **How it works:** `fetch` sends HTTPS requests over a reused HTTP/2 or HTTP/3 connection;
  CORS preflights cross-origin calls that carry credentials.
- **Inputs / outputs:** user actions, API responses / API requests.
- **Talks to:** API gateway (identity provider only to sign in or refresh).
- **Technologies:** React, Vue, Angular; `fetch`, TanStack Query.
- **Advantages / limitations:** rich, responsive UI / runs on an untrusted device: never
  trust input from it, never put secrets in it.

### API gateway

As drafted in Phase 2 (purpose, six responsibilities, Kong / Envoy / NGINX / AWS API Gateway /
Azure API Management / Apigee), plus a **how it works** section describing the five
stations in order (TLS → authentication → rate limit → validation → routing) and the response
path (compression, headers, logs).

### Identity provider

- **Purpose:** _Beginner:_ the office that issues passes after you sign in. _Advanced:_ an
  OAuth 2.0 / OpenID Connect authorization server that issues signed tokens and publishes its
  public keys (JWKS).
- **Responsibilities:** authenticate users (password, MFA, SSO) · issue access and refresh
  tokens · publish signing keys and rotate them.
- **How it works:** after sign-in, issues a short-lived JWT access token and a longer-lived
  refresh token; anyone with the public keys can verify its tokens offline.
- **Talks to:** browser (sign-in, refresh); gateway fetches its JWKS now and then.
- **Technologies:** Auth0, Okta, Microsoft Entra ID, Keycloak, AWS Cognito.
- **Advantages / limitations:** one place for identity, offline verification / short-lived
  tokens can't be revoked instantly; it is critical for sign-in, so it must be highly
  available.

### Orders service

- **Purpose:** _Beginner:_ the department that knows everything about orders. _Advanced:_ a
  domain service owning the orders data and rules, running as several stateless instances.
- **Responsibilities:** enforce order rules (who sees what) · read and write orders · combine
  data from other services · return API responses.
- **How it works:** receives requests already authenticated by the gateway (caller identity in
  headers), queries PostgreSQL through a connection pool, calls the Users service with its own
  timeout.
- **Talks to:** API gateway, Users service, PostgreSQL.
- **Technologies:** Node.js, Java/Spring, Go, .NET; a health endpoint for the gateway.
- **Advantages / limitations:** independent deploys and scaling, clear ownership / network
  calls between services add latency and new failure modes.

### Users service

- **Purpose:** _Beginner:_ the department that keeps customer details. _Advanced:_ the domain
  service owning user profiles, called internally by other services.
- **Responsibilities:** store and return user profiles · own user data and its rules.
- **Talks to:** Orders service (and others) inside the system.
- **Technologies:** as for the Orders service.
- **Advantages / limitations:** single source of truth for users / every service that needs
  user data now depends on it (consider caching, or copying the few fields needed).

### PostgreSQL (Orders database)

- **Purpose:** _Beginner:_ the filing cabinet where orders are kept safely. _Advanced:_ a
  relational database providing transactions (ACID), indexes and SQL.
- **Responsibilities:** store orders durably · answer queries quickly · keep data consistent
  under concurrent writes.
- **How it works:** queries use indexes to find rows; each write is logged before it is
  acknowledged (WAL), so it survives crashes.
- **Talks to:** Orders service only. Each service owns its database.
- **Technologies:** PostgreSQL; managed: Amazon RDS / Aurora, Azure Database, Cloud SQL;
  PgBouncer for pooling.
- **Advantages / limitations:** strong consistency, flexible queries / scaling writes beyond
  one primary is hard (sharding); connections are expensive.

---

## Glossary (all terms used above)

Access log · Authentication vs. authorization · Bearer token · Claims · Client · Compression ·
Connection pool · CORS preflight · DNS · East–west traffic · Header · Health check · HTTP
method · Idempotent · Index · JSON · JWKS · JWT · Latency · Load balancing · North–south
traffic · Observability · Origin · Pagination · Reverse proxy · Retry-After · Round trip (RTT) ·
Route table · SQL injection · Status code · Tail latency (p99) · Timeout budget · TLS · TLS
termination · Token bucket · Trace context · 429 Too Many Requests

Each term gets a one-sentence definition in the content files; they are short and follow the
style of the Phase 4 drafts.
