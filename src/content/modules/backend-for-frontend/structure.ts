import type { Beat, SceneConnection, SceneLayout } from "@/lib/scene-spec";
import { badge, send, signal, status, timed, wait, work } from "../beats";
import type { LearningModule } from "../types";

/**
 * Backend for Frontend, one backend per screen: scene layout, steps and scenarios.
 * Source of truth for the content: docs/modules/backend-for-frontend.md (approved 2026-11-24).
 * The text lives in ./text (server only).
 *
 * Packet travel times stand for the network: a mobile round trip is drawn slow, Wi-Fi quick and
 * calls inside the data centre quicker still. The badges show the (illustrative) real values.
 */

const SERVICES = ["orders", "users", "recommendations"] as const;
type Service = (typeof SERVICES)[number];

/** Where the direct calls of chapter 1 cross the network: the open ground between the two BFFs. */
const NETWORK: SceneConnection["via"] = [[-3.5, 0, 0]];

const layout: SceneLayout = {
  components: [
    { id: "web", kind: "client", label: "Web browser", role: "Client", position: [-9, 0, -3.2] },
    { id: "mobile", kind: "mobile", label: "Mobile app", role: "Client", position: [-9, 0, 3.2] },
    {
      id: "web-bff",
      kind: "service",
      label: "Web BFF",
      role: "Backend for web",
      position: [-3.5, 0, -3.2],
    },
    {
      id: "mobile-bff",
      kind: "service",
      label: "Mobile BFF",
      role: "Backend for the app",
      position: [-3.5, 0, 3.2],
    },
    {
      id: "orders",
      kind: "service",
      label: "Orders service",
      role: "Backend service",
      position: [3.5, 0, -4],
    },
    {
      id: "users",
      kind: "service",
      label: "Users service",
      role: "Backend service",
      position: [3.5, 0, 0],
      // Above, the Mobile BFF → Orders wire runs through it.
      labelPlacement: "below",
    },
    {
      id: "recommendations",
      kind: "service",
      label: "Recommendations",
      role: "Backend service",
      position: [3.5, 0, 4],
      // Above, it would sit on the Mobile BFF's wires to Users and Orders.
      labelPlacement: "below",
    },
  ],
  connections: [
    { id: "web-web-bff", from: "web", to: "web-bff" },
    { id: "mobile-mobile-bff", from: "mobile", to: "mobile-bff" },
    ...(["web-bff", "mobile-bff"] as const).flatMap((bff) =>
      SERVICES.map((service) => ({ id: `${bff}-${service}`, from: bff, to: service })),
    ),
    // Chapter 1 only: the apps call the services themselves, across the network.
    ...(["web", "mobile"] as const).flatMap((app) =>
      SERVICES.map((service) => ({
        id: `${app}-${service}`,
        from: app,
        to: service,
        via: NETWORK,
        hidden: true,
      })),
    ),
  ],
};

const ALL = layout.components.map((component) => component.id);
const APPS_AND_BFFS = ["web", "mobile", "web-bff", "mobile-bff"];

/** Travel time of a packet, one way: the network it crosses sets the pace. */
const TRAVEL = { wifi: 0.5, mobile: 1.3, inside: 0.35 } as const;
/** Illustrative milliseconds per round trip on each network (the badges). */
const ROUND_TRIP_MS = { web: 40, mobile: 300 } as const;

/** The badge "n calls · t ms" on an app. */
const calls = (app: "web" | "mobile", count: number, ms: number): Beat =>
  status(app, "info", badge(`calls-${count}`, ms));

/** Chapter 1: an app calls the three services itself, one after another. */
function directCalls(app: "web" | "mobile"): Beat[] {
  const travel = app === "web" ? TRAVEL.wifi : TRAVEL.mobile;
  return SERVICES.flatMap((service, index) => [
    send(`${app}-${service}`, "request", { duration: travel, message: `${service}-request` }),
    work(service, 0.3),
    send(`${app}-${service}`, "response", {
      back: true,
      duration: travel,
      message: `${service}-response`,
    }),
    calls(app, index + 1, (index + 1) * ROUND_TRIP_MS[app]),
  ]);
}

/** A BFF calls one service inside the data centre and gets its (general-purpose) answer. */
const insideCall = (bff: "web-bff" | "mobile-bff", service: Service): Beat[] => [
  send(`${bff}-${service}`, "request", {
    duration: TRAVEL.inside,
    message: `bff-${service}-request`,
  }),
  work(service, 0.2),
  send(`${bff}-${service}`, "response", {
    back: true,
    duration: TRAVEL.inside,
    message: `${service}-response`,
  }),
];

/**
 * The BFF's fan-out: Orders first (the others need its userId), then Users and
 * Recommendations side by side. With `slowRecommendations`, that answer never comes.
 */
