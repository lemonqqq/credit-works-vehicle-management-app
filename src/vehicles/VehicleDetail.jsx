import { useCallback, useState, useEffect } from "react";
import TextField from "../shared/textField";
import "./VehicleDetail.css";
import { useVehicle } from "./utils/useVehicles";
import { vehicleValidator } from "./utils/vehicleValidator";

function Detail({ id, returnToList, setError }) {
  const [editMode] = useState(true);
  const [loading, setLoading] = useState(true);
  const [vehicle, setVehicle] = useState({});

  const load = useCallback(async (signal) => {
    setLoading(true);
    try {
      var data = await useVehicle.get(id, signal);
      setVehicle(data);
    } catch (err) {
      if (err.name !== "AbortError") setError(err.message);
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, []);

  useEffect(() => {
    const abortController = new AbortController();
    load(abortController.signal);
    return () => abortController.abort();
  }, [load]);

  const onFieldChangeHandler = (e, field) => {
    const value = e.target.value;
    const convertedValue =
      !isNaN(parseFloat(value)) && isFinite(value)
        ? parseFloat(e.target.value)
        : e.target.value;
    setVehicle({ ...vehicle, [field]: convertedValue });
  };

  const onCancel = () => {
    setError("");
    returnToList();
  };

  const onSave = async (item) => {
    setError("");
    try {
      const error = vehicleValidator.validate(item);
      if (error !== null) {
        setError(error);
        return;
      }

      if (item.id == null) {
        await useVehicle.create(item);
        returnToList();
      } else {
        await useVehicle.update(item);
        returnToList();
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    !loading && (
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
              textValue={vehicle?.weightKg?.toFixed(2)}
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
    )
  );
}

export default Detail;
