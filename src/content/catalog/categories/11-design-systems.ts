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
      summary:
        "How a design system is structured: tokens, primitives, components, documentation and the packages that ship them.",
    },
    {
      id: "component-libraries",
      title: "Component Libraries",
      summary:
        "Reusable, tested interface components distributed as a package for product teams to build with.",
    },
    {
      id: "design-tokens",
      title: "Design Tokens",
      summary:
        "Named design decisions, such as colours, spacing and type, stored in a format that both code and design tools can use.",
      keywords: ["tokens"],
    },
    {
      id: "theming",
      title: "Theming",
      summary:
        "Changing an interface's look, for example light and dark modes or several brands, by swapping token values rather than component code.",
      keywords: ["dark mode"],
    },
    {
      id: "css-architecture",
      title: "CSS Architecture",
      summary:
        "Strategies for organising CSS at scale so styles stay predictable: naming, layering and scoping.",
      keywords: ["BEM", "ITCSS", "cascade layers"],
    },
    {
      id: "css-modules",
      title: "CSS Modules",
      summary: "CSS files whose class names are scoped locally to the component that imports them.",
    },
    {
      id: "css-in-js",
      title: "CSS-in-JS",
      summary:
        "Writing styles in JavaScript next to components, generated either at runtime or at build time.",
      keywords: ["styled-components", "Emotion", "vanilla-extract"],
    },
    {
      id: "tailwind-css",
      title: "Tailwind CSS",
      summary:
        "A utility-first CSS framework: styling with small, single-purpose classes generated from a design scale.",
      keywords: ["utility classes"],
    },
    {
      id: "css-variables",
      title: "CSS Variables",
      summary:
        "Custom properties that store values in CSS, cascade like other properties and can change at runtime.",
      keywords: ["custom properties"],
    },
    {
      id: "shadow-dom",
      title: "Shadow DOM",
      summary:
        "An encapsulated DOM subtree whose markup and styles are isolated from the rest of the page.",
    },
    ref("web-components"),
    {
      id: "accessibility",
      title: "Accessibility",
      summary:
        "Designing and building interfaces everyone can use, including people who rely on keyboards, screen readers or magnification.",
      keywords: ["a11y"],
    },
    {
      id: "wcag",
      title: "WCAG",
      summary:
        "The Web Content Accessibility Guidelines: testable success criteria grouped into levels A, AA and AAA.",
      keywords: ["accessibility guidelines"],
    },
    {
      id: "aria",
      title: "ARIA",
      summary:
        "Attributes that describe roles, states and properties to assistive technologies when native HTML is not enough.",
      keywords: ["WAI-ARIA", "roles"],
    },
    {
      id: "internationalization",
      title: "Internationalization (i18n)",
      summary:
        "Preparing software so it can support many languages and regions without code changes.",
      keywords: ["i18n"],
    },
    {
      id: "localization",
      title: "Localization (l10n)",
      summary:
        "Adapting a product for a specific locale: translations and date, number and currency formats.",
      keywords: ["l10n", "translations"],
    },
    {
      id: "right-to-left",
      title: "Right-to-Left (RTL)",
      summary:
        "Supporting languages such as Arabic and Hebrew, where reading direction and layout are mirrored.",
      keywords: ["RTL", "bidi", "logical properties"],
    },
    {
      id: "responsive-design",
      title: "Responsive Design",
      summary:
        "Layouts that adapt to any screen size and input method, using fluid grids, media queries and container queries.",
    },
    {
      id: "storybook",
      title: "Storybook",
      summary:
        "A workshop for developing, documenting and testing interface components in isolation.",
    },
    {
      id: "visual-regression-testing",
      title: "Visual Regression Testing",
      summary:
        "Comparing screenshots against approved baselines to catch unintended visual changes.",
      keywords: ["screenshot testing", "Chromatic"],
    },
    {
      id: "component-versioning",
      title: "Component Versioning",
      summary:
        "Releasing component library changes with semantic versions so consumers know what is safe to upgrade.",
    },
    {
      id: "backward-compatibility",
      title: "Backward Compatibility",
      summary:
        "Making changes without breaking existing consumers, through deprecation periods and additive APIs.",
      keywords: ["breaking changes", "deprecation"],
    },
    {
      id: "design-system-governance",
      title: "Design System Governance",
      summary:
        "How a design system is owned, how contributions are made and how decisions about it are taken.",
    },
  ],
};