function fanOut(bff: "web-bff" | "mobile-bff", slowRecommendations = false): Beat[] {
  const out = (service: Service, at: number) => ({
    at,
    beat: send(`${bff}-${service}`, "request", {
      duration: TRAVEL.inside,
      next: 0,
      message: `bff-${service}-request`,
    }),
  });
  const back = (service: Service, at: number) => ({
    at,
    beat: send(`${bff}-${service}`, "response", {
      back: true,
      duration: TRAVEL.inside,
      next: 0,
      message: `${service}-response`,
    }),
  });
  return [
    ...insideCall(bff, "orders"),
    ...timed([
      out("users", 0),
      out("recommendations", 0),
      back("users", 0.55),
      ...(slowRecommendations ? [] : [back("recommendations", 0.75)]),
    ]),
    wait(TRAVEL.inside),
  ];
}

/** An app asks its BFF for the screen; the BFF fans out, composes and answers. */
function screenRequest(app: "web" | "mobile", response = `${app}-response`): Beat[] {
  const bff = app === "web" ? "web-bff" : "mobile-bff";
  const travel = app === "web" ? TRAVEL.wifi : TRAVEL.mobile;
  return [
    send(`${app}-${bff}`, "request", { duration: travel, message: `${app}-screen-request` }),
    work(bff, 0.25),
    ...fanOut(bff),
    work(bff, 0.3),
    send(`${app}-${bff}`, "response", { back: true, duration: travel, message: response }),
  ];
}

