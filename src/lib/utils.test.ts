import { cn } from "./utils";

describe("cn", () => {
  it("joins conditional class names and drops falsy values", () => {
    const hidden = false;
    expect(cn("a", hidden && "b", undefined, "c")).toBe("a c");
  });

  it("resolves conflicting Tailwind utilities in favour of the last one", () => {
    expect(cn("px-2 text-sm", "px-4")).toBe("text-sm px-4");
  });
});
