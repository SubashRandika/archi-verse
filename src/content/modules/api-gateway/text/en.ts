import type { LocaleText } from "../../types";
import { enSteps } from "./en-steps";

/** API Gateway module, English. SERVER ONLY. */
export const en: LocaleText = {
  chapters: {
    request: "The request",
    gateway: "The gateway",
    backend: "The backend",
    "return-trip": "The return trip",
  },

  scenarios: {
    unauthorized: {
      title: "401 Unauthorized",
      summary: "An expired token is turned away at the door, then refreshed.",
    },
    "rate-limited": {
      title: "429 Too Many Requests",
      summary: "A burst uses up the allowance; the gateway asks the client to slow down.",
    },
    timeout: {
      title: "Timeout, then retry",
      summary: "A slow service makes the gateway give up; the client retries with backoff.",
    },
    unavailable: {
      title: "503, rerouted",
      summary: "One instance goes down and traffic moves to the healthy one.",
    },
  },

  steps: enSteps,

  messages: {
    request: "The request the browser sends",
    "expired-request": "The same request, with a token that expired 4 minutes ago",
    forwarded: "The request the gateway forwards to Orders",
    "users-call": "Orders asks the Users service (inside the system)",
    "users-reply": "The Users service answers",
    "sql-query": "The query Orders sends to PostgreSQL",
    "sql-rows": "PostgreSQL returns two rows",
    "service-response": "The response the Orders service builds",
    "final-response": "The response the browser receives",
    "401-response": "The gateway’s answer",
    "refresh-request": "The app asks the identity provider for a new access token",
    "refresh-response": "A fresh access token",
    "429-response": "The gateway’s answer",
    "504-response": "The gateway’s answer",
    "503-response": "The gateway’s answer",
  },

  components: {
    browser: {
      name: "Browser",
      kind: "Client",
      beginner: {
        summary: "The app you use. It asks the shop for information and shows it to you.",
        analogy:
          "Like a customer at a shop counter: you ask for what you want and it is handed to you. You never go into the storeroom yourself.",
        jobs: [
          "Shows you the shop’s pages",
          "Sends a request when you click",
          "Keeps your pass (token) after you sign in",
          "Tries again politely when something goes wrong",
        ],
      },
      advanced: {
        summary:
          "A single-page app on its own origin, calling the API over HTTPS with a bearer token.",
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
        technologies: ["React", "Vue", "Angular", "fetch", "TanStack Query"],
        examples: ["A React single-page app calling a REST API", "A mobile app using the same API"],
        advantages: ["Rich, responsive interface", "Works offline-first if designed to"],
        limitations: [
          "Runs on an untrusted device: never trust its input",
          "Never put secrets in it",
        ],
      },
      talksTo: ["API gateway", "Identity provider (sign-in and refresh only)"],
    },

    gateway: {
      name: "API Gateway",
      kind: "Edge component",
      beginner: {
        summary: "The front door of the system. Every request comes through it first.",
        analogy:
          "Like a hotel reception desk: it checks who you are, makes sure you are allowed in, and sends you to the right room.",
        jobs: [
          "Opens the sealed (encrypted) request",
          "Checks your pass",
          "Stops anyone who sends too many requests",
          "Checks that the request is written correctly",
          "Sends it to the right service",
        ],
      },
      advanced: {
        summary:
          "A reverse proxy that acts as the single entry point for client traffic. It terminates TLS, authenticates requests, enforces rate limits and routes each request to the right upstream service, so cross-cutting concerns live in one place instead of in every service.",
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
        technologies: [
          "Kong",
          "Envoy",
          "NGINX",
          "AWS API Gateway",
          "Azure API Management",
          "Apigee",
        ],
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
      talksTo: ["Browser", "Identity provider (keys only)", "Orders service"],
    },

    identity: {
      name: "Identity provider",
      kind: "Security service",
      beginner: {
        summary: "The office that gives you a pass when you sign in.",
        analogy:
          "Like the ticket office of a museum: it checks who you are once and gives you a ticket. After that, the guards only look at the ticket.",
        jobs: [
          "Checks your password when you sign in",
          "Gives out passes (tokens)",
          "Gives you a new pass when the old one expires",
          "Shares the stamp (public key) that guards use to spot fake passes",
        ],
      },
      advanced: {
        summary:
          "An OAuth 2.0 / OpenID Connect authorization server that issues signed tokens and publishes its public keys (JWKS).",
        howItWorks:
          "After sign-in it issues a short-lived JWT access token and a longer-lived refresh token. Anyone with its public keys can verify its tokens offline, so it is not called on every request.",
        responsibilities: [
          "Authenticate users (password, MFA, SSO)",
          "Issue access and refresh tokens",
          "Publish its signing keys and rotate them",
        ],
        inputs: ["Sign-in and token requests"],
        outputs: ["Tokens", "Public keys (JWKS)"],
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
      talksTo: ["Browser (sign-in, refresh)", "API gateway (fetches its keys now and then)"],
    },

    "orders-1": {
      name: "Orders service",
      kind: "Backend service (copy #1 of 2)",
      beginner: {
        summary: "The part of the system that knows everything about orders.",
        analogy:
          "Like the orders department of a company: it keeps track of what everyone bought, and follows the rules about who may see what.",
        jobs: [
          "Follows the rules about orders",
          "Reads and saves orders in the database",
          "Asks other services for extra details",
          "Writes the answer",
        ],
      },
      advanced: {
        summary:
          "A domain service owning the orders data and rules, running as several stateless instances.",
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
        technologies: ["Node.js", "Java / Spring", "Go", ".NET", "A /healthz endpoint"],
        examples: ["An e-commerce service owning carts and orders"],
        advantages: ["Independent deploys and scaling", "Clear ownership of orders"],
        limitations: [
          "Calls between services add latency",
          "New failure modes: timeouts, partial outages",
        ],
      },
      talksTo: ["API gateway", "Users service", "PostgreSQL"],
    },

    "orders-2": {
      name: "Orders service",
      kind: "Backend service (copy #2 of 2)",
      beginner: {
        summary: "A second copy of the Orders service, ready to share the work.",
        analogy:
          "Like a second checkout at a supermarket: it does the same job, so if one is busy or closed, the other one serves you.",
        jobs: ["Shares the work with copy #1", "Takes over if copy #1 breaks"],
      },
      advanced: {
        summary:
          "An identical, stateless instance. The gateway load-balances across both and routes around one that fails.",
        howItWorks:
          "Same code and database as instance #1. Because instances keep no state between requests, any of them can answer any request.",
        responsibilities: ["Share the load", "Take over when the other instance fails"],
        inputs: ["Requests from the gateway"],
        outputs: ["API responses"],
        technologies: ["Container orchestration (Kubernetes, ECS)", "Autoscaling"],
        examples: ["Two to dozens of replicas behind one route"],
        advantages: ["Redundancy", "Horizontal scaling"],
        limitations: ["Only works if instances are stateless", "Needs health checks to be useful"],
      },
      talksTo: ["API gateway", "Users service", "PostgreSQL"],
    },

    users: {
      name: "Users service",
      kind: "Backend service",
      beginner: {
        summary: "The part of the system that keeps customer details, like names and addresses.",
        analogy:
          "Like the school office that keeps every student’s address: teachers ask it when they need one.",
        jobs: ["Keeps customer details", "Answers other services when they ask"],
      },
      advanced: {
        summary: "The domain service owning user profiles, called internally by other services.",
        howItWorks:
          "Serves profile data to other services over internal (east–west) calls that never pass the gateway.",
        responsibilities: ["Store and return user profiles", "Own user data and its rules"],
        inputs: ["Internal requests"],
        outputs: ["User profiles"],
        technologies: ["Node.js", "Java / Spring", "Go", ".NET"],
        examples: ["A profile service used by checkout, emails and support tools"],
        advantages: ["A single source of truth for users"],
        limitations: [
          "Every service that needs user data now depends on it (consider caching, or copying the few fields needed)",
        ],
      },
      talksTo: ["Orders service (and other services)"],
    },

    postgres: {
      name: "PostgreSQL",
      kind: "Data store (the Orders database)",
      beginner: {
        summary: "The database: where the orders are kept safely.",
        analogy:
          "Like a tidy filing cabinet with an index card for everything, so any file can be found in seconds.",
        jobs: [
          "Keeps orders safe, even if the power goes off",
          "Finds the right orders quickly",
          "Makes sure two changes at the same time don’t mix up the data",
        ],
      },
      advanced: {
        summary: "A relational database providing transactions (ACID), indexes and SQL.",
        howItWorks:
          "Queries use indexes to find rows quickly. Each write is logged before it is acknowledged (the write-ahead log), so it survives crashes.",
        responsibilities: [
          "Store orders durably",
          "Answer queries quickly",
          "Keep data consistent under concurrent writes",
        ],
        inputs: ["SQL queries"],
        outputs: ["Rows"],
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
      talksTo: ["Orders service only: each service owns its database"],
    },
  },

  glossary: {
    client: { term: "Client", definition: "The program that sends requests: here, the browser." },
    origin: {
      term: "Origin",
      definition:
        "The scheme, host and port of a web address. The browser keeps different origins apart.",
    },
    "cors-preflight": {
      term: "CORS preflight",
      definition:
        "A small OPTIONS request the browser sends first, to ask whether a call to another origin is allowed.",
    },
    "http-method": {
      term: "HTTP method",
      definition: "The action a request asks for, such as GET (give me) or POST (create this).",
    },
    header: { term: "Header", definition: "A named note sent along with a message." },
    "bearer-token": {
      term: "Bearer token",
      definition: "A pass that proves who you are. Whoever holds it is trusted, so keep it safe.",
    },
    idempotent: {
      term: "Idempotent",
      definition: "Sending the request twice has the same effect as sending it once.",
    },
    dns: {
      term: "DNS",
      definition:
        "The internet’s contacts list: it turns names like api.shop.example into addresses.",
    },
    tls: {
      term: "TLS",
      definition:
        "The secret code that keeps a connection private and proves who is on the other side (the “S” in HTTPS).",
    },
    rtt: {
      term: "Round trip (RTT)",
      definition: "The time for a message to reach the other side and an answer to come back.",
    },
    "reverse-proxy": {
      term: "Reverse proxy",
      definition: "A server that receives requests for other servers and passes them on.",
    },
    "tls-termination": {
      term: "TLS termination",
      definition: "Unlocking the secure connection at the front door, so the request can be read.",
    },
    "north-south": {
      term: "North–south traffic",
      definition: "Requests coming into the system from outside, and their answers.",
    },
    jwt: {
      term: "JWT",
      definition:
        "JSON Web Token: a signed pass with facts about a user, which anyone with the public key can check.",
    },
    jwks: {
      term: "JWKS",
      definition:
        "JSON Web Key Set: the public keys an identity provider shares, so others can check its tokens.",
    },
    claims: {
      term: "Claims",
      definition: "The facts written inside a token, such as who it is for and when it expires.",
    },
    "authn-authz": {
      term: "Authentication vs. authorization",
      definition: "“Who are you?” (authentication) versus “what may you do?” (authorization).",
    },
    "token-bucket": {
      term: "Token bucket",
      definition:
        "A way to limit requests: a bucket of tokens refills steadily, and each request takes one.",
    },
    "429": {
      term: "429 Too Many Requests",
      definition: "The answer for a client that has used up its allowance.",
    },
    "401": {
      term: "401 Unauthorized",
      definition: "The answer when the pass is missing, wrong or expired.",
    },
    "retry-after": {
      term: "Retry-After",
      definition: "A header that tells the client how long to wait before trying again.",
    },
    "route-table": {
      term: "Route table",
      definition: "The gateway’s list of which addresses go to which service.",
    },
    "load-balancing": {
      term: "Load balancing",
      definition: "Sharing requests between several copies of a service.",
    },
    "health-check": {
      term: "Health check",
      definition:
        "A regular “are you OK?” that tells the gateway whether a copy can take requests.",
    },
    "trace-context": {
      term: "Trace context",
      definition:
        "Headers (traceparent) that link every step of one request across services, so it can be followed.",
    },
    "business-logic": {
      term: "Business logic",
      definition: "The rules of the product itself, such as who may see which orders.",
    },
    "east-west": {
      term: "East–west traffic",
      definition: "Requests between services inside the system.",
    },
    "timeout-budget": {
      term: "Timeout budget",
      definition:
        "How long each call may take. Calls deeper inside get less time, so callers give up in order.",
    },
    index: {
      term: "Index",
      definition: "A database shortcut that finds matching rows without reading the whole table.",
    },
    "connection-pool": {
      term: "Connection pool",
      definition:
        "A set of open database connections that are reused, instead of opening new ones.",
    },
    "sql-injection": {
      term: "SQL injection",
      definition: "An attack that sneaks SQL commands into a query through unchecked input.",
    },
    "status-code": {
      term: "Status code",
      definition:
        "The three-digit result of a request: 2xx success, 4xx the client’s mistake, 5xx the server’s problem.",
    },
    json: {
      term: "JSON",
      definition: "A simple text format for information, readable by any program.",
    },
    pagination: {
      term: "Pagination",
      definition: "Sending a long list in pages, with a way to ask for the next page.",
    },
    compression: {
      term: "Compression",
      definition: "Squeezing a response (gzip, Brotli) so it travels faster.",
    },
    "access-log": {
      term: "Access log",
      definition: "One line per request: who called what, the result and how long it took.",
    },
    observability: {
      term: "Observability",
      definition: "Logs, metrics and traces that let a team see what the system is doing.",
    },
    latency: { term: "Latency", definition: "How long a request takes, from start to finish." },
    "tail-latency": {
      term: "Tail latency (p99)",
      definition: "The time only the slowest 1% of requests go over.",
    },
    "refresh-token": {
      term: "Refresh token",
      definition: "A longer-lasting pass used only to get new access tokens.",
    },
    backoff: {
      term: "Exponential backoff",
      definition:
        "Waiting longer after each failed try, with a little randomness (jitter) so clients don’t all retry at once.",
    },
  },
};
