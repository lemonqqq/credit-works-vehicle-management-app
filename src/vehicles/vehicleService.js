import { categoryService } from "../categories/categoryService";
import { vehiclesApi } from "../services/api";

let vehicles = [];

const search = async (filters, signal) => {
  const category =
    filters.category == null ? null : categoryService.get(filters.category);
  const list = await vehiclesApi.search(
    {
      ownerName: filters.ownerName,
      year: filters.year,
      manufacturerName: filters.manufacturer,
      minWeightKg: category?.minWeightKg,
      maxWeightKg: category?.maxWeightKg,
      pageNumber: filters.pageNumber,
    },
    signal,
  );
  vehicles = list;
  return list;
};

const create = (vehicle) => {
  return vehiclesApi.create({
    ownerName: vehicle.ownerName,
    manufacturer: vehicle.manufacturer,
    year: Number(vehicle.year),
    vin: vehicle.vin,
    registrationNumber: vehicle.registrationNumber,
    weightKg: Number(vehicle.weightKg),
  });
};

const update = (vehicle) => {
  return vehiclesApi.update(vehicle.id, {
    ownerName: vehicle.ownerName,
    manufacturer: vehicle.manufacturer,
    year: Number(vehicle.year),
    vin: vehicle.vin,
    registrationNumber: vehicle.registrationNumber,
    weightKg: Number(vehicle.weightKg),
  });
};

const get = (id, signal) => vehiclesApi.get(id, signal);

export const vehicleService = {
  search: (filters, signal) => search(filters, signal),
  get: (id, signal) => get(id, signal),
  getList: () => vehicles,
  create: (vehicle) => create(vehicle),
  update: (vehicle) => update(vehicle),
};
