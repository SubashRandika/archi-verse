import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PlannedConceptInspector } from "@/features/inspector/planned-concept-inspector";
import { useProgressStore } from "@/features/progress/progress-store";
import { renderInStudio } from "@/test/render";
import { PlannedConceptStudio } from "./planned-concept-studio";

describe("PlannedConceptStudio", () => {
  it("explains the concept and that its visualization is planned", () => {
    renderInStudio(<PlannedConceptStudio />, { conceptSlug: "cap-theorem" });

    expect(screen.getByRole("heading", { level: 1, name: "CAP Theorem" })).toBeInTheDocument();
    expect(screen.getByText(/must choose between staying consistent/)).toBeInTheDocument();
    expect(screen.getByText(/visualization for this concept is planned/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Open API Gateway" })).toHaveAttribute(
      "href",
      "/learn/api-gateway",
    );
    // Guided/Explore only exists for concepts with a module.
    expect(screen.queryByRole("group", { name: "Learning mode" })).not.toBeInTheDocument();
  });

  it("lists every category a shared concept belongs to", () => {
    renderInStudio(<PlannedConceptStudio />, { conceptSlug: "circuit-breaker" });
    const categoryList = screen.getByText("Part of these categories").closest("dl");
    expect(categoryList).not.toBeNull();
    expect(
      within(categoryList as HTMLElement)
        .getAllByRole("definition")
        .map((item) => item.textContent),
    ).toEqual([
      "API Integration & Communication Architecture",
      "Resilience, Reliability & Fault Tolerance",
    ]);
  });

  it("marks the concept completed and back", async () => {
    const user = userEvent.setup();
    renderInStudio(<PlannedConceptStudio />, { conceptSlug: "cap-theorem" });
    const toggle = screen.getByRole("button", { name: "Completed" });

    expect(toggle).toHaveAttribute("aria-pressed", "false");
    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-pressed", "true");
    expect(useProgressStore.getState().concepts["cap-theorem"]?.status).toBe("completed");

    await user.click(toggle);
    expect(useProgressStore.getState().concepts["cap-theorem"]).toBeUndefined();
  });
});

describe("PlannedConceptInspector", () => {
  it("shows the summary, alternative names and related concepts", () => {
    renderInStudio(<PlannedConceptInspector />, { conceptSlug: "server-sent-events" });

    expect(
      screen.getByRole("heading", { level: 2, name: "Server-Sent Events (SSE)" }),
    ).toBeInTheDocument();
    expect(screen.getByText("EventSource")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "WebSockets" })).toHaveAttribute(
      "href",
      "/learn/websockets",
    );
  });
});
