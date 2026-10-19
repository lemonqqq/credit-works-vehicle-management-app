import { afterEach, describe, expect, it, vi } from "vitest";
import { categoriesApi, vehiclesApi } from "./api";

afterEach(() => vi.unstubAllGlobals());

describe("API client", () => {
  it("search_WhenFiltersProvided_ThenSendsGetWithQueryParameters", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue({ ok: true, status: 200, json: async () => [] });
    vi.stubGlobal("fetch", fetchMock);

    await vehiclesApi.search({
      ownerName: "Alex Smith",
      year: 2020,
      vin: null,
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/vehicles/search?ownerName=Alex+Smith&year=2020",
      expect.objectContaining({ method: "GET", body: undefined }),
    );
  });

  it("search_WhenSignalProvided_ThenPassesCancellationToFetch", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ data: [] }),
    });
    vi.stubGlobal("fetch", fetchMock);
    const controller = new AbortController();
    await vehiclesApi.search({ year: 2020 }, controller.signal);
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/vehicles/search?year=2020",
      expect.objectContaining({
        method: "GET",
        signal: controller.signal,
        body: undefined,
      }),
    );
  });

  it("create_WhenVehicleProvided_ThenSendsJsonRequest", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 201,
      json: async () => ({ id: "new-id" }),
    });
    vi.stubGlobal("fetch", fetchMock);
    const vehicle = {
      ownerName: "Alex Smith",
      manufacturerId: "mazda-id",
      year: 2020,
      weightKg: 1850.75,
    };

    await expect(vehiclesApi.create(vehicle)).resolves.toEqual({
      id: "new-id",
    });
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/vehicles",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify(vehicle),
        headers: { "Content-Type": "application/json" },
      }),
    );
  });

  it("get_WhenIdProvided_ThenRequestsThatVehicle", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 200,
      json: async () => ({ id: "vehicle-id" }) });
    vi.stubGlobal("fetch", fetchMock);
    await expect(vehiclesApi.get("vehicle-id")).resolves.toEqual({ id: "vehicle-id" });
    expect(fetchMock).toHaveBeenCalledWith("/api/vehicles/vehicle-id",
      expect.objectContaining({ method: "GET", body: undefined }));
  });

  it("update_WhenVehicleProvided_ThenSendsPutWithJson", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 202,
      json: async () => "queue-id" });
    vi.stubGlobal("fetch", fetchMock);
    const vehicle = { ownerName: "Alex Smith", weightKg: 420.5 };
    await vehiclesApi.update("vehicle-id", vehicle);
    expect(fetchMock).toHaveBeenCalledWith("/api/vehicles/vehicle-id",
      expect.objectContaining({ method: "PUT", body: JSON.stringify(vehicle) }));
  });

  it("list_WhenLoaded_ThenUsesCurrentCategoryRouteWithoutCache", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 200,
      json: async () => [] });
    vi.stubGlobal("fetch", fetchMock);
    await categoriesApi.list();
    expect(fetchMock).toHaveBeenCalledWith("/api/categories/list",
      expect.objectContaining({ method: "GET", cache: "no-store" }));
  });

  it("confirm_WhenCategoryInvalid_ThenReturnsValidationError", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 400,
        json: async () => ({ error: "Category ranges overlap" }),
      }),
    );
    await expect(
      categoriesApi.confirm({ categories: [{ name: "Overlap" }] }),
    ).rejects.toThrow("Category ranges overlap");
  });

  it("create_WhenProblemDetailsReturned_ThenSurfacesValidationText", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 400,
        json: async () => ({
          title: "Validation failed",
          detail: "Weight must be positive",
        }),
      }),
    );
    await expect(vehiclesApi.create({ weightKg: 0 })).rejects.toThrow(
      "Weight must be positive",
    );
  });

  it("confirm_WhenConfigurationProvided_ThenSendsPatchRequest", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 202,
      json: async () => ({ queueId: "one" }),
    });
    vi.stubGlobal("fetch", fetchMock);
    const categories = [
      { name: "Light", minWeightKg: 0, maxWeightKg: null, iconKey: "car" },
    ];
    await categoriesApi.confirm(categories);
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/categories",
      expect.objectContaining({
        method: "PATCH",
        body: JSON.stringify({ categories }),
      }),
    );
  });

  it("create_WhenServerReturnsModelErrors_ThenSurfacesRequestValidation", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 400,
        json: async () => ({
          title: "One or more validation errors occurred.",
          errors: { WeightKg: ["Weight must be positive"] },
        }),
      }),
    );
    await expect(vehiclesApi.create({ weightKg: -1 })).rejects.toThrow(
      "Weight must be positive",
    );
  });
});
