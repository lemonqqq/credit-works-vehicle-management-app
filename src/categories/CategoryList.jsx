import { FaPen, FaTrash } from "react-icons/fa";
import "./CategoryList.css";
import { categoryIcon } from "./utils/categoryIcon";

function List({ categories, onEdit, onCancel, onConfirm, onRemoveItem }) {
  const formatFieldWithDecimal = (value) => {
    return !isNaN(parseFloat(value)) && isFinite(value)
      ? parseFloat(value).toFixed(2)
      : value;
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
                <th scope="col">Minimum weight (in KG)</th>
                <th scope="col">Maximum weight (in KG)</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((item, index) => (
                <tr key={`${item.id}-${index}`}>
                  <td>
                    <div>
                      <span>{categoryIcon.get(item.iconKey)}</span>
                      {item.name}
                    </div>
                  </td>
                  <td>{item.description}</td>
                  <td>{formatFieldWithDecimal(item?.minWeightKg)} kg</td>
                  <td>
                    {item.maxWeightKg === null
                      ? "No upper limit"
                      : `${formatFieldWithDecimal(item?.maxWeightKg)} kg`}
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
