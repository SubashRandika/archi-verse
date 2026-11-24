import { getModuleLabels } from "@/content/modules/text";

/**
 * Module text for tests. In the app, module text is server-only and reaches the studio and the
 * inspector as route props (ESLint forbids importing it from features); tests pass it the same
 * way.
 */
export { apiGatewayText } from "@/content/modules/api-gateway/text";

export const apiGatewayLabels = getModuleLabels("api-gateway")!;
