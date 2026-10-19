import { useCallback, useEffect, useState } from "react";
import "./App.css";
import Navigation from "../navigation/navigation";
import { default as CategoryMain } from "../categories/CategoryPage";
import { default as VehicleMain } from "../vehicles/VehiclePage";
import { useCategory } from "../categories/utils/useCategory";

function App() {
  const [section, setSection] = useState("vehicles");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const refreshCategories = () => {
    setLoading(true);
    setError("");
    setRefreshKey((key) => key + 1);
  };

  const go = (next) => {
    setSection(next);
    refreshCategories();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const loadCategories = useCallback(async (signal) => {
    setLoading(true);
    setError("");
    try {
      await useCategory.load(signal);
    } catch (err) {
      if (!signal.aborted) setError(err.message);
    } finally {
      if (!signal.aborted) setLoading(false);
    }
  }, []);

  useEffect(() => {
    const abortController = new AbortController();
    loadCategories(abortController.signal);
    return () => abortController.abort();
  }, [section, refreshKey, loadCategories]);

  return (
    <div className="credit-works-app">
      <aside className="credit-works-side-panel">
        <Navigation section={section} setSection={go} />
      </aside>
      <main className="credit-works-main-section">
        {loading && (
          <p className="credit-works-main-status-msg" role="status">
            Loading categories...
          </p>
        )}
        {!loading && error && (
          <div role="alert">
            Could not load categories: {error}{" "}
            <button type="button" onClick={refreshCategories}>
              Retry
            </button>
          </div>
        )}
        {!loading && !error && section === "vehicles" && <VehicleMain />}
        {!loading && !error && section === "categories" && <CategoryMain />}
      </main>
    </div>
  );
}

export default App;
