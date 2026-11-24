import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderInStudio } from "@/test/render";
import { PlaybackDock } from "./playback-dock";

const controls = () => screen.getByRole("region", { name: "Playback controls" });
const currentStepTitle = () =>
  within(screen.getByRole("list", { name: "Timeline" })).getByRole("button", { current: "step" });

describe("PlaybackDock", () => {
  it("starts on step 2 of 12", () => {
    renderInStudio(<PlaybackDock />);
    expect(within(controls()).getByText("Step 2 of 12")).toBeInTheDocument();
    expect(currentStepTitle()).toHaveAccessibleName("Step 2: Anatomy of an HTTP request");
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
    renderInStudio(<PlaybackDock />, { initialStepIndex: 0 });

    expect(screen.getByRole("button", { name: "Previous step" })).toBeDisabled();
    await user.click(screen.getByRole("button", { name: "Next step" }));
    expect(currentStepTitle()).toHaveAccessibleName("Step 2: Anatomy of an HTTP request");

    await user.click(screen.getByRole("button", { name: "Step 12: The full lifecycle" }));
    expect(screen.getByRole("button", { name: "Next step" })).toBeDisabled();
    expect(controls()).toHaveTextContent("The return trip");
  });

  it("restarts from the first step", async () => {
    const user = userEvent.setup();
    renderInStudio(<PlaybackDock />, { initialStepIndex: 6 });

    await user.click(screen.getByRole("button", { name: "Restart" }));

    expect(currentStepTitle()).toHaveAccessibleName("Step 1: Meet the client");
  });

  it("changes the playback speed", async () => {
    const user = userEvent.setup();
    renderInStudio(<PlaybackDock />);

    await user.click(screen.getByRole("button", { name: "Playback speed, 1×" }));
    await user.click(await screen.findByRole("menuitemradio", { name: "2×" }));

    expect(screen.getByRole("button", { name: "Playback speed, 2×" })).toBeInTheDocument();
  });
});
