import { expect, test } from "@playwright/test";

const baseUrl = process.env.API_BASE_URL;
test.skip(
  !baseUrl || process.env.E2E_TEST_DATABASE !== "1",
  "Requires a running API backed by an isolated disposable database.",
);

const endpoint = (path) => `${baseUrl}${path}`;

async function waitForQueue(request, id) {
  for (let attempt = 0; attempt < 30; attempt++) {
    const response = await request.get(endpoint(`/api/request/${id}`));
    expect(response.ok()).toBeTruthy();
    const { state } = await response.json();
    if (state === "succeeded" || state === "failed") return state;
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error(`Queue ${id} did not finish`);
}

test("seeded SQL data has the required categories, boundaries and paged vehicles", async ({
  request,
}) => {
  const categories = await (
    await request.get(endpoint("/api/categories/list"))
  ).json();
  expect(
    categories.map(({ name, minWeightKg, maxWeightKg }) => ({
      name,
      minWeightKg,
      maxWeightKg,
    })),
  ).toEqual([
    { name: "Light", minWeightKg: 0, maxWeightKg: 500 },
    { name: "Medium", minWeightKg: 500, maxWeightKg: 2500 },
    { name: "Heavy", minWeightKg: 2500, maxWeightKg: null },
  ]);

  const first = await (
    await request.get(endpoint("/api/vehicles/search?pageNumber=1"))
  ).json();
  const second = await (
    await request.get(endpoint("/api/vehicles/search?pageNumber=2"))
  ).json();
  expect(first.totalRecords).toBeGreaterThanOrEqual(20);
  expect(first.data).toHaveLength(10);
  expect(second.data).toHaveLength(10);
  const vehicles = [...first.data, ...second.data];
  for (const weight of [499.99, 500, 2499.99, 2500]) {
    const vehicle = vehicles.find((item) => item.weightKg === weight);
    expect(vehicle).toBeTruthy();
    const matches = categories.filter(
      (item) =>
        weight >= item.minWeightKg &&
        (item.maxWeightKg === null || weight < item.maxWeightKg),
    );
    expect(matches).toHaveLength(1);
  }
});

test("a vehicle can be created with the four fields required by the brief", async ({
  request,
}) => {
  const response = await request.post(endpoint("/api/vehicles"), {
    data: {
      ownerName: "Assessment",
      manufacturer: "Mazda",
      year: 2020,
      weightKg: 1850.75,
    },
  });
  expect(response.status()).toBe(202);
  expect(await waitForQueue(request, await response.json())).toBe("succeeded");
});

test("a valid queued vehicle write persists and can be updated", async ({
  request,
}) => {
  const suffix = crypto.randomUUID().replaceAll("-", "").toUpperCase();
  const vehicle = {
    ownerName: "Assessment",
    manufacturer: "Mazda",
    year: 2020,
    vin: suffix.slice(0, 17),
    registrationNumber: suffix.slice(0, 6),
    weightKg: 1850.75,
  };
  const created = await request.post(endpoint("/api/vehicles"), {
    data: vehicle,
  });
  expect(created.status()).toBe(202);
  expect(await waitForQueue(request, await created.json())).toBe("succeeded");
  const result = await (
    await request.get(endpoint("/api/vehicles/search?ownerName=Assessment"))
  ).json();
  const saved = result.data.find((item) => item.vin === vehicle.vin);
  expect(saved).toMatchObject({
    ownerName: vehicle.ownerName,
    weightKg: vehicle.weightKg,
  });

  const updated = await request.put(endpoint(`/api/vehicles/${saved.id}`), {
    data: { ...vehicle, weightKg: 2050 },
  });
  expect(updated.status()).toBe(202);
  expect(await waitForQueue(request, await updated.json())).toBe("succeeded");
  const read = await (
    await request.get(endpoint(`/api/vehicles/${saved.id}`))
  ).json();
  expect(read.weightKg).toBe(2050);
});

test("category gaps and overlaps are rejected without changing the database", async ({
  request,
}) => {
  const original = await (
    await request.get(endpoint("/api/categories/list"))
  ).json();
  const medium = original.find((item) => item.name === "Medium");
  for (const minWeightKg of [400, 600]) {
    const proposal = original.map((item) =>
      item.id === medium.id ? { ...item, minWeightKg } : item,
    );
    const response = await request.patch(endpoint("/api/categories"), {
      data: { categories: proposal },
    });
    expect([400, 409, 202]).toContain(response.status());
    if (response.status() === 202) {
      expect(await waitForQueue(request, await response.json())).toBe("failed");
    }
    expect(
      await (await request.get(endpoint("/api/categories/list"))).json(),
    ).toEqual(original);
  }
});

test("vehicle weight sorting orders the full result before paging", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Vehicles", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Weight (kg)" }).click();
  await page.getByRole("button", { name: "Descending (Z-A)" }).click();
  const pageOneLast = Number(
    (
      await page
        .locator(".vehicle-list-section tbody tr")
        .last()
        .locator("td")
        .nth(4)
        .innerText()
    ).replace(" kg", ""),
  );
  await page.locator(".vehicle-list-footer button").last().click();
  await expect(page.locator(".vehicle-list-footer")).toContainText("2");
  const pageTwoFirst = Number(
    (
      await page
        .locator(".vehicle-list-section tbody tr")
        .first()
        .locator("td")
        .nth(4)
        .innerText()
    ).replace(" kg", ""),
  );
  expect(pageOneLast).toBeGreaterThanOrEqual(pageTwoFirst);
});

test("vehicle category display updates after a valid range change", async ({
  request,
  page,
}) => {
  const original = await (
    await request.get(endpoint("/api/categories/list"))
  ).json();
  const changed = original.map((item) =>
    item.name === "Medium"
      ? { ...item, maxWeightKg: 2000 }
      : item.name === "Heavy"
        ? { ...item, minWeightKg: 2000 }
        : item,
  );
  try {
    const response = await request.patch(endpoint("/api/categories"), {
      data: { categories: changed },
    });
    expect(response.status()).toBe(202);
    expect(await waitForQueue(request, await response.json())).toBe(
      "succeeded",
    );
    await page.goto("/");
    await page.getByPlaceholder("Search owner").fill("Liam");
    await page.getByRole("button", { name: "Search", exact: true }).click();
    await expect(page.getByRole("row", { name: /Liam Roberts/ })).toContainText(
      "Heavy",
    );
  } finally {
    const response = await request.patch(endpoint("/api/categories"), {
      data: { categories: original },
    });
    if (response.status() === 202)
      await waitForQueue(request, await response.json());
  }
});

test("category edit can be saved from the browser", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Categories", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Vehicle categories" }),
  ).toBeVisible();
  await page
    .locator(".category-list-section tbody tr")
    .first()
    .getByRole("button")
    .first()
    .click();
  await expect(
    page.getByRole("button", { name: "Update", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Update", exact: true }).click();
  await expect(page.locator(".category-list-section")).toBeVisible();
});
