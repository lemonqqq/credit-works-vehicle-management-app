const currentYear = () => new Date().getUTCFullYear();

export const vehicleValidator = {
  validate(vehicle) {
    if (vehicle === null) return null;
    const errors = [];
    if (!vehicle?.ownerName?.trim()) errors.push("owner name");
    if (!vehicle?.manufacturer?.trim()) errors.push("manufacturer");
    const year = Number(vehicle?.year);
    if (!Number.isInteger(year) || year < 2000 || year > currentYear() + 1)
      errors.push("year");
    if (!/^[a-zA-Z0-9]{1,6}$/.test(vehicle?.registrationNumber ?? ""))
      errors.push("registration number");
    if (!/^[a-zA-Z0-9]{17}$/.test(vehicle?.vin ?? "")) errors.push("VIN");
    const weight = Number(vehicle?.weightKg);
    if (
      !Number.isFinite(weight) ||
      weight <= 0 ||
      Math.abs(Math.round(weight * 100) - weight * 100) > 1e-8
    )
      errors.push("weight");
    return errors.length ? `Invalid ${errors.join(", ")}` : null;
  },
};
