import type { ModuleText } from "../../types";
import { en } from "./en";
import { messages, steps } from "./shared";
import { si } from "./si";

/**
 * Idempotency module text in every language. SERVER ONLY: read by the concept routes and
 * delivered as route data (ESLint forbids importing it from client code).
 */
export const idempotencyText: ModuleText = { steps, messages, locales: { en, si } };
