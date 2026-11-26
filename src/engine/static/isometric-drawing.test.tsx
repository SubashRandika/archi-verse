import { render, screen } from "@testing-library/react";
import type { SceneLayout } from "@/lib/scene-spec";
import { roleColor, SCENE_PALETTES } from "../scene/palette";
import { IsometricDrawing } from "./isometric-drawing";

const layout: SceneLayout = {
  components: [
    { id: "app", kind: "client", label: "App", role: "Client", position: [0, 0, 0] },
    {
      id: "hop",
      kind: "hop",
      label: "Net",
      role: "Network",
      position: [2, 0, 0],
      decorative: true,
    },
    { id: "db", kind: "database", label: "Database", role: "Store", position: [4, 0, 0] },
  ],
  connections: [
    { id: "app-db", from: "app", to: "db" },
    { id: "app-db-cache", from: "app", to: "db", style: "dashed" },
    { id: "secret", from: "app", to: "db", hidden: true },
  ],
};

describe("IsometricDrawing", () => {
  it("draws every component, labels the non-decorative ones and skips hidden connections", () => {
    const { container } = render(
      <IsometricDrawing layout={layout} theme="dark" label="The scene" />,
    );

    expect(screen.getByRole("img", { name: "The scene" })).toBeInTheDocument();
    expect([...container.querySelectorAll("text")].map((text) => text.textContent)).toEqual([
      "App",
      "Database",
    ]);
    const wires = container.querySelectorAll("polyline");
    expect(wires).toHaveLength(2);
    expect(wires[1]).toHaveAttribute("stroke-dasharray", "3 4");
  });

  it("dims what is outside the step's focus", () => {
    const { container } = render(
      <IsometricDrawing layout={layout} theme="dark" focus={["db"]} label="The scene" />,
    );
    const label = (name: string) =>
      [...container.querySelectorAll("text")].find((text) => text.textContent === name);

    expect(label("Database")).toHaveClass("fill-paper");
    expect(label("App")).toHaveClass("fill-graphite");
  });

  it("colours parts by kind and theme", () => {
    for (const theme of ["dark", "light"] as const) {
      const { container, unmount } = render(
        <IsometricDrawing layout={layout} theme={theme} label="The scene" />,
      );
      const fills = new Set(
        [...container.querySelectorAll("polygon, path, ellipse")].map((shape) =>
          shape.getAttribute("fill"),
        ),
      );
      expect(fills, theme).toContain(roleColor(SCENE_PALETTES[theme], "client", "body"));
      expect(fills, theme).toContain(roleColor(SCENE_PALETTES[theme], "database", "body"));
      expect(fills, theme).toContain(SCENE_PALETTES[theme].screen);
      unmount();
    }
  });

  it("dims unfocused components", () => {
    const { container } = render(
      <IsometricDrawing layout={layout} theme="light" focus={["db"]} label="The scene" />,
    );
    const group = (id: string) => container.querySelector(`g[data-component="${id}"]`);

    expect(group("app")).toHaveAttribute("opacity", "0.35");
    expect(group("hop")).toHaveAttribute("opacity", "0.35");
    expect(group("db")).not.toHaveAttribute("opacity");
  });
});
