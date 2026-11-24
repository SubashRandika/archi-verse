import { CATEGORY_ICONS, categories } from "./categories";

describe("categories catalog", () => {
  it("contains the 16 roadmap categories in order", () => {
    expect(categories).toHaveLength(16);
    expect(categories.map((category) => category.order)).toEqual(
      Array.from({ length: 16 }, (_, index) => index + 1),
    );
  });

  it("uses unique kebab-case ids", () => {
    const ids = categories.map((category) => category.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
  });

  it("assigns every category a distinct icon key", () => {
    const icons = categories.map((category) => category.icon);
    expect(new Set(icons).size).toBe(CATEGORY_ICONS.length);
  });
});
