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
      keywords: ["REST", "RESTful", "resources"],
    },
    {
      id: "graphql",
      title: "GraphQL",
    },
    {
      id: "grpc-web",
      title: "gRPC-Web",
      keywords: ["gRPC", "protobuf", "Protocol Buffers"],
    },
    {
      id: "websockets",
      title: "WebSockets",
      keywords: ["real-time", "socket"],
    },
    {
      id: "server-sent-events",
      title: "Server-Sent Events (SSE)",
      keywords: ["SSE", "EventSource", "streaming"],
    },
    {
      id: "http-protocol",
      title: "HTTP Protocol",
      keywords: ["HTTP", "HTTP/2", "HTTP/3", "status codes"],
    },
    {
      id: "api-gateway",
      title: "API Gateway",
      keywords: ["reverse proxy", "edge", "Kong", "Envoy"],
      moduleId: "api-gateway",
    },
    {
      id: "backend-for-frontend",
      title: "Backend for Frontend (BFF)",
      keywords: ["BFF"],
    },
    {
      id: "api-versioning",
      title: "API Versioning",
    },
    {
      id: "openapi-specification",
      title: "OpenAPI Specification",
      keywords: ["Swagger", "OAS"],
    },
    {
      id: "request-cancellation",
      title: "Request Cancellation",
      keywords: ["AbortController", "abort"],
    },
    {
      id: "retry-and-exponential-backoff",
      title: "Retry and Exponential Backoff",
      keywords: ["retry and backoff", "jitter"],
    },
    {
      id: "rate-limiting",
      title: "Rate Limiting",
      keywords: ["429", "throttling", "token bucket"],
    },
    {
      id: "pagination",
      title: "Pagination",
      keywords: ["cursor", "offset", "infinite scroll"],
    },
    {
      id: "request-deduplication",
      title: "Request Deduplication",
    },
    {
      id: "idempotency",
      title: "Idempotency",
      keywords: ["idempotency key", "idempotent"],
    },
    {
      id: "circuit-breaker",
      title: "Circuit Breaker",
      moduleId: "circuit-breaker",
    },
  ],
};
