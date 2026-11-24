import { act, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useProgressStore } from "@/features/progress/progress-store";
import { renderInStudio } from "@/test/render";
import { Sidebar } from "./sidebar";

const nav = () => screen.getByRole("navigation", { name: "Learning navigation" });
const categoryButton = (name: RegExp) => within(nav()).getByRole("button", { name });
const search = () => screen.getByRole("searchbox", { name: /search/i });

describe("Sidebar", () => {
  it("lists all 16 categories with their concept counts", () => {
    renderInStudio(<Sidebar />);
    const toggles = within(nav())
      .getAllByRole("button")
      .filter(
        (button) => button.hasAttribute("aria-expanded") && !button.hasAttribute("aria-haspopup"),
      );
    expect(toggles).toHaveLength(16);
    expect(categoryButton(/^Security Architecture/)).toHaveTextContent("0/18");
    expect(screen.getByText("0 of 291")).toBeInTheDocument();
  });

  it("expands the current concept's category and links every concept", () => {
    renderInStudio(<Sidebar />, { conceptSlug: "etag" });
    expect(categoryButton(/^Caching Architecture/)).toHaveAttribute("aria-expanded", "true");
    const current = screen.getByRole("link", { name: /^ETag/ });
    expect(current).toHaveAttribute("href", "/learn/etag");
    expect(current).toHaveAttribute("aria-current", "page");
  });

  it("toggles a category open and closed", async () => {
    const user = userEvent.setup();
    renderInStudio(<Sidebar />);
    const caching = categoryButton(/^Caching Architecture/);

    await user.click(caching);
    expect(caching).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("link", { name: /^Stale-While-Revalidate/ })).toBeInTheDocument();
    await user.click(caching);
    expect(caching).toHaveAttribute("aria-expanded", "false");
  });

  it("reflects saved progress in rows, category counts and the total", () => {
    renderInStudio(<Sidebar />);
    act(() => {
      useProgressStore.getState().markCompleted("api-gateway");
      useProgressStore.getState().markCompleted("graphql");
    });

    expect(screen.getByRole("link", { name: /^GraphQL, Completed/ })).toBeInTheDocument();
    expect(categoryButton(/^API Integration/)).toHaveTextContent("2/17");
    // API Gateway is shared with the backend category, so it counts there too.
    expect(categoryButton(/^Backend & Distributed/)).toHaveTextContent("1/26");
    expect(screen.getByText("2 of 291")).toBeInTheDocument();
  });

  it("searches titles and keywords and shows the number of matches", async () => {
    const user = userEvent.setup();
    renderInStudio(<Sidebar />);

    await user.type(search(), "kafka");

    expect(screen.getByRole("link", { name: /^Apache Kafka/ })).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("1 concept");
    expect(
      screen.queryByRole("button", { name: /^Security Architecture/ }),
    ).not.toBeInTheDocument();
  });

  it("explains what to do when nothing matches, and clears the filters", async () => {
    const user = userEvent.setup();
    renderInStudio(<Sidebar />);

    await user.type(search(), "quantum blockchain");
    expect(screen.getByText(/Nothing matches these filters/)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Clear filters" }));
    expect(search()).toHaveValue("");
    expect(categoryButton(/^Security Architecture/)).toBeInTheDocument();
  });

  it("filters by status", async () => {
    const user = userEvent.setup();
    renderInStudio(<Sidebar />);
    act(() => useProgressStore.getState().markCompleted("jwt"));

    await user.click(screen.getByRole("button", { name: "Filter concepts" }));
    await user.click(await screen.findByRole("menuitemradio", { name: "Completed" }));

    const links = within(nav()).getAllByRole("link");
    expect(links.map((link) => link.getAttribute("href"))).toEqual(["/learn/jwt"]);
  });

  it("focuses search when / is pressed", async () => {
    const user = userEvent.setup();
    renderInStudio(<Sidebar />);
    await user.keyboard("/");
    expect(search()).toHaveFocus();
  });

  it("resets progress after confirmation", async () => {
    const user = userEvent.setup();
    renderInStudio(<Sidebar />);
    act(() => useProgressStore.getState().markCompleted("jwt"));

    await user.click(screen.getByRole("button", { name: "Progress options" }));
    await user.click(await screen.findByRole("menuitem", { name: "Reset progress…" }));
    const dialog = await screen.findByRole("alertdialog", { name: "Reset all progress?" });
    await user.click(within(dialog).getByRole("button", { name: "Reset progress" }));

    expect(useProgressStore.getState().concepts).toEqual({});
    expect(screen.getByText("0 of 291")).toBeInTheDocument();
  });

  it("renders the icon rail when collapsed on desktop", async () => {
    const user = userEvent.setup();
    const { shell } = renderInStudio(<Sidebar />, { shell: { sidebarCollapsed: true } });

    expect(screen.queryByRole("searchbox")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Caching Architecture" }));
    expect(shell.openSidebar).toHaveBeenCalledOnce();
  });
});
