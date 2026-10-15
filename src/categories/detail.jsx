import { useState } from "react";
import TextField from "../shared/textField";
import './detail.css';
import { categoryFn } from "./utils/categoryUtil";

function Detail({data}) {
    const [editMode, setEditMode] = useState(true);
    const [category, setCategory] = useState(data);

    const onFieldChangeHandler = (e, field) => {
        setCategory({...category, [field]: e.target.value});
    }

    return (
        <div className="category-details-section">
            <div className="category-details-header">
                <h4>Add category</h4>
                <div>Create a classification with a clear weight range and a recognisable icon.</div>
            </div>
            <div className="category-details-line-1">
                <div className="category-details-name">
                    <TextField 
                        label="Category name *"
                        textValue={category.name}
                        editMode={editMode}
                        onChangeHandler={(e) => onFieldChangeHandler(e, 'name')}  />
                </div>
            </div>
            <div className="category-details-line-1">                
                <div className="category-details-description">
                    <TextField
                        label="Description"
                        textValue={category.description}
                        editMode={editMode}
                        onChangeHandler={(e) => onFieldChangeHandler(e, 'description')} />
                </div>
            </div>
            <div className="category-details-line-2">
                <div className="category-details-min-weight">
                    <TextField
                        label="Minimum weight (in KG)"
                        textValue={category.minWeight}
                        editMode={editMode}
                        onChangeHandler={(e) => onFieldChangeHandler(e, 'minWeight')} />
                </div>
                <div className="category-details-max-weight">
                    <TextField
                        label="Maximum weight (in KG)"
                        textValue={category.maxWeight}
                        editMode={editMode}
                        onChangeHandler={(e) => onFieldChangeHandler(e, 'maxWeight')} />
                </div>
            </div>
            <div className="category-details-line-1">
                <h5>AVAILABLE ICONS</h5>
                <div className="category-details-icon">
                    {categoryFn.icons().map((item, key) => (
                        <div>
                            <button className={key === 1 ? "selected" : ""}>
                                {item.icon}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
            {editMode && <div className="category-details-footer">
                <button>Cancel</button>
                <button>Save</button>
            </div>}
        </div>
    )
}

export default Detail;