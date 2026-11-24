import { apiGatewayModule } from "./api-gateway";
import type { LearningModule } from "./types";

export type { LearningModule, ModuleChapter, ModuleStep } from "./types";

/** Every implemented learning module, by id. */
export const modules: Readonly<Record<string, LearningModule>> = {
  [apiGatewayModule.id]: apiGatewayModule,
};

export function getModule(id: string | undefined): LearningModule | undefined {
  return id ? modules[id] : undefined;
}
