import { useState } from "react";
import TextField from "../shared/textField";
import "./CategoryDetail.css";
import { categoryIcon } from "./utils/categoryIcon";

function Detail({
  category,
  onUpdate,
  onCancel,
  onFieldChangeHandler,
  onIconClickHandler,
}) {
  const [editMode] = useState(true);

  const formatFieldWithDecimal = (value) => {
    return !isNaN(parseFloat(value)) && isFinite(value)
      ? parseFloat(value).toFixed(2)
      : value;
  };

  return (
    <div className="category-details-section">
      <div className="category-details-header">
        <h4>Add category</h4>
        <div>
          Create a classification with a clear weight range and a recognisable
          icon.
        </div>
      </div>
      <div className="category-details-line-1">
        <div className="category-details-name">
          <TextField
            label="Category name"
            textValue={category?.name}
            editMode={editMode}
            onChangeHandler={(e) => onFieldChangeHandler(e, "name")}
            required={true}
          />
        </div>
      </div>
      <div className="category-details-line-1">
        <div className="category-details-description">
          <TextField
            label="Description"
            textValue={category?.description}
            editMode={editMode}
            onChangeHandler={(e) => onFieldChangeHandler(e, "description")}
          />
        </div>
      </div>
      <div className="category-details-line-2">
        <div className="category-details-min-weight">
          <TextField
            label="Minimum weight (in KG)"
            textValue={formatFieldWithDecimal(category?.minWeightKg)}
            editMode={editMode}
            onChangeHandler={(e) => onFieldChangeHandler(e, "minWeightKg")}
            required={true}
          />
        </div>
        <div className="category-details-max-weight">
          <TextField
            label="Maximum weight (in KG)"
            textValue={formatFieldWithDecimal(category?.maxWeightKg)}
            editMode={editMode}
            onChangeHandler={(e) => onFieldChangeHandler(e, "maxWeightKg")}
          />
        </div>
      </div>
      <div className="category-details-line-1">
        <h5>AVAILABLE ICONS</h5>
        <div className="category-details-icon">
          {categoryIcon.icons().map((item, key) => (
            <div key={key}>
              <button
                className={item.id === category?.iconKey ? "selected" : ""}
                onClick={() => onIconClickHandler(item.id)}
              >
                {item.icon}
              </button>
            </div>
          ))}
        </div>
      </div>
      {editMode && (
        <div className="category-details-footer">
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
          <button type="button" onClick={() => onUpdate(category)}>
            Update
          </button>
        </div>
      )}
    </div>
  );
}

export default Detail;
