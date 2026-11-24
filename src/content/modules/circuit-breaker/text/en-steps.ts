import { code, list, p, step } from "../../text-blocks";
import type { StepCopy } from "../../types";
import { exampleCode } from "./shared";

/**
 * Circuit Breaker module, English step text. SERVER ONLY.
 * Beginner: explained as if to a five-year-old, with an everyday example.
 * Advanced: the technical detail, with a worked example.
 * Source: docs/modules/circuit-breaker.md (approved 2026-11-24).
 */
export const enSteps: Readonly<Record<string, StepCopy>> = {
  // ----- Chapter 1: When a service gets slow ------------------------------------------------
  "healthy-chain": step(
    "A healthy chain",
    "A request goes from the browser through Orders and the breaker to Payments and its database, and the answers come straight back.",
    {
      body: [
        p(
          "When you open “My orders”, the Orders service makes your list. But it doesn’t know if each order is paid, so it asks the Payments service. Payments looks in its notebook, the database, and answers.",
        ),
        p("All of this takes less time than a blink."),
      ],
      example: [
        p(
          "A waiter takes your order and asks the kitchen: “Is the soup ready?” The kitchen answers straight away, and the waiter tells you.",
        ),
      ],
    },
    {
      body: [
        p(
          "Orders calls Payments synchronously while it builds its response: one request, one HTTP call downstream, and a database query behind that. In a healthy system the whole chain takes about 60 ms, and one of Orders’ threads is busy for all of it.",
        ),
        p(
          "The circuit breaker sits around that call, in Orders’ code. Right now it is closed: it only watches, recording each call’s result and duration. (The API gateway from the previous module is still in front of Orders; it is left out to keep the picture small.)",
        ),
      ],
      example: [code("http", "The call and its answer", exampleCode.healthyCall)],
    },
  ),

  "everyone-waits": step(
    "One slow service, everyone waits",
    "The database turns amber. Requests reach Payments but no answers come back, and Orders’ busy-threads badge climbs.",
    {
      body: [
        p(
          "Today the Payments notebook is very slow. Payments asks it, and waits, and waits. Orders asks Payments, and waits too.",
        ),
        p(
          "More people open “My orders”, so more and more of Orders’ helpers are stuck waiting. Soon Orders has no free helpers left, even for people who don’t need Payments at all.",
        ),
      ],
      example: [
        p(
          "The kitchen stops answering. Every waiter who asks stands at the kitchen door, waiting. After a while no waiter is left to take new orders, and the whole restaurant stops, even though only the kitchen has a problem.",
        ),
      ],
    },
    {
      body: [
        p(
          "This is how a cascading failure starts. Each call to Payments holds one of Orders’ threads (or connections, or event-loop slots) until it returns. When Payments slows from 40 ms to 10 s, the number of calls in flight grows by the same factor (Little’s law). Orders has 50 threads; requests that never touch Payments start failing too.",
        ),
        p(
          "A 2 s timeout helps: each stuck call now holds a thread for 2 s instead of 10. But Orders still pays 2 s for every call it could already guess will fail, and it keeps sending load to a service that is struggling.",
        ),
      ],
      example: [code("text", "Threads busy waiting for Payments", exampleCode.threads)],
    },
  ),

  // ----- Chapter 2: The breaker -------------------------------------------------------------
  "meet-the-breaker": step(
    "Meet the circuit breaker",
    "The breaker’s “closed” lamp flashes. One call passes straight through it on its way to Payments.",
    {
      body: [
        p(
          "The circuit breaker is a small guard between Orders and Payments. It watches every call. As long as Payments answers well, it lets everything through.",
        ),
        p("That is called closed: like a closed switch, the calls flow through."),
      ],
      example: [
        p(
          "The fuse box in your house. Normally the electricity flows. If something goes wrong too many times, it switches off to keep the house safe.",
        ),
      ],
    },
    {
      body: [
        p("A circuit breaker wraps the calls to one dependency and keeps a small state machine:"),
        list(
          ["Closed", "calls pass through; their results are counted."],
          ["Open", "calls fail at once, without being tried."],
          ["Half-open", "a few trial calls test whether the dependency has recovered."],
        ),
        p(
          "It lives in the caller, usually as a library around the HTTP client, with one breaker per dependency (or per endpoint). Here it is drawn as its own box so you can see its state.",
        ),
      ],
      example: [code("text", "The breaker’s settings in resilience4j (Java)", exampleCode.config)],
    },
  ),

  "failures-add-up": step(
    "Failures add up",
    "Five calls go to Payments. Each one times out and comes back as a rose error, and the breaker’s badge counts 1 of 5 … 5 of 5.",
    {
      body: [
        p(
          "Payments is still slow. Each time Orders asks, it gives up after two seconds and comes back with “no answer”.",
        ),
        p("The guard keeps count: one failure, two, three, four, five."),
      ],
      example: [
        p(
          "You call a friend and nobody picks up. You try again. And again. After five tries you stop and think: “They’re busy. I’ll call later.”",
        ),
      ],
    },
    {
      body: [
        p(
          "The breaker records each outcome. A call counts as a failure if it throws, returns an error the policy counts (a 5xx, a refused connection) or takes longer than the slow-call threshold. 4xx answers usually do not count: they are the caller’s mistake, not a sick dependency.",
        ),
        p(
          "Real breakers rarely use “5 in a row”. They use a failure rate over a sliding window, for example 50 % of the last 20 calls once at least 10 were made, so one unlucky call in a busy minute doesn’t trip it. The scene uses 5 in a row to keep the counting visible.",
        ),
      ],
      example: [code("text", "A count-based window of the last 10 calls", exampleCode.window)],
    },
  ),

  "breaker-trips": step(
    "The breaker trips",
    "The breaker’s “open” lamp flashes and it turns rose: “open · 30 s”.",
    {
      body: [
        p(
          "Five failures! The guard decides: “Payments is not well. Let’s stop asking for a while.”",
        ),
        p("It opens: no more calls go to Payments for 30 seconds."),
      ],
      example: [
        p(
          "The fuse switches off. The lights go out in one room, but the rest of the house is safe, and nothing burns.",
        ),
      ],
    },
    {
      body: [
        p(
          "The failure threshold was reached, so the breaker moves from closed to open and starts its wait timer (30 s here).",
        ),
        p(
          "The transition is an event worth logging and alerting on: it is the clearest signal that a dependency is unhealthy, and it often fires before any dashboard shows a problem.",
        ),
      ],
      example: [code("text", "The log line and the metric", exampleCode.trip)],
    },
  ),

  "fail-fast": step(
    "Failing fast, with a fallback",
    "New calls stop at the breaker and bounce straight back. Orders answers the browser at once, and its busy-threads badge drops.",
    {
      body: [
        p(
          "Now when Orders asks, the guard answers right away: “Payments is resting, don’t wait.” So Orders doesn’t get stuck.",
        ),
        p(
          "It shows your orders anyway, and says “payment status: we’ll check again soon”. And Payments gets some quiet time to get better.",
        ),
      ],
      example: [
        p(
          "The waiter knows the kitchen is in trouble, so he doesn’t go and wait at its door. He tells you: “The soup will take a while. Can I bring you some bread now?”",
        ),
      ],
    },
    {
      body: [
        p(
          "While open, the breaker rejects calls immediately (CallNotPermittedException), in microseconds instead of a 2 s timeout. That frees Orders’ threads, keeps its latency low and takes the load off Payments, which helps it recover.",
        ),
        p("A fallback turns the fast failure into a useful answer. Options, best first:"),
        list(
          "Cached or last-known data",
          "A safe default (“unknown”)",
          "A smaller feature (hide the payment column)",
          "An honest error",
        ),
        p("A fallback must be cheap, and must never call the failing dependency again."),
      ],
      example: [code("http", "Orders’ answer during the outage", exampleCode.fallback)],
    },
  ),

  // ----- Chapter 3: Recovery ----------------------------------------------------------------
  "half-open": step(
    "Half-open: one careful try",
    "The breaker counts down from 30 s, its “half-open” lamp flashes, and exactly one call goes through to Payments, which answers quickly.",
    {
      body: [
        p(
          "After 30 seconds the guard thinks: “Maybe Payments feels better now. Let’s try once.” It lets one call through, and only one.",
        ),
        p("This is half-open: the door is open just a crack."),
      ],
      example: [
        p(
          "After a fuse trips, you switch it back on carefully and watch. You don’t plug everything in at once.",
        ),
      ],
    },
    {
      body: [
        p(
          "When the wait is over, the breaker moves to half-open and permits a small number of trial calls (1 here, often 3–10). Their results decide: if they succeed, it closes; if one fails, it opens again with a fresh timer.",
        ),
        p(
          "Limiting the trials matters: a service that has just recovered often falls over again if it suddenly gets all of its traffic back.",
        ),
      ],
      example: [code("text", "The timeline", exampleCode.halfOpen)],
    },
  ),

  "closed-again": step(
    "Closed again",
    "The “closed” lamp flashes and requests flow through the whole chain again. Then the three lamps flash in turn: closed, open, half-open, closed.",
    {
      body: [
        p(
          "The try worked! Payments is better. The guard closes again, and everything flows like before. It starts counting from zero, and keeps watching.",
        ),
        p(
          "The guard has three moods: closed (all good, let calls through), open (something is wrong, stop calling for a while) and half-open (try once, carefully).",
        ),
      ],
      example: [
        p(
          "The lights in the room are back on. The fuse box is still there, ready to switch off again if something goes wrong.",
        ),
      ],
    },
    {
      body: [
        p(
          "A successful trial closes the breaker and resets its window. Nobody had to notice the outage, switch Payments off and on, or redeploy Orders.",
        ),
        p("Breakers work best together with:"),
        list(
          ["Timeouts", "turn hangs into failures the breaker can count."],
          ["Bulkheads", "a separate pool per dependency, so one can’t use up all of Orders."],
          ["Retries with backoff", "for short blips, and they stop while the breaker is open."],
          ["Fallbacks", "decide what the user sees meanwhile."],
        ),
      ],
      example: [
        p("Where the breaker can live:"),
        list(
          ["In the caller’s code", "resilience4j, Polly (.NET), opossum (Node)."],
          ["In the API gateway", "Spring Cloud Gateway, Kong passive health checks."],
          ["In a service mesh", "Envoy outlier detection, Istio."],
        ),
      ],
    },
  ),

  // ----- Scenario: Without a breaker -------------------------------------------------------
  "queue-grows": step(
    "The queue grows",
    "There is no breaker. Calls keep going to the slow Payments service, and Orders’ badge climbs to 50 of 50 threads busy.",
    {
      body: [
        p(
          "This time there is no guard. Orders keeps asking Payments, and keeps waiting. Now all of its helpers are stuck.",
        ),
      ],
      example: [
        p("Every waiter is now standing at the kitchen door. Nobody is left in the dining room."),
      ],
    },
    {
      body: [
        p(
          "Thread-pool exhaustion: with no breaker and no bulkhead, the slow dependency takes every thread. The request queue fills next, then memory. Timeouts alone only slow this down.",
        ),
      ],
      example: [code("text", "What Orders’ logs show", exampleCode.noBreaker)],
    },
  ),

  "unrelated-pages-fail": step(
    "Even unrelated pages fail",
    "The browser asks Orders for “My profile”, which never needs Payments. Orders can’t take it and answers 503.",
    {
      body: [
        p(
          "Now even “My profile”, which never needs Payments, doesn’t work. One sick service made a healthy one sick too.",
        ),
      ],
      example: [
        p(
          "You only wanted a glass of water, but no waiter is free to bring it, because they are all waiting for the soup.",
        ),
      ],
    },
    {
      body: [
        p(
          "The failure has crossed a service boundary. Orders answers 503 Service Unavailable even for requests that don’t touch Payments. Its health checks start failing, the load balancer removes instances, and the ones that are left get even more load.",
        ),
      ],
      example: [
        code("http", "The answer to “My profile”", [
          "HTTP/1.1 503 Service Unavailable",
          "Retry-After: 10",
        ]),
      ],
    },
  ),

  "retry-storm": step(
    "Retries make it worse",
    "The browser retries again and again; every retry fails too, and the retry badge climbs.",
    {
      body: [
        p(
          "People press “reload” again and again, and the app tries again by itself too. Each try adds more waiting.",
        ),
      ],
      example: [
        p(
          "When a lift is slow, everybody presses the button again. The lift doesn’t come any faster, and the panel gets busier.",
        ),
      ],
    },
    {
      body: [
        p(
          "A retry storm: retries multiply the load on a system that is already failing. The fixes work together: a retry budget (at most a few retries, a share of traffic), exponential backoff with jitter, honouring Retry-After, and a breaker that stops retries while it is open.",
        ),
      ],
      example: [code("text", "Why retries at once hurt", exampleCode.retryStorm)],
    },
  ),

  // ----- Scenario: The trial call fails -----------------------------------------------------
  "still-sick": step(
    "Payments is still sick",
    "The one trial call goes to Payments and times out. The breaker shows “half-open · failed”.",
    {
      body: [p("The careful try didn’t work. Payments still can’t answer.")],
      example: [
        p(
          "You switch the fuse back on, and it switches off again straight away. Something is still wrong.",
        ),
      ],
    },
    {
      body: [
        p(
          "One failed trial is enough to reopen: the breaker doesn’t wait for a full window, because it already knows the dependency was unhealthy a moment ago.",
        ),
      ],
      example: [code("text", "The trial, and what happens next", exampleCode.reopen)],
    },
  ),

  "open-again": step(
    "Open again",
    "The “open” lamp flashes, the badge shows “open · 30 s”, and calls fail fast with the fallback again.",
    {
      body: [
        p(
          "The guard closes the crack and waits another 30 seconds before trying again. Your orders still show, with “payment status: unknown”.",
        ),
      ],
      example: [
        p(
          "You wait a bit longer before trying the fuse again, and keep using the other rooms meanwhile.",
        ),
      ],
    },
    {
      body: [
        p(
          "The timer restarts. Some libraries grow the wait each time (exponential, with a cap), so a long outage gets fewer probes.",
        ),
        p(
          "A breaker that keeps reopening is an alert for a person, not just a log line: the dependency needs fixing, and the fallback is now what users see.",
        ),
      ],
      example: [code("text", "Calls while open", exampleCode.reopen.slice(2))],
    },
  ),
};
