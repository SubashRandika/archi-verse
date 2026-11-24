import { type CategoryDefinition, ref } from "../types";

export const designSystems: CategoryDefinition = {
  id: "design-systems",
  title: "Design Systems & UI Platform Architecture",
  description:
    "The shared foundations, components, tooling and governance that let many teams build consistent, accessible interfaces.",
  icon: "design-systems",
  order: 11,
  concepts: [
    {
      id: "design-system-architecture",
      title: "Design System Architecture",
    },
    {
      id: "component-libraries",
      title: "Component Libraries",
    },
    {
      id: "design-tokens",
      title: "Design Tokens",
      keywords: ["tokens"],
    },
    {
      id: "theming",
      title: "Theming",
      keywords: ["dark mode"],
    },
    {
      id: "css-architecture",
      title: "CSS Architecture",
      keywords: ["BEM", "ITCSS", "cascade layers"],
    },
    {
      id: "css-modules",
      title: "CSS Modules",
    },
    {
      id: "css-in-js",
      title: "CSS-in-JS",
      keywords: ["styled-components", "Emotion", "vanilla-extract"],
    },
    {
      id: "tailwind-css",
      title: "Tailwind CSS",
      keywords: ["utility classes"],
    },
    {
      id: "css-variables",
      title: "CSS Variables",
      keywords: ["custom properties"],
    },
    {
      id: "shadow-dom",
      title: "Shadow DOM",
    },
    ref("web-components"),
    {
      id: "accessibility",
      title: "Accessibility",
      keywords: ["a11y"],
    },
    {
      id: "wcag",
      title: "WCAG",
      keywords: ["accessibility guidelines"],
    },
    {
      id: "aria",
      title: "ARIA",
      keywords: ["WAI-ARIA", "roles"],
    },
    {
      id: "internationalization",
      title: "Internationalization (i18n)",
      keywords: ["i18n"],
    },
    {
      id: "localization",
      title: "Localization (l10n)",
      keywords: ["l10n", "translations"],
    },
    {
      id: "right-to-left",
      title: "Right-to-Left (RTL)",
      keywords: ["RTL", "bidi", "logical properties"],
    },
    {
      id: "responsive-design",
      title: "Responsive Design",
    },
    {
      id: "storybook",
      title: "Storybook",
    },
    {
      id: "visual-regression-testing",
      title: "Visual Regression Testing",
      keywords: ["screenshot testing", "Chromatic"],
    },
    {
      id: "component-versioning",
      title: "Component Versioning",
    },
    {
      id: "backward-compatibility",
      title: "Backward Compatibility",
      keywords: ["breaking changes", "deprecation"],
    },
    {
      id: "design-system-governance",
      title: "Design System Governance",
    },
  ],
};
