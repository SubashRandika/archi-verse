import { code, list, p, step } from "../../text-blocks";
import type { StepCopy } from "../../types";
import { exampleCode } from "./shared";

/**
 * Idempotency module, English step text. SERVER ONLY.
 * Beginner: explained as if to a five-year-old, with an everyday example.
 * Advanced: the technical detail, with a worked example.
 * Source: docs/modules/idempotency.md (approved 2026-11-26).
 */
export const enSteps: Readonly<Record<string, StepCopy>> = {
  // ----- Chapter 1: Safe to repeat? ---------------------------------------------------------
  "same-twice": step(
    "Same request, twice",
    "Shopper A sets the delivery address twice: the order still has one address. Then Shopper A pays twice without a key: the Payments DB shows two charges.",
    {
      body: [
        p(
          "Some things are fine to do twice. If you say “my address is 12 Lake Road” two times, the shop still has one address: 12 Lake Road.",
        ),
        p(
          "But if you say “take 12,400 rupees” two times, the shop takes the money two times. This module is about making the second kind safe too.",
        ),
      ],
      example: [
        p(
          "Pressing the lift button again doesn’t call two lifts. But putting money into a vending machine twice does buy you two drinks.",
        ),
      ],
    },
    {
      body: [
        p(
          "An operation is idempotent if doing it many times has the same effect on the server as doing it once. RFC 9110 defines GET, HEAD, OPTIONS, TRACE, PUT and DELETE as idempotent: PUT replaces a resource with the same body, DELETE removes it once. POST and PATCH are not: each POST /payments creates a new payment.",
        ),
        p(
          "Idempotent is about the effect, not the answer: a second DELETE may return 404 and a second PUT 200 instead of 201, and both are still idempotent. The method name only states what is expected; the server has to keep the promise.",
        ),
      ],
      example: [code("text", "The same request, twice", exampleCode.putVsPost)],
    },
  ),

  duplicates: step(
    "Where duplicates come from",
    "A double click sends two payments, and both answers are lost. The retry is slow, so the app times out and retries again. Four requests, four charges, one order.",
    {
      body: [
        p(
          "The app didn’t mean to pay four times. A finger tapped twice. Then the “done!” messages got lost, so the app asked again. Then the helper was slow, so the app asked again before the answer came.",
        ),
        p("Each time, the helper thought it was a new payment."),
      ],
      example: [
        p(
          "You post a letter, don’t hear back, and post it again. The shop now has two letters and can’t tell they are the same.",
        ),
      ],
    },
    {
      body: [
        p(
          "As soon as anyone retries, delivery is at least once: a client can’t tell “the request was lost” from “the answer was lost” from “the server is slow”. Duplicates come from double submits, client retries after timeouts or resets, proxies and load balancers retrying, mobile apps resending after a network switch, and message queues redelivering.",
        ),
        p(
          "Exactly-once delivery is impossible over an unreliable network; an exactly-once effect is possible if the receiver recognises repeats. Disabling the button after a click fixes one source only. The fix belongs on the server, because only it sees every attempt.",
        ),
      ],
      example: [code("text", "What the server sees", exampleCode.serverLog)],
    },
  ),

  // ----- Chapter 2: Idempotency keys --------------------------------------------------------
  "one-key": step(
    "One key per payment",
    "Shopper A makes a key and saves it, then pays with it. The answer is lost, so Shopper A retries with the same key.",
    {
      body: [
        p(
          "Before paying, the app writes a secret number on the payment, like a ticket number: 7f3a. It keeps the number safe.",
        ),
        p(
          "If it has to ask again, it uses the same number. A new shopping trip gets a new number.",
        ),
      ],
      example: [
        p(
          "A cloakroom ticket: you get one ticket for your coat, and you show the same ticket every time you ask about that coat.",
        ),
      ],
    },
    {
      body: [
        p(
          "The client generates the key once per operation, not per attempt. A random UUID v4 from crypto.randomUUID() is enough, and it must be unpredictable. It keeps the key with the operation (component state, a form library’s submit state, or sessionStorage so a reload keeps it) and sends it on every attempt in the Idempotency-Key header, as the IETF draft describes.",
        ),
        p(
          "It makes a new key when the operation changes (a different amount or cart) or after it has finished. Reusing a key for a new payment would make the server replay the old one (step 7).",
        ),
      ],
      example: [code("text", "The client side (TypeScript)", exampleCode.clientKey)],
    },
  ),

  "write-first": step(
    "The server writes it down first",
    "Payments saves the key as “in progress”, charges the card through the Card processor, then saves the payment and the answer with the key, and replies “paid”.",
    {
      body: [
        p(
          "The helper first writes the ticket number in its notebook: “7f3a: working on it”. Then it takes the money.",
        ),
        p(
          "Then it writes down the answer next to the number: “7f3a: done, paid”. Now it will remember this payment if anyone asks again.",
        ),
      ],
      example: [
        p(
          "A cloakroom attendant writes your ticket number on the hanger before walking off with your coat.",
        ),
      ],
    },
    {
      body: [
        p(
          "The server keeps a table of keys: the key, a fingerprint of the request, the state (in progress or done), the stored response and an expiry time. The first request:",
        ),
        list(
          [
            "Inserts the key as in progress",
            "with a unique constraint on the key; if the insert fails, another request has it (steps 5–6).",
          ],
          ["Does the work", "charges the card and creates the payment."],
          [
            "Saves the answer with the key",
            "and marks it done, in the same transaction as the payment row.",
          ],
        ),
        p(
          "The call to the Card processor can’t be inside that transaction. The “Crash halfway” scenario and step 8 deal with that gap.",
        ),
      ],
      example: [code("text", "The key row afterwards", exampleCode.keyRow)],
    },
  ),

  replay: step(
    "A repeat gets the saved answer",
    "The answer is lost again. Shopper A retries with the same key; Payments finds it “done” and sends the saved answer back. The Card processor isn’t called.",
    {
      body: [
        p(
          "The app didn’t hear back, so it asks again with ticket 7f3a. The helper looks in the notebook: “7f3a: done, paid”.",
        ),
        p("So it just says “paid!” again. It doesn’t take the money again."),
      ],
      example: [p("You show your cloakroom ticket twice; you still get one coat.")],
    },
    {
      body: [
        p(
          "A repeat with a done key gets the stored response: the same status code and body as the first time, so the client can’t tell a replay from the original. Stripe adds Idempotent-Replayed: true so clients and logs can tell. Nothing runs again and nothing downstream is called.",
        ),
        p(
          "Which results to store is a choice. Stripe stores any result once the operation has started, including a 500, so a retry gets the same failure instead of a second attempt with unknown effects. Validation errors that happen before anything changed are not stored.",
        ),
      ],
      example: [code("http", "The replay", exampleCode.replay)],
    },
  ),

  // ----- Chapter 3: The hard cases ----------------------------------------------------------
  "two-at-once": step(
    "Two at once",
    "A double tap sends two requests with one key. The first does the work; the second finds the key in progress and gets 409. Its retry gets the saved answer. One charge.",
    {
      body: [
        p(
          "Two taps, same ticket, at almost the same moment. The helper is already working on 7f3a when the second one arrives.",
        ),
        p(
          "It says “I’m still doing that one, ask me again in a moment”. When the app asks again, the answer is ready: “paid”.",
        ),
      ],
      example: [
        p(
          "You ask for your coat while the attendant is still walking back with it. They say “one moment”, not “here’s another coat”.",
        ),
      ],
    },
    {
      body: [
        p(
          "Two requests with one key can arrive together, from a double submit or a client retrying before the first attempt has finished. Without care, both would see “no key yet” and both would charge. The unique constraint on the key makes the second insert fail, and the server answers 409 Conflict (the IETF draft’s choice, and Stripe’s). The client retries with backoff, as in the Retry module.",
        ),
        p(
          "The alternative is to make the second request wait for the first and then replay its answer. It’s friendlier, but it ties up a connection and needs a timeout; 409 keeps the server simple.",
        ),
      ],
      example: [code("http", "The second request’s answer", exampleCode.conflict)],
    },
  ),

  "different-body": step(
    "Same key, different request",
    "The cart changed but the app kept the old key, so it sends key 7f3a with a new amount. Payments sees the request doesn’t match the key and refuses with 422. Nothing is charged.",
    {
      body: [
        p(
          "The app used ticket 7f3a again, but this time for a different, bigger payment: 13,900 rupees.",
        ),
        p(
          "The helper notices that the notebook says ticket 7f3a was for 12,400 rupees. So it refuses: “that ticket was for something else”.",
        ),
      ],
      example: [p("You hand in a ticket for a blue coat and ask for a red one.")],
    },
    {
      body: [
        p(
          "The server stores a fingerprint of each key’s request (a hash of method, path and body) and compares it on every repeat. A different request with a used key is a client bug; the IETF draft answers 422 Unprocessable Content. Without the check, the server would replay the old payment’s answer, and the shopper would think the new amount was paid.",
        ),
        p(
          "On the client this is step 3’s rule: a new operation needs a new key. Tie the key to what is being paid (the cart and the amount), not only to the order number.",
        ),
      ],
      example: [code("http", "The refusal", exampleCode.unprocessable)],
    },
  ),

  "pass-it-on": step(
    "Expiry, and passing the key on",
    "The same payment, but Payments now sends its own key (pay_81f2) to the Card processor. The key is saved with an expiry: 24 hours.",
    {
      body: [
        p(
          "The helper’s notebook can’t keep every ticket forever, so it throws old ones away after a day.",
        ),
        p(
          "And when the helper asks the bank for the money, it gives the bank a ticket number of its own. Then, if the helper has to ask the bank again, the bank won’t take the money twice either.",
        ),
      ],
      example: [p("A parcel gets a tracking number at every company that carries it.")],
    },
    {
      body: [
        p(
          "Expiry: keys are deleted after a while (Stripe keeps them at least 24 hours) to keep the table small. The lifetime must be longer than any client keeps retrying; a retry after the key is gone is treated as a new payment (see “Key expired”). A unique rule on the business key, one successful payment per order, is a good second safety net.",
        ),
        p(
          "Passing it on: each system can only protect itself. Payments makes its Card processor call idempotent too, by sending its own key that stays the same for this payment, such as the payment’s id. Then Payments can repeat that call after a timeout or a crash, and the whole chain charges once.",
        ),
      ],
      example: [code("http", "Payments calling the Card processor", exampleCode.downstream)],
    },
  ),

  // ----- Scenario: crash halfway ------------------------------------------------------------
  crash: step(
    "The crash",
    "Payments saves the key as “in progress” and the Card processor charges the card. Then Payments crashes before saving the answer. Shopper A hears nothing.",
    {
      body: [
        p(
          "The helper took the money from the bank, and then, before writing “done” in the notebook, it fell asleep.",
        ),
        p("The notebook still says “7f3a: working on it”. The app heard nothing."),
      ],
      example: [
        p(
          "The attendant fetched your coat and then got called away before handing it over. The hanger still says “being fetched”.",
        ),
      ],
    },
    {
      body: [
        p(
          "The money moved, but the key row still says in progress and no payment row exists. This is the gap between an outside side effect and the local transaction.",
        ),
        p(
          "A plain retry would get 409 forever, and a careless server that started over would charge again. (Payments already sends its own key, pay_81f2, to the Card processor, as step 8 explains; that is what makes the recovery safe.)",
        ),
      ],
      example: [code("text", "What is left after the crash", exampleCode.crashState)],
    },
  ),

  recover: step(
    "Recovering safely",
    "Payments is back. Shopper A retries; the key has been in progress for over 60 s, so Payments takes it over and asks the Card processor again with the same key. The processor replays its earlier charge.",
    {
      body: [
        p(
          "The helper wakes up and sees “7f3a: working on it” from long ago. It asks the bank again, with the same ticket.",
        ),
        p(
          "The bank says “I already did that one”, so no money moves twice. Now the helper writes “done” and says “paid”.",
        ),
      ],
      example: [
        p(
          "The attendant comes back, sees “being fetched” on the hanger and checks the coat rail first, instead of fetching a second coat.",
        ),
      ],
    },
    {
      body: [
        p(
          "The key row records when it was locked. A lock older than a timeout (here 60 s) is treated as abandoned, and the next request with the key resumes the work.",
        ),
        p(
          "Resuming is safe only because the outside call carries its own key. Larger systems split the work into steps with saved recovery points, and finish stuck keys in a background job instead of waiting for a retry.",
        ),
      ],
      example: [code("text", "The recovery", exampleCode.recovery)],
    },
  ),

  // ----- Scenario: key expired --------------------------------------------------------------
  "late-retry": step(
    "A retry a day later",
    "The first payment went through, but its answer was lost and the laptop went to sleep. 25 hours later the app retries with key 7f3a. The key has expired, so Payments charges again.",
    {
      body: [
        p("The app waited much too long. The helper had already thrown the old ticket away."),
        p("So it didn’t know this was the same payment, and took the money again."),
      ],
      example: [
        p(
          "You come back for your coat a week later. The cloakroom has thrown your ticket away, and someone hands you a different coat.",
        ),
      ],
    },
    {
      body: [
        p(
          "After expiry the key protects nothing. Clients must stop retrying well inside the key’s lifetime (a deadline, as in the Retry module).",
        ),
        p(
          "Before resending an old operation, a client should check what happened first, for example with GET /orders/1042.",
        ),
      ],
      example: [code("text", "Two days, two payments", exampleCode.lateRetry)],
    },
  ),

  "safety-net": step(
    "The safety nets",
    "The same late retry, but Payments also checks the order: one successful payment per order. Order 1042 is already paid, so Payments refuses and nothing is charged.",
    {
      body: [
        p("This time the helper also looks at the order number."),
        p("Order 1042 is already paid, so it says so instead of taking the money again."),
      ],
      example: [
        p(
          "The cloakroom also writes your name on the coat. Even without the ticket, they can see you already took yours.",
        ),
      ],
    },
    {
      body: [
        p(
          "Combine the short-lived key with a lasting business rule: a unique index on succeeded payments per order (order_id WHERE status = 'succeeded'). It costs nothing on the happy path and stops duplicates long after keys expire.",
        ),
        p(
          "The client can do its part too: before resending after a long gap, ask the server what happened (GET /orders/1042) and show that instead.",
        ),
      ],
      example: [code("http", "Payments refuses", exampleCode.alreadyPaid)],
    },
  ),
};
