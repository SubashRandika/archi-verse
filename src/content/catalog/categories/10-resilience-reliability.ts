import { type CategoryDefinition, ref } from "../types";

export const resilienceReliability: CategoryDefinition = {
  id: "resilience-reliability",
  title: "Resilience, Reliability & Fault Tolerance",
  description:
    "Designing systems that keep working, or fail gracefully, when parts of them break, and observing them so you know when that happens.",
  icon: "resilience",
  order: 10,
  concepts: [
    {
      id: "fault-tolerance",
      title: "Fault Tolerance",
      summary:
        "The ability of a system to keep operating correctly when some of its components fail.",
    },
    {
      id: "graceful-degradation",
      title: "Graceful Degradation",
      summary:
        "Keeping core functionality available when features or dependencies fail, instead of failing completely.",
    },
    {
      id: "progressive-enhancement",
      title: "Progressive Enhancement",
      summary:
        "Starting from a baseline that works everywhere, then adding richer features for capable browsers.",
    },
    {
      id: "error-boundaries",
      title: "Error Boundaries",
      summary:
        "React components that catch rendering errors in their subtree and show a fallback instead of crashing the app.",
    },
    ref("retry-and-exponential-backoff"),
    ref("circuit-breaker"),
    {
      id: "timeout-handling",
      title: "Timeout Handling",
      summary:
        "Giving every remote call a time limit, so a slow dependency cannot make the caller hang indefinitely.",
      keywords: ["timeouts", "deadline"],
    },
    {
      id: "fallback-ui",
      title: "Fallback UI",
      summary:
        "Placeholder or alternative interfaces shown while content loads or when it fails, such as skeletons and error states.",
      keywords: ["skeleton", "empty state", "error state"],
    },
    {
      id: "offline-first-architecture",
      title: "Offline-First Architecture",
      summary:
        "Treating the local device as the primary data source and syncing with the server whenever a connection is available.",
      keywords: ["local-first"],
    },
    {
      id: "network-resilience",
      title: "Network Resilience",
      summary:
        "Handling slow, flaky and lost connections with retries, timeouts, offline queues and clear feedback to the user.",
    },
    {
      id: "health-checks",
      title: "Health Checks",
      summary:
        "Endpoints or probes that report whether a service is alive and ready, used by load balancers and orchestrators.",
      keywords: ["liveness", "readiness", "probes"],
    },
    {
      id: "redundancy",
      title: "Redundancy",
      summary:
        "Running extra copies of components so the system survives the loss of any single one of them.",
      keywords: ["replicas", "failover"],
    },
    {
      id: "availability-and-reliability",
      title: "Availability and Reliability",
      summary:
        "Availability is how often a system can be used; reliability is how consistently it works correctly. Both are tracked with SLOs.",
      keywords: ["SLA", "SLO", "SLI", "uptime", "nines"],
    },
    {
      id: "disaster-recovery",
      title: "Disaster Recovery",
      summary:
        "Plans and mechanisms for restoring service after a major failure, defined by recovery time and data-loss objectives.",
      keywords: ["RTO", "RPO", "backups"],
    },
    {
      id: "observability",
      title: "Observability",
      summary:
        "Understanding a system's internal state from the data it emits: logs, metrics and traces.",
      keywords: ["telemetry", "monitoring"],
    },
    {
      id: "logging",
      title: "Logging",
      summary:
        "Recording structured, timestamped events that explain what happened inside a system.",
      keywords: ["structured logs"],
    },
    {
      id: "metrics",
      title: "Metrics",
      summary:
        "Numeric measurements aggregated over time, such as request rate, error rate and latency.",
      keywords: ["RED", "Prometheus", "dashboards"],
    },
    {
      id: "distributed-tracing",
      title: "Distributed Tracing",
      summary:
        "Following one request across services with trace and span IDs to see where time is spent and where it failed.",
      keywords: ["OpenTelemetry", "spans", "traces"],
    },
  ],
};
