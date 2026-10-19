import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { vehiclesApi } from "../../services/api";
import { useCategory } from "../../categories/utils/useCategory";
import { useVehicle } from "./useVehicles";

vi.mock("../../services/api", () => ({
  vehiclesApi: { create: vi.fn(), update: vi.fn(), search: vi.fn(), get: vi.fn() },
  categoriesApi: {},
}));

const vehicle = {
  id: "existing-id",
  ownerName: "Amelia WilsonTEST",
  manufacturer: "Mazda",
  year: "2018",
  registrationNumber: "CW0001",
  vin: "CWMZD000000000001",
  weightKg: "420.50",
};

describe("vehicle request mapping", () => {
  beforeEach(() => vi.clearAllMocks());
  afterEach(() => vi.restoreAllMocks());

  it("sends the displayed weight when updating an existing vehicle", async () => {
    await useVehicle.update(vehicle);
    expect(vehiclesApi.update).toHaveBeenCalledWith(
      "existing-id",
      expect.objectContaining({ weightKg: 420.5, year: 2018 }),
    );
  });

  it("sends a numeric weight when creating a vehicle", async () => {
    await useVehicle.create({ ...vehicle, id: undefined });
    expect(vehiclesApi.create).toHaveBeenCalledWith(
      expect.objectContaining({ weightKg: 420.5, year: 2018 }),
    );
  });

  it("maps category, owner, manufacturer, year and page filters to the search request", async () => {
    vi.spyOn(useCategory, "get").mockReturnValue({ minWeightKg: 500, maxWeightKg: 2500 });
    vehiclesApi.search.mockResolvedValue({ data: [], pageCount: 2, totalRecords: 0 });
    const signal = new AbortController().signal;
    await useVehicle.search({ ownerName: "Alex", manufacturer: "Mazda", year: 2020,
      category: "medium", pageNumber: 2 }, signal);
    expect(vehiclesApi.search).toHaveBeenCalledWith({
      ownerName: "Alex", manufacturerName: "Mazda", year: 2020,
      minWeightKg: 500, maxWeightKg: 2500, pageNumber: 2,
    }, signal);
  });

  it("fetches an existing vehicle by id", async () => {
    vehiclesApi.get.mockResolvedValue(vehicle);
    expect(await useVehicle.get("existing-id")).toEqual(vehicle);
    expect(vehiclesApi.get).toHaveBeenCalledWith("existing-id", undefined);
  });
});
