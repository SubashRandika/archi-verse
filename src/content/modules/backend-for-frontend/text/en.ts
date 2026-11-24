import type { ComponentDoc, LocaleText } from "../../types";
import { enSteps } from "./en-steps";

/** The three general-purpose services share most of their description. */
const service = (
  name: string,
  owns: string,
  beginner: ComponentDoc["beginner"],
  example: string,
  extra: { optional?: boolean } = {},
): ComponentDoc => ({
  name,
  kind: "Backend service",
  beginner,
  advanced: {
    summary: `A general-purpose service that owns ${owns}, with one REST API for every caller.`,
    howItWorks: extra.optional
      ? "Answers from its own data store. Its answers are “nice to have”: a screen still works without them, so callers give it a short timeout."
      : "Answers from its own data store, with one response shape for every caller. It knows nothing about screens.",
    responsibilities: [
      `Own ${owns}`,
      "Keep its API stable for every caller",
      "Hold the business rules for its data",
    ],
    inputs: ["Requests from the BFFs (or, before them, from the apps)"],
    outputs: ["General-purpose JSON answers"],
    technologies: ["Spring Boot", "Go", "Node.js", "ASP.NET Core"],
    examples: [example],
    advantages: ["One owner and one API for its data", "Doesn’t change for every new screen"],
    limitations: ["One shape for everyone: too much for some callers, too little for others"],
  },
  talksTo: ["Web BFF", "Mobile BFF"],
});