export const backendForFrontendModule: LearningModule = {
  id: "backend-for-frontend",
  layout,
  chapters: [{ id: "one-api" }, { id: "per-front-end" }, { id: "trade-offs" }],
  steps: [
    // ----- Chapter 1: One API for everyone ---------------------------------------------------
    {
      id: "one-api",
      chapterId: "one-api",
      scene: {
        focus: ["web", ...SERVICES],
        frame: ALL,
        beats: [...directCalls("web"), wait(0.6)],
      },
    },
    {
      id: "chatty-mobile",
      chapterId: "one-api",
      scene: {
        focus: ["mobile", ...SERVICES],
        frame: ALL,
        beats: [...directCalls("mobile"), wait(0.6)],
      },
    },
    {
      id: "too-much",
      chapterId: "one-api",
      scene: {
        focus: ["web", "mobile", ...SERVICES],
        frame: ALL,
        beats: [
          // The phone asks for all three at once and gets three big answers.
          ...timed(
            SERVICES.flatMap((service, index) => {
              const sent = index * 0.2;
              const back = sent + TRAVEL.mobile + 0.3;
              return [
                {
                  at: sent,
                  beat: send(`mobile-${service}`, "request", {
                    duration: TRAVEL.mobile,
                    next: 0,
                    message: `${service}-request`,
                  }),
                },
                {
                  at: back,
                  beat: send(`mobile-${service}`, "response", {
                    back: true,
                    duration: TRAVEL.mobile,
                    next: 0,
                    message: `${service}-response`,
                  }),
                },
                {
                  at: back + TRAVEL.mobile,
                  beat: status("mobile", "info", badge("received", [21, 24, 38][index])),
                },
              ];
            }),
          ),
          wait(0.4),
          status("mobile", "warning", badge("waste")),
          wait(0.6),
          // The web page needs a field the general answer doesn't have: one more call.
          send("web-orders", "request", { duration: TRAVEL.wifi, message: "delivery-request" }),
          work("orders", 0.3),
          send("web-orders", "response", {
            back: true,
            duration: TRAVEL.wifi,
            message: "delivery-response",
          }),
          status("web", "warning", badge("extra-call")),
          wait(0.6),
        ],
      },
    },

    // ----- Chapter 2: A backend per front end ------------------------------------------------
    {
      id: "meet-bffs",
      chapterId: "per-front-end",
      scene: {
        focus: APPS_AND_BFFS,
        frame: ALL,
        beats: [
          work("web-bff", 0.7),
          signal("web-web-bff", 0.7),
          work("mobile-bff", 0.7),
          signal("mobile-mobile-bff", 0.7),
          wait(0.3),
        ],
      },
    },
    {
      id: "aggregation",
      chapterId: "per-front-end",
      scene: {
        focus: ["mobile", "mobile-bff", ...SERVICES],
        frame: ALL,
        beats: [...screenRequest("mobile"), calls("mobile", 1, 380), wait(0.6)],
      },
    },
    {
      id: "shaped",
      chapterId: "per-front-end",
      scene: {
        focus: APPS_AND_BFFS,
        frame: ALL,
        beats: [
          // Both apps ask at once; the web's request is quicker, so it leaves a little later.
          ...timed([
            {
              at: 0,
              beat: send("mobile-mobile-bff", "request", {
                duration: TRAVEL.mobile,
                next: 0,
                message: "mobile-screen-request",
              }),
            },
            {
              at: TRAVEL.mobile - TRAVEL.wifi,
              beat: send("web-web-bff", "request", {
                duration: TRAVEL.wifi,
                next: 0,
                message: "web-screen-request",
              }),
            },
          ]),
          wait(TRAVEL.mobile),
          work("web-bff", 0.4),
          work("mobile-bff", 0.4),
          ...timed([
            {
              at: 0,
              beat: send("web-web-bff", "response", {
                back: true,
                duration: TRAVEL.wifi,
                next: 0,
                message: "web-response",
              }),
            },
            {
              at: 0,
              beat: send("mobile-mobile-bff", "response", {
                back: true,
                duration: TRAVEL.mobile,
                next: 0,
                message: "mobile-response",
              }),
            },
            { at: TRAVEL.wifi, beat: status("web", "info", badge("size", 38)) },
            { at: TRAVEL.mobile, beat: status("mobile", "info", badge("size", 4)) },
          ]),
          wait(0.8),
        ],
      },
    },
    {
      id: "ownership",
      chapterId: "per-front-end",
      scene: {
        focus: APPS_AND_BFFS,
        frame: ALL,
        beats: [
          status("web", "info", badge("web-team")),
          status("web-bff", "info", badge("web-team")),
          work("web", 0.6),
          signal("web-web-bff", 0.5),
          work("web-bff", 0.6),
          status("mobile", "info", badge("mobile-team")),
          status("mobile-bff", "info", badge("mobile-team")),
          work("mobile", 0.6),
          signal("mobile-mobile-bff", 0.5),
          work("mobile-bff", 0.6),
          wait(0.4),
        ],
      },
    },

    // ----- Chapter 3: Trade-offs -------------------------------------------------------------
    {
      id: "costs",
      chapterId: "trade-offs",
      scene: {
        focus: ALL,
        beats: [
          // The same rule, written twice: both BFFs make the same call to Orders.
          ...timed(
            (["web-bff", "mobile-bff"] as const).flatMap((bff) => [
              {
                at: 0,
                beat: send(`${bff}-orders`, "request", {
                  duration: 0.6,
                  next: 0,
                  message: "bff-orders-request",
                }),
              },
              { at: 0.6, beat: status(bff, "warning", badge("copies")) },
            ]),
          ),
          wait(0.6),
          work("orders", 0.5),
          wait(0.4),
          // The whole picture: each app through its own BFF.
          signal("web-web-bff", 0.6),
          signal("mobile-mobile-bff", 0.6),
          wait(0.4),
        ],
      },
    },
  ],
  scenarios: [
    {
      id: "slow-service",
      branchesFromStepId: "aggregation",
      steps: [
        {
          id: "recommendations-slow",
          scene: {
            focus: ["mobile", "mobile-bff", ...SERVICES],
            frame: ALL,
            initial: { status: { recommendations: { tone: "warning", badge: badge("slow") } } },
            beats: [
              send("mobile-mobile-bff", "request", {
                duration: TRAVEL.mobile,
                message: "mobile-screen-request",
              }),
              work("mobile-bff", 0.25),
              ...fanOut("mobile-bff", true),
              work("recommendations", 0.8, { tone: "warning" }),
              // The BFF's time budget for the optional call runs down.
              ...[100, 150, 200].flatMap((ms) => [
                status("mobile-bff", "warning", badge("budget", ms)),
                wait(0.45),
              ]),
            ],
          },
        },
        {
          id: "partial-answer",
          scene: {
            focus: ["mobile", "mobile-bff", "recommendations"],
            frame: ALL,
            initial: {
              status: {
                recommendations: { tone: "warning", badge: badge("slow") },
                "mobile-bff": { tone: "warning", badge: badge("budget", 200) },
              },
            },
            beats: [
              work("mobile-bff", 0.3),
              status("mobile-bff", "info", badge("partial")),
              ...timed([
                {
                  at: 0,
                  beat: send("mobile-mobile-bff", "response", {
                    back: true,
                    duration: TRAVEL.mobile,
                    next: 0,
                    message: "partial-response",
                  }),
                },
                // Recommendations answers at last, too late: the BFF drops it.
                {
                  at: 0.5,
                  beat: send("mobile-bff-recommendations", "response", {
                    back: true,
                    duration: TRAVEL.inside,
                    next: 0,
                    message: "late-response",
                  }),
                },
                {
                  at: 0.5 + TRAVEL.inside,
                  beat: status("mobile-bff", "info", badge("dropped")),
                },
                { at: TRAVEL.mobile, beat: status("mobile", "info", badge("partial")) },
              ]),
              wait(0.8),
            ],
          },
        },
      ],
    },
    {
      id: "web-change",
      branchesFromStepId: "ownership",
      steps: [
        {
          id: "new-field",
          scene: {
            focus: ["web", "web-bff"],
            frame: ALL,
            beats: [
              status("web-bff", "info", badge("deploying")),
              work("web-bff", 1.4),
              status("web-bff", "info", badge("version")),
              status("mobile-bff", "info", badge("unchanged")),
              wait(0.8),
            ],
          },
        },
        {
          id: "web-sees-it",
          scene: {
            focus: ["web", "mobile", "web-bff", "mobile-bff", ...SERVICES],
            frame: ALL,
            initial: {
              status: {
                "web-bff": { tone: "info", badge: badge("version") },
                "mobile-bff": { tone: "info", badge: badge("unchanged") },
              },
            },
            beats: [
              ...screenRequest("web", "web-response-v2"),
              status("web", "info", badge("arrives")),
              wait(0.3),
              ...screenRequest("mobile"),
              status("mobile", "info", badge("as-before")),
              wait(0.6),
            ],
          },
        },
      ],
    },
  ],
};
