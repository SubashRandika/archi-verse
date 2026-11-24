import type { SceneConnection, SceneLayout, Vec3 } from "@/lib/scene-spec";

/** Height of wires above the ground (just enough to avoid z-fighting with the grid). */
export const WIRE_HEIGHT = 0.02;
/** Height at which packets travel. */
export const PACKET_HEIGHT = 0.3;

/** Ground route of a connection: source centre, waypoints, target centre. */
export function routeOf(
  layout: SceneLayout,
  connection: SceneConnection,
  height = WIRE_HEIGHT,
): Vec3[] {
  const position = (id: string) => {
    const component = layout.components.find((candidate) => candidate.id === id);
    if (!component)
      throw new Error(`Connection "${connection.id}" references unknown component "${id}".`);
    return component.position;
  };
  const points = [position(connection.from), ...(connection.via ?? []), position(connection.to)];
  return points.map(([x, , z]) => [x, height, z] as const);
}
