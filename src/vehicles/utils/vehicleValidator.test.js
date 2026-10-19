import { describe, expect, it } from "vitest";
import { vehicleValidator } from "./vehicleValidator";

const valid = () => ({
  ownerName: "Alex Smith",
  manufacturer: "Mazda",
  year: 2020,
  vin: "ABC12345678901234",
  registrationNumber: "ABC123",
  weightKg: 1850.75,
});

describe("vehicle data validation", () => {
  it("accepts a complete vehicle", () =>
    expect(vehicleValidator.validate(valid())).toBeNull());

  it.each([
    [{ ownerName: " " }, /owner/i],
    [{ manufacturer: "" }, /manufacturer/i],
    [{ year: 0 }, /year/i],
    [{ weightKg: 0 }, /weight/i],
    [{ weightKg: -1 }, /weight/i],
    [{ weightKg: 1.001 }, /weight/i],
    [{ weightKg: "" }, /weight/i],
    [{ weightKg: "abc" }, /weight/i],
    [{ year: "not-a-year" }, /year/i],
    [{ year: 3000 }, /year/i],
    [{ vin: "short" }, /vin/i],
    [{ registrationNumber: "TOOLONG" }, /registration/i],
  ])("rejects invalid vehicle data", (change, message) => {
    expect(vehicleValidator.validate({ ...valid(), ...change })).toMatch(
      message,
    );
  });

  it("accepts the displayed two-decimal weight as a string", () => {
    expect(
      vehicleValidator.validate({ ...valid(), weightKg: "420.50" }),
    ).toBeNull();
  });

  it("accepts the smallest valid positive weight", () => {
    expect(vehicleValidator.validate({ ...valid(), weightKg: 0.01 })).toBeNull();
  });
});
