import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderInStudio } from "@/test/render";
import { Sidebar } from "./sidebar";

const categoryButton = (name: RegExp) => screen.getByRole("button", { name });

describe("Sidebar", () => {
  it("lists all 16 categories with their progress", () => {
    renderInStudio(<Sidebar />);
    const nav = screen.getByRole("navigation", { name: "Learning navigation" });
    const categoryToggles = within(nav)
      .getAllByRole("button")
      .filter((button) => button.hasAttribute("aria-expanded"));
    expect(categoryToggles).toHaveLength(16);
    expect(categoryButton(/^Security Architecture/)).toHaveTextContent("0/18");
  });

  it("expands the current category and marks the current concept", () => {
    renderInStudio(<Sidebar />);
    expect(categoryButton(/^API Integration/)).toHaveAttribute("aria-expanded", "true");
    const current = screen.getByText("API Gateway").closest("li");
    expect(current).toHaveAttribute("aria-current", "page");
  });

  it("toggles a category open and closed", async () => {
    const user = userEvent.setup();
    renderInStudio(<Sidebar />);
    const caching = categoryButton(/^Caching Architecture/);

    await user.click(caching);
    expect(caching).toHaveAttribute("aria-expanded", "true");
    await user.click(caching);
    expect(caching).toHaveAttribute("aria-expanded", "false");
  });

  it("filters categories and concepts by search text", async () => {
    const user = userEvent.setup();
    renderInStudio(<Sidebar />);

    await user.type(screen.getByRole("searchbox", { name: /search/i }), "idempot");

    expect(categoryButton(/^API Integration/)).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("Idempotency")).toBeInTheDocument();
    expect(screen.queryByText("GraphQL")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /^Security Architecture/ }),
    ).not.toBeInTheDocument();
  });

  it("explains what to do when nothing matches, and clears the search", async () => {
    const user = userEvent.setup();
    renderInStudio(<Sidebar />);

    await user.type(screen.getByRole("searchbox", { name: /search/i }), "kubernetes operator");
    expect(screen.getByText(/Nothing matches/)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Clear search" }));
    expect(screen.getByRole("searchbox", { name: /search/i })).toHaveValue("");
    expect(categoryButton(/^Security Architecture/)).toBeInTheDocument();
  });

  it("renders the icon rail when collapsed on desktop", async () => {
    const user = userEvent.setup();
    const { shell } = renderInStudio(<Sidebar />, { shell: { sidebarCollapsed: true } });

    expect(screen.queryByRole("searchbox")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Caching Architecture" }));
    expect(shell.openSidebar).toHaveBeenCalledOnce();
  });
});
