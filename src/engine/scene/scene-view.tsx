"use client";

import { useThree } from "@react-three/fiber";
import { useEffect, useMemo } from "react";
import type { FlowKind, SceneLayout } from "@/lib/scene-spec";
import { ComponentNode } from "../primitives/component-node";
import { ConnectionWire, type WireState } from "../primitives/connection-wire";
import { Packet } from "../primitives/packet";
import { PACKET_HEIGHT, routeOf } from "../primitives/routes";
import type { SceneChannels } from "../timeline";

export interface SceneViewProps {
  readonly layout: SceneLayout;
  /** Per-frame timeline state (packets, activity). Omit for a static scene. */
  readonly channels?: SceneChannels;
  /** Components shown dimmed (out of focus). */
  readonly dimmed: ReadonlySet<string>;
  /** Connections carrying a flow in the current step, and which flow. */
  readonly flows: ReadonlyMap<string, FlowKind>;
  readonly selectedId: string | null;
  readonly hoveredId: string | null;
  /** Ease highlight changes (false for reduced motion). */
  readonly smooth: boolean;
  readonly onSelect?: (id: string) => void;
  readonly onHover?: (id: string | null) => void;
  /** A packet carrying a message was clicked. */
  readonly onInspectMessage?: (messageId: string) => void;
}

/** Renders a scene layout: components, connections and the packets travelling on them. */
export function SceneView({
  layout,
  channels,
  dimmed,
  flows,
  selectedId,
  hoveredId,
  smooth,
  onSelect,
  onHover,
  onInspectMessage,
}: SceneViewProps) {
  const canvas = useThree((state) => state.gl.domElement);
  useEffect(() => {
    canvas.style.cursor = hoveredId ? "pointer" : "";
  }, [canvas, hoveredId]);

  const routes = useMemo(
    () =>
      new Map(
        layout.connections.map((connection) => [
          connection.id,
          { wire: routeOf(layout, connection), packet: routeOf(layout, connection, PACKET_HEIGHT) },
        ]),
      ),
    [layout],
  );

  const wireState = (id: string, from: string, to: string): WireState =>
    flows.get(id) ?? (dimmed.has(from) || dimmed.has(to) ? "dimmed" : "idle");

  return (
    <>
      {layout.connections.map((connection) => (
        <ConnectionWire
          key={connection.id}
          points={routes.get(connection.id)!.wire}
          state={wireState(connection.id, connection.from, connection.to)}
          dashed={connection.style === "dashed"}
          hidden={connection.hidden}
          channel={channels?.wires[connection.id]}
        />
      ))}
      {layout.components.map((component) => (
        <ComponentNode
          key={component.id}
          component={component}
          emphasis={dimmed.has(component.id) ? "dimmed" : "normal"}
          selected={selectedId === component.id}
          hovered={hoveredId === component.id}
          channel={channels?.components[component.id]}
          smooth={smooth}
          onSelect={onSelect}
          onHover={onHover}
        />
      ))}
      {channels?.packets.map((packet) => {
        const route = routes.get(packet.connection);
        return route ? (
          <Packet
            key={packet.id}
            channel={packet}
            route={route.packet}
            onInspect={onInspectMessage}
          />
        ) : null;
      })}
    </>
  );
}
