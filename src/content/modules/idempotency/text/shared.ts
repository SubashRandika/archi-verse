import type { MessageCode, StepLinks } from "../../types";

/**
 * Language-free parts of the Idempotency module text: each step's terms and message, the code
 * of every message, and code used in worked examples. SERVER ONLY (see ../../text.ts).
 * Source: docs/modules/idempotency.md (approved 2026-11-26).
 */

const KEY = "7f3a9c2e-4b1d-4e8a-9f60-2d5c1b8e3a47";
const BODY = '{"orderId":1042,"amount":"12400.00","currency":"LKR"}';
const CHANGED_BODY = '{"orderId":1042,"amount":"13900.00","currency":"LKR"}';

const payment = (headers: string[] = [], body = BODY): string[] => [
  "POST /payments HTTP/1.1",
  "Host: api.shop.example",
  "Content-Type: application/json",
  ...headers,
  "",
  body,
];
const KEYED = payment([`Idempotency-Key: ${KEY}`]);

const created = (id: string, headers: string[] = []): string[] => [
  "HTTP/1.1 201 Created",
  "Content-Type: application/json",
  `Location: /payments/${id}`,
  ...headers,
  "",
  `{"id":"${id}","orderId":1042,"status":"succeeded"}`,
];

const charge = (key?: string): string[] => [
  "POST /v1/charges HTTP/1.1",
  "Host: api.cardprocessor.example",
  ...(key ? [`Idempotency-Key: ${key}`] : []),
  "",
  '{"amount":1240000,"currency":"lkr","source":"tok_visa"}',
];

const charged = (id: string, headers: string[] = []): string[] => [
  "HTTP/1.1 200 OK",
  ...headers,
  "",
  `{"id":"${id}","amount":1240000,"status":"succeeded"}`,
];

const INSERT_KEY = [
  "INSERT INTO idempotency_keys (key, request_hash, state, locked_at, expires_at)",
  `VALUES ('${KEY}', 'sha256:c1e9…', 'in_progress', now(),`,
  "        now() + interval '24 hours');",
];

const SAVE_DONE = [
  "BEGIN;",
  "INSERT INTO payments (id, order_id, amount, charge_id)",
  "VALUES ('pay_81f2', 1042, 12400.00, 'ch_3f1a');",
  "UPDATE idempotency_keys",
  "SET state = 'done', response_code = 201, response_body = '{\"id\":\"pay_81f2\",…}'",
  `WHERE key = '${KEY}';`,
  "COMMIT;",
];

const KEY_LOOKUP = [
  "SELECT request_hash, state, locked_at, response_code, response_body",
  "FROM idempotency_keys",
  `WHERE key = '${KEY}';`,
];

const insertPayment = (id: string, charge: string): string[] => [
  "INSERT INTO payments (id, order_id, amount, charge_id)",
  `VALUES ('${id}', 1042, 12400.00, '${charge}');`,
];

const CONFLICT = [
  "HTTP/1.1 409 Conflict",
  "Content-Type: application/json",
  "Retry-After: 1",
  "",
  '{"error":"idempotency_key_in_use","message":"A request with this key is still in progress."}',
];

const UNPROCESSABLE = [
  "HTTP/1.1 422 Unprocessable Content",
  "Content-Type: application/json",
  "",
  '{"error":"idempotency_key_reused","message":"This key was used with a different request."}',
];

const ALREADY_PAID = [
  "HTTP/1.1 409 Conflict",
  "Content-Type: application/json",
  "",
  '{"error":"order_already_paid","paymentId":"pay_81f2"}',
];

