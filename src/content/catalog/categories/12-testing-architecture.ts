import { type CategoryDefinition, ref } from "../types";

export const testingArchitecture: CategoryDefinition = {
  id: "testing-architecture",
  title: "Testing Architecture & Quality Engineering",
  description:
    "Strategies, tools and practices for gaining confidence that software works, and for keeping test suites fast and trustworthy.",
  icon: "testing",
  order: 12,
  concepts: [
    {
      id: "unit-testing",
      title: "Unit Testing",
    },
    {
      id: "integration-testing",
      title: "Integration Testing",
    },
    {
      id: "component-testing",
      title: "Component Testing",
    },
    {
      id: "end-to-end-testing",
      title: "End-to-End Testing",
      keywords: ["e2e"],
    },
    ref("visual-regression-testing"),
    {
      id: "contract-testing",
      title: "Contract Testing",
      keywords: ["Pact", "consumer-driven contracts"],
    },
    {
      id: "accessibility-testing",
      title: "Accessibility Testing",
      keywords: ["axe", "a11y"],
    },
    {
      id: "performance-testing",
      title: "Performance Testing",
      keywords: ["load testing", "Lighthouse", "k6"],
    },
    {
      id: "test-pyramid",
      title: "Test Pyramid",
    },
    {
      id: "test-trophy",
      title: "Test Trophy",
      keywords: ["testing trophy"],
    },
    {
      id: "test-driven-development",
      title: "Test-Driven Development (TDD)",
      keywords: ["TDD"],
    },
    {
      id: "behavior-driven-development",
      title: "Behavior-Driven Development (BDD)",
      keywords: ["BDD", "Gherkin", "Cucumber"],
    },
    {
      id: "mocking-and-stubbing",
      title: "Mocking and Stubbing",
    },
    {
      id: "test-doubles",
      title: "Test Doubles",
      keywords: ["fakes", "spies"],
    },
    {
      id: "mock-service-worker",
      title: "Mock Service Worker (MSW)",
      keywords: ["MSW", "API mocking"],
    },
    {
      id: "jest",
      title: "Jest",
    },
    {
      id: "vitest",
      title: "Vitest",
    },
    {
      id: "react-testing-library",
      title: "React Testing Library",
      keywords: ["Testing Library"],
    },
    {
      id: "cypress",
      title: "Cypress",
    },
    {
      id: "playwright",
      title: "Playwright",
    },
    {
      id: "ci-testing-pipelines",
      title: "CI Testing Pipelines",
    },
    {
      id: "test-coverage",
      title: "Test Coverage",
      keywords: ["code coverage"],
    },
    {
      id: "flaky-tests",
      title: "Flaky Tests",
    },
    {
      id: "test-isolation",
      title: "Test Isolation",
    },
    {
      id: "test-data-management",
      title: "Test Data Management",
      keywords: ["fixtures", "factories", "seeding"],
    },
  ],
};
