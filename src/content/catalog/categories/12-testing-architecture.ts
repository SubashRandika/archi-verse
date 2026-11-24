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
      summary: "Testing the smallest units of code, such as single functions, in isolation.",
    },
    {
      id: "integration-testing",
      title: "Integration Testing",
      summary: "Testing how several units, modules or services work together.",
    },
    {
      id: "component-testing",
      title: "Component Testing",
      summary:
        "Testing a component's behaviour by rendering it and interacting with it the way a user would.",
    },
    {
      id: "end-to-end-testing",
      title: "End-to-End Testing",
      summary: "Testing complete user journeys through the real application in a browser.",
      keywords: ["e2e"],
    },
    ref("visual-regression-testing"),
    {
      id: "contract-testing",
      title: "Contract Testing",
      summary:
        "Checking that a consumer and a provider agree on an API contract without running both of them together.",
      keywords: ["Pact", "consumer-driven contracts"],
    },
    {
      id: "accessibility-testing",
      title: "Accessibility Testing",
      summary:
        "Automated and manual checks that an interface works with assistive technologies, for example with axe.",
      keywords: ["axe", "a11y"],
    },
    {
      id: "performance-testing",
      title: "Performance Testing",
      summary:
        "Measuring speed and stability under load or on constrained devices, with tools such as load testers and Lighthouse.",
      keywords: ["load testing", "Lighthouse", "k6"],
    },
    {
      id: "test-pyramid",
      title: "Test Pyramid",
      summary:
        "A testing strategy with many fast unit tests, fewer integration tests and only a few end-to-end tests.",
    },
    {
      id: "test-trophy",
      title: "Test Trophy",
      summary:
        "A front-end testing strategy that puts most effort into integration tests, on top of static analysis and unit tests.",
      keywords: ["testing trophy"],
    },
    {
      id: "test-driven-development",
      title: "Test-Driven Development (TDD)",
      summary:
        "Writing a failing test first, then the code that makes it pass, then refactoring: red, green, refactor.",
      keywords: ["TDD"],
    },
    {
      id: "behavior-driven-development",
      title: "Behavior-Driven Development (BDD)",
      summary:
        "Describing behaviour as shared, business-readable scenarios (given, when, then) that become automated tests.",
      keywords: ["BDD", "Gherkin", "Cucumber"],
    },
    {
      id: "mocking-and-stubbing",
      title: "Mocking and Stubbing",
      summary:
        "Replacing real dependencies with controllable substitutes: stubs return canned data, mocks also verify how they were called.",
    },
    {
      id: "test-doubles",
      title: "Test Doubles",
      summary:
        "The umbrella term for stand-ins used in tests: dummies, stubs, spies, mocks and fakes.",
      keywords: ["fakes", "spies"],
    },
    {
      id: "mock-service-worker",
      title: "Mock Service Worker (MSW)",
      summary:
        "A library that intercepts network requests and returns mock responses, in the browser and in Node.",
      keywords: ["MSW", "API mocking"],
    },
    {
      id: "jest",
      title: "Jest",
      summary:
        "A JavaScript testing framework with a built-in runner, assertions, mocking and snapshot testing.",
    },
    {
      id: "vitest",
      title: "Vitest",
      summary:
        "A Vite-native test runner with a Jest-compatible API and fast, on-demand transformation.",
    },
    {
      id: "react-testing-library",
      title: "React Testing Library",
      summary:
        "Utilities for testing React components through the DOM, the way users interact with them.",
      keywords: ["Testing Library"],
    },
    {
      id: "cypress",
      title: "Cypress",
      summary:
        "An end-to-end and component testing tool that runs tests inside the browser, with time-travel debugging.",
    },
    {
      id: "playwright",
      title: "Playwright",
      summary:
        "A browser automation and end-to-end testing framework for Chromium, Firefox and WebKit.",
    },
    {
      id: "ci-testing-pipelines",
      title: "CI Testing Pipelines",
      summary:
        "Running tests automatically on every change in continuous integration, often in parallel and split by type.",
    },
    {
      id: "test-coverage",
      title: "Test Coverage",
      summary:
        "Measuring which lines and branches the tests execute: a useful signal, but not proof of quality.",
      keywords: ["code coverage"],
    },
    {
      id: "flaky-tests",
      title: "Flaky Tests",
      summary:
        "Tests that pass and fail without any code change, usually because of timing, shared state or external dependencies.",
    },
    {
      id: "test-isolation",
      title: "Test Isolation",
      summary:
        "Making sure tests share no state, so each can run alone, in any order and in parallel.",
    },
    {
      id: "test-data-management",
      title: "Test Data Management",
      summary:
        "Creating, seeding and cleaning up the data tests depend on, using factories and fixtures.",
      keywords: ["fixtures", "factories", "seeding"],
    },
  ],
};
