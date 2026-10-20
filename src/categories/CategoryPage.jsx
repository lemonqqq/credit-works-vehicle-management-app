import { default as CategoryDetail } from "./CategoryDetail";
import { default as CategoryList } from "./CategoryList";
import { useCallback, useEffect, useState } from "react";
import "./CategoryPage.css";
import { categoryService } from "./categoryService";
import { FaPlus } from "react-icons/fa";
import { categoryValidator } from "./utils/categoryValidator";

async function loadCategories(signal, setLoading, setError, setCategories) {
  setLoading(true);
  setError("");
  try {
    await categoryService.load(signal);
    if (!signal.aborted) setCategories(categoryService.getDraft());
  } catch (err) {
    if (!signal.aborted) setError(err.message);
  } finally {
    if (!signal.aborted) setLoading(false);
  }
}

function CategoryPage() {
  const [section, setSection] = useState("list");
  const [category, setCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const onCancel = async () => {
    const abortController = new AbortController();
    await loadCategories(
      abortController.signal,
      setLoading,
      setError,
      setCategories,
    );
  };

  useEffect(() => {
    const abortController = new AbortController();
    loadCategories(abortController.signal, setLoading, setError, setCategories);
    return () => abortController.abort();
  }, []);

  const onConfirm = async (refreshCategories) => {
    setError("");
    try {
      categoryValidator.validateWithList();
      if (!categoryValidator.isModified()) {
        setError("No changes made.");
      } else if (!categoryValidator.isValid()) {
        const invalidMessages = categoryService
          .getDraft()
          .filter((x) => x.invalid)
          .map((x) => x.validationMessage);
        setError(`Update not allowed. ${invalidMessages.join(",")}`);
      } else {
        await categoryService.confirm(refreshCategories);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const onUpdate = (item) => {
    const errors = categoryValidator.validate(item);
    if (errors !== null) {
      setError(errors);
      return;
    } else {
      categoryService.update(item);
      setCategories(categoryService.getDraft());
      setSection("list");
    }
  };

  const onFieldChangeHandler = (e, field) => {
    const value = e.target.value;
    const convertedValue =
      !isNaN(parseFloat(value)) && isFinite(value)
        ? parseFloat(e.target.value)
        : e.target.value;
    setCategory({ ...category, [field]: convertedValue });
  };

  const onIconClickHandler = (iconKey) => {
    setCategory({ ...category, iconKey: iconKey });
  };

  const onRemoveItem = (item) => {
    categoryService.remove(item);
    setCategories(categoryService.getDraft());
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
          categories={categories}
          onEdit={onEdit}
          onConfirm={onConfirm}
          onCancel={onCancel}
          onRemoveItem={onRemoveItem}
        />
      )}
      {section === "detail" && (
        <CategoryDetail
          category={category}
          onUpdate={onUpdate}
          onCancel={() => setSection("list")}
          onFieldChangeHandler={onFieldChangeHandler}
          onIconClickHandler={onIconClickHandler}
        />
      )}
    </section>
  );
}

export default CategoryPage;