export const messages: Readonly<Record<string, MessageCode>> = {
  // Step 1: a PUT twice, then a POST twice.
  "put-address": {
    language: "http",
    lines: [
      "PUT /orders/1042/address HTTP/1.1",
      "Host: api.shop.example",
      "Content-Type: application/json",
      "",
      '{"street":"12 Lake Rd","city":"Kandy"}',
    ],
  },
  "update-address": {
    language: "sql",
    lines: ["UPDATE orders SET address = '12 Lake Rd, Kandy'", "WHERE id = 1042;"],
  },
  "address-updated": {
    language: "text",
    lines: ["1 row updated: order 1042's address is 12 Lake Rd (the same as before)"],
  },
  "address-ok": {
    language: "http",
    lines: [
      "HTTP/1.1 200 OK",
      "Content-Type: application/json",
      "",
      '{"orderId":1042,"street":"12 Lake Rd","city":"Kandy"}',
    ],
  },
  "pay-no-key": { language: "http", lines: payment() },
  "charge-card": { language: "http", lines: charge() },
  "card-charged": { language: "http", lines: charged("ch_3f1a") },
  "insert-payment": { language: "sql", lines: insertPayment("pay_81f2", "ch_3f1a") },
  "payment-saved": { language: "text", lines: ["1 row inserted: payment pay_81f2"] },
  created: { language: "http", lines: created("pay_81f2") },
  "created-again": { language: "http", lines: created("pay_9c04") },
  "lost-response": {
    language: "text",
    lines: [
      'HTTP/1.1 201 Created   {"id":"pay_81f2","status":"succeeded"}',
      "connection reset on the way back: the app never sees this answer",
    ],
  },

  // Steps 3–8: with an idempotency key.
  "keyed-request": { language: "http", lines: KEYED },
  "keyed-retry": { language: "http", lines: KEYED },
  "insert-key": { language: "sql", lines: INSERT_KEY },
  "key-inserted": { language: "text", lines: [`key ${KEY.slice(0, 8)}… saved: in_progress`] },
  "save-done": { language: "sql", lines: SAVE_DONE },
  "saved-done": {
    language: "text",
    lines: ["payment pay_81f2 and the key's answer (201) saved together: one transaction"],
  },
  "key-lookup": { language: "sql", lines: KEY_LOOKUP },
  "key-found-done": {
    language: "text",
    lines: [
      "state = done, same request_hash",
      'response = 201 {"id":"pay_81f2","status":"succeeded"}',
    ],
  },
  replayed: { language: "http", lines: created("pay_81f2", ["Idempotent-Replayed: true"]) },
  "key-conflict": {
    language: "text",
    lines: [
      'ERROR: duplicate key value violates unique constraint "idempotency_keys_pkey"',
      "→ another request with this key is still in progress",
    ],
  },
  conflict: { language: "http", lines: CONFLICT },
  "changed-request": {
    language: "http",
    lines: payment([`Idempotency-Key: ${KEY}`], CHANGED_BODY),
  },
  "fingerprint-differs": {
    language: "text",
    lines: [
      "stored request_hash   sha256:c1e9…   (amount 12400.00)",
      "this request's hash   sha256:57d0…   (amount 13900.00)   → different request",
    ],
  },
  unprocessable: { language: "http", lines: UNPROCESSABLE },
  "charge-with-key": { language: "http", lines: charge("pay_81f2") },

  // Scenario: crash halfway.
  "key-found-stale": {
    language: "text",
    lines: ["state = in_progress, locked_at = 70 s ago (more than 60 s): abandoned → take over"],
  },
  "card-replayed": {
    language: "http",
    lines: charged("ch_3f1a", ["Idempotent-Replayed: true"]),
  },

  // Scenario: key expired.
  "key-missing": {
    language: "text",
    lines: ["0 rows: the key expired and was deleted after 24 hours"],
  },
  "charge-card-new": { language: "http", lines: charge("pay_a51c") },
  "card-charged-again": { language: "http", lines: charged("ch_8d27") },
  "insert-payment-again": { language: "sql", lines: insertPayment("pay_a51c", "ch_8d27") },
  "payment-saved-again": {
    language: "text",
    lines: ["1 row inserted: payment pay_a51c (a second payment for order 1042)"],
  },
  "created-late": { language: "http", lines: created("pay_a51c") },
  "check-order": {
    language: "sql",
    lines: [
      "-- one successful payment per order",
      "CREATE UNIQUE INDEX one_payment_per_order ON payments (order_id)",
      "  WHERE status = 'succeeded';",
      "",
      "SELECT id FROM payments WHERE order_id = 1042 AND status = 'succeeded';",
    ],
  },
  "order-paid": { language: "text", lines: ["found: pay_81f2 (order 1042 is already paid)"] },
  "already-paid": { language: "http", lines: ALREADY_PAID },
};

