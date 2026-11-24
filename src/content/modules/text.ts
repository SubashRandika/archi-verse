import { apiGatewayText } from "./api-gateway/text";
import type { ModuleText } from "./types";

/**
 * Module text by module id. SERVER ONLY: import this from route files in `src/app/` and pass
 * what a page needs as props. ESLint forbids importing it from features and components, so the
 * text travels as route data instead of client JavaScript.
 */
const texts: Readonly<Record<string, ModuleText>> = {
  "api-gateway": apiGatewayText,
};

export function getModuleText(id: string | undefined): ModuleText | undefined {
  return id ? texts[id] : undefined;
}
