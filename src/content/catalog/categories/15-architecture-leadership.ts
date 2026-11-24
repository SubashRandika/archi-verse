import { type CategoryDefinition, ref } from "../types";

export const architectureLeadership: CategoryDefinition = {
  id: "architecture-leadership",
  title: "Architecture Leadership & Technical Decision-Making",
  description:
    "The practices that turn technical knowledge into good decisions across teams: reviews, trade-offs, standards, roadmaps and migrations.",
  icon: "leadership",
  order: 15,
  concepts: [
    {
      id: "architecture-reviews",
      title: "Architecture Reviews",
    },
    ref("architecture-decision-records"),
    {
      id: "technical-debt-management",
      title: "Technical Debt Management",
      keywords: ["tech debt"],
    },
    {
      id: "build-vs-buy-decisions",
      title: "Build vs Buy Decisions",
    },
    {
      id: "architectural-trade-offs",
      title: "Architectural Trade-offs",
    },
    {
      id: "scalability-planning",
      title: "Scalability Planning",
      keywords: ["capacity planning"],
    },
    {
      id: "maintainability-planning",
      title: "Maintainability Planning",
    },
    {
      id: "technology-evaluation",
      title: "Technology Evaluation",
      keywords: ["tech radar", "proof of concept"],
    },
    {
      id: "engineering-standards",
      title: "Engineering Standards",
      keywords: ["guidelines", "conventions"],
    },
    {
      id: "code-review-governance",
      title: "Code Review Governance",
      keywords: ["CODEOWNERS", "pull requests"],
    },
    {
      id: "design-reviews",
      title: "Design Reviews",
      keywords: ["RFC", "design doc"],
    },
    {
      id: "cross-team-architecture",
      title: "Cross-Team Architecture",
    },
    {
      id: "technical-roadmaps",
      title: "Technical Roadmaps",
    },
    {
      id: "architecture-risk-management",
      title: "Architecture Risk Management",
    },
    {
      id: "technical-documentation",
      title: "Technical Documentation",
      keywords: ["docs", "runbooks"],
    },
    {
      id: "dependency-governance",
      title: "Dependency Governance",
    },
    ref("backward-compatibility"),
    {
      id: "migration-strategies",
      title: "Migration Strategies",
    },
    {
      id: "strangler-fig-pattern",
      title: "Strangler Fig Pattern",
    },
    {
      id: "incremental-modernization",
      title: "Incremental Modernization",
    },
    {
      id: "developer-experience",
      title: "Developer Experience (DX)",
      keywords: ["DX"],
    },
    {
      id: "engineering-metrics",
      title: "Engineering Metrics",
      keywords: ["DORA", "SPACE", "lead time"],
    },
  ],
};