/** Code used in the worked examples (not inspectable messages). */
export const exampleCode = {
  putVsPost: [
    "PUT  /orders/1042/address   → 200 OK        (address = 12 Lake Rd)",
    "PUT  /orders/1042/address   → 200 OK        (address = 12 Lake Rd, unchanged)",
    "",
    "POST /payments              → 201 Created   pay_81f2",
    "POST /payments              → 201 Created   pay_9c04   (a second charge)",
  ],
  serverLog: [
    "10:00:00.120  POST /payments  order 1042   ← click",
    "10:00:00.310  POST /payments  order 1042   ← second click",
    "10:00:05.400  POST /payments  order 1042   ← retry after a lost answer",
    "10:00:15.900  POST /payments  order 1042   ← retry after a 10 s timeout",
  ],
  clientKey: [
    'const key = sessionStorage.getItem("pay:1042") ?? crypto.randomUUID();',
    'sessionStorage.setItem("pay:1042", key);',
    "",
    "await retry(() =>",
    '  fetch("/payments", {',
    '    method: "POST",',
    '    headers: { "Content-Type": "application/json", "Idempotency-Key": key },',
    '    body: JSON.stringify({ orderId: 1042, amount: "12400.00", currency: "LKR" }),',
    "  }),",
    ");",
    'sessionStorage.removeItem("pay:1042"); // done: the next payment gets a new key',
  ],
  keyRow: [
    "key            7f3a9c2e-4b1d-4e8a-9f60-2d5c1b8e3a47",
    "request_hash   sha256:c1e9…",
    "state          done",
    'response       201 {"id":"pay_81f2","status":"succeeded"}',
    "expires_at     now + 24 hours",
  ],
  replay: created("pay_81f2", ["Idempotent-Replayed: true"]),
  conflict: CONFLICT,
  unprocessable: UNPROCESSABLE,
  downstream: charge("pay_81f2"),
  crashState: [
    "key 7f3a…   in_progress (since 10:00:00)",
    "payments    no row for order 1042",
    "card        charged (ch_3f1a)",
  ],
  recovery: [
    "10:01:10  retry, key 7f3a…   lock 70 s old → take over",
    "10:01:10  POST /v1/charges  Idempotency-Key: pay_81f2  → 200 (replayed, no new charge)",
    "10:01:10  key 7f3a… done, 201 saved",
  ],
  lateRetry: [
    "day 1  10:00  POST /payments  key 7f3a…  → 201 pay_81f2 (answer lost)",
    "day 2  11:00  key 7f3a… deleted (24 h)",
    "day 2  11:05  POST /payments  key 7f3a…  → new payment pay_a51c (charged twice)",
  ],
  alreadyPaid: ALREADY_PAID,
};

export const steps: Readonly<Record<string, StepLinks>> = {
  // Main path
  "same-twice": {
    terms: ["idempotent", "idempotent-methods", "safe-methods"],
    message: "put-address",
  },
  duplicates: {
    terms: ["at-least-once-delivery", "exactly-once-effect", "double-submit"],
    message: "pay-no-key",
  },
  "one-key": { terms: ["idempotency-key", "uuid"], message: "keyed-request" },
  "write-first": {
    terms: ["key-table", "request-fingerprint", "atomic-transaction"],
    message: "insert-key",
  },
  replay: { terms: ["replay", "stored-response"], message: "replayed" },
  "two-at-once": { terms: ["concurrent-requests", "status-409", "lock"], message: "conflict" },
  "different-body": { terms: ["request-fingerprint", "status-422"], message: "unprocessable" },
  "pass-it-on": {
    terms: ["key-expiry", "business-key", "end-to-end-idempotency"],
    message: "charge-with-key",
  },
  // Scenario: crash halfway
  crash: { terms: ["atomic-transaction", "end-to-end-idempotency"], message: "charge-with-key" },
  recover: { terms: ["lock", "replay"], message: "key-found-stale" },
  // Scenario: key expired
  "late-retry": { terms: ["key-expiry"], message: "key-missing" },
  "safety-net": { terms: ["business-key"], message: "check-order" },
};
