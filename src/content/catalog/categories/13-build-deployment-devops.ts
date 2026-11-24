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
      summary:
        "A highly configurable module bundler built around loaders and plugins, for years the default for large applications.",
    },
    {
      id: "vite",
      title: "Vite",
      summary:
        "A build tool that serves native ES modules in development for instant start-up, and bundles for production.",
    },
    {
      id: "rollup",
      title: "Rollup",
      summary:
        "An ES module bundler known for efficient tree shaking, widely used to build libraries.",
    },
    {
      id: "esbuild",
      title: "ESBuild",
      summary: "An extremely fast JavaScript and TypeScript bundler and transformer written in Go.",
    },
    {
      id: "turbopack",
      title: "Turbopack",
      summary:
        "An incremental bundler written in Rust and the default bundler in recent versions of Next.js.",
    },
    {
      id: "module-resolution",
      title: "Module Resolution",
      summary:
        "How a bundler or runtime turns an import path into a file, through package exports, aliases and file extensions.",
      keywords: ["package exports", "path aliases"],
    },
    {
      id: "environment-configuration",
      title: "Environment Configuration",
      summary:
        "Supplying different settings and secrets for each environment without changing code, for example with environment variables.",
      keywords: ["env vars", ".env", "secrets"],
    },
    {
      id: "ci-cd",
      title: "CI/CD",
      summary:
        "Continuous integration builds and tests every change; continuous delivery or deployment releases it automatically.",
      keywords: ["continuous integration", "continuous delivery", "pipelines"],
    },
    {
      id: "github-actions",
      title: "GitHub Actions",
      summary:
        "GitHub's built-in CI/CD: workflows of jobs defined in YAML and triggered by repository events.",
    },
    {
      id: "jenkins",
      title: "Jenkins",
      summary:
        "A long-established, self-hosted automation server for building CI/CD pipelines with plugins.",
    },
    {
      id: "docker",
      title: "Docker",
      summary:
        "A platform for packaging applications with their dependencies into portable container images.",
      keywords: ["Dockerfile", "images"],
    },
    {
      id: "containerization",
      title: "Containerization",
      summary:
        "Running applications in isolated containers that share the host's kernel, for consistent environments from laptop to production.",
      keywords: ["containers", "Kubernetes"],
    },
    {
      id: "static-hosting",
      title: "Static Hosting",
      summary:
        "Serving pre-built HTML, CSS and JavaScript files from storage or a CDN, with no application server.",
    },
    {
      id: "cdn-and-edge-deployment",
      title: "CDN and Edge Deployment",
      summary: "Deploying assets and code to edge locations close to users for lower latency.",
    },
    {
      id: "blue-green-deployment",
      title: "Blue-Green Deployment",
      summary:
        "Running two identical environments and switching all traffic from the old one to the new one at once, with instant rollback.",
    },
    {
      id: "canary-deployment",
      title: "Canary Deployment",
      summary:
        "Releasing a new version to a small share of traffic first, and widening it only while the metrics stay healthy.",
      keywords: ["canary release", "progressive delivery"],
    },
    {
      id: "feature-flags",
      title: "Feature Flags",
      summary:
        "Turning features on or off at runtime without deploying, which separates deploying code from releasing features.",
      keywords: ["feature toggles"],
    },
    {
      id: "release-management",
      title: "Release Management",
      summary:
        "Planning, scheduling and coordinating releases, including versioning, changelogs and communication.",
      keywords: ["changelog"],
    },
    {
      id: "rollback-strategies",
      title: "Rollback Strategies",
      summary:
        "Ways to undo a bad release quickly, such as redeploying the previous artifact, switching traffic or turning off a flag.",
    },
    {
      id: "source-maps",
      title: "Source Maps",
      summary:
        "Files that map minified production code back to the original source, for readable stack traces and debugging.",
    },
    {
      id: "artifact-management",
      title: "Artifact Management",
      summary:
        "Storing versioned build outputs, such as packages and container images, in a registry for reproducible deployments.",
      keywords: ["registry"],
    },
    {
      id: "monorepos",
      title: "Monorepos",
      summary:
        "Keeping many projects in one repository, with shared tooling and changes that span projects in a single commit.",
      keywords: ["monorepo", "workspaces"],
    },
    {
      id: "nx",
      title: "Nx",
      summary:
        "A monorepo build system with a project graph, commands that run only on affected projects, and computation caching.",
    },
    {
      id: "turborepo",
      title: "Turborepo",
      summary:
        "A high-performance build system for JavaScript monorepos, with task pipelines and remote caching.",
    },
    {
      id: "package-management",
      title: "Package Management",
      summary:
        "Installing and versioning dependencies with npm, pnpm or Yarn, using lockfiles for reproducible installs.",
      keywords: ["npm", "pnpm", "Yarn", "lockfile"],
    },
    {
      id: "semantic-versioning",
      title: "Semantic Versioning",
      summary:
        "Version numbers in the form major.minor.patch that signal breaking changes, new features and fixes.",
      keywords: ["semver"],
    },
  ],
};
