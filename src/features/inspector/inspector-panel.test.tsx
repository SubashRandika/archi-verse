import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderInStudio } from "@/test/render";
import { InspectorPanel } from "./inspector-panel";

describe("InspectorPanel", () => {
  it("shows the beginner explanation of the current step by default", () => {
    renderInStudio(<InspectorPanel />);
    expect(
      screen.getByRole("heading", { level: 2, name: "The request leaves the browser" }),
    ).toBeInTheDocument();
    expect(screen.getByText(/Think of it as a letter/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Beginner" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("switches to the advanced explanation without changing the step", async () => {
    const user = userEvent.setup();
    renderInStudio(<InspectorPanel />);

    await user.click(screen.getByRole("button", { name: "Advanced" }));

    expect(screen.getByText(/pseudo-headers/)).toBeInTheDocument();
    expect(screen.queryByText(/Think of it as a letter/)).not.toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "The request leaves the browser" }),
    ).toBeInTheDocument();
  });

  it("explains the step the learner is on", () => {
    renderInStudio(<InspectorPanel />, { initialStepIndex: 1 });
    expect(
      screen.getByRole("heading", { level: 2, name: "The gateway checks and routes it" }),
    ).toBeInTheDocument();
    expect(screen.getByText(/front desk/)).toBeInTheDocument();
  });

  it("lists the scene's components until one is selected", async () => {
    const user = userEvent.setup();
    renderInStudio(<InspectorPanel />);

    await user.click(screen.getByRole("tab", { name: "Component" }));
    expect(screen.getByText(/Select a component in the scene/)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /API gateway/ }));
    expect(screen.getByRole("heading", { level: 2, name: "API Gateway" })).toBeInTheDocument();
    expect(screen.getByText(/front door of the system/)).toBeInTheDocument();
  });

  it("keeps the selected tab when the explanation level changes", async () => {
    const user = userEvent.setup();
    renderInStudio(<InspectorPanel />);

    await user.click(screen.getByRole("tab", { name: "Component" }));
    await user.click(screen.getByRole("button", { name: /API gateway/ }));
    await user.click(screen.getByRole("button", { name: "Advanced" }));

    expect(screen.getByRole("tab", { name: "Component" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText(/A reverse proxy/)).toBeInTheDocument();
  });

  it("shows name and role for components without full documentation yet", async () => {
    const user = userEvent.setup();
    renderInStudio(<InspectorPanel />);

    await user.click(screen.getByRole("tab", { name: "Component" }));
    await user.click(screen.getByRole("button", { name: /Orders database/ }));

    expect(screen.getByRole("heading", { level: 2, name: "Orders database" })).toBeInTheDocument();
    expect(screen.getByText("Data store")).toBeInTheDocument();
  });

  it("does not allow both levels to be deselected", async () => {
    const user = userEvent.setup();
    renderInStudio(<InspectorPanel />);

    await user.click(screen.getByRole("button", { name: "Beginner" }));

    expect(screen.getByRole("button", { name: "Beginner" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });
});
