import { expect, test } from "@playwright/test";

const apiBaseUrl = process.env.API_BASE_URL;
const disposableDatabase = process.env.E2E_TEST_DATABASE === "1";
const path = (route) => `${apiBaseUrl}${route}`;
const rows = (body) => (Array.isArray(body) ? body : body.data);
const categoryName = (vehicle) =>
  vehicle.category?.name ?? vehicle.categoryName;

test.describe("SQL-backed API requirements", () => {
  test.skip(
    !apiBaseUrl,
    "Set API_BASE_URL to a running API backed by a disposable SQL Server database.",
  );
  test.describe.configure({ mode: "serial" });

  test("returns five predefined manufacturers and continuous seeded categories", async ({
    request,
  }) => {
    const manufacturers = await request.get(path("/api/manufacturers"));
    expect(manufacturers.ok()).toBeTruthy();
    expect(rows(await manufacturers.json()).map((item) => item.name)).toEqual(
      expect.arrayContaining([
        "Mazda",
        "Mercedes",
        "Honda",
        "Ferrari",
        "Toyota",
      ]),
    );

    const response = await request.get(path("/api/categories"));
    expect(response.ok()).toBeTruthy();
    const categories = rows(await response.json());
    expect(categories.map((item) => item.name)).toEqual([
      "Light",
      "Medium",
      "Heavy",
    ]);
    expect(categories[0].minWeightKg).toBe(0);
    expect(categories[0].maxWeightKg).toBe(categories[1].minWeightKg);
    expect(categories[1].maxWeightKg).toBe(categories[2].minWeightKg);
    expect(categories[2].maxWeightKg).toBeNull();
    expect(categories.every((item) => item.iconKey)).toBeTruthy();
  });

  test("classifies exact boundary weights once and sorts on all required fields", async ({
    request,
  }) => {
    const response = await request.get(path("/api/vehicles/list"));
    expect(response.ok()).toBeTruthy();
    const vehicles = rows(await response.json());
    for (const [weight, name] of [
      [499.99, "Light"],
      [500, "Medium"],
      [2499.99, "Medium"],
      [2500, "Heavy"],
    ]) {
      expect(
        vehicles.some(
          (vehicle) =>
            vehicle.weightKg === weight && categoryName(vehicle) === name,
        ),
      ).toBe(true);
    }
    for (const field of ["ownerName", "manufacturer", "year", "weightKg"]) {
      for (const direction of ["asc", "desc"]) {
        const sortedResponse = await request.get(
          path(`/api/vehicles/list?sortBy=${field}&direction=${direction}`),
        );
        expect(sortedResponse.ok()).toBeTruthy();
        const sorted = rows(await sortedResponse.json());
        const values = sorted.map((vehicle) =>
          field === "manufacturer"
            ? (vehicle.manufacturer?.name ?? vehicle.manufacturer)
            : vehicle[field],
        );
        const expected = [...values].sort((a, b) =>
          typeof a === "string" ? a.localeCompare(b) : a - b,
        );
        if (direction === "desc") expected.reverse();
        expect(values).toEqual(expected);
      }
    }
  });

  test("returns a safe not-found response for missing vehicles", async ({
    request,
  }) => {
    const response = await request.get(
      path("/api/vehicles/ffffffff-ffff-4fff-8fff-ffffffffffff"),
    );
    expect(response.status()).toBe(404);
    expect(await response.text()).not.toMatch(
      /stack trace|SqlException|connection string/i,
    );
  });

  test("rejects invalid vehicle data on the server", async ({ request }) => {
    const cases = [
      { ownerName: "", manufacturer: "Mazda", year: 2020, weightKg: 100 },
      { ownerName: "Test", manufacturer: "", year: 2020, weightKg: 100 },
      { ownerName: "Test", manufacturer: "Unknown", year: 2020, weightKg: 100 },
      {
        ownerName: "Test",
        manufacturer: "Mazda' OR 1=1 --",
        year: 2020,
        weightKg: 100,
      },
      { ownerName: "Test", manufacturer: "Mazda", year: 0, weightKg: 100 },
      { ownerName: "Test", manufacturer: "Mazda", year: 2020, weightKg: 0 },
      { ownerName: "Test", manufacturer: "Mazda", year: 2020, weightKg: -1 },
      { ownerName: "Test", manufacturer: "Mazda", year: 2020, weightKg: 1.001 },
    ];
    for (const body of cases) {
      const response = await request.post(path("/api/vehicles"), {
        data: body,
      });
      expect([400, 422]).toContain(response.status());
      expect(await response.text()).not.toMatch(
        /stack trace|SqlException|connection string/i,
      );
    }
  });

  test("creates and reads a vehicle using only required assignment fields", async ({
    request,
  }) => {
    test.skip(
      !disposableDatabase,
      "Set E2E_TEST_DATABASE=1 only for an isolated disposable database.",
    );
    const ownerName = `E2E ${Date.now()}`;
    const response = await request.post(path("/api/vehicles"), {
      data: {
        ownerName,
        manufacturer: "Mazda",
        year: 2020,
        weightKg: 1850.75,
      },
    });
    expect(response.status()).toBe(201);
    const created = await response.json();
    expect(created.id).toBeTruthy();
    expect(categoryName(created)).toBe("Medium");
    const read = await request.get(path(`/api/vehicles/${created.id}`));
    expect(read.ok()).toBeTruthy();
    expect(await read.json()).toMatchObject({
      id: created.id,
      ownerName,
      weightKg: 1850.75,
    });
  });

  test("rejects invalid category edits and recalculates existing vehicles after an atomic boundary change", async ({
    request,
  }) => {
    test.skip(
      !disposableDatabase,
      "Set E2E_TEST_DATABASE=1 only for an isolated disposable database.",
    );
    const categoriesResponse = await request.get(path("/api/categories"));
    const original = rows(await categoriesResponse.json());
    const medium = original.find((item) => item.name === "Medium");
    const heavy = original.find((item) => item.name === "Heavy");
    const overlap = original.map((item) =>
      item.id === medium.id ? { ...item, minWeightKg: 400 } : item,
    );
    const gap = original.map((item) =>
      item.id === medium.id ? { ...item, minWeightKg: 600 } : item,
    );
    const missingFinalRange = original.map((item) =>
      item.id === heavy.id ? { ...item, maxWeightKg: 5000 } : item,
    );
    const missingIcon = original.map((item) =>
      item.id === medium.id ? { ...item, iconKey: "" } : item,
    );
    const duplicateName = original.map((item) =>
      item.id === medium.id ? { ...item, name: "Light" } : item,
    );
    for (const proposal of [
      overlap,
      gap,
      missingFinalRange,
      missingIcon,
      duplicateName,
    ]) {
      const response = await request.put(
        path("/api/categories/configuration"),
        { data: { categories: proposal } },
      );
      expect([400, 409, 422]).toContain(response.status());
    }
    const deleteResponse = await request.delete(
      path(`/api/categories/${heavy.id}`),
    );
    expect([400, 409, 422]).toContain(deleteResponse.status());
    const changed = original.map((item) =>
      item.id === medium.id
        ? { ...item, maxWeightKg: 2000 }
        : item.id === heavy.id
          ? { ...item, minWeightKg: 2000 }
          : item,
    );
    try {
      const update = await request.put(path("/api/categories/configuration"), {
        data: { categories: changed },
      });
      expect(update.ok()).toBeTruthy();
      const list = await request.get(path("/api/vehicles/list"));
      const vehicle = rows(await list.json()).find(
        (item) => item.weightKg === 2200,
      );
      expect(categoryName(vehicle)).toBe("Heavy");
    } finally {
      const restore = await request.put(path("/api/categories/configuration"), {
        data: { categories: original },
      });
      expect(restore.ok()).toBeTruthy();
    }
  });

  test("creates, edits and deletes a category while preserving complete coverage", async ({
    request,
  }) => {
    test.skip(
      !disposableDatabase,
      "Set E2E_TEST_DATABASE=1 only for an isolated disposable database.",
    );
    const original = rows(
      await (await request.get(path("/api/categories"))).json(),
    );
    const heavy = original.find((item) => item.name === "Heavy");
    const newId = crypto.randomUUID();
    const split = original.map((item) =>
      item.id === heavy.id ? { ...item, maxWeightKg: 5000 } : item,
    );
    split.push({
      id: newId,
      name: "Super Heavy",
      description: "Above 5000 kg",
      minWeightKg: 5000,
      maxWeightKg: null,
      iconKey: "truck",
    });
    try {
      const create = await request.put(path("/api/categories/configuration"), {
        data: { categories: split },
      });
      expect(create.ok()).toBeTruthy();
      expect(
        rows(await (await request.get(path("/api/categories"))).json()).some(
          (item) => item.name === "Super Heavy",
        ),
      ).toBe(true);

      const edited = split.map((item) =>
        item.id === newId
          ? { ...item, name: "Extra Heavy", iconKey: "van" }
          : item,
      );
      const edit = await request.put(path("/api/categories/configuration"), {
        data: { categories: edited },
      });
      expect(edit.ok()).toBeTruthy();
      expect(
        rows(await (await request.get(path("/api/categories"))).json()).some(
          (item) => item.name === "Extra Heavy" && item.iconKey === "van",
        ),
      ).toBe(true);
    } finally {
      const deleteViaConfiguration = await request.put(
        path("/api/categories/configuration"),
        { data: { categories: original } },
      );
      expect(deleteViaConfiguration.ok()).toBeTruthy();
      expect(
        rows(await (await request.get(path("/api/categories"))).json()).some(
          (item) => item.id === newId,
        ),
      ).toBe(false);
    }
  });
});
