import { beforeEach, describe, expect, it } from "vitest";
import { categoryValidator } from "./categoryValidator";
import { categoryService } from "../categoryService";

const initial = () => [
  {
    id: "light",
    name: "Light",
    minWeightKg: 0,
    maxWeightKg: 500,
    iconKey: "car",
  },
  {
    id: "medium",
    name: "Medium",
    minWeightKg: 500,
    maxWeightKg: 2500,
    iconKey: "van",
  },
  {
    id: "heavy",
    name: "Heavy",
    minWeightKg: 2500,
    maxWeightKg: null,
    iconKey: "truck",
  },
];

describe("category data validation", () => {
  beforeEach(() => categoryService.setDraft(initial()));

  it("accepts a complete set of adjacent ranges", () => {
    categoryValidator.validateWithList(initial()[1]);
    expect(categoryValidator.isValid()).toBe(true);
  });

  it.each([
    [{ ...initial()[1], minWeightKg: 600 }, /missing|gap/i],
    [{ ...initial()[1], minWeightKg: 400 }, /overlap/i],
    [{ ...initial()[2], maxWeightKg: 5000 }, /open|upper|limit/i],
  ])("rejects an invalid range", (changed, message) => {
    categoryValidator.validateWithList(changed);
    expect(categoryValidator.isValid()).toBe(false);
    expect(
      categoryService
        .getDraft()
        .some((item) => message.test(item.validationMessage ?? "")),
    ).toBe(true);
  });

  it("accepts a zero lower bound and open final upper bound", () => {
    expect(categoryValidator.validate(initial()[0])).toBeNull();
    expect(categoryValidator.validate(initial()[2])).toBeNull();
  });

  it("rejects missing name and icon", () => {
    expect(
      categoryValidator.validate({ ...initial()[1], name: " ", iconKey: "" }),
    ).toMatch(/name.*icon/i);
  });

  it("rejects a missing minimum weight", () => {
    expect(
      categoryValidator.validate({
        name: "Medium",
        iconKey: "van",
        maxWeightKg: 2500,
      }),
    ).toMatch(/minimum weight/i);
  });

  it.each([
    [{ ...initial()[0], minWeightKg: -0.01 }, /minimum/i],
    [{ ...initial()[1], maxWeightKg: 500 }, /maximum/i],
    [{ ...initial()[1], minWeightKg: 500.001 }, /minimum/i],
    [{ ...initial()[1], maxWeightKg: 2500.001 }, /maximum/i],
  ])("rejects invalid category bounds", (category, message) => {
    expect(categoryValidator.validate(category)).toMatch(message);
  });

  it("rejects category names that differ only by case and surrounding space", () => {
    categoryValidator.validateWithList({ ...initial()[1], name: " light " });
    expect(categoryValidator.isValid()).toBe(false);
    expect(
      categoryService
        .getDraft()
        .some((x) => /duplicate/i.test(x.validationMessage)),
    ).toBe(true);
  });
});
