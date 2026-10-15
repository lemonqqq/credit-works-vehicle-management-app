import { useState } from "react";
import TextField from "../shared/textField";
import './detail.css';

function Detail({data}) {
    const [editMode, setEditMode] = useState(true);
    const [vehicle, setVehicle] = useState(data);

    const onFieldChangeHandler = (e, field) => {
        setVehicle({...vehicle, [field]: e.target.value});
    }

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
                        textValue={vehicle.ownerName}
                        editMode={editMode}
                        onChangeHandler={onFieldChangeHandler}  />
                </div>
            </div>
            <div className="vehicle-details-line-2">
                <div className="vehicle-details-manufacturer">
                    <TextField
                        label="Manufacturer"
                        textValue={vehicle.manufacturer}
                        editMode={editMode}
                        onChangeHandler={onFieldChangeHandler} />
                </div>
                <div className="vehicle-details-year">
                    <TextField
                        label="Year"
                        textValue={vehicle.year}
                        editMode={editMode}
                        onChangeHandler={onFieldChangeHandler} />
                </div>
            </div>
            <div className="vehicle-details-line-2">
                <div className="vehicle-details-registration">
                    <TextField
                        label="Registration number"
                        textValue={vehicle.registrationNumber}
                        editMode={editMode}
                        onChangeHandler={onFieldChangeHandler} />
                </div>      
                <div className="vehicle-details-weight">
                    <TextField
                        label="Weight (in KG)"
                        textValue={vehicle.weight}
                        editMode={editMode}
                        onChangeHandler={onFieldChangeHandler} />
                </div> 
            </div>
            <div className="vehicle-details-line-1">     
                <div className="vehicle-details-vin">
                    <TextField
                        label="Vehicle identification number (VIN)"
                        textValue={vehicle.vin}
                        editMode={editMode}
                        onChangeHandler={onFieldChangeHandler} />
                </div>
            </div>
            {editMode && <div className="vehicle-details-footer">
                <button>Cancel</button>
                <button>Save</button>
            </div>}
        </div>
    )
}

export default Detail;