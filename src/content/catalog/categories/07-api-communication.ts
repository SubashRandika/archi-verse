import type { CategoryDefinition } from "../types";

export const apiCommunication: CategoryDefinition = {
  id: "api-communication",
  title: "API Integration & Communication Architecture",
  description:
    "How clients and servers talk: the protocols, API styles and gateways involved, and the patterns that keep communication reliable.",
  icon: "api",
  order: 7,
  concepts: [
    {
      id: "rest-apis",
      title: "REST APIs",
      summary:
        "Resource-oriented HTTP APIs that use standard methods, status codes and URLs to read and change data.",
      keywords: ["REST", "RESTful", "resources"],
    },
    {
      id: "graphql",
      title: "GraphQL",
      summary:
        "A query language and runtime that lets clients ask for exactly the data they need from a typed schema, usually through one endpoint.",
    },
    {
      id: "grpc-web",
      title: "gRPC-Web",
      summary:
        "A way for browsers to call gRPC services using Protocol Buffers over HTTP, usually through a proxy.",
      keywords: ["gRPC", "protobuf", "Protocol Buffers"],
    },
    {
      id: "websockets",
      title: "WebSockets",
      summary:
        "A persistent, two-way connection between browser and server for real-time messaging.",
      keywords: ["real-time", "socket"],
    },
    {
      id: "server-sent-events",
      title: "Server-Sent Events (SSE)",
      summary:
        "A one-way stream of events from server to browser over a long-lived HTTP connection.",
      keywords: ["SSE", "EventSource", "streaming"],
    },
    {
      id: "http-protocol",
      title: "HTTP Protocol",
      summary:
        "The request-response protocol of the web: methods, headers and status codes, across HTTP/1.1, HTTP/2 and HTTP/3.",
      keywords: ["HTTP", "HTTP/2", "HTTP/3", "status codes"],
    },
    {
      id: "api-gateway",
      title: "API Gateway",
      summary:
        "A single entry point in front of backend services that handles authentication, rate limiting, routing and other cross-cutting concerns.",
      keywords: ["reverse proxy", "edge", "Kong", "Envoy"],
      moduleId: "api-gateway",
    },
    {
      id: "backend-for-frontend",
      title: "Backend for Frontend (BFF)",
      summary:
        "A dedicated backend for each kind of client, such as web or mobile, that shapes data exactly for that interface.",
      keywords: ["BFF"],
    },
    {
      id: "api-versioning",
      title: "API Versioning",
      summary:
        "Evolving an API without breaking existing clients, using URL, header or schema-based versions.",
    },
    {
      id: "openapi-specification",
      title: "OpenAPI Specification",
      summary:
        "A standard, machine-readable format for describing HTTP APIs, used to generate documentation, clients and tests.",
      keywords: ["Swagger", "OAS"],
    },
    {
      id: "request-cancellation",
      title: "Request Cancellation",
      summary:
        "Aborting requests that are no longer needed, for example with AbortController when the user navigates away.",
      keywords: ["AbortController", "abort"],
    },
    {
      id: "retry-and-exponential-backoff",
      title: "Retry and Exponential Backoff",
      summary:
        "Retrying failed requests after increasing, randomised delays so a struggling service is not overwhelmed.",
      keywords: ["retry and backoff", "jitter"],
    },
    {
      id: "rate-limiting",
      title: "Rate Limiting",
      summary:
        "Capping how many requests a client can make in a time window, to protect a service from overload and abuse.",
      keywords: ["429", "throttling", "token bucket"],
    },
    {
      id: "pagination",
      title: "Pagination",
      summary: "Returning large result sets one page at a time, using offsets or cursors.",
      keywords: ["cursor", "offset", "infinite scroll"],
    },
    {
      id: "request-deduplication",
      title: "Request Deduplication",
      summary:
        "Collapsing identical in-flight requests into one, so the same data is not fetched twice.",
    },
    {
      id: "idempotency",
      title: "Idempotency",
      summary:
        "Designing operations so that repeating them has the same effect as doing them once, which makes retries safe.",
      keywords: ["idempotency key", "idempotent"],
    },
    {
      id: "circuit-breaker",
      title: "Circuit Breaker",
      summary:
        "Stopping calls to a failing dependency for a while and failing fast instead, then testing whether it has recovered.",
    },
  ],
};
