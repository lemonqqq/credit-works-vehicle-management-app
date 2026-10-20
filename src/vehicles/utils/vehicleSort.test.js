import { describe, expect, it } from "vitest";
import { sortVehicles } from "./vehicleSort";

const vehicles = [
  { ownerName: "Zoe", manufacturer: "Toyota", year: 2022, weightKg: 2500 },
  { ownerName: "Alex", manufacturer: "Mazda", year: 2018, weightKg: 499.99 },
  { ownerName: "Mia", manufacturer: "Honda", year: 2020, weightKg: 500 },
];

describe("vehicle sorting", () => {
  it.each([
    ["ownerName", ["Alex", "Mia", "Zoe"]],
    ["manufacturer", ["Mia", "Alex", "Zoe"]],
    ["year", ["Alex", "Mia", "Zoe"]],
    ["weightKg", ["Alex", "Mia", "Zoe"]],
  ])(
    "sorts by %s in both directions without mutating the input",
    (field, owners) => {
      expect(sortVehicles(vehicles, field).map((x) => x.ownerName)).toEqual(
        owners,
      );
      expect(
        sortVehicles(vehicles, field, false).map((x) => x.ownerName),
      ).toEqual([...owners].reverse());
      expect(vehicles.map((x) => x.ownerName)).toEqual(["Zoe", "Alex", "Mia"]);
    },
  );
});
