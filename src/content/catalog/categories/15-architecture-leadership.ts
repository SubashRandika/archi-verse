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
      summary:
        "Structured evaluations of a proposed or existing architecture against quality goals and risks.",
    },
    ref("architecture-decision-records"),
    {
      id: "technical-debt-management",
      title: "Technical Debt Management",
      summary:
        "Making technical debt visible, deciding which of it to pay down and when, and preventing new debt from piling up.",
      keywords: ["tech debt"],
    },
    {
      id: "build-vs-buy-decisions",
      title: "Build vs Buy Decisions",
      summary:
        "Deciding whether to build a capability, buy it or adopt open source, weighing cost, fit, risk and ownership.",
    },
    {
      id: "architectural-trade-offs",
      title: "Architectural Trade-offs",
      summary:
        "Making explicit what each option gains and loses, such as consistency versus availability or speed versus flexibility.",
    },
    {
      id: "scalability-planning",
      title: "Scalability Planning",
      summary:
        "Anticipating growth in users, data and teams, and designing for it before it becomes urgent.",
      keywords: ["capacity planning"],
    },
    {
      id: "maintainability-planning",
      title: "Maintainability Planning",
      summary:
        "Keeping a system easy to understand and change for years, through modularity, documentation, tests and clear ownership.",
    },
    {
      id: "technology-evaluation",
      title: "Technology Evaluation",
      summary:
        "Assessing new technologies against clear criteria, with proofs of concept and an adoption plan.",
      keywords: ["tech radar", "proof of concept"],
    },
    {
      id: "engineering-standards",
      title: "Engineering Standards",
      summary:
        "Shared conventions for code, tooling and practices that keep work consistent across teams.",
      keywords: ["guidelines", "conventions"],
    },
    {
      id: "code-review-governance",
      title: "Code Review Governance",
      summary:
        "Policies for how code is reviewed: ownership, required approvals, turnaround times and what a good review covers.",
      keywords: ["CODEOWNERS", "pull requests"],
    },
    {
      id: "design-reviews",
      title: "Design Reviews",
      summary:
        "Reviewing a technical design document with peers before implementation, to catch problems while they are cheap.",
      keywords: ["RFC", "design doc"],
    },
    {
      id: "cross-team-architecture",
      title: "Cross-Team Architecture",
      summary:
        "Aligning architecture across teams through shared platforms, clear boundaries, contracts and decision forums.",
    },
    {
      id: "technical-roadmaps",
      title: "Technical Roadmaps",
      summary: "A time-based plan of technical investments that is aligned with product goals.",
    },
    {
      id: "architecture-risk-management",
      title: "Architecture Risk Management",
      summary:
        "Identifying, assessing and reducing technical risks before they turn into incidents.",
    },
    {
      id: "technical-documentation",
      title: "Technical Documentation",
      summary:
        "Writing the documentation engineers need, such as architecture overviews, runbooks and API references, and keeping it current.",
      keywords: ["docs", "runbooks"],
    },
    {
      id: "dependency-governance",
      title: "Dependency Governance",
      summary:
        "Policies for choosing, updating and auditing third-party dependencies across an organisation.",
    },
    ref("backward-compatibility"),
    {
      id: "migration-strategies",
      title: "Migration Strategies",
      summary:
        "Approaches for moving from an old system to a new one: big bang, phased, parallel run or incremental.",
    },
    {
      id: "strangler-fig-pattern",
      title: "Strangler Fig Pattern",
      summary:
        "Gradually replacing a legacy system by routing more and more functionality to a new one, until the old one can be removed.",
    },
    {
      id: "incremental-modernization",
      title: "Incremental Modernization",
      summary: "Modernising a codebase in small, safe steps while continuing to ship features.",
    },
    {
      id: "developer-experience",
      title: "Developer Experience (DX)",
      summary:
        "How easy and pleasant it is for engineers to build, test and ship, from tooling and docs to feedback loops.",
      keywords: ["DX"],
    },
    {
      id: "engineering-metrics",
      title: "Engineering Metrics",
      summary:
        "Measuring delivery and quality, for example with DORA metrics, to guide improvement rather than to rank people.",
      keywords: ["DORA", "SPACE", "lead time"],
    },
  ],
};
