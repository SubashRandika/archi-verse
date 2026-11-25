import type { ModuleText } from "../../types";
import { en } from "./en";
import { messages, steps } from "./shared";
import { si } from "./si";

/**
 * Retry and Exponential Backoff module text in every language. SERVER ONLY: read by the concept routes and
 * delivered as route data (ESLint forbids importing it from client code).
 */
export const retryAndExponentialBackoffText: ModuleText = { steps, messages, locales: { en, si } };
