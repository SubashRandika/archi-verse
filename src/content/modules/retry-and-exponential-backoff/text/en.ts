import type { ComponentDoc, LocaleText } from "../../types";
import { enSteps } from "./en-steps";

/** The three shoppers share most of their description. */
const shopper = (name: string, device: "laptop" | "phone", order: number): ComponentDoc => ({
  name,
  kind: "Client",
  beginner: {
    summary: `Someone paying for order ${order} on their ${device}.`,
    analogy: "Like someone phoning a shop: if the line is busy, they decide when to call back.",
    jobs: ["Sends the payment", "Tries again when it fails for a moment", "Knows when to stop"],
  },
  advanced: {
    summary:
      "A client that owns the retry policy: which errors to retry, backoff with jitter, max attempts, a deadline, and one idempotency key per payment.",
    howItWorks:
      "On a retryable error (timeout, 429, 502, 503, 504) it waits random(0, min(cap, base · 2^attempt)), or as long as Retry-After says, and tries again, up to 4 attempts inside a 10 s deadline. Every attempt of one payment carries the same Idempotency-Key.",
    responsibilities: [
      "Decide which errors are worth retrying",
      "Back off with jitter",
      "Stop at the attempt limit or the deadline",
      "Send the same idempotency key on every attempt",
    ],
    inputs: ["The shopper pressing Pay", "Answers and errors from Payments"],
    outputs: ["Payment requests (and retries) to Payments", "A clear message when it gives up"],
    technologies:
      device === "laptop"
        ? ["fetch with a small retry helper", "TanStack Query (retry, retryDelay)", "ky"]
        : ["OkHttp interceptors (Android)", "URLSession (iOS)", "TanStack Query in React Native"],
    examples: [`POST /payments  {"orderId":${order}}`],
    advantages: ["Hides short blips from the shopper"],
    limitations: [
      "Every retry adds load and delay",
      "Unsafe for payments without an idempotency key",
    ],
  },
  talksTo: ["Payments"],
});

