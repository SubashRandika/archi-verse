import { code, list, p, step } from "../../text-blocks";
import type { StepCopy } from "../../types";
import { exampleCode } from "./shared";

/**
 * Backend for Frontend module, English step text. SERVER ONLY.
 * Beginner: explained as if to a five-year-old, with an everyday example.
 * Advanced: the technical detail, with a worked example.
 * Source: docs/modules/backend-for-frontend.md (approved 2026-11-24).
 */
export const enSteps: Readonly<Record<string, StepCopy>> = {
  // ----- Chapter 1: One API for everyone ----------------------------------------------------
  "one-api": step(
    "One API for everyone",
    "The web browser calls Orders, Users and Recommendations itself, one after another. Its badge counts the calls and the time: 3 calls · 120 ms.",
    {
      body: [
        p(
          "To show one order, the web page needs three things: the order, where to deliver it, and some ideas for what else you might like. Each thing lives in a different service, so the page asks all three, one after the other.",
        ),
        p("On fast Wi-Fi that’s quick."),
      ],
      example: [
        p(
          "To make dinner you walk to the butcher, then the baker, then the greengrocer. If they are all on your street, it doesn’t take long.",
        ),
      ],
    },
    {
      body: [
        p(
          "Each service exposes a general-purpose REST API designed around its own data, not around any screen. The client composes the screen itself: GET /orders/1042, then GET /users/u_7f3a/address, then GET /recommendations?for=1042.",
        ),
        p(
          "Calls that depend on an earlier answer must run one after another: the user id only arrives with the order. (The numbers in this module are illustrations, with realistic orders of magnitude.)",
        ),
      ],
      example: [code("text", "Three round trips on Wi-Fi", exampleCode.wifi)],
    },
  ),

  "chatty-mobile": step(
    "The chatty mobile app",
    "The mobile app makes the same three calls. Each round trip takes much longer: 3 calls · 900 ms.",
    {
      body: [
        p(
          "The phone does exactly the same, but its connection is slow, like shouting across a big field. Every question takes a long time to arrive, and a long time to come back.",
        ),
        p("Three questions take three long waits."),
      ],
      example: [
        p(
          "The butcher, the baker and the greengrocer are now in three different villages. Each trip takes ages, and you need three trips.",
        ),
      ],
    },
    {
      body: [
        p(
          "On a mobile network, latency, not bandwidth, dominates: each round trip costs hundreds of milliseconds, and requests over a fresh connection pay for DNS, TCP and TLS too. A screen that needs N sequential calls costs N round trips.",
        ),
        p("It also costs battery: the radio stays awake for each request."),
      ],
      example: [code("text", "The same three calls on a mobile network", exampleCode.mobile)],
    },
  ),

  "too-much": step(
    "Too much, too little",
    "Three big answers reach the phone: 38 KB received, only 4 KB used. Then the web page has to make one more call for a field the answer didn’t have.",
    {
      body: [
        p(
          "The services send the same big answer to everyone. The phone gets photos and details it will never show, and has to throw most of it away.",
        ),
        p(
          "And sometimes the web page wants something the answer doesn’t have, so it must ask again.",
        ),
      ],
      example: [
        p(
          "You ask for one apple and get a whole crate. Your friend asked for apples and the price, but the crate has no price tag, so they have to go back.",
        ),
      ],
    },
    {
      body: [
        p(
          "A general-purpose API returns one shape for everyone, so some clients over-fetch (data they discard: wasted bytes, parsing time and memory on a phone) and others under-fetch (they need another call for a missing field).",
        ),
        p(
          "Adding fields for one client grows the payload for all of them; removing fields breaks someone. The API’s design ends up negotiated between teams with different needs.",
        ),
      ],
      example: [code("text", "What the phone receives, and what it shows", exampleCode.received)],
    },
  ),

  // ----- Chapter 2: A backend per front end -------------------------------------------------
  "meet-bffs": step(
    "Meet the BFFs",
    "The Web BFF and the Mobile BFF light up. From now on the browser talks only to the Web BFF, and the phone only to the Mobile BFF.",
    {
      body: [
        p(
          "Now each app gets its own helper on the server. The web page has a web helper; the phone has a phone helper.",
        ),
        p("Each helper knows exactly what its app needs, and does the running around for it."),
      ],
      example: [
        p(
          "Instead of walking to three shops, you have a personal shopper who knows what you like. You ask once, and they bring you one bag.",
        ),
      ],
    },
    {
      body: [
        p(
          "A Backend for Frontend is a server-side component built for exactly one user experience: one for the web, one for the mobile app (sometimes one per platform, iOS and Android).",
        ),
        p(
          "It sits behind the API gateway, which still handles TLS, authentication and rate limits for everyone, and in front of the services. The gateway is left out of the picture to keep it small. A BFF holds no business rules of its own: it composes and adapts.",
        ),
      ],
      example: [code("text", "The request paths", exampleCode.paths)],
    },
  ),

  aggregation: step(
    "One call in, three calls out",
    "The phone sends one request. The Mobile BFF asks Orders, then Users and Recommendations side by side, puts the answers together and sends one answer back: 1 call · 380 ms.",
    {
      body: [
        p(
          "The phone asks its helper just once. The helper, who lives close to the services, asks them quickly, collects the answers and sends back one.",
        ),
        p("The phone waits for only one slow trip instead of three."),
      ],
      example: [
        p(
          "Your personal shopper sends two friends to two of the shops at the same time. You get one bag, and it arrives sooner.",
        ),
      ],
    },
    {
      body: [
        p(
          "The BFF aggregates: it turns one client request into several service calls inside the data centre, where a round trip costs about 1 ms instead of 300.",
        ),
        p(
          "Independent calls run in parallel, so their total is roughly the slowest call, not the sum. Calls that depend on earlier answers still run in sequence: Users needs the userId from the order.",
        ),
      ],
      example: [code("text", "Where the time goes now", exampleCode.timing)],
    },
  ),

  shaped: step(
    "Each screen gets its own answer",
    "Both apps ask at the same time. The web gets a 38 KB answer, the phone a 4 KB one. Click either answer to compare them.",
    {
      body: [
        p(
          "The two helpers pack different bags. The web helper packs everything the big screen shows: photos and twelve ideas. The phone helper packs only what fits on a small screen: names, totals and three ideas.",
        ),
        p("Nobody gets things they will throw away."),
      ],
      example: [
        p(
          "The same shop packs a big family box for one customer and a small lunch box for another. Same shop, different boxes.",
        ),
      ],
    },
    {
      body: [
        p(
          "Each BFF shapes the response for its screen: it selects fields, renames them for the UI, merges data from several services, formats values (dates, money) for display and picks image sizes.",
        ),
        p("The services’ APIs stay general; the BFF absorbs the differences."),
      ],
      example: [code("http", "The mobile answer", exampleCode.mobileAnswer)],
    },
  ),

  ownership: step(
    "Owned by the front-end team",
    "The browser and the Web BFF light up together, then the phone and the Mobile BFF: one team each.",
    {
      body: [
        p(
          "The people who make the web page also make the web helper. When they change the page, they can change their helper the same day, without asking anybody else.",
        ),
        p("The phone team does the same with theirs."),
      ],
      example: [
        p(
          "Each family has its own shopper, who listens only to them. If you want something new in your bag, you tell your shopper, and nobody else has to agree.",
        ),
      ],
    },
    {
      body: [
        p(
          "A BFF is owned by the team that owns the front end, so a screen and its API change and ship together, without negotiating with other clients’ teams. This is Conway’s law, used on purpose.",
        ),
        p(
          "A web BFF is also the safest place to keep tokens out of the browser (the token handler pattern): the BFF holds the OAuth tokens on the server and gives the browser only an HttpOnly, Secure, SameSite session cookie, so a script injected into the page (XSS) cannot steal them.",
        ),
      ],
      example: [code("text", "What the browser holds, with and without a BFF", exampleCode.tokens)],
    },
  ),

  // ----- Chapter 3: Trade-offs --------------------------------------------------------------
  costs: step(
    "The costs, and the alternatives",
    "Both BFFs make the same call to Orders: the same rule, written twice. Then the whole picture: each app through its own BFF.",
    {
      body: [
        p(
          "Two helpers means two things to look after. Sometimes both helpers learn the same trick; later one of them changes it and the other doesn’t, so the two apps behave a little differently.",
        ),
        p(
          "BFFs are great when the apps really need different things. When they don’t, one shared helper is simpler.",
        ),
      ],
      example: [
        p(
          "Two personal shoppers are nice, but you pay two people, and they might each remember your favourite bread differently.",
        ),
      ],
    },
    {
      body: [
        p(
          "Costs: one more deployable per front end (hosting, monitoring, on-call), logic that gets copied between BFFs and drifts (move real business rules into the services), and one more hop inside the data centre.",
        ),
        list(
          [
            "API gateway",
            "shared concerns for every client (TLS, authentication, rate limits). It sits in front of the BFFs and should not grow screen-specific logic.",
          ],
          [
            "GraphQL",
            "one flexible endpoint where each client asks for exactly the fields it needs. It solves over- and under-fetching without a BFF per client, at the cost of a schema and resolver layer (often federated over the services).",
          ],
          [
            "When a BFF is worth it",
            "when front ends differ a lot (web, mobile, TV) and are built by different teams.",
          ],
        ),
      ],
      example: [
        p(
          "SoundCloud used BFFs while splitting its monolith (described by Phil Calçado), and Sam Newman wrote up the pattern. Netflix ran device-specific adapter scripts on its API platform, one per kind of device.",
        ),
      ],
    },
  ),

  // ----- Scenario: One service is slow ------------------------------------------------------
  "recommendations-slow": step(
    "Recommendations slows down",
    "Recommendations turns amber. Orders and Users answer the Mobile BFF, Recommendations doesn’t, and the BFF’s badge counts its time budget down.",
    {
      body: [
        p(
          "One of the three shops is very slow today. The helper already has two of the three things, and waits a little for the third.",
        ),
      ],
      example: [
        p(
          "Your shopper has the meat and the bread, but the greengrocer has a long queue. They look at their watch.",
        ),
      ],
    },
    {
      body: [
        p(
          "In a fan-out, the slowest dependency sets the response time. So each downstream call gets its own timeout, inside an overall time budget for the request.",
        ),
        p(
          "Required data (the order) and optional data (the suggestions) can have different budgets.",
        ),
      ],
      example: [code("text", "The BFF’s budgets for this screen", exampleCode.budget)],
    },
  ),

  "partial-answer": step(
    "Answer with what you have",
    "The budget runs out. The Mobile BFF answers the phone without suggestions; Recommendations’ late answer is dropped.",
    {
      body: [
        p(
          "The helper doesn’t make you wait for ever. You get your order and the address now, just without the ideas.",
        ),
        p("That part of the screen stays empty."),
      ],
      example: [
        p(
          "Your shopper comes home with the meat and the bread, and says: “No vegetables today, the queue was too long.” Dinner still happens.",
        ),
      ],
    },
    {
      body: [
        p(
          "The BFF returns a partial response for optional data (suggestions are nice to have; the order is not), marks what is missing, and lets the UI hide that section. Required data failing is still an error.",
        ),
        p(
          "A circuit breaker around each call (the previous module) stops the BFF waiting on a service that is down.",
        ),
      ],
      example: [code("http", "The partial answer", exampleCode.partial)],
    },
  ),

  // ----- Scenario: A web-only change --------------------------------------------------------
  "new-field": step(
    "The web wants a new field",
    "The Web BFF is deployed again and becomes v2.5. The Mobile BFF and the services stay as they are.",
    {
      body: [
        p(
          "The web team wants to show “arrives Thursday”. They teach their helper to ask for the delivery date.",
        ),
        p("Nobody else has to change anything."),
      ],
      example: [
        p(
          "You tell your own shopper: “From now on, please check when the bread is fresh.” The other family’s shopper doesn’t need to know.",
        ),
      ],
    },
    {
      body: [
        p(
          "The web team adds estimatedDelivery to its BFF, using a field Orders already returns. No change to the services’ APIs, no coordination with the mobile team, and no new version of a shared API.",
        ),
      ],
      example: [code("text", "The whole change, in the Web BFF", exampleCode.webChange)],
    },
  ),

  "web-sees-it": step(
    "Only the web sees it",
    "The browser asks again and its answer now says when the order arrives. The phone asks and gets its usual answer.",
    {
      body: [p("The web page shows the delivery day. The phone app works exactly as before.")],
      example: [
        p(
          "One family now gets a note about fresh bread in its bag. The other family’s bag looks the same as always.",
        ),
      ],
    },
    {
      body: [
        p(
          "Each client’s contract changes on its own schedule. The mobile app ships through the app stores and has old versions in use for months; it is not affected.",
        ),
        p(
          "When the app wants the field too, the Mobile BFF adds it, and keeps serving the old app versions.",
        ),
      ],
      example: [code("text", "Each client’s contract", exampleCode.contracts)],
    },
  ),
};
