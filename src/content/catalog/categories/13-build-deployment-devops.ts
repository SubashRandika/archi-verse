import type { CategoryDefinition } from "../types";

export const buildDeploymentDevops: CategoryDefinition = {
  id: "build-deployment-devops",
  title: "Build, Deployment & DevOps Architecture",
  description:
    "How code gets from a repository to users: bundlers, pipelines, environments, release strategies and repository tooling.",
  icon: "devops",
  order: 13,
  concepts: [
    {
      id: "webpack",
      title: "Webpack",
    },
    {
      id: "vite",
      title: "Vite",
    },
    {
      id: "rollup",
      title: "Rollup",
    },
    {
      id: "esbuild",
      title: "ESBuild",
    },
    {
      id: "turbopack",
      title: "Turbopack",
    },
    {
      id: "module-resolution",
      title: "Module Resolution",
      keywords: ["package exports", "path aliases"],
    },
    {
      id: "environment-configuration",
      title: "Environment Configuration",
      keywords: ["env vars", ".env", "secrets"],
    },
    {
      id: "ci-cd",
      title: "CI/CD",
      keywords: ["continuous integration", "continuous delivery", "pipelines"],
    },
    {
      id: "github-actions",
      title: "GitHub Actions",
    },
    {
      id: "jenkins",
      title: "Jenkins",
    },
    {
      id: "docker",
      title: "Docker",
      keywords: ["Dockerfile", "images"],
    },
    {
      id: "containerization",
      title: "Containerization",
      keywords: ["containers", "Kubernetes"],
    },
    {
      id: "static-hosting",
      title: "Static Hosting",
    },
    {
      id: "cdn-and-edge-deployment",
      title: "CDN and Edge Deployment",
    },
    {
      id: "blue-green-deployment",
      title: "Blue-Green Deployment",
    },
    {
      id: "canary-deployment",
      title: "Canary Deployment",
      keywords: ["canary release", "progressive delivery"],
    },
    {
      id: "feature-flags",
      title: "Feature Flags",
      keywords: ["feature toggles"],
    },
    {
      id: "release-management",
      title: "Release Management",
      keywords: ["changelog"],
    },
    {
      id: "rollback-strategies",
      title: "Rollback Strategies",
    },
    {
      id: "source-maps",
      title: "Source Maps",
    },
    {
      id: "artifact-management",
      title: "Artifact Management",
      keywords: ["registry"],
    },
    {
      id: "monorepos",
      title: "Monorepos",
      keywords: ["monorepo", "workspaces"],
    },
    {
      id: "nx",
      title: "Nx",
    },
    {
      id: "turborepo",
      title: "Turborepo",
    },
    {
      id: "package-management",
      title: "Package Management",
      keywords: ["npm", "pnpm", "Yarn", "lockfile"],
    },
    {
      id: "semantic-versioning",
      title: "Semantic Versioning",
      keywords: ["semver"],
    },
  ],
};
