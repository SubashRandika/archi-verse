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
    },
    {
      id: "graceful-degradation",
      title: "Graceful Degradation",
    },
    {
      id: "progressive-enhancement",
      title: "Progressive Enhancement",
    },
    {
      id: "error-boundaries",
      title: "Error Boundaries",
    },
    ref("retry-and-exponential-backoff"),
    ref("circuit-breaker"),
    {
      id: "timeout-handling",
      title: "Timeout Handling",
      keywords: ["timeouts", "deadline"],
    },
    {
      id: "fallback-ui",
      title: "Fallback UI",
      keywords: ["skeleton", "empty state", "error state"],
    },
    {
      id: "offline-first-architecture",
      title: "Offline-First Architecture",
      keywords: ["local-first"],
    },
    {
      id: "network-resilience",
      title: "Network Resilience",
    },
    {
      id: "health-checks",
      title: "Health Checks",
      keywords: ["liveness", "readiness", "probes"],
    },
    {
      id: "redundancy",
      title: "Redundancy",
      keywords: ["replicas", "failover"],
    },
    {
      id: "availability-and-reliability",
      title: "Availability and Reliability",
      keywords: ["SLA", "SLO", "SLI", "uptime", "nines"],
    },
    {
      id: "disaster-recovery",
      title: "Disaster Recovery",
      keywords: ["RTO", "RPO", "backups"],
    },
    {
      id: "observability",
      title: "Observability",
      keywords: ["telemetry", "monitoring"],
    },
    {
      id: "logging",
      title: "Logging",
      keywords: ["structured logs"],
    },
    {
      id: "metrics",
      title: "Metrics",
      keywords: ["RED", "Prometheus", "dashboards"],
    },
    {
      id: "distributed-tracing",
      title: "Distributed Tracing",
      keywords: ["OpenTelemetry", "spans", "traces"],
    },
  ],
};
