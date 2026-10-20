import { default as VehicleDetail } from "./VehicleDetail";
import { default as VehicleList } from "./VehicleList";
import { useState, useEffect } from "react";
import "./VehiclePage.css";
import { vehicleService } from "./vehicleService";
import { FaPlus } from "react-icons/fa";
import { vehicleValidator } from "./utils/vehicleValidator";

function VehiclePage() {
  const [section, setSection] = useState("list");
  const [filters, setFilters] = useState({ pageNumber: 1 });
  const [appliedFilters, setAppliedFilters] = useState({ pageNumber: 1 });
  const [vehicles, setVehicles] = useState({ data: [], totalRecords: 0 });
  const [vehicle, setVehicle] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const onSearchFilterUpdate = (field, value) => {
    setFilters((current) => ({ ...current, [field]: value, pageNumber: 1 }));
  };

  const onSearch = () => {
    setAppliedFilters({ ...filters, pageNumber: 1 });
  };

  const onPageSearch = (pageNumber) => {
    setAppliedFilters((current) => ({ ...current, pageNumber }));
  };

  useEffect(() => {
    const abortController = new AbortController();
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const result = await vehicleService.search(
          appliedFilters,
          abortController.signal,
        );
        if (!abortController.signal.aborted) setVehicles(result);
      } catch (err) {
        if (!abortController.signal.aborted) setError(err.message);
      } finally {
        if (!abortController.signal.aborted) setLoading(false);
      }
    };
    load();
    return () => abortController.abort();
  }, [appliedFilters]);

  const onEdit = async (id) => {
    const abortController = new AbortController();
    setLoading(true);
    try {
      setVehicle(await vehicleService.get(id, abortController.signal));
      setSection("detail");
    } catch (err) {
      if (err.name !== "AbortError") setError(err.message);
    } finally {
      if (!abortController.signal?.aborted) setLoading(false);
    }
    return () => abortController.abort();
  };

  const onAdd = () => {
    setVehicle({});
    setSection("detail");
  };

  const onFieldChangeHandler = (e, field) => {
    const value = e.target.value;
    const convertedValue =
      !isNaN(parseFloat(value)) && isFinite(value)
        ? parseFloat(e.target.value)
        : e.target.value;
    setVehicle({ ...vehicle, [field]: convertedValue });
  };

  const onSave = async (item) => {
    setError("");
    try {
      const error = vehicleValidator.validate(item);
      if (error !== null) {
        setError(error);
        return;
      }

      if (item.id == null) {
        await vehicleService.create(item);
      } else {
        await vehicleService.update(item);
      }
      setSection("list");
      setAppliedFilters((current) => ({ ...current }));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section className="vehicle-page">
      <header className="vehicle-page-header">
        <div>
          <h1>Vehicles</h1>
          <p>Manage your registered vehicles</p>
        </div>
        <button
          className="vehicle-page-add"
          type="button"
          onClick={() => onAdd()}
        >
          <FaPlus />
          Add vehicle
        </button>
      </header>
      {error && (
        <p className="vehicle-page-error-msg" role="alert">
          {error}
        </p>
      )}
      {loading && (
        <p className="vehicle-page-status-msg" role="status">
          Loading vehicles...
        </p>
      )}
      {section === "list" && vehicles && (
        <VehicleList
          vehicles={vehicles}
          onEdit={onEdit}
          filters={filters}
          onSearchFilterUpdate={onSearchFilterUpdate}
          onSearch={onSearch}
          onPageSearch={onPageSearch}
        />
      )}
      {section === "detail" && (
        <VehicleDetail
          vehicle={vehicle}
          onFieldChangeHandler={onFieldChangeHandler}
          onCancel={() => setSection("list")}
          onSave={onSave}
        />
      )}
    </section>
  );
}

export default VehiclePage;
