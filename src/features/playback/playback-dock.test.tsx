import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderInStudio } from "@/test/render";
import { PlaybackDock } from "./playback-dock";

const controls = () => screen.getByRole("region", { name: "Playback controls" });
const currentStepTitle = () =>
  within(screen.getByRole("list", { name: "Timeline" })).getByRole("button", { current: "step" });

describe("PlaybackDock", () => {
  it("starts on the first step of the module", () => {
    renderInStudio(<PlaybackDock />);
    expect(within(controls()).getByText("Step 1 of 3")).toBeInTheDocument();
    expect(currentStepTitle()).toHaveAccessibleName("Step 1: The request leaves the browser");
    expect(screen.getByRole("list", { name: "Timeline" })).toHaveTextContent(
      /The request.*The gateway.*The return trip/,
    );
  });

  it("toggles between play and pause", async () => {
    const user = userEvent.setup();
    renderInStudio(<PlaybackDock />);

    await user.click(screen.getByRole("button", { name: "Play" }));
    expect(screen.getByRole("button", { name: "Pause" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Pause" }));
    expect(screen.getByRole("button", { name: "Play" })).toBeInTheDocument();
  });

  it("moves between steps and disables navigation at the ends", async () => {
    const user = userEvent.setup();
    renderInStudio(<PlaybackDock />);

    expect(screen.getByRole("button", { name: "Previous step" })).toBeDisabled();
    await user.click(screen.getByRole("button", { name: "Next step" }));
    expect(currentStepTitle()).toHaveAccessibleName("Step 2: The gateway checks and routes it");

    await user.click(screen.getByRole("button", { name: "Step 3: The response flows back" }));
    expect(screen.getByRole("button", { name: "Next step" })).toBeDisabled();
    expect(controls()).toHaveTextContent("The return trip");
  });

  it("plays a step when navigating to it", async () => {
    const user = userEvent.setup();
    renderInStudio(<PlaybackDock />);
    await user.click(screen.getByRole("button", { name: "Next step" }));
    expect(screen.getByRole("button", { name: "Pause" })).toBeInTheDocument();
  });

  it("restarts from the first step", async () => {
    const user = userEvent.setup();
    renderInStudio(<PlaybackDock />, { initialStepIndex: 2 });

    await user.click(screen.getByRole("button", { name: "Restart" }));

    expect(currentStepTitle()).toHaveAccessibleName("Step 1: The request leaves the browser");
  });

  it("shows the current step's progress track", () => {
    renderInStudio(<PlaybackDock />);
    expect(within(currentStepTitle()).getByTestId("step-progress")).toHaveStyle({
      transform: "scaleX(0)",
    });
  });

  it("changes the playback speed", async () => {
    const user = userEvent.setup();
    renderInStudio(<PlaybackDock />);

    await user.click(screen.getByRole("button", { name: "Playback speed, 1×" }));
    await user.click(await screen.findByRole("menuitemradio", { name: "2×" }));

    expect(screen.getByRole("button", { name: "Playback speed, 2×" })).toBeInTheDocument();
  });
});
