import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { InspectorPanel } from "@/features/inspector/inspector-panel";
import { useProgressStore } from "@/features/progress/progress-store";
import { renderInStudio } from "@/test/render";
import { Studio } from "./studio";

const currentStep = () =>
  within(screen.getByRole("list", { name: "Timeline" })).getByRole("button", { current: "step" });

function renderStudio(options?: Parameters<typeof renderInStudio>[1]) {
  return renderInStudio(
    <>
      <Studio />
      <InspectorPanel />
    </>,
    options,
  );
}

describe("Studio (without WebGL)", () => {
  it("falls back to the static drawing and keeps steps working", async () => {
    const user = userEvent.setup();
    renderStudio();

    expect(screen.getByRole("note")).toHaveTextContent(/can’t show the 3D view/);

    // Playing has no animation to wait for: the step finishes at once.
    await user.click(screen.getByRole("button", { name: "Play" }));
    expect(screen.getByRole("button", { name: "Play" })).toBeInTheDocument();

    // Playing again moves on to the next step.
    await user.click(screen.getByRole("button", { name: "Play" }));
    expect(currentStep()).toHaveAccessibleName("Step 2: The gateway checks and routes it");
  });

  it("supports keyboard shortcuts outside of form controls and widgets", async () => {
    const user = userEvent.setup();
    renderStudio();
    const studio = screen.getByRole("main");
    studio.focus();

    await user.keyboard("{ArrowRight}");
    expect(currentStep()).toHaveAccessibleName("Step 2: The gateway checks and routes it");
    await user.keyboard("{ArrowRight}");
    expect(currentStep()).toHaveAccessibleName("Step 3: The response flows back");
    await user.keyboard("{ArrowLeft}");
    expect(currentStep()).toHaveAccessibleName("Step 2: The gateway checks and routes it");
    await user.keyboard("r");
    expect(currentStep()).toHaveAccessibleName("Step 1: The request leaves the browser");
  });

  it("selects components from the scene outline, in sync with the inspector", async () => {
    const user = userEvent.setup();
    renderStudio();
    const outline = screen.getByRole("navigation", { name: "Scene components" });

    await user.click(within(outline).getByRole("button", { name: /API gateway/ }));

    expect(within(outline).getByRole("button", { name: /API gateway/ })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    // Selecting opens the component's details.
    expect(screen.getByRole("tab", { name: "Component" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("heading", { level: 2, name: "API Gateway" })).toBeInTheDocument();

    // Escape clears the selection (focus back on the studio, not on a widget).
    screen.getByRole("main").focus();
    await user.keyboard("{Escape}");
    expect(within(outline).getByRole("button", { name: /API gateway/ })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });

  it("marks the concept in progress once the learner plays a step", async () => {
    await useProgressStore.persist.rehydrate();
    const user = userEvent.setup();
    renderStudio();
    expect(useProgressStore.getState().concepts["api-gateway"]).toBeUndefined();

    await user.click(screen.getByRole("button", { name: "Next step" }));

    expect(useProgressStore.getState().concepts["api-gateway"]).toMatchObject({
      status: "in-progress",
      lastStepId: "gateway-routes-the-request",
    });
  });
});
