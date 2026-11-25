import { code, list, p, step } from "../../text-blocks";
import type { StepCopy } from "../../types";
import { exampleCode } from "./shared";

/**
 * Retry and Exponential Backoff module, English step text. SERVER ONLY.
 * Beginner: explained as if to a five-year-old, with an everyday example.
 * Advanced: the technical detail, with a worked example.
 * Source: docs/modules/retry-and-exponential-backoff.md (approved 2026-11-25).
 */
export const enSteps: Readonly<Record<string, StepCopy>> = {
  // ----- Chapter 1: Things fail for a moment ------------------------------------------------
  blip: step(
    "A blip",
    "Shopper A presses Pay while Payments is restarting. Payments answers 503 Service Unavailable, and a moment later it is ready again.",
    {
      body: [
        p(
          "Shopper A presses Pay. The payment helper on the server is busy for a moment, so it says “sorry, not now”.",
        ),
        p(
          "A second later it is fine again. Nothing is really broken; the timing was just unlucky.",
        ),
      ],
      example: [
        p(
          "You phone a shop and the line is busy. That doesn’t mean the shop has closed. It means everyone called at once, or the person was away for a minute.",
        ),
      ],
    },
    {
      body: [
        p(
          "Many failures in distributed systems are transient: they last milliseconds to seconds and go away without anyone acting. Typical causes are a deploy restarting instances, a brief overload, a dropped connection, a database failover or a network hiccup.",
        ),
        p(
          "A permanent failure (a bad request, a missing resource, a bug) gives the same error every time. (The numbers in this module are illustrations, and playback compresses time; the badges show the real values.)",
        ),
      ],
      example: [code("http", "The failed payment", exampleCode.unavailable)],
    },
  ),

  "try-again": step(
    "Just try again",
    "Shopper A waits a moment and sends the same payment again. This time Payments charges it and answers 201 Created: paid on attempt 2.",
    {
      body: [
        p(
          "Shopper A’s app waits a tiny moment and asks again. This time the helper says yes, and the payment goes through.",
        ),
        p("Shopper A never even noticed that the first try failed."),
      ],
      example: [
        p("The line was busy, so you wait a moment and call again, and this time someone answers."),
      ],
    },
    {
      body: [
        p(
          "A retry sends the same request again after a failure. It is worth it only for errors that might succeed next time:",
        ),
        list(
          [
            "Retry",
            "timeouts, dropped connections, 408, 429, 502, 503 and 504. Often 500 too, carefully.",
          ],
          [
            "Don’t retry",
            "400, 401, 403, 404, 409 and 422. The same request will fail the same way; retrying only adds load and delay.",
          ],
        ),
        p(
          "The browser’s fetch never retries for you. Libraries do: TanStack Query retries a failed query 3 times by default, gRPC has a retry policy in its service config, and the AWS SDKs retry throttling and transient errors by default.",
        ),
      ],
      example: [code("text", "A retry decision (TypeScript)", exampleCode.isRetryable)],
    },
  ),

  // ----- Chapter 2: Retrying without making it worse ----------------------------------------
  storm: step(
    "Everyone retries at once",
    "All three shoppers pay while Payments is restarting, and every app retries straight away, again and again. Payments’ load climbs to 30 requests a second, three times what it can handle.",
    {
      body: [
        p(
          "Now everyone’s payment fails at the same moment, and every app asks again straight away, and again, and again.",
        ),
        p(
          "The helper was only a little busy before. Now it has three times more questions than it can answer, so it stays stuck.",
        ),
      ],
      example: [
        p(
          "A lift is full, and everyone waiting keeps pressing the button non-stop. The lift doesn’t come any faster; the crowd just grows.",
        ),
      ],
    },
    {
      body: [
        p(
          "Retrying immediately turns a short failure into a long one. Every failed request comes back as one or more new requests, so the load on the struggling service multiplies just when it has the least capacity. This is a retry storm.",
        ),
        p(
          "It can leave a system stuck in an overloaded state after the original cause has gone: the restart finished, but the backlog of retries keeps it failing. This is called a metastable failure. (The three shoppers stand for everyone paying at that moment.)",
        ),
      ],
      example: [code("text", "Immediate retries during the restart", exampleCode.storm)],
    },
  ),

  backoff: step(
    "Exponential backoff",
    "Each shopper now waits before retrying, and every wait is twice as long: 1 s, 2 s, then 4 s. The fourth attempts succeed, but the three retries always reach Payments together.",
    {
      body: [
        p(
          "This time each app waits before asking again, and every time it fails, it waits twice as long: one second, then two, then four. That gives the helper time to get back on its feet.",
        ),
        p(
          "But look: all three apps wait exactly the same, so their questions still arrive at the same moment.",
        ),
      ],
      example: [
        p(
          "If the line is busy, you wait a minute before calling again, then two minutes, then four. You stop jamming the line. But if all your friends use the same rule, you all call back at exactly the same moment.",
        ),
      ],
    },
    {
      body: [
        p(
          "Exponential backoff makes the wait before retry n grow geometrically, base × 2^(n−1), limited by a cap so it never gets absurdly long. Fewer retries reach the service while it is down, and quick blips still recover quickly.",
        ),
        p(
          "But clients that failed together keep retrying together, in synchronised waves. TanStack Query’s default delay is exactly this: base 1 s, cap 30 s.",
        ),
      ],
      example: [
        code("text", "Base 1 s, cap 30 s", exampleCode.backoff),
        code("text", "TanStack Query’s default retryDelay", exampleCode.backoffCode),
      ],
    },
  ),

  jitter: step(
    "Add jitter",
    "Each shopper now waits a random part of the backoff, so their retries drift apart and reach Payments one at a time. The random waits are fixed here, so every replay looks the same.",
    {
      body: [
        p(
          "Now each app adds a little surprise: it waits a random part of its waiting time, not exactly the same as the others.",
        ),
        p(
          "So the questions arrive one by one instead of all at once, and the helper can answer each of them.",
        ),
      ],
      example: [
        p(
          "Instead of everyone calling back at exactly 2 o’clock, each friend calls sometime between 2 and 2:10. The line is never jammed.",
        ),
      ],
    },
    {
      body: [
        p(
          "Jitter adds randomness to each wait so that clients that failed together spread out. Marc Brooker’s AWS Architecture Blog post “Exponential Backoff and Jitter” compared the variants.",
        ),
        p(
          "Full jitter is simple and works well: sleep = random(0, min(cap, base × 2^attempt)). Compared with backoff alone, it cuts both the work the server does and the time until clients finish. The animation uses fixed “random” values so that replays match; real clients use Math.random().",
        ),
      ],
      example: [
        code(
          "text",
          "The waits before attempts 2 and 3, with full jitter",
          exampleCode.jitterTable,
        ),
        code("text", "Full jitter", exampleCode.jitterCode),
      ],
    },
  ),

  "give-up": step(
    "Know when to stop",
    "This time the deploy goes wrong and Payments stays down. Shopper A tries four times with backoff, then stops and shows a clear message.",
    {
      body: [
        p(
          "Sometimes the helper is not coming back soon. Asking for ever would only make you wait for ever.",
        ),
        p(
          "So the app tries a few times, then stops and tells you honestly: “Payment didn’t go through. You weren’t charged. Please try again later.”",
        ),
      ],
      example: [
        p(
          "After calling three or four times with no answer, you stop and send a message instead. You don’t spend the whole day redialling.",
        ),
      ],
    },
    {
      body: [
        p("Every retry loop needs limits:"),
        list(
          ["Max attempts", "here 4 (the first try and 3 retries)."],
          [
            "A deadline",
            "an overall time budget for the whole operation, here 10 s. Each attempt’s timeout must fit inside what is left of it.",
          ],
          [
            "A retry budget",
            "retries as a share of all requests (Google’s SRE book suggests about 10% per client), so a big outage cannot multiply the load.",
          ],
          [
            "A circuit breaker",
            "when most calls are failing, stop sending even first attempts for a while (see the Circuit Breaker module). Retries handle blips; the breaker handles outages.",
          ],
        ),
        p("Then fail clearly: tell the user what happened and whether anything was charged."),
      ],
      example: [code("text", "The give-up path", exampleCode.giveUp)],
    },
  ),

  // ----- Chapter 3: Is it safe to repeat? ---------------------------------------------------
  "double-charge": step(
    "The double charge",
    "Payments charges Shopper A, but its answer is lost halfway back. The app times out and retries, and Payments charges again: charged twice.",
    {
      body: [
        p(
          "Shopper A pays, and the payment goes through, but the “done!” message gets lost on the way back.",
        ),
        p(
          "The app doesn’t know it worked, so it asks again, and the helper takes the money a second time. Oops.",
        ),
      ],
      example: [
        p(
          "You post a letter with money inside, but you never hear back. So you send another letter with more money, and later find out both arrived.",
        ),
      ],
    },
    {
      body: [
        p(
          "A timeout tells the client nothing about what happened on the server: the request may never have arrived, may have failed, or may have succeeded with the response lost. Retrying is safe only if doing the operation twice has the same effect as doing it once: if it is idempotent.",
        ),
        p(
          "In HTTP, GET, HEAD, PUT and DELETE are defined as idempotent; POST and PATCH are not. That is why TanStack Query retries queries by default but not mutations (retry: 0 for useMutation).",
        ),
      ],
      example: [code("text", "What each side saw", exampleCode.doubleCharge)],
    },
  ),

  "idempotency-key": step(
    "Idempotency keys",
    "This time the payment carries a key. The answer is lost again, and the app retries with the same key. Payments finds the key and returns the first result: charged once.",
    {
      body: [
        p(
          "Now the app writes a special number on the payment, like a ticket number, and keeps it. If it has to ask again, it sends the same number.",
        ),
        p(
          "The helper checks: “I already did this ticket”, and just says “done” again, without taking more money.",
        ),
      ],
      example: [
        p(
          "You write a reference number on the letter. If you send a second letter with the same number, the shop knows it’s the same order and doesn’t charge you again.",
        ),
      ],
    },
    {
      body: [
        p(
          "The client makes a unique idempotency key once per operation (not per attempt) and sends it with every attempt. The server stores the key with the result of the first request; a repeat with the same key gets the stored result instead of a second charge. Stripe’s API works this way, and the IETF Idempotency-Key header draft describes it for any HTTP API.",
        ),
        p(
          "Details that matter, covered in the Idempotency concept: keys expire (Stripe keeps them for at least 24 hours), the same key with a different body is an error, and two concurrent requests with one key need a lock.",
        ),
      ],
      example: [
        code("http", "The retry, with a key", exampleCode.keyed),
        code("http", "The first result, not a new charge", exampleCode.replayed),
      ],
    },
  ),

  // ----- Scenario: The server says when ------------------------------------------------------
  "server-hint": step(
    "A 503 with Retry-After",
    "The three shoppers pay while Payments is restarting. Payments answers each with 503 and Retry-After: 5, so each app knows how long to wait.",
    {
      body: [
        p("This time the helper says more than “not now”. It says “come back in five seconds”."),
        p("So the apps don’t have to guess."),
      ],
      example: [
        p(
          "The shop’s answering machine says: “We open again at ten.” You don’t keep calling; you call at ten.",
        ),
      ],
    },
    {
      body: [
        p(
          "Retry-After (RFC 9110) tells the client how long to wait, as seconds (Retry-After: 5) or as an HTTP date. Servers send it with 503, and with 429 Too Many Requests (see the Rate Limiting concept).",
        ),
        p(
          "A good client honours it as the minimum wait, still adds a little jitter, and gives up if the wait would pass its deadline.",
        ),
      ],
      example: [code("http", "The hint", exampleCode.retryAfter)],
    },
  ),

  "on-time": step(
    "Everyone comes back at the right time",
    "After the wait, each with a little jitter of its own, the three retries reach Payments, which is ready: all three are paid.",
    {
      body: [p("The apps waited as long as they were told, and the helper was ready for them.")],
      example: [p("You called at ten, and the shop picked up straight away.")],
    },
    {
      body: [
        p(
          "The server knows its own state (a restart takes about 5 s, a rate-limit window resets in 5 s), so its hint beats any guess.",
        ),
        p("Without the header, the client falls back to its own backoff with jitter."),
      ],
      example: [code("text", "How a client uses Retry-After", exampleCode.honour)],
    },
  ),

  // ----- Scenario: Retries multiply ---------------------------------------------------------
  "two-layers": step(
    "Two layers retrying",
    "The Payments DB is overloaded. Each time Shopper A tries, Payments tries the database four times, and Shopper A tries four times: the database’s badge counts 16 queries for one tap.",
    {
      body: [
        p(
          "The app asks the helper again and again, and each time, the helper asks the database again and again.",
        ),
        p(
          "One press of a button turns into sixteen questions to the database, which is already struggling.",
        ),
      ],
      example: [
        p(
          "You ask your friend four times to call the shop, and each time your friend calls four times. The shop’s phone rings sixteen times.",
        ),
      ],
    },
    {
      body: [
        p(
          "Retries at several layers multiply: 4 attempts at the client × 4 attempts at Payments = up to 16 database calls for one user action. Three layers would make 64.",
        ),
        p(
          "The layers also wait for each other, so the user waits far longer than any single deadline.",
        ),
      ],
      example: [code("text", "One tap, two layers retrying", exampleCode.multiply)],
    },
  ),

  "one-layer": step(
    "Retry at one layer",
    "Payments now fails fast and passes the error up; only Shopper A retries. The database’s badge stops at 4 queries for one tap.",
    {
      body: [
        p(
          "Now only the app asks again. The helper just says “the database isn’t answering” straight away.",
        ),
        p("Four questions instead of sixteen."),
      ],
      example: [
        p(
          "Your friend calls the shop once, and if nobody answers, comes straight back to tell you. You decide when to try again.",
        ),
      ],
    },
    {
      body: [
        p(
          "Retry at a single layer, usually the one that knows whether the operation is safe to repeat and holds the user’s deadline. Inner layers fail fast and return a retryable error, with Retry-After if they know.",
        ),
        p("Retry budgets and circuit breakers cap the rest."),
      ],
      example: [code("text", "One tap, one layer retrying", exampleCode.oneLayer)],
    },
  ),
};
