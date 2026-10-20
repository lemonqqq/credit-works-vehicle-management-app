import { useState } from "react";
import TextField from "../shared/textField";
import "./VehicleDetail.css";

function VehicleDetail({ vehicle, onFieldChangeHandler, onSave, onCancel }) {
  const [editMode] = useState(true);

  const formatFieldWithDecimal = (value) => {
    return !isNaN(parseFloat(value)) && isFinite(value)
      ? parseFloat(value).toFixed(2)
      : value;
  };

  return (
    <div className="vehicle-details-section">
      <div className="vehicle-details-header">
        <h4>Vehicle information</h4>
        <div>Core identification and ownership details</div>
      </div>
      <div className="vehicle-details-line-1">
        <div className="vehicle-details-owner">
          <TextField
            label="Owner name"
            textValue={vehicle?.ownerName}
            editMode={editMode}
            onChangeHandler={(e) => onFieldChangeHandler(e, "ownerName")}
            required={true}
          />
        </div>
      </div>
      <div className="vehicle-details-line-2">
        <div className="vehicle-details-manufacturer">
          <TextField
            label="Manufacturer"
            textValue={vehicle?.manufacturer}
            editMode={editMode}
            onChangeHandler={(e) => onFieldChangeHandler(e, "manufacturer")}
            required={true}
          />
        </div>
        <div className="vehicle-details-year">
          <TextField
            label="Year"
            textValue={vehicle?.year}
            editMode={editMode}
            onChangeHandler={(e) => onFieldChangeHandler(e, "year")}
            required={true}
          />
        </div>
      </div>
      <div className="vehicle-details-line-2">
        <div className="vehicle-details-registration">
          <TextField
            label="Registration number"
            textValue={vehicle?.registrationNumber}
            editMode={editMode}
            onChangeHandler={(e) =>
              onFieldChangeHandler(e, "registrationNumber")
            }
            required={true}
          />
        </div>
        <div className="vehicle-details-weight">
          <TextField
            label="Weight (in KG)"
            textValue={formatFieldWithDecimal(vehicle?.weightKg)}
            editMode={editMode}
            onChangeHandler={(e) => onFieldChangeHandler(e, "weightKg")}
            required={true}
          />
        </div>
      </div>
      <div className="vehicle-details-line-1">
        <div className="vehicle-details-vin">
          <TextField
            label="Vehicle identification number (VIN)"
            textValue={vehicle?.vin}
            editMode={editMode}
            onChangeHandler={(e) => onFieldChangeHandler(e, "vin")}
            required={true}
          />
        </div>
      </div>
      {editMode && (
        <div className="vehicle-details-footer">
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
          <button type="button" onClick={() => onSave(vehicle)}>
            Save
          </button>
        </div>
      )}
    </div>
  );
}

export default VehicleDetail;