/** Backend for Frontend module, English. SERVER ONLY. */
export const en: LocaleText = {
  chapters: {
    "one-api": "One API for everyone",
    "per-front-end": "A backend per front end",
    "trade-offs": "Trade-offs",
  },

  scenarios: {
    "slow-service": {
      title: "One service is slow",
      summary: "Recommendations is late, so the Mobile BFF answers in time, without suggestions.",
    },
    "web-change": {
      title: "A web-only change",
      summary: "The web team adds a field to its own BFF; the mobile app is untouched.",
    },
  },

  steps: enSteps,

  messages: {
    "orders-request": "The app asks Orders for the order",
    "orders-response": "The whole order, for every caller (21 KB)",
    "users-request": "The app asks Users for the address",
    "users-response": "The whole address record (3 KB)",
    "recommendations-request": "The app asks for suggestions",
    "recommendations-response": "Twelve suggestions with images (14 KB)",
    "delivery-request": "The web page asks again, for the delivery date",
    "delivery-response": "The delivery estimate",
    "web-screen-request": "The browser asks the Web BFF for the screen",
    "mobile-screen-request": "The app asks the Mobile BFF for the screen",
    "bff-orders-request": "The BFF asks Orders",
    "bff-users-request": "The BFF asks Users",
    "bff-recommendations-request": "The BFF asks for three suggestions",
    "web-response": "The web screen’s answer (38 KB)",
    "mobile-response": "The mobile screen’s answer (4 KB)",
    "partial-response": "The answer without suggestions",
    "late-response": "Recommendations answers too late",
    "web-response-v2": "The web answer, now with the delivery day",
  },

  components: {
    web: {
      name: "Web browser",
      kind: "Client",
      beginner: {
        summary: "The shop’s web site, on a big screen with fast Wi-Fi.",
        analogy: "Like a family with a big table: it has room for everything.",
        jobs: ["Shows the whole Order details page", "Asks for what the page needs"],
      },
      advanced: {
        summary: "The shop’s web front end, rendering the full Order details page.",
        howItWorks:
          "Without a BFF it calls each service’s API and composes the page itself. With one, it makes one call to the Web BFF (through the gateway) and holds only a session cookie.",
        responsibilities: [
          "Render the Order details page",
          "Call its BFF for each screen",
          "Hide sections whose data is missing",
        ],
        inputs: ["User actions", "Answers from the Web BFF"],
        outputs: ["Requests to the Web BFF"],
        technologies: ["React", "Next.js", "fetch"],
        examples: ["https://shop.example/orders/1042"],
        advantages: ["Fast network, big screen", "Can be updated at any time"],
        limitations: [
          "Anything stored in the page, like tokens, can be read by an injected script (XSS)",
        ],
      },
      talksTo: ["Web BFF (through the API gateway)"],
    },

    mobile: {
      name: "Mobile app",
      kind: "Client",
      beginner: {
        summary: "The shop’s app on your phone, with a small screen and a slow connection.",
        analogy: "Like someone far away on a walkie-talkie: every message takes a while.",
        jobs: ["Shows a short Order details screen", "Asks for as little as it can"],
      },
      advanced: {
        summary:
          "A native app on a slow, high-latency network, with old versions in use for months.",
        howItWorks:
          "Each round trip costs about 300 ms, so it wants one call per screen and small answers. It is released through the app stores, so it can’t be changed overnight.",
        responsibilities: [
          "Render the Order details screen",
          "Make as few calls as possible",
          "Keep working with older API contracts",
        ],
        inputs: ["User actions", "Answers from the Mobile BFF"],
        outputs: ["Requests to the Mobile BFF"],
        technologies: ["Swift", "Kotlin", "React Native", "Flutter"],
        examples: ["The shop’s iOS and Android apps"],
        advantages: ["Always with the customer"],
        limitations: [
          "Every round trip is expensive (time and battery)",
          "Can’t be updated instantly (app-store releases)",
        ],
      },
      talksTo: ["Mobile BFF (through the API gateway)"],
    },

    "web-bff": {
      name: "Web BFF",
      kind: "Backend for Frontend",
      beginner: {
        summary: "The web page’s own helper on the server. It knows what the web page needs.",
        analogy: "Like a personal shopper for one family: ask once, get one bag, packed for you.",
        jobs: [
          "Asks the services for the web page",
          "Packs one answer for the big screen",
          "Keeps the web page’s keys safe",
        ],
      },
      advanced: {
        summary:
          "A server-side layer for the web experience: aggregates service calls, shapes the response for the web page and keeps tokens out of the browser.",
        howItWorks:
          "For each screen request it calls the services in the data centre (in parallel where it can), merges and formats the results for the page, and answers once. It holds the user’s OAuth tokens and gives the browser an HttpOnly session cookie.",
        responsibilities: [
          "Aggregate service calls",
          "Shape responses for the web page",
          "Per-call timeouts and partial answers",
          "Keep tokens server-side (token handler)",
        ],
        inputs: ["Screen requests from the browser", "Answers from the services"],
        outputs: ["One answer per screen", "Calls to the services"],
        technologies: [
          "Node.js (Express, Fastify, NestJS)",
          "Next.js route handlers",
          "Spring Boot",
          "Go",
        ],
        examples: ["GET /web/order-details/1042"],
        advantages: [
          "The web page gets exactly what it needs",
          "The web team changes and ships it on its own",
        ],
        limitations: ["One more service to run", "Logic copied from other BFFs can drift"],
      },
      talksTo: ["Web browser", "Orders service", "Users service", "Recommendations"],
    },

    "mobile-bff": {
      name: "Mobile BFF",
      kind: "Backend for Frontend",
      beginner: {
        summary: "The phone’s own helper on the server. It knows what the small screen needs.",
        analogy: "Like a personal shopper who packs a small lunch box instead of a big crate.",
        jobs: [
          "Asks the services for the phone",
          "Packs one small answer",
          "Doesn’t keep the phone waiting for a slow shop",
        ],
      },
      advanced: {
        summary:
          "A server-side layer for the mobile app: turns one call from the phone into several calls inside the data centre, and answers with a small, screen-shaped payload.",
        howItWorks:
          "Calls Orders, then Users and Recommendations in parallel, each with its own timeout inside a time budget. It answers with only the fields the screen shows, and returns a partial answer when optional data is late.",
        responsibilities: [
          "Aggregate service calls",
          "Shape small responses for the app",
          "Time budgets and partial answers",
          "Keep serving older app versions",
        ],
        inputs: ["Screen requests from the app", "Answers from the services"],
        outputs: ["One small answer per screen", "Calls to the services"],
        technologies: ["Node.js (Fastify, NestJS)", "Kotlin", "Go", "a GraphQL server"],
        examples: ["GET /app/v3/order-screen/1042"],
        advantages: ["One mobile round trip per screen", "Small payloads: less data, less battery"],
        limitations: ["One more service to run", "Must support every app version still in use"],
      },
      talksTo: ["Mobile app", "Orders service", "Users service", "Recommendations"],
    },

    orders: service(
      "Orders service",
      "orders and their items",
      {
        summary: "Knows every order and what is in it.",
        analogy: "Like the butcher: it has what you need, and gives everyone the same big parcel.",
        jobs: ["Keeps the orders", "Says what is in each order"],
      },
      "GET /orders/1042",
    ),

    users: service(
      "Users service",
      "users and their addresses",
      {
        summary: "Knows who you are and where to deliver.",
        analogy: "Like the baker: one more shop to visit.",
        jobs: ["Keeps the addresses", "Says where an order goes"],
      },
      "GET /users/u_7f3a/address",
    ),

    recommendations: service(
      "Recommendations",
      "product suggestions",
      {
        summary: "Suggests other things you might like.",
        analogy: "Like the greengrocer: nice to have, but dinner works without it.",
        jobs: ["Finds products you may like"],
      },
      "GET /recommendations?for=1042",
      { optional: true },
    ),
  },

  // Short texts shown in the scene, next to a component's name.
  badges: {
    "calls-1": "1 call · {count} ms",
    "calls-2": "2 calls · {count} ms",
    "calls-3": "3 calls · {count} ms",
    received: "{count} KB received",
    waste: "38 KB received · 4 KB used",
    "extra-call": "1 more call needed",
    size: "{count} KB",
    "web-team": "web team",
    "mobile-team": "mobile team",
    copies: "same rule, 2 copies",
    slow: "slow",
    budget: "waiting · {count} ms",
    partial: "partial",
    dropped: "late answer dropped",
    deploying: "deploying",
    version: "v2.5",
    unchanged: "unchanged",
    arrives: "arrives Thursday",
    "as-before": "as before",
  },

  glossary: {
    aggregation: {
      term: "Aggregation",
      definition:
        "Turning one request into several calls to other services and combining their answers into one.",
    },
    "api-gateway": {
      term: "API gateway",
      definition:
        "The single way in for every client: it handles TLS, authentication and rate limits, and routes requests on (to the BFFs here).",
    },
    bff: {
      term: "Backend for Frontend (BFF)",
      definition:
        "A small server-side layer built for one front end, and owned by the team that builds that front end.",
    },
    "chatty-api": {
      term: "Chatty API",
      definition: "An API that needs many small calls to do one job: costly on a slow network.",
    },
    "client-side-composition": {
      term: "Client-side composition",
      definition: "The app calls several services itself and builds the screen from their answers.",
    },
    "code-duplication": {
      term: "Code duplication",
      definition:
        "The same logic written in more than one place, where the copies can slowly drift apart.",
    },
    "conways-law": {
      term: "Conway’s law",
      definition:
        "Systems end up shaped like the teams that build them. A BFF per front-end team uses this on purpose.",
    },
    "experience-api": {
      term: "Experience API",
      definition:
        "An API designed for one user experience (one app or screen), not for every caller.",
    },
    "fan-out": {
      term: "Fan-out",
      definition: "One incoming request causing several outgoing calls at once.",
    },
    "general-purpose-api": {
      term: "General-purpose API",
      definition:
        "An API designed around a service’s own data, giving the same answer to every caller.",
    },
    graphql: {
      term: "GraphQL",
      definition:
        "A query language for APIs: the client asks one endpoint for exactly the fields it needs.",
    },
    "httponly-cookie": {
      term: "HttpOnly cookie",
      definition:
        "A cookie the browser sends with requests but that page scripts cannot read, so XSS can’t steal it.",
    },
    latency: {
      term: "Latency",
      definition:
        "The time a message takes to get there and back, whatever its size. High on mobile networks.",
    },
    "over-fetching": {
      term: "Over-fetching",
      definition: "Receiving more data than the screen uses, then throwing the rest away.",
    },
    "parallel-calls": {
      term: "Parallel calls",
      definition:
        "Calls made at the same time instead of one after another: the slowest one sets the total.",
    },
    "partial-response": {
      term: "Partial response",
      definition:
        "An answer that leaves out optional data that came too late, and says what is missing.",
    },
    payload: {
      term: "Payload",
      definition: "The data in a request or response body, e.g. the JSON.",
    },
    "response-shaping": {
      term: "Response shaping",
      definition:
        "Choosing, renaming, merging and formatting fields so the answer fits one screen.",
    },
    "round-trip": {
      term: "Round trip",
      definition: "One request travelling to a server and its answer travelling back.",
    },
    "time-budget": {
      term: "Time budget",
      definition:
        "The longest a request may take overall; each call it makes gets a timeout inside it.",
    },
    "token-handler": {
      term: "Token handler",
      definition:
        "A pattern where a backend (here the web BFF) keeps the OAuth tokens and gives the browser only a session cookie.",
    },
    "under-fetching": {
      term: "Under-fetching",
      definition: "An answer that lacks a field the screen needs, so another call is required.",
    },
  },
};
