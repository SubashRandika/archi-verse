import { apiGatewayModule } from "./api-gateway/structure";
import { retryAndExponentialBackoffModule } from "./retry-and-exponential-backoff/structure";
import { backendForFrontendModule } from "./backend-for-frontend/structure";
import { circuitBreakerModule } from "./circuit-breaker/structure";
import type { LearningModule } from "./types";

export type * from "./types";

/**
 * Every implemented learning module (structure only), by id. Module **text** is loaded by
 * server code through `./text`, never imported from client components.
 */
export const modules: Readonly<Record<string, LearningModule>> = {
  [apiGatewayModule.id]: apiGatewayModule,
  [retryAndExponentialBackoffModule.id]: retryAndExponentialBackoffModule,
  [backendForFrontendModule.id]: backendForFrontendModule,
  [circuitBreakerModule.id]: circuitBreakerModule,
};

export function getModule(id: string | undefined): LearningModule | undefined {
  return id ? modules[id] : undefined;
}
