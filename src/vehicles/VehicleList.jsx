import {
  FaArrowDown,
  FaArrowUp,
  FaPen,
  FaRegCircle,
  FaRegDotCircle,
} from "react-icons/fa";
import { categoryIcon } from "../categories/utils/categoryIcon";
import "./VehicleList.css";
import {
  CategoryOptions,
  ManufacturerOptions,
  YearOptions,
} from "./utils/vehicleSearchOptions";
import { useState } from "react";
import { RiArrowLeftWideLine, RiArrowRightWideLine } from "react-icons/ri";
import { sortVehicles } from "./utils/vehicleSort";

function VehicleList({
  vehicles,
  filters = {},
  onEdit,
  onSearchFilterUpdate,
  onSearch,
  onPageSearch,
}) {
  const [sortField, setSortField] = useState("ownerName");
  const [ascending, setAscending] = useState(true);

  const getSortedList = () => {
    if (!vehicles?.data) return [];
    return sortVehicles(vehicles.data, sortField, ascending);
  };

  return (
    <section className="vehicle-list-section">
      <search className="vehicle-list-filters" aria-label="Vehicle filters">
        <label className="vehicle-list-search-field">
          <span className="vehicle-list-sr-only">Search vehicles</span>
          <input
            type="search"
            placeholder="Search owner"
            value={filters.ownerName ?? ""}
            onChange={(e) => onSearchFilterUpdate("ownerName", e.target.value)}
          />
        </label>
        <label>
          <span className="vehicle-list-sr-only">Category</span>
          {CategoryOptions(onSearchFilterUpdate, filters.category ?? "")}
        </label>
        <label>
          <span className="vehicle-list-sr-only">Manufacturer</span>
          {ManufacturerOptions(
            onSearchFilterUpdate,
            filters.manufacturer ?? "",
          )}
        </label>
        <label>
          <span className="vehicle-list-sr-only">Year</span>
          {YearOptions(onSearchFilterUpdate, filters.year ?? "")}
        </label>
        <button
          className="vehicle-list-search"
          type="button"
          onClick={onSearch}
        >
          Search
        </button>
      </search>

      <div className="vehicle-list-sort-section" aria-label="Vehicle sorting">
        <span>Sorting</span>
        <div>
          <div className="vehicle-list-sort-option">
            <label>Sort by</label>
            <div>
              <button
                className={
                  sortField === "ownerName"
                    ? "selected"
                    : "vehicle-list-sort-field"
                }
                type="button"
                onClick={() => setSortField("ownerName")}
              >
                {sortField === "ownerName" ? (
                  <FaRegDotCircle />
                ) : (
                  <FaRegCircle />
                )}
                Owner name
              </button>
              <button
                className={
                  sortField === "manufacturer"
                    ? "selected"
                    : "vehicle-list-sort-field"
                }
                type="button"
                onClick={() => setSortField("manufacturer")}
              >
                {sortField === "manufacturer" ? (
                  <FaRegDotCircle />
                ) : (
                  <FaRegCircle />
                )}
                Manufacturer
              </button>
              <button
                className={
                  sortField === "year" ? "selected" : "vehicle-list-sort-field"
                }
                type="button"
                onClick={() => setSortField("year")}
              >
                {sortField === "year" ? <FaRegDotCircle /> : <FaRegCircle />}
                Year
              </button>
              <button
                className={
                  sortField === "weightKg"
                    ? "selected"
                    : "vehicle-list-sort-field"
                }
                type="button"
                onClick={() => setSortField("weightKg")}
              >
                {sortField === "weightKg" ? (
                  <FaRegDotCircle />
                ) : (
                  <FaRegCircle />
                )}
                Weight (kg)
              </button>
            </div>
          </div>
          <div className="vehicle-list-sort-direction-option">
            <label>Direction</label>
            <div>
              <button
                className={
                  ascending ? "selected" : "vehicle-list-sort-direction"
                }
                type="button"
                onClick={() => setAscending(true)}
              >
                <FaArrowUp /> Ascending (A-Z)
              </button>
              <button
                className={
                  ascending ? "vehicle-list-sort-direction" : "selected"
                }
                type="button"
                onClick={() => setAscending(false)}
              >
                <FaArrowDown /> Descending (Z-A)
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="vehicle-list-card">
        <div className="vehicle-list-card-header">
          <h2>All vehicles</h2>
          <span>
            {vehicles?.data?.length} of {vehicles.totalRecords} records
          </span>
        </div>
        <div className="vehicle-list-table-scroll">
          <table>
            <thead>
              <tr>
                <th scope="col">Owner name</th>
                <th scope="col">Manufacturer</th>
                <th scope="col">Category</th>
                <th scope="col">Year</th>
                <th scope="col">Weight</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {getSortedList()?.map((item, index) => (
                <tr key={`${item.id}-${index}`}>
                  <td>{item.ownerName}</td>
                  <td>{item.manufacturer}</td>
                  <td>{categoryIcon.getSection(null, item.weightKg)}</td>
                  <td>{item.year}</td>
                  <td>{item.weightKg.toFixed(2)} kg</td>
                  <td>
                    <div>
                      <button type="button" onClick={() => onEdit(item.id)}>
                        <FaPen />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {vehicles.pageNumber && (
        <footer className="vehicle-list-footer">
          {vehicles.pageNumber !== 1 && (
            <button
              type="button"
              onClick={() => onPageSearch(vehicles.pageNumber - 1)}
            >
              <RiArrowLeftWideLine />
            </button>
          )}
          <span>{vehicles.pageNumber}</span>
          {Math.ceil(vehicles.totalRecords / 10) !== vehicles.pageNumber && (
            <button
              type="button"
              onClick={() => onPageSearch(vehicles.pageNumber + 1)}
            >
              <RiArrowRightWideLine />
            </button>
          )}
        </footer>
      )}
    </section>
  );
}

export default VehicleList;