/** Retry and Exponential Backoff module, English. SERVER ONLY. */
export const en: LocaleText = {
  chapters: {
    blips: "Things fail for a moment",
    "not-worse": "Retrying without making it worse",
    "safe-to-repeat": "Is it safe to repeat?",
  },

  scenarios: {
    "server-says-when": {
      title: "The server says when",
      summary: "Payments answers 503 with Retry-After: 5, and the apps wait exactly that long.",
    },
    "retries-multiply": {
      title: "Retries multiply",
      summary: "Payments and the app both retry, so one tap becomes 16 database queries.",
    },
  },

  steps: enSteps,

  messages: {
    "pay-a": "Shopper A pays for order 1042",
    "pay-b": "Shopper B pays for order 1043",
    "pay-c": "Shopper C pays for order 1044",
    "charge-a": "Payments records the charge for order 1042",
    "charge-b": "Payments records the charge for order 1043",
    "charge-c": "Payments records the charge for order 1044",
    "charged-a": "The charge is saved",
    "charged-b": "The charge is saved",
    "charged-c": "The charge is saved",
    "created-a": "Payment succeeded",
    "created-b": "Payment succeeded",
    "created-c": "Payment succeeded",
    unavailable: "503: not now, try again shortly",
    "retry-after": "503, with “come back in 5 seconds”",
    "gave-up": "Shopper A stops after four attempts",
    "lost-response": "“Payment succeeded”, lost on the way back",
    "charge-again": "The same payment, charged again",
    "charged-again": "A second charge is saved",
    "created-again": "“Payment succeeded”, again",
    "keyed-request": "The payment, with an idempotency key",
    "keyed-retry": "The retry, with the same key",
    "store-key": "The charge and its key, saved together",
    "key-stored": "Charge and key saved",
    "key-lookup": "Payments looks the key up",
    "key-found": "Key found: here is the first result",
    replayed: "The first result again, no new charge",
    "db-timeout": "The database doesn’t answer in time",
  },

  components: {
    "shopper-a": shopper("Shopper A", "laptop", 1042),
    "shopper-b": shopper("Shopper B", "phone", 1043),
    "shopper-c": shopper("Shopper C", "phone", 1044),

    payments: {
      name: "Payments",
      kind: "Backend service",
      beginner: {
        summary: "The helper on the server that takes the money.",
        analogy: "Like the shop’s till: sometimes it restarts, and you have to wait a moment.",
        jobs: [
          "Charges the card",
          "Says “not now” when it is busy",
          "Never charges the same ticket twice",
        ],
      },
      advanced: {
        summary:
          "A service that charges cards and records payments. During a deploy it briefly returns 503; it stores idempotency keys with their results.",
        howItWorks:
          "Each payment runs in one transaction: the charge and its idempotency key are saved together. A request whose key already exists gets the stored result (Idempotent-Replayed: true). When it can’t serve, it answers 503 quickly, with Retry-After when it knows how long.",
        responsibilities: [
          "Charge once per idempotency key",
          "Return clear, retryable errors (with Retry-After when it knows)",
          "Fail fast instead of retrying its own dependencies at every layer",
        ],
        inputs: ["Payment requests from the shoppers’ apps"],
        outputs: ["201 Created, or a 503", "Charges and keys in the Payments DB"],
        technologies: ["Stripe or Adyen behind it", "Spring Boot", "Go", "Node.js"],
        examples: ["POST /payments", "Idempotency-Key: 7f3a9c2e-…"],
        advantages: ["Safe to retry, thanks to idempotency keys"],
        limitations: ["Needs capacity headroom for retries", "Must store keys (and expire them)"],
      },
      talksTo: ["Shopper A", "Shopper B", "Shopper C", "Payments DB"],
    },

    "payments-db": {
      name: "Payments DB",
      kind: "Database",
      beginner: {
        summary: "The notebook where every payment is written down.",
        analogy: "Like the shop’s receipt book: each ticket number appears only once.",
        jobs: ["Keeps every charge", "Remembers each ticket number and its result"],
      },
      advanced: {
        summary:
          "Stores charges and an idempotency table: key, request fingerprint, stored response and expiry.",
        howItWorks:
          "A unique constraint on the key means two requests with one key can’t both insert a charge. Expired keys are deleted after about 24 hours.",
        responsibilities: [
          "Store charges",
          "Store idempotency keys with their responses",
          "Enforce one row per key",
        ],
        inputs: ["Inserts and lookups from Payments"],
        outputs: ["Saved rows", "Stored responses for repeated keys"],
        technologies: ["PostgreSQL", "MySQL", "DynamoDB (conditional writes)"],
        examples: ["SELECT response FROM idempotency_keys WHERE key = '7f3a…'"],
        advantages: ["The single source of truth for “was this charged?”"],
        limitations: ["Under overload, retried queries pile up on it"],
      },
      talksTo: ["Payments"],
    },
  },

  // Short texts shown in the scene, next to a component's name.
  badges: {
    restarting: "restarting",
    ready: "ready",
    failed: "{count} · failed",
    "retry-2": "attempt 2 · wait 1 s",
    "retry-3": "attempt 3 · wait 2 s",
    "retry-4": "attempt 4 · wait 4 s",
    "paid-on": "attempt {count} · paid",
    paid: "paid",
    "no-wait": "attempt {count} · no wait",
    load: "{count} req/s · capacity 10",
    together: "3 retries at once",
    "wait-ms": "wait {count} ms",
    "one-at-a-time": "1 at a time",
    "deploy-failed": "deploy failed",
    "gave-up": "gave up after 4 tries",
    "timed-out": "no answer · timed out",
    "charged-once": "charged once",
    "charged-twice": "charged twice",
    replayed: "same key · first answer",
    "server-wait": "wait 5 s · server said",
    overloaded: "overloaded",
    queries: "{count} queries · 1 tap",
    "fails-fast": "fails fast",
  },

  glossary: {
    "at-least-once": {
      term: "At-least-once",
      definition:
        "What retries give you: the request is sure to be processed, but maybe more than once.",
    },
    "base-delay": {
      term: "Base delay",
      definition: "The first wait in a backoff schedule; later waits are multiples of it.",
    },
    cap: {
      term: "Cap",
      definition: "The longest a backoff wait may grow, e.g. 30 s.",
    },
    "circuit-breaker": {
      term: "Circuit breaker",
      definition:
        "A guard that stops calling a failing service for a while, so calls fail fast instead of piling up.",
    },
    deadline: {
      term: "Deadline",
      definition:
        "The latest time an operation may finish, retries included. Each attempt’s timeout must fit in what is left.",
    },
    "exactly-once-effect": {
      term: "Exactly-once effect",
      definition:
        "A request may be delivered more than once, but its effect (the charge) happens only once.",
    },
    "exponential-backoff": {
      term: "Exponential backoff",
      definition: "Waiting longer after each failure, doubling every time: 1 s, 2 s, 4 s, …",
    },
    "fail-fast": {
      term: "Fail fast",
      definition:
        "Returning an error straight away instead of waiting or retrying, so the caller can decide.",
    },
    "full-jitter": {
      term: "Full jitter",
      definition:
        "Waiting a random time between zero and the backoff: random(0, min(cap, base · 2^n)).",
    },
    idempotent: {
      term: "Idempotent",
      definition: "Doing it twice has the same effect as doing it once.",
    },
    "idempotency-key": {
      term: "Idempotency key",
      definition:
        "A unique id the client sends with an operation (and every retry of it), so the server does it only once.",
    },
    "idempotent-methods": {
      term: "Idempotent methods",
      definition: "HTTP methods defined as idempotent: GET, HEAD, PUT, DELETE (not POST or PATCH).",
    },
    jitter: {
      term: "Jitter",
      definition: "Randomness added to retry waits, so clients that failed together spread out.",
    },
    "load-amplification": {
      term: "Load amplification",
      definition: "One user action turning into many requests, e.g. because of retries.",
    },
    "max-attempts": {
      term: "Max attempts",
      definition: "The most times an operation is tried, the first try included.",
    },
    "metastable-failure": {
      term: "Metastable failure",
      definition:
        "A system that stays overloaded after the cause has gone, kept down by its own retries.",
    },
    "permanent-failure": {
      term: "Permanent failure",
      definition:
        "An error that happens every time (a bad request, a missing item): don’t retry it.",
    },
    retry: {
      term: "Retry",
      definition: "Sending the same request again after it failed.",
    },
    "retry-after": {
      term: "Retry-After",
      definition:
        "An HTTP header (sent with 503 or 429) telling the client how long to wait: seconds or a date.",
    },
    "retry-budget": {
      term: "Retry budget",
      definition: "A limit on retries as a share of all requests, e.g. at most 10%.",
    },
    "retry-storm": {
      term: "Retry storm",
      definition:
        "Many clients retrying at once, multiplying the load on a service that is already struggling.",
    },
    "retryable-error": {
      term: "Retryable error",
      definition: "An error that might not happen next time: a timeout, 429, 502, 503 or 504.",
    },
    "status-503": {
      term: "503 Service Unavailable",
      definition: "The server can’t handle the request right now, usually for a short time.",
    },
    "thundering-herd": {
      term: "Thundering herd",
      definition: "Many clients waking up and hitting a service at the same moment.",
    },
    "transient-failure": {
      term: "Transient failure",
      definition: "A failure that goes away by itself, usually within seconds.",
    },
  },
};
