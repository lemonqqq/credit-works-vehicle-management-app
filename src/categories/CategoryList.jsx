import { useState } from "react";
import { FaPen, FaTrash } from "react-icons/fa";
import "./CategoryList.css";
import { categoryIcon } from "./utils/categoryIcon";
import { useCategory } from "./utils/useCategory";
import { categoryValidator } from "./utils/categoryValidator";

function List({ data, onEdit, setError }) {
  const [categories, setCategories] = useState(data);

  const onRemoveItem = (item) => {
    setCategories(categories.filter((x) => x !== item));
  };

  const onConfirm = async (categories) => {
    setError("");
    try {
      if (!categoryValidator.isModified()) {
        setError("No changes made.");
      } else if (!categoryValidator.isValid()) {
        setError("Update not allowed.");
      } else {
        await useCategory.confirm(categories);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const onCancel = () => {
    setError("");
  };

  return (
    <section className="category-list-section">
      <div className="category-list-card">
        <div className="category-list-card-header">
          <h2>All categories</h2>
          <span>{categories.length} records</span>
        </div>
        <div className="category-list-table-scroll">
          <table>
            <thead>
              <tr>
                <th scope="col">Category name</th>
                <th scope="col">Description</th>
                <th scope="col">Min. weight</th>
                <th scope="col">Max weight</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((item, index) => (
                <tr key={`${item.id}-${index}`}>
                  <td>{categoryIcon.getSection(item.id)}</td>
                  <td>{item.description}</td>
                  <td>{item.minWeightKg.toFixed(2)} kg</td>
                  <td>
                    {item.maxWeightKg === null
                      ? "No upper limit"
                      : `${item.maxWeightKg.toFixed(2)} kg`}
                  </td>
                  <td>
                    <div>
                      <button onClick={() => onEdit(item)}>
                        <FaPen />
                      </button>
                      <button onClick={() => onRemoveItem(item)}>
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <footer className="category-list-footer">
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
        <button
          className="category-list-confirm"
          type="button"
          onClick={() => onConfirm(categories)}
        >
          Confirm
        </button>
      </footer>
    </section>
  );
}

export default List;
