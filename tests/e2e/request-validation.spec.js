import { expect, test } from "@playwright/test";

const baseUrl = process.env.API_BASE_URL;

test.describe("API request validation", () => {
  test.skip(
    !baseUrl,
    "Set API_BASE_URL to a running API. These requests do not need a disposable database.",
  );

  const valid = () => ({
    ownerName: "Alex Smith",
    manufacturer: "Mazda",
    year: 2020,
    vin: "ABC12345678901234",
    registrationNumber: "ABC123",
    weightKg: 1850.75,
  });

  for (const [field, value] of [
    ["ownerName", ""],
    ["manufacturer", ""],
    ["year", 0],
    ["vin", "short"],
    ["registrationNumber", "TOOLONG"],
    ["weightKg", 0],
    ["weightKg", 1.001],
  ]) {
    test(`POST /api/vehicles rejects invalid ${field}: ${value}`, async ({
      request,
    }) => {
      const response = await request.post(`${baseUrl}/api/vehicles`, {
        data: { ...valid(), [field]: value },
      });
      expect(response.status()).toBe(400);
      const problem = await response.json();
      expect(problem.errors ?? problem.detail ?? problem.title).toBeTruthy();
      expect(JSON.stringify(problem)).not.toMatch(
        /SqlException|connection string|stack trace/i,
      );
    });
  }

  test("PUT /api/vehicles/{id} validates the body before queueing", async ({
    request,
  }) => {
    const response = await request.put(
      `${baseUrl}/api/vehicles/ffffffff-ffff-4fff-8fff-ffffffffffff`,
      {
        data: { ...valid(), weightKg: -1 },
      },
    );
    expect(response.status()).toBe(400);
  });

  test("GET /api/vehicles/search rejects an invalid year", async ({
    request,
  }) => {
    const response = await request.get(
      `${baseUrl}/api/vehicles/search?year=1999`,
    );
    expect(response.status()).toBe(400);
  });
});
