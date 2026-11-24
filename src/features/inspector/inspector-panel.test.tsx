import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderInStudio } from "@/test/render";
import { InspectorPanel } from "./inspector-panel";

describe("InspectorPanel", () => {
  it("shows the beginner explanation of the current step by default", () => {
    renderInStudio(<InspectorPanel />);
    expect(
      screen.getByRole("heading", { level: 2, name: "Anatomy of an HTTP request" }),
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
      screen.getByRole("heading", { level: 2, name: "Anatomy of an HTTP request" }),
    ).toBeInTheDocument();
  });

  it("keeps the selected tab when the explanation level changes", async () => {
    const user = userEvent.setup();
    renderInStudio(<InspectorPanel />);

    await user.click(screen.getByRole("tab", { name: "Component" }));
    expect(screen.getByText(/front door of the system/)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Advanced" }));

    expect(screen.getByRole("tab", { name: "Component" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText(/A reverse proxy/)).toBeInTheDocument();
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

  it("shows a pointer to finished content for steps without an explanation yet", () => {
    renderInStudio(<InspectorPanel />, { initialStepIndex: 5 });
    expect(screen.getByRole("heading", { level: 2, name: "Rate limiting" })).toBeInTheDocument();
    expect(screen.getByText(/written with the API Gateway module/)).toBeInTheDocument();
  });
});
