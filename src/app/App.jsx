import { useEffect, useState } from "react";
import "./App.css";
import Navigation from "../navigation/Navigation";
import { default as CategoryMain } from "../categories/CategoryPage";
import { default as VehicleMain } from "../vehicles/VehiclePage";
import { categoryService } from "../categories/categoryService";
import Polling from "../polling/Polling";

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
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const abortController = new AbortController();
    categoryService
      .load(abortController.signal)
      .catch((err) => {
        if (!abortController.signal.aborted) setError(err.message);
      })
      .finally(() => {
        if (!abortController.signal.aborted) setLoading(false);
      });
    return () => abortController.abort();
  }, [refreshKey]);

  return (
    <div className="credit-works-app">
      <aside className="credit-works-side-panel">
        <Navigation section={section} setSection={go} />
        <Polling></Polling>
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
