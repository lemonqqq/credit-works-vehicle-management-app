import { expect, test } from "@playwright/test";

test("vehicle filters and pagination send one request with the selected values", async ({
  page,
}) => {
  const searches = [];
  await page.route("**/api/categories/list", (route) =>
    route.fulfill({
      json: [
        {
          id: "medium",
          name: "Medium",
          minWeightKg: 500,
          maxWeightKg: 2500,
          iconKey: "van",
        },
      ],
    }),
  );
  await page.route("**/api/vehicles/search?*", (route) => {
    const query = new URL(route.request().url()).searchParams;
    searches.push(Object.fromEntries(query));
    return route.fulfill({
      json: {
        data: [],
        pageNumber: Number(query.get("pageNumber") ?? 1),
        totalRecords: 30,
      },
    });
  });

  await page.goto("/");
  await expect(page.getByText("All vehicles")).toBeVisible();
  await expect(page.getByText("0 of 30 records")).toBeVisible();
  searches.length = 0;

  await page.getByPlaceholder("Search owner").fill("Alex");
  await page
    .locator(".vehicle-list-filters select")
    .nth(0)
    .selectOption("medium");
  await page
    .locator(".vehicle-list-filters select")
    .nth(1)
    .selectOption("Mazda");
  await page
    .locator(".vehicle-list-filters select")
    .nth(2)
    .selectOption("2020");
  await expect.poll(() => searches.length).toBe(0);
  await page.getByRole("button", { name: "Search", exact: true }).click();
  await expect.poll(() => searches.length).toBe(1);
  expect(searches[0]).toEqual({
    ownerName: "Alex",
    year: "2020",
    manufacturerName: "Mazda",
    minWeightKg: "500",
    maxWeightKg: "2500",
    pageNumber: "1",
  });

  await page.locator(".vehicle-list-footer button").last().click();
  await expect.poll(() => searches.length).toBe(2);
  expect(searches[1]).toEqual({ ...searches[0], pageNumber: "2" });
});
