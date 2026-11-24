import { act, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { InspectorPanel } from "@/features/inspector/inspector-panel";
import { PROGRESS_STORAGE_KEY, useProgressStore } from "@/features/progress/progress-store";
import { apiGatewayLabels, apiGatewayText } from "@/test/module-text";
import { renderInStudio } from "@/test/render";
import { Studio } from "./studio";

const currentStep = () =>
  within(screen.getByRole("list", { name: "Timeline" })).getByRole("button", { current: "step" });

function renderStudio(options?: Parameters<typeof renderInStudio>[1]) {
  return renderInStudio(
    <>
      <Studio labels={apiGatewayLabels} />
      <InspectorPanel text={apiGatewayText} />
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
    expect(currentStep()).toHaveAccessibleName("Step 2: Anatomy of an HTTP request");
  });

  it("supports keyboard shortcuts outside of form controls and widgets", async () => {
    const user = userEvent.setup();
    renderStudio();
    const studio = screen.getByRole("main");
    studio.focus();

    await user.keyboard("{ArrowRight}");
    expect(currentStep()).toHaveAccessibleName("Step 2: Anatomy of an HTTP request");
    await user.keyboard("{ArrowRight}");
    expect(currentStep()).toHaveAccessibleName("Step 3: Across the network");
    await user.keyboard("{ArrowLeft}");
    expect(currentStep()).toHaveAccessibleName("Step 2: Anatomy of an HTTP request");
    await user.keyboard("r");
    expect(currentStep()).toHaveAccessibleName("Step 1: Meet the client");
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
    // Selecting opens the part's details in the explanation panel.
    expect(screen.getByRole("heading", { level: 2, name: "API Gateway" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Back to step 1" })).toBeInTheDocument();

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
      lastStepId: "anatomy-of-a-request",
    });
  });

  it("resumes at the learner's last step once saved progress loads", async () => {
    localStorage.setItem(
      PROGRESS_STORAGE_KEY,
      JSON.stringify({
        version: 1,
        state: {
          concepts: {
            "api-gateway": {
              status: "in-progress",
              updatedAt: "2026-11-24T10:00:00Z",
              lastStepId: "rate-limiting",
            },
          },
        },
      }),
    );
    renderStudio();
    expect(currentStep()).toHaveAccessibleName("Step 1: Meet the client");

    await act(() => useProgressStore.persist.rehydrate());

    expect(currentStep()).toHaveAccessibleName("Step 6: Rate limiting");
    expect(screen.getByRole("button", { name: "Play" })).toBeInTheDocument();
  });
});
