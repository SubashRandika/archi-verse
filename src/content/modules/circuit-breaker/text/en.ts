import type { LocaleText } from "../../types";
import { enSteps } from "./en-steps";

/** Circuit Breaker module, English. SERVER ONLY. */
export const en: LocaleText = {
  chapters: {
    "slow-service": "When a service gets slow",
    breaker: "The breaker",
    recovery: "Recovery",
  },

  scenarios: {
    "no-breaker": {
      title: "Without a breaker",
      summary: "No guard: the slow service takes Orders down with it, and retries make it worse.",
    },
    "trial-fails": {
      title: "The trial call fails",
      summary: "Payments is still sick, so the breaker opens again and keeps the fallback.",
    },
  },

  steps: enSteps,

  messages: {
    "orders-request": "The browser asks for the orders",
    "orders-response": "The orders, with their payment status",
    "payments-request": "Orders asks Payments",
    "payments-response": "Payments answers",
    timeout: "No answer in time",
    rejected: "The open breaker turns the call away",
    "fallback-response": "Orders answers with the fallback",
    "profile-request": "The browser asks for “My profile”",
    "unavailable-response": "Orders has no free workers",
  },

  components: {
    browser: {
      name: "Browser",
      kind: "Client",
      beginner: {
        summary: "The app you use. It asks for your orders and shows them to you.",
        analogy: "Like a customer in a restaurant: you ask, and wait for what you ordered.",
        jobs: ["Shows your orders", "Asks again when something goes wrong"],
      },
      advanced: {
        summary: "The shop’s single-page app, calling the API through the gateway.",
        howItWorks:
          "It sends HTTPS requests to the API gateway, which routes them to the Orders service. It only sees Orders’ answers, never Payments.",
        responsibilities: [
          "Render the orders page",
          "Show degraded data clearly (“payment status unknown”)",
          "Retry carefully: with backoff, and honouring Retry-After",
        ],
        inputs: ["User actions", "API responses"],
        outputs: ["API requests"],
        technologies: ["React", "TanStack Query", "fetch"],
        examples: ["The “My orders” page"],
        advantages: ["Can show partial data instead of an error page"],
        limitations: ["Aggressive retries from many browsers can become a retry storm"],
      },
      talksTo: ["Orders service (through the API gateway)"],
    },

    orders: {
      name: "Orders service",
      kind: "Backend service",
      beginner: {
        summary: "Makes your list of orders. To show if each one is paid, it asks Payments.",
        analogy:
          "Like a waiter: takes your order, asks the kitchen, and brings you the answer. A waiter can only wait at one door at a time.",
        jobs: [
          "Makes the list of your orders",
          "Asks Payments if they are paid",
          "Shows the list anyway when Payments is unwell",
        ],
      },
      advanced: {
        summary:
          "The caller: builds the orders response and calls Payments, through a circuit breaker, for each order’s payment status.",
        howItWorks:
          "A pool of 50 worker threads; each request holds one until it answers. Calls to Payments go through a breaker with a 2 s timeout and a fallback.",
        responsibilities: [
          "Build the orders response",
          "Call Payments through the breaker",
          "Answer with a fallback while the breaker is open",
          "Protect its own capacity (timeouts, bulkheads)",
        ],
        inputs: ["Requests for orders (from the gateway)", "Payments’ answers"],
        outputs: ["Orders responses", "Calls to Payments"],
        technologies: ["Spring Boot", "ASP.NET Core", "Node.js", "Go"],
        examples: ["GET /api/orders?status=open"],
        advantages: ["Stays responsive while Payments is down, thanks to the breaker"],
        limitations: [
          "Its threads are shared by all requests: without a breaker or bulkhead, one slow dependency can use them all",
        ],
      },
      talksTo: ["Browser (through the gateway)", "Payments service (through the breaker)"],
    },

    breaker: {
      name: "Circuit breaker",
      kind: "Resilience",
      beginner: {
        summary:
          "A guard that stops Orders from calling Payments when Payments is unwell, and tries again later.",
        analogy:
          "Like the fuse box in your house: when something goes wrong again and again, it switches off to keep everything else safe.",
        jobs: [
          "Counts failed calls",
          "Stops the calls when there are too many failures",
          "Tries once, carefully, after a while",
        ],
      },
      advanced: {
        summary:
          "A state machine around calls to one dependency: it turns repeated failures into immediate rejections, then probes for recovery.",
        howItWorks:
          "Closed: calls pass and outcomes are counted in a window. When failures or slow calls cross the threshold, it opens: calls are rejected at once for the wait duration. Then it goes half-open and lets a few trial calls decide whether to close or open again.",
        responsibilities: [
          "Count outcomes (failures and slow calls)",
          "Trip open when the threshold is crossed",
          "Fail fast while open",
          "Allow trial calls when half-open",
          "Report state changes (logs, metrics)",
        ],
        inputs: ["Calls and their outcomes"],
        outputs: ["Calls passed on, or rejected at once"],
        technologies: ["resilience4j", "Polly", "opossum", "Envoy outlier detection", "Istio"],
        examples: [
          "One breaker per downstream service in a Spring Boot app",
          "Polly policies around HttpClient in .NET",
        ],
        advantages: [
          "Protects the caller’s capacity",
          "Gives the failing service room to recover",
          "Recovers automatically",
        ],
        limitations: [
          "Needs tuning (window, thresholds, wait)",
          "Only as useful as its fallback",
          "Each caller instance has its own view of the dependency",
        ],
      },
      talksTo: ["Orders service (it lives in its code)", "Payments service"],
    },

    payments: {
      name: "Payments service",
      kind: "Backend service",
      beginner: {
        summary: "Knows whether each order is paid.",
        analogy: "Like the kitchen: it has the answer, but it can get too busy to give it.",
        jobs: ["Says which orders are paid", "Looks it up in its database"],
      },
      advanced: {
        summary: "The dependency: owns payment state and answers payment-status queries.",
        howItWorks:
          "Answers GET /payments?orderIds=… from its own database, usually in about 40 ms.",
        responsibilities: ["Answer payment-status queries", "Keep payment records"],
        inputs: ["Payment-status queries"],
        outputs: ["Payment statuses"],
        technologies: ["Spring Boot", "Go", "Node.js"],
        examples: ["GET /payments?orderIds=1042,1043"],
        advantages: ["One owner for payment data"],
        limitations: ["Only as fast as its database: when that slows down, so does Payments"],
      },
      talksTo: ["Orders service", "Payments DB"],
    },

    "payments-db": {
      name: "Payments DB",
      kind: "Data store",
      beginner: {
        summary: "Payments’ notebook, where every payment is written down.",
        analogy: "Like a big notebook: if someone else is reading it, you have to wait.",
        jobs: ["Keeps every payment", "Answers Payments’ questions"],
      },
      advanced: {
        summary:
          "The payments database. In this story it is overloaded, for example by a long report.",
        howItWorks:
          "A relational database. Under heavy load its queries queue up, and Payments’ calls to it slow from milliseconds to seconds.",
        responsibilities: ["Store payments", "Answer queries"],
        inputs: ["Queries from Payments"],
        outputs: ["Rows"],
        technologies: ["PostgreSQL", "MySQL"],
        examples: ["A reporting query that locks a busy table"],
        advantages: ["Consistent, durable payment records"],
        limitations: ["A single overloaded database slows down everything that depends on it"],
      },
      talksTo: ["Payments service"],
    },
  },

  // Short texts shown in the scene, next to a component's name.
  badges: {
    closed: "closed · {count} of 5 failures",
    open: "open · {count} s",
    "half-open": "half-open",
    "trial-failed": "half-open · failed",
    threads: "{count} of 50 threads busy",
    slow: "slow",
    recovering: "recovering",
    waiting: "waiting",
    off: "no breaker",
    code: "{count}",
    retries: "{count} retries",
  },

  glossary: {
    bulkhead: {
      term: "Bulkhead",
      definition:
        "A separate pool of threads or connections for each dependency, so one slow dependency can’t use up all of a service’s capacity.",
    },
    "cascading-failure": {
      term: "Cascading failure",
      definition:
        "A failure in one service that spreads to the services calling it, because they get stuck waiting for it.",
    },
    "circuit-breaker": {
      term: "Circuit breaker",
      definition:
        "A guard around calls to a dependency that stops calling it after too many failures, then tries again carefully later.",
    },
    "closed-state": {
      term: "Closed state",
      definition: "The breaker’s normal state: calls pass through and their results are counted.",
    },
    dependency: {
      term: "Dependency",
      definition: "A service that another service needs to call to do its work.",
    },
    "fail-fast": {
      term: "Fail fast",
      definition:
        "Giving up at once when a call is known to fail, instead of waiting for a timeout.",
    },
    "failure-threshold": {
      term: "Failure threshold",
      definition:
        "How many failures (or what share of calls) trip the breaker open, e.g. 50 % of the last 20 calls.",
    },
    fallback: {
      term: "Fallback",
      definition:
        "What to answer instead when a call can’t be made: cached data, a default, or a smaller feature.",
    },
    "graceful-degradation": {
      term: "Graceful degradation",
      definition:
        "Keeping the main features working, with less detail, while a part of the system is down.",
    },
    "half-open-state": {
      term: "Half-open state",
      definition:
        "After the wait, the breaker lets a few trial calls through to see whether the dependency has recovered.",
    },
    "littles-law": {
      term: "Little’s law",
      definition:
        "Calls in flight = arrival rate × time per call. When calls get slower, more are in flight at once.",
    },
    "open-state": {
      term: "Open state",
      definition: "The breaker rejects calls at once, without trying them, until the wait is over.",
    },
    probe: {
      term: "Probe",
      definition: "A careful test call that checks whether a service has recovered.",
    },
    "retry-storm": {
      term: "Retry storm",
      definition:
        "Many clients retrying at the same time, multiplying the load on a service that is already failing.",
    },
    "retry-with-backoff": {
      term: "Retry with backoff",
      definition:
        "Trying again after waiting longer each time (1 s, 2 s, 4 s…), with a little randomness (jitter).",
    },
    "service-mesh": {
      term: "Service mesh",
      definition:
        "A layer of proxies next to each service (e.g. Envoy in Istio) that handles retries, timeouts and breaking outside the code.",
    },
    "service-unavailable": {
      term: "503 Service Unavailable",
      definition:
        "The status code for “I can’t handle this right now, try again later”, often with Retry-After.",
    },
    "sliding-window": {
      term: "Sliding window",
      definition:
        "The most recent calls (e.g. the last 20, or the last 60 seconds) that the breaker looks at.",
    },
    "slow-call": {
      term: "Slow call",
      definition:
        "A call that took longer than a set limit. Breakers can count slow calls like failures.",
    },
    "synchronous-call": {
      term: "Synchronous call",
      definition: "A call where the caller waits for the answer before it can go on.",
    },
    "thread-pool": {
      term: "Thread pool",
      definition:
        "The fixed set of workers a service uses to handle requests. When all are busy, new requests wait or fail.",
    },
    timeout: {
      term: "Timeout",
      definition: "The longest a caller waits for an answer before giving up.",
    },
    "trial-call": {
      term: "Trial call",
      definition: "One of the few calls a half-open breaker lets through to test the dependency.",
    },
    trip: {
      term: "Trip",
      definition: "When the breaker switches from closed to open.",
    },
    "wait-duration": {
      term: "Wait duration",
      definition: "How long the breaker stays open before it tries again (30 s here).",
    },
  },
};
