const fields = new Set(["ownerName", "manufacturer", "year", "weightKg"]);

export function sortVehicles(vehicles, field, ascending = true) {
  if (!fields.has(field)) throw new Error(`Unsupported sort field: ${field}`);
  const direction = ascending ? 1 : -1;
  return [...vehicles].sort((a, b) => {
    const left = a[field];
    const right = b[field];
    const comparison =
      typeof left === "number"
        ? left - right
        : String(left).localeCompare(String(right));
    return comparison * direction;
  });
}
