import type { LocaleText } from "../../types";
import { enSteps } from "./en-steps";

/** Idempotency module, English. SERVER ONLY. */
export const en: LocaleText = {
  chapters: {
    "safe-to-repeat": "Safe to repeat?",
    keys: "Idempotency keys",
    "hard-cases": "The hard cases",
  },
  scenarios: {
    "crash-halfway": {
      title: "Crash halfway",
      summary:
        "Payments charges the card, then crashes before saving the answer. The retry finishes the job without a second charge.",
    },
    "key-expired": {
      title: "Key expired",
      summary:
        "A retry arrives 25 hours later, after the key is gone, and charges again; then the order check that stops it.",
    },
  },
  steps: enSteps,
  messages: {
    "put-address": "Shopper A sets the delivery address",
    "update-address": "Payments updates the order's address",
    "address-updated": "The address is the same as before",
    "address-ok": "Address saved",
    "pay-no-key": "Shopper A pays for order 1042 (no key)",
    "charge-card": "Payments asks the Card processor to take the money",
    "card-charged": "The card is charged",
    "insert-payment": "Payments records the payment",
    "payment-saved": "The payment is saved",
    created: "Payment succeeded",
    "created-again": "Payment succeeded (a second payment)",
    "lost-response": "The answer is lost on the way back",
    "keyed-request": "Shopper A pays, with an idempotency key",
    "keyed-retry": "Shopper A retries, with the same key",
    "insert-key": "Payments writes the key down first: in progress",
    "key-inserted": "The key is saved as in progress",
    "save-done": "Payments saves the payment and the key's answer together",
    "saved-done": "Payment and answer saved in one transaction",
    "key-lookup": "Payments looks the key up",
    "key-found-done": "Found: done, with the saved answer",
    replayed: "The saved answer, replayed",
    "key-conflict": "The key is already taken",
    conflict: "409: still in progress, try again shortly",
    "changed-request": "Shopper A pays a new amount with the old key",
    "fingerprint-differs": "The request doesn't match the key's fingerprint",
    unprocessable: "422: this key was used for a different request",
    "charge-with-key": "Payments asks the Card processor, with its own key",
    "key-found-stale": "Found: in progress, but abandoned 70 s ago",
    "card-replayed": "The Card processor replays the earlier charge",
    "key-missing": "Not found: the key has expired",
    "charge-card-new": "Payments charges the card again (a new key)",
    "card-charged-again": "The card is charged a second time",
    "insert-payment-again": "Payments records a second payment",
    "payment-saved-again": "A second payment for order 1042",
    "created-late": "Payment succeeded (a second payment)",
    "check-order": "Payments checks whether the order is already paid",
    "order-paid": "Order 1042 is already paid",
    "already-paid": "409: order already paid",
  },
  components: {
    "shopper-a": {
      name: "Shopper A",
      kind: "Client",
      beginner: {
        summary: "Someone paying for order 1042 on their laptop.",
        analogy:
          "Like someone at a cloakroom: they keep their ticket and show the same one every time they ask.",
        jobs: [
          "Makes one ticket number (key) for each payment",
          "Sends the same key every time it asks again",
          "Makes a new key for a new payment",
        ],
      },
      advanced: {
        summary:
          "The client that owns the idempotency key: one per operation, kept across retries and reloads, replaced when the operation changes.",
        howItWorks:
          "When the shopper presses Pay it creates a key with crypto.randomUUID(), keeps it in sessionStorage, and sends it in the Idempotency-Key header on every attempt. On 409 it retries with backoff; on success it forgets the key.",
        responsibilities: [
          "One key per operation, not per attempt",
          "Keep the key across retries and page reloads",
          "Make a new key when the amount or cart changes",
          "Retry 409 with backoff; never retry 422",
        ],
        inputs: ["The shopper pressing Pay", "Answers from Payments (201, 409, 422)"],
        outputs: ["POST /payments with an Idempotency-Key header"],
        technologies: [
          "crypto.randomUUID()",
          "sessionStorage",
          "TanStack Query mutations",
          "Form libraries' submit state",
        ],
        examples: ["Idempotency-Key: 7f3a9c2e-4b1d-4e8a-9f60-2d5c1b8e3a47"],
        advantages: ["Every retry is safe, whatever went wrong"],
        limitations: [
          "A key reused for a different payment is a bug the server must catch",
          "Retries after the key expires are not protected",
        ],
      },
      talksTo: ["Payments"],
    },
    payments: {
      name: "Payments",
      kind: "Backend service",
      beginner: {
        summary: "The helper that takes the money and keeps a notebook of ticket numbers.",
        analogy:
          "Like a cloakroom attendant who writes your ticket number on the hanger before fetching your coat.",
        jobs: [
          "Writes the key down before doing anything",
          "Takes the money once",
          "Gives the saved answer to anyone who asks again",
        ],
      },
      advanced: {
        summary:
          "The service that turns many attempts into one effect: it records the key first, does the work once, and replays the stored answer.",
        howItWorks:
          "It inserts the key as in progress (unique on the key), charges the card through the Card processor with its own key, then saves the payment and the response with the key in one transaction. A repeat gets the stored response; a key in progress gets 409; a key with a different request gets 422.",
        responsibilities: [
          "Record the key before the work",
          "Compare request fingerprints",
          "Replay stored responses",
          "Answer 409 for keys in progress and 422 for reused keys",
          "Send its own key to the Card processor",
        ],
        inputs: ["POST /payments with Idempotency-Key"],
        outputs: [
          "201 (or the replayed 201)",
          "409 Conflict",
          "422 Unprocessable Content",
          "Charges to the Card processor",
        ],
        technologies: [
          "Stripe-style idempotency middleware",
          "Postgres unique constraints and row locks",
          "Redis (SET NX) as an alternative key store",
        ],
        examples: ["Idempotent-Replayed: true on a replayed answer"],
        advantages: ["Retries, double clicks and redeliveries all charge once"],
        limitations: [
          "Needs storage and a lookup on every request",
          "Side effects outside its database need their own keys",
        ],
      },
      talksTo: ["Shopper A", "Payments DB", "Card processor"],
    },
    "payments-db": {
      name: "Payments DB",
      kind: "Database",
      beginner: {
        summary: "The notebook where payments and ticket numbers are written down.",
        analogy: "Like the attendant's book: ticket number, which coat, and whether it's back.",
        jobs: ["Remembers every key and its answer", "Remembers every payment"],
      },
      advanced: {
        summary:
          "Holds the payments and the idempotency-key table, written in one transaction so a payment and its saved answer always go together.",
        howItWorks:
          "The key table has the key (unique), a request fingerprint, the state (in progress or done), when it was locked, the stored response and an expiry time. A unique index on succeeded payments per order is a second safety net.",
        responsibilities: [
          "Enforce one row per key",
          "Store responses with their keys",
          "Expire old keys",
          "Allow one successful payment per order",
        ],
        inputs: ["Key inserts, lookups and updates", "Payment rows"],
        outputs: ["Stored answers", "Unique-constraint errors for duplicates"],
        technologies: ["PostgreSQL", "MySQL", "Redis for keys (no shared transaction)"],
        examples: ["CREATE UNIQUE INDEX … ON payments (order_id) WHERE status = 'succeeded'"],
        advantages: ["One transaction keeps the payment and its answer consistent"],
        limitations: ["The key table grows; expired keys must be deleted"],
      },
      talksTo: ["Payments"],
    },
    "card-processor": {
      name: "Card processor",
      kind: "External service",
      beginner: {
        summary: "The bank that actually moves the money.",
        analogy: "Like a bank that also keeps a list of ticket numbers it has already paid.",
        jobs: ["Takes the money from the card", "Doesn't take it twice for the same key"],
      },
      advanced: {
        summary:
          "An outside API (Stripe, Adyen, a bank) that accepts its own Idempotency-Key, so its callers can repeat a charge safely.",
        howItWorks:
          "Payments sends each charge with a key that stays the same for this payment (pay_81f2). A repeat with that key returns the first charge instead of a new one.",
        responsibilities: ["Charge cards", "Deduplicate charges by key"],
        inputs: ["POST /v1/charges with Idempotency-Key"],
        outputs: ["The charge (or the replayed charge)"],
        technologies: ["Stripe", "Adyen", "Braintree", "bank APIs"],
        examples: ["Idempotency-Key: pay_81f2"],
        advantages: ["Makes the whole chain safe to repeat"],
        limitations: ["Its keys expire too (Stripe: at least 24 hours)"],
      },
      talksTo: ["Payments"],
    },
  },
  badges: {
    "address-same": "address: 12 Lake Rd · same",
    "charged-once": "charged once",
    "charged-twice": "charged twice",
    "charges-one-order": "{count} charges · 1 order",
    "double-click": "double click",
    "no-answer": "no answer",
    slow: "slow",
    "timed-out": "timed out · retry",
    "key-saved": "key 7f3a… · saved",
    "key-attempt-2": "key 7f3a… · attempt 2",
    paid: "paid",
    "in-progress": "key 7f3a… · in progress",
    done: "key 7f3a… · done · 201 saved",
    replayed: "replayed",
    "one-charge-requests": "1 charge · {count} requests",
    "double-tap": "double tap",
    conflict: "409 · try again shortly",
    "new-cart": "new cart · same key",
    "different-body": "different body",
    "key-reused": "422 · key reused",
    "downstream-key": "key pay_81f2 · charged once",
    expires: "key 7f3a… · expires in 24 h",
    crashed: "crashed",
    "taking-over": "taking over",
    "charged-once-replayed": "charged once · replayed",
    "late-retry": "25 h later · retry",
    "key-expired": "key 7f3a… · expired",
    "already-paid": "already paid · order 1042",
    "one-charge": "1 charge",
  },
  glossary: {
    idempotent: {
      term: "Idempotent",
      definition:
        "An operation whose effect is the same whether it runs once or many times. The answer may differ; the effect may not.",
    },
    "idempotent-methods": {
      term: "Idempotent methods",
      definition:
        "HTTP methods defined as idempotent by RFC 9110: GET, HEAD, OPTIONS, TRACE, PUT and DELETE. POST and PATCH are not.",
    },
    "safe-methods": {
      term: "Safe methods",
      definition:
        "Methods that only read (GET, HEAD, OPTIONS, TRACE). Every safe method is idempotent; PUT and DELETE are idempotent but not safe.",
    },
    "at-least-once-delivery": {
      term: "At-least-once delivery",
      definition:
        "What retries give you: a request is sure to arrive, but may arrive more than once.",
    },
    "exactly-once-effect": {
      term: "Exactly-once effect",
      definition:
        "Many deliveries, one result: the receiver recognises repeats and applies the operation once.",
    },
    "double-submit": {
      term: "Double submit",
      definition: "The same form or button sent twice, from a double click or an impatient tap.",
    },
    "idempotency-key": {
      term: "Idempotency key",
      definition:
        "A unique value the client sends with every attempt of one operation, so the server can tell repeats from new requests.",
    },
    uuid: {
      term: "UUID",
      definition:
        "A 128-bit random identifier (version 4), such as 7f3a9c2e-4b1d-4e8a-9f60-2d5c1b8e3a47; crypto.randomUUID() makes one.",
    },
    "key-table": {
      term: "Key table",
      definition:
        "Where the server keeps each key with its request fingerprint, state, stored response and expiry.",
    },
    "request-fingerprint": {
      term: "Request fingerprint",
      definition:
        "A hash of a request's method, path and body, stored with the key to detect a key reused for a different request.",
    },
    "atomic-transaction": {
      term: "Atomic transaction",
      definition:
        "Several database writes that succeed or fail together, such as a payment and its key's saved answer.",
    },
    replay: {
      term: "Replay",
      definition:
        "Answering a repeat with the stored response of the first request, without doing the work again.",
    },
    "stored-response": {
      term: "Stored response",
      definition: "The status code and body of a key's first request, kept to answer repeats.",
    },
    "concurrent-requests": {
      term: "Concurrent requests",
      definition: "Requests handled at the same time, such as two taps with one key.",
    },
    "status-409": {
      term: "409 Conflict",
      definition:
        "The request conflicts with the server's current state; for keys, another request with the same key is still in progress.",
    },
    lock: {
      term: "Lock",
      definition:
        "A marker that one request owns a key while it works; others wait or get 409. An old lock is treated as abandoned.",
    },
    "status-422": {
      term: "422 Unprocessable Content",
      definition:
        "The server understood the request but can't process it; for keys, the key was used with a different request.",
    },
    "key-expiry": {
      term: "Key expiry",
      definition:
        "Deleting keys after a while (Stripe: at least 24 hours); retries after that are treated as new.",
    },
    "business-key": {
      term: "Business key",
      definition:
        "A value that identifies the real-world thing, such as the order number; a unique rule on it stops duplicates for good.",
    },
    "end-to-end-idempotency": {
      term: "End-to-end idempotency",
      definition:
        "Every hop protects itself: each service sends its own key to the next, so the whole chain can be repeated safely.",
    },
  },
};
