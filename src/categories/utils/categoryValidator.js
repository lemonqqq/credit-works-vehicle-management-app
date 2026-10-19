import { useCategory } from "./useCategory";

let valid = false;
let modified = false;

const twoDecimals = (value) =>
  Number.isFinite(value) &&
  Math.abs(Math.round(value * 100) - value * 100) <= 1e-8;

export const categoryValidator = {
  validate(item) {
    const errors = [];
    if (!item?.name?.trim()) errors.push("name");
    if (!item?.iconKey?.trim()) errors.push("icon");
    const min = Number(item?.minWeightKg ?? item?.minWeight);
    const maxRaw = item?.maxWeightKg ?? item?.maxWeight;
    const max = maxRaw == null || maxRaw === "" ? null : Number(maxRaw);
    if (
      (item?.minWeightKg == null && item?.minWeight == null) ||
      !twoDecimals(min) ||
      min < 0
    )
      errors.push("minimum weight");
    if (max !== null && (!twoDecimals(max) || max <= min))
      errors.push("maximum weight");
    return errors.length ? `Invalid ${errors.join(", ")}` : null;
  },

  validateWithList(item) {
    const list = useCategory
      .getDraft()
      .filter((x) => x.id !== item.id)
      .concat(item)
      .map((x) => ({ ...x, invalid: false, validationMessage: "" }))
      .sort(
        (a, b) =>
          Number(a.minWeightKg ?? a.minWeight) -
          Number(b.minWeightKg ?? b.minWeight),
      );
    let expected = 0;
    const names = new Set();
    for (const [index, category] of list.entries()) {
      const ownError = this.validate(category);
      const min = Number(category.minWeightKg ?? category.minWeight);
      const rawMax = category.maxWeightKg ?? category.maxWeight;
      const max = rawMax == null || rawMax === "" ? null : Number(rawMax);
      let message = ownError;
      if (!message && names.has(category.name.trim().toLowerCase()))
        message = "Duplicate category name";
      if (!message && min > expected)
        message = `Missing weight between ${expected} and ${min} kg`;
      if (!message && min < expected) message = "Overlap weight";
      if (!message && max === null && index !== list.length - 1)
        message = "Only final category may have an open upper limit";
      if (!message && max !== null && index === list.length - 1)
        message = "Final category needs an open upper limit";
      category.invalid = Boolean(message);
      category.validationMessage = message ?? "";
      names.add(category.name?.trim().toLowerCase());
      if (max !== null) expected = max;
    }
    useCategory.setDraft(list);
    valid = list.length > 0 && list.every((x) => !x.invalid);
    modified = true;
  },
  isValid: () => valid,
  isModified: () => modified,
};
