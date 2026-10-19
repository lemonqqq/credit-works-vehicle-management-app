import { default as CategoryDetail } from "./CategoryDetail";
import { default as CategoryList } from "./CategoryList";
import { useCallback, useEffect, useState } from "react";
import "./CategoryPage.css";
import { useCategory } from "./utils/useCategory";
import { FaPlus } from "react-icons/fa";

function Index() {
  const [section, setSection] = useState("list");
  const [category, setCategory] = useState(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async (signal) => {
    setLoading(true);
    setError("");
    try {
      await useCategory.load(signal);
    } catch (err) {
      if (!signal?.aborted) setError(err.message);
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, []);

  useEffect(() => {
    const abortController = new AbortController();
    load(abortController.signal);
    return () => abortController.abort();
  }, [load]);

  async function confirm(refreshCategories) {
    setSaving(true);
    setError("");
    try {
      await useCategory.confirm(refreshCategories);
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
      setCategory(null);
    }
  }

  const getDraftCategories = () => {
    var list = useCategory.getDraft();
    return list;
  };

  const onEdit = useCallback((item) => {
    setCategory(item);
    setSection("detail");
  }, []);

  return (
    <section className="category-page">
      <header className="category-page-header">
        <div>
          <h1>Vehicle categories</h1>
          <p>
            Define your fleet classifications, weight range and identifying
            icons.
          </p>
        </div>
        <button
          className="category-page-add"
          type="button"
          onClick={() => onEdit({})}
        >
          <FaPlus />
          Add category
        </button>
      </header>
      {error && (
        <p className="category-page-error-msg" role="alert">
          {error}
        </p>
      )}
      {section === "list" && !loading && (
        <CategoryList
          data={getDraftCategories()}
          onEdit={onEdit}
          setError={setError}
        />
      )}
      {section === "detail" && (
        <CategoryDetail
          data={category}
          returnToList={() => setSection("list")}
          setError={setError}
        />
      )}
    </section>
  );
}

export default Index;
