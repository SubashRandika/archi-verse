import { render, screen } from "@testing-library/react";
import HomePage from "./page";

describe("HomePage (Phase 1 placeholder)", () => {
  it("renders the product name as the page heading", () => {
    render(<HomePage />);
    expect(screen.getByRole("heading", { level: 1, name: "Archiverse" })).toBeInTheDocument();
  });
});
