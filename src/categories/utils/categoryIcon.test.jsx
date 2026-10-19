import { afterEach, describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { categoriesApi } from "../../services/api";
import { useCategory } from "./useCategory";
import { categoryIcon } from "./categoryIcon";

const categories = [
  { id: "light", name: "Light", minWeightKg: 0, maxWeightKg: 500, iconKey: "car" },
  { id: "medium", name: "Medium", minWeightKg: 500, maxWeightKg: 2500, iconKey: "van" },
  { id: "heavy", name: "Heavy", minWeightKg: 2500, maxWeightKg: null, iconKey: "truck" },
];

afterEach(() => vi.restoreAllMocks());

describe("current category determination", () => {
  it.each([
    [0.01, "Light"], [499.99, "Light"], [500, "Medium"],
    [2499.99, "Medium"], [2500, "Heavy"], [5000, "Heavy"],
  ])("places %s kg in %s exactly once", async (weight, expected) => {
    vi.spyOn(categoriesApi, "list").mockResolvedValue(categories);
    await useCategory.load();
    const html = renderToStaticMarkup(categoryIcon.getSection(null, weight));
    expect(html).toContain(expected);
    expect(categories.filter((x) => weight >= x.minWeightKg &&
      (x.maxWeightKg === null || weight < x.maxWeightKg))).toHaveLength(1);
  });

  it("reclassifies an existing weight after the ranges are reloaded", async () => {
    const list = vi.spyOn(categoriesApi, "list");
    list.mockResolvedValueOnce(categories).mockResolvedValueOnce([
      categories[0],
      { ...categories[1], maxWeightKg: 2000 },
      { ...categories[2], minWeightKg: 2000 },
    ]);
    await useCategory.load();
    expect(renderToStaticMarkup(categoryIcon.getSection(null, 2200))).toContain("Medium");
    await useCategory.load();
    expect(renderToStaticMarkup(categoryIcon.getSection(null, 2200))).toContain("Heavy");
  });
});
