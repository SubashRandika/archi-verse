/**
 * PLACEHOLDER (Phases 2–4). Draft copy for the three demonstration steps and one component,
 * so the inspector works against realistic content. The reviewed module content (beginner
 * and advanced text for all 12 steps, every component) replaces it in Phase 5.
 */
import type { ExplanationLevel } from "@/features/preferences/preferences-store";
import type { ExplanationBlock } from "./explanation-blocks";

export const previewStepExplanations: Readonly<
  Record<string, Record<ExplanationLevel, readonly ExplanationBlock[]>>
> = {
  "request-leaves-the-browser": {
    beginner: [
      {
        type: "paragraph",
        text: "Before anything moves, the browser writes a request. Think of it as a letter: an address on the envelope, a few notes about who is asking, and sometimes something inside.",
      },
      {
        type: "list",
        items: [
          { term: "Method", text: "what you want to do. GET means “please give me”." },
          { term: "Path", text: "which thing you want, here the list of orders." },
          {
            term: "Headers",
            text: "extra notes, such as who you are and which format you can read.",
          },
          { term: "Body", text: "the contents of the letter. A GET request has none." },
        ],
      },
      {
        type: "http",
        caption: "The request the browser sends",
        lines: [
          "GET /api/orders?status=open HTTP/1.1",
          "Host: api.shop.example",
          "Authorization: Bearer eyJhbGciOiJSUzI1NiJ9…",
          "Accept: application/json",
        ],
      },
      {
        type: "callout",
        text: "In the scene, this request is the blue packet travelling from the browser to the API gateway.",
      },
      {
        type: "terms",
        terms: [
          {
            term: "HTTP method",
            definition: "The action a request asks for, such as GET or POST.",
          },
          { term: "Header", definition: "A named piece of extra information sent with a request." },
          {
            term: "Bearer token",
            definition: "A pass that proves who you are. Whoever holds it is trusted.",
          },
        ],
      },
    ],
    advanced: [
      {
        type: "paragraph",
        text: "An HTTP request is a method, a target, header fields and an optional body. HTTP/2 and HTTP/3 keep the same semantics but encode them as binary frames: the method and path travel as pseudo-headers, and header fields are compressed with HPACK or QPACK.",
      },
      {
        type: "http",
        caption: "The same request as HTTP/2 header fields",
        lines: [
          ":method: GET",
          ":scheme: https",
          ":authority: api.shop.example",
          ":path: /api/orders?status=open",
          "authorization: Bearer eyJhbGciOiJSUzI1NiJ9…",
          "accept: application/json",
        ],
      },
      {
        type: "list",
        items: [
          {
            term: "Safe and idempotent",
            text: "GET must not change server state, which is what lets gateways, CDNs and clients cache and retry it.",
          },
          {
            term: "Authorization",
            text: "carries a signed JWT. The gateway verifies it locally with cached JWKS keys, without calling the identity provider per request.",
          },
          {
            term: "Accept",
            text: "starts content negotiation. A server that cannot produce JSON should answer 406 Not Acceptable.",
          },
        ],
      },
      {
        type: "terms",
        terms: [
          {
            term: "Pseudo-header",
            definition:
              "An HTTP/2+ field starting with “:” that replaces the HTTP/1.1 request line.",
          },
          {
            term: "HPACK / QPACK",
            definition:
              "Header compression for HTTP/2 and HTTP/3, using static and dynamic tables.",
          },
          {
            term: "Idempotent",
            definition: "Repeating the request has the same effect as sending it once.",
          },
        ],
      },
    ],
  },

  "gateway-routes-the-request": {
    beginner: [
      {
        type: "paragraph",
        text: "The gateway is the front desk. Before letting the request in, it checks the pass (is this really you?), makes sure you are not sending too many requests, and then looks up which service handles orders.",
      },
      {
        type: "list",
        items: [
          { term: "Check", text: "the token is valid and has not expired." },
          { term: "Limit", text: "this client is still under its request allowance." },
          { term: "Route", text: "/api/orders belongs to the Orders service, so it goes there." },
        ],
      },
      {
        type: "callout",
        text: "Watch the gateway glow while it works, then the request continue to one service. The other service is dimmed: it is not involved.",
      },
    ],
    advanced: [
      {
        type: "paragraph",
        text: "A gateway runs each request through a filter chain before proxying it upstream. Order matters: cheap rejections (rate limits, malformed requests) should run before expensive ones, and authentication before anything that depends on the caller's identity.",
      },
      {
        type: "list",
        items: [
          {
            term: "Authentication",
            text: "verifies the JWT signature and claims (exp, aud, iss) against cached JWKS keys.",
          },
          {
            term: "Rate limiting",
            text: "usually a token bucket per API key or user, kept in a shared store such as Redis so every gateway replica sees the same counts.",
          },
          {
            term: "Routing",
            text: "matches host, path and method to an upstream cluster, then load-balances across its healthy instances.",
          },
        ],
      },
    ],
  },

  "response-flows-back": {
    beginner: [
      {
        type: "paragraph",
        text: "The service did its work and wrote a reply. The reply travels back the same way it came: through the gateway, and on to the browser, which can finally show your orders.",
      },
      {
        type: "http",
        caption: "The response the browser receives",
        lines: [
          "HTTP/1.1 200 OK",
          "Content-Type: application/json",
          "Cache-Control: no-store",
          "",
          '[{ "id": 1042, "status": "open" }]',
        ],
      },
      {
        type: "callout",
        text: "Responses are green in the scene, requests are blue.",
      },
    ],
    advanced: [
      {
        type: "paragraph",
        text: "On the way back the gateway can still act: it adds standard headers (CORS, security headers, a request id for tracing), may compress the body, and records the status and latency for metrics. It should never change the meaning of the response.",
      },
      {
        type: "list",
        items: [
          {
            term: "Status codes",
            text: "pass through unchanged, except for errors the gateway raised itself (401, 429, 502, 504).",
          },
          {
            term: "Observability",
            text: "the request id added on the way in links the gateway's access log to the service's traces.",
          },
        ],
      },
    ],
  },
};

export interface PreviewComponentDoc {
  name: string;
  kind: string;
  purpose: Record<ExplanationLevel, string>;
  responsibilities: readonly string[];
  inputs: readonly string[];
  outputs: readonly string[];
  talksTo: readonly string[];
  technologies: readonly string[];
  advantages: readonly string[];
  limitations: readonly string[];
}

/** Full component documentation, by scene component id. */
export const previewComponentDocs: Readonly<Record<string, PreviewComponentDoc>> = {
  gateway: {
    name: "API Gateway",
    kind: "Edge component",
    purpose: {
      beginner:
        "The front door of the system. Every request from the app passes through it first, so it can check who is asking, stop abuse and send the request to the right service, much like a hotel reception desk that checks your key card and points you to the right room.",
      advanced:
        "A reverse proxy that acts as the single entry point for client traffic. It terminates TLS, authenticates requests, enforces rate limits and routes each request to the right upstream service, so cross-cutting concerns live in one place instead of in every service.",
    },
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
    talksTo: ["Browser", "Identity provider", "Orders service", "Users service"],
    technologies: ["Kong", "Envoy", "NGINX", "AWS API Gateway", "Azure API Management", "Apigee"],
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
};
