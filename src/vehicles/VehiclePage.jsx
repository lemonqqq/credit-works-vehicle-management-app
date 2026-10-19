import { default as VehicleDetail } from "./VehicleDetail";
import { default as VehicleList } from "./VehicleList";
import { useCallback, useState, useEffect } from "react";
import "./VehiclePage.css";
import { useVehicle } from "./utils/useVehicles";
import { FaPlus } from "react-icons/fa";

function Index() {
  const [section, setSection] = useState("list");
  const [vehicles, setVehicles] = useState([]);
  const [vehicle, setVehicle] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async (filters, signal) => {
    setLoading(true);
    setError("");
    try {
      setVehicles(await useVehicle.search(filters, signal));
    } catch (err) {
      if (err.name !== "AbortError") setError(err.message);
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, []);

  useEffect(() => {
    const abortController = new AbortController();
    load({}, abortController.signal);
    return () => abortController.abort();
  }, [load]);

  const onSearch = (filters) => {
    setLoading(true);
    const abortController = new AbortController();
    load(filters, abortController.signal);
    return () => abortController.abort();
  };

  const onEdit = (item) => {
    setVehicle(item);
    setSection("detail");
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
          onClick={() => onEdit({})}
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
      {section === "list" && (
        <VehicleList vehicles={vehicles} onEdit={onEdit} onSearch={onSearch} />
      )}
      {section === "detail" && (
        <VehicleDetail
          id={vehicle.id}
          returnToList={() => setSection("list")}
          setError={setError}
        />
      )}
    </section>
  );
}

export default Index;
