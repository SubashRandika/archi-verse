import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { usePreferencesStore } from "@/features/preferences/preferences-store";
import { useProgressStore } from "@/features/progress/progress-store";
import { apiGatewayText } from "@/test/module-text";
import { renderInStudio } from "@/test/render";
import { PlaybackDock } from "@/features/playback/playback-dock";
import { InspectorPanel } from "./inspector-panel";

const inspector = () => <InspectorPanel text={apiGatewayText} />;

describe("InspectorPanel", () => {
  it("explains the step in simple words with a real-life example, by default", () => {
    renderInStudio(inspector());
    expect(screen.getByText("Step 1 of 12")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "Meet the client" })).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "In simple words" })).toHaveTextContent(
      /This is the browser/,
    );
    expect(screen.getByRole("region", { name: "Like in real life" })).toHaveTextContent(/pizza/);
    expect(screen.getByText(/Everything else waits for it to ask/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Beginner" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("folds the words to know until asked", async () => {
    const user = userEvent.setup();
    renderInStudio(inspector());
    const toggle = screen.getByRole("button", { name: "Words to know (3)" });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("region", { name: "Words to know" })).not.toBeInTheDocument();

    await user.click(toggle);

    expect(screen.getByRole("region", { name: "Words to know" })).toHaveTextContent(
      "CORS preflight",
    );
  });

  it("switches to the advanced explanation and its example without changing the step", async () => {
    const user = userEvent.setup();
    renderInStudio(inspector());

    await user.click(screen.getByRole("button", { name: "Advanced" }));

    expect(screen.getByRole("region", { name: "How it works" })).toHaveTextContent(
      /not a CORS “simple request”/,
    );
    expect(screen.getByRole("region", { name: "Example" })).toHaveTextContent(
      "Access-Control-Max-Age: 600",
    );
    expect(screen.getByRole("heading", { level: 2, name: "Meet the client" })).toBeInTheDocument();
  });

  it("switches to Sinhala, keeping technical terms in English", async () => {
    const user = userEvent.setup();
    renderInStudio(inspector(), { initialStepIndex: 4 });

    await user.click(screen.getByRole("button", { name: "සිංහල" }));

    expect(usePreferencesStore.getState().locale).toBe("si");
    expect(screen.getByRole("complementary")).toHaveAttribute("lang", "si");
    expect(screen.getByRole("region", { name: "සරලව කිව්වොත්" })).toHaveTextContent(
      /gateway එක ඔබේ අවසර පත්‍රය පරීක්ෂා කරනවා/,
    );
    await user.click(screen.getByRole("button", { name: "දැනගන්න ඕන වචන (4)" }));
    expect(screen.getByRole("region", { name: "දැනගන්න ඕන වචන" })).toHaveTextContent("JWKS");
  });

  it("shows the real message on request", async () => {
    const user = userEvent.setup();
    renderInStudio(inspector(), { initialStepIndex: 6 });

    await user.click(screen.getByRole("button", { name: "Show the real message" }));

    const message = screen.getByRole("region", { name: "Message in flight" });
    expect(message).toHaveTextContent("The request the gateway forwards to Orders");
    expect(message).toHaveTextContent("X-User-Id: u_7f3a");
  });

  it("opens a part from the step and goes back to the step", async () => {
    const user = userEvent.setup();
    renderInStudio(inspector(), { initialStepIndex: 4 });
    const parts = screen.getByRole("region", { name: "Parts in this step" });
    expect(within(parts).queryByRole("button", { name: /Internet/ })).not.toBeInTheDocument();

    await user.click(within(parts).getByRole("button", { name: "Identity provider" }));

    expect(
      screen.getByRole("heading", { level: 2, name: "Identity provider" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "Like in real life" })).toHaveTextContent(
      /ticket office/,
    );
    expect(screen.getByRole("region", { name: "What it does" })).toBeInTheDocument();

    // Advanced shows the technical details of the same part.
    await user.click(screen.getByRole("button", { name: "Advanced" }));
    expect(screen.getByText("Keycloak")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Back to step 5" }));
    expect(screen.getByRole("heading", { level: 2, name: "Authentication" })).toBeInTheDocument();
  });

  it("offers a scenario and completion at the end of the main path", async () => {
    const user = userEvent.setup();
    renderInStudio(inspector(), { initialStepIndex: 11 });
    const finish = screen.getByRole("region", {
      name: "You’ve followed a request from start to finish",
    });

    await user.click(within(finish).getByRole("button", { name: /^Completed/ }));
    expect(useProgressStore.getState().concepts["api-gateway"]?.status).toBe("completed");

    await user.click(
      within(finish).getByRole("button", { name: "Try a scenario: 401 Unauthorized" }),
    );
    expect(screen.getByText("Scenario: 401 Unauthorized · Step 1 of 3")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "An expired token arrives" }),
    ).toBeInTheDocument();
  });

  it("offers the next scenario or the way back at the end of a scenario", async () => {
    const user = userEvent.setup();
    renderInStudio(
      <>
        <PlaybackDock />
        {inspector()}
      </>,
      { initialStepIndex: 11 },
    );
    const timeline = () => screen.getByRole("list", { name: "Timeline" });
    const endOfScenario = () => screen.getByRole("region", { name: "End of this scenario" });

    await user.click(screen.getByRole("button", { name: "Try a scenario: 401 Unauthorized" }));
    expect(screen.queryByRole("region", { name: "End of this scenario" })).not.toBeInTheDocument();

    await user.click(within(timeline()).getByRole("button", { name: /^Step 3:/ }));
    await user.click(
      within(endOfScenario()).getByRole("button", {
        name: "Next scenario: 429 Too Many Requests",
      }),
    );
    expect(screen.getByRole("heading", { level: 2, name: "A burst of requests" })).toBeVisible();

    await user.click(within(timeline()).getByRole("button", { name: /^Step 3:/ }));
    await user.click(
      within(endOfScenario()).getByRole("button", { name: "Back to the main path" }),
    );
    // 429 branches from step 6, Rate limiting.
    expect(screen.getByRole("heading", { level: 2, name: "Rate limiting" })).toBeVisible();
  });

  it("does not allow both levels to be deselected", async () => {
    const user = userEvent.setup();
    renderInStudio(inspector());

    await user.click(screen.getByRole("button", { name: "Beginner" }));

    expect(screen.getByRole("button", { name: "Beginner" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });
});
