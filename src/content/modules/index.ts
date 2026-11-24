import { apiGatewayModule } from "./api-gateway/structure";
import type { LearningModule } from "./types";

export type * from "./types";

/**
 * Every implemented learning module (structure only), by id. Module **text** is loaded by
 * server code through `./text`, never imported from client components.
 */
export const modules: Readonly<Record<string, LearningModule>> = {
  [apiGatewayModule.id]: apiGatewayModule,
};

export function getModule(id: string | undefined): LearningModule | undefined {
  return id ? modules[id] : undefined;
}
