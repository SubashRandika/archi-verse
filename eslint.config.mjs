import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier/flat";

/**
 * Architectural dependency rules (see docs/ARCHITECTURE.md → "Dependency rules").
 * Lower layers must never import higher layers:
 *
 *   app → features → engine / content → lib
 */
const restrict = (groups, message) => ({
  "no-restricted-imports": ["error", { patterns: [{ group: groups, message }] }],
});

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      "@typescript-eslint/consistent-type-imports": ["error", { fixStyle: "inline-type-imports" }],
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
  {
    files: ["src/lib/**/*.{ts,tsx}"],
    rules: restrict(
      ["@/app/*", "@/features/*", "@/engine/*", "@/content/*", "@/components/*"],
      "lib/ is the bottom layer: it must not depend on app, features, engine, content or UI.",
    ),
  },
  {
    files: ["src/content/**/*.{ts,tsx}"],
    rules: restrict(
      [
        "@/app/*",
        "@/features/*",
        "@/engine/*",
        "@/components/*",
        "react",
        "three",
        "@react-three/*",
      ],
      "content/ is pure learning data: it must not import UI, React or the 3D engine.",
    ),
  },
  {
    files: ["src/engine/**/*.{ts,tsx}"],
    rules: restrict(
      ["@/app/*", "@/features/*", "@/content/*"],
      "engine/ is domain-agnostic: it must not import features or learning content.",
    ),
  },
  {
    // The 3D engine updates three.js objects (materials, lines, the canvas) imperatively in
    // render-loop callbacks and effects: the intended React Three Fiber pattern, and the way
    // per-frame values stay out of React (ADR-0004). The React Compiler's immutability rule
    // flags exactly that, so it is off for engine components only (docs/CONVENTIONS.md).
    files: ["src/engine/**/*.tsx"],
    rules: { "react-hooks/immutability": "off" },
  },
  {
    files: ["src/features/**/*.{ts,tsx}", "src/components/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            { group: ["@/app/*"], message: "features/ must not import route modules from app/." },
            {
              group: ["@/content/modules/text", "@/content/modules/*/text"],
              message:
                "Module text is server-only: load it in an app/ route and pass it as props, so it ships as route data instead of client JavaScript.",
            },
          ],
        },
      ],
    },
  },
  prettier,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "coverage/**",
    "playwright-report/**",
    "test-results/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
