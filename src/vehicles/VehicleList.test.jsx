import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import VehicleList from "./VehicleList";

describe("vehicle list requirements", () => {
  it("offers four sort fields and shows the selected direction", () => {
    const html = renderToStaticMarkup(
      <VehicleList
        vehicles={{ data: [], totalRecords: 0 }}
        onEdit={() => {}}
      />,
    );
    for (const field of ["Owner name", "Manufacturer", "Year", "Weight (kg)"]) {
      expect(html).toContain(field);
    }
    expect(html).toContain("Ascending (A-Z)");
    expect(html).toContain("selected");
  });
});
