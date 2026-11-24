import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useProgressStore } from "@/features/progress/progress-store";
import { apiGatewayText } from "@/test/module-text";
import { renderInStudio } from "@/test/render";
import { InspectorPanel } from "./inspector-panel";

const inspector = () => <InspectorPanel text={apiGatewayText} />;

describe("InspectorPanel", () => {
  it("shows the beginner explanation and terms of the current step by default", () => {
    renderInStudio(inspector());
    expect(screen.getByRole("heading", { level: 2, name: "Meet the client" })).toBeInTheDocument();
    expect(screen.getByText(/The browser is where the story starts/)).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "Terms" })).toHaveTextContent("CORS preflight");
    expect(screen.getByRole("button", { name: "Beginner" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("switches to the advanced explanation without changing the step", async () => {
    const user = userEvent.setup();
    renderInStudio(inspector());

    await user.click(screen.getByRole("button", { name: "Advanced" }));

    expect(screen.getByText(/not a CORS “simple request”/)).toBeInTheDocument();
    expect(screen.queryByText(/The browser is where the story starts/)).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "Meet the client" })).toBeInTheDocument();
  });

  it("shows the message in flight for the step", () => {
    renderInStudio(inspector(), { initialStepIndex: 6 });
    const message = screen.getByRole("region", { name: "Message in flight" });
    expect(message).toHaveTextContent("The request the gateway forwards to Orders");
    expect(message).toHaveTextContent("X-User-Id: u_7f3a");
  });

  it("lists the scene's components (not scenery) until one is selected", async () => {
    const user = userEvent.setup();
    renderInStudio(inspector());

    await user.click(screen.getByRole("tab", { name: "Component" }));
    expect(screen.getByText(/Select a component in the scene/)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Internet/ })).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /Identity provider/ }));
    expect(
      screen.getByRole("heading", { level: 2, name: "Identity provider" }),
    ).toBeInTheDocument();
    expect(screen.getByText(/issues passes after you sign in/)).toBeInTheDocument();
    expect(screen.getByText("Keycloak")).toBeInTheDocument();
  });

  it("keeps the selected tab when the explanation level changes", async () => {
    const user = userEvent.setup();
    renderInStudio(inspector());

    await user.click(screen.getByRole("tab", { name: "Component" }));
    await user.click(screen.getByRole("button", { name: /API gateway/ }));
    await user.click(screen.getByRole("button", { name: "Advanced" }));

    expect(screen.getByRole("tab", { name: "Component" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText(/A reverse proxy that acts/)).toBeInTheDocument();
  });

  it("offers the scenarios and completion at the end of the main path", async () => {
    const user = userEvent.setup();
    renderInStudio(inspector(), { initialStepIndex: 11 });
    const finish = screen.getByRole("region", {
      name: "You’ve followed a request from start to finish",
    });

    expect(within(finish).getAllByRole("button", { name: /\d{3}|Timeout/ })).toHaveLength(4);
    await user.click(within(finish).getByRole("button", { name: /^Completed/ }));
    expect(useProgressStore.getState().concepts["api-gateway"]?.status).toBe("completed");

    await user.click(within(finish).getByRole("button", { name: /^429 Too Many Requests/ }));
    expect(screen.getByText("Scenario: 429 Too Many Requests")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "A burst of requests" }),
    ).toBeInTheDocument();
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
