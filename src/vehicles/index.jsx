import { default as VehicleDetail } from './detail';
import { default as VehicleList } from './list';
import { useMemo, useState } from 'react';
import './index.css';

function Index() {
    const [section, setSection] = useState('list');
    return useMemo(() => (
        <section className="vehicle-page">
            <header className="vehicle-page-header">
                <div>
                    <h1>Vehicles</h1>
                    <p>Manage your registered vehicles</p>
                </div>
                <button className="vehicle-page-add" type="button" onClick={() => setSection('detail')}>+ Add vehicle</button>
            </header>
            {section === 'list' && <VehicleList />}
            {section === 'detail' && <VehicleDetail data={{
                id: "10000000-0000-4000-8000-000000000007",
                ownerName: "Mia Anderson",
                manufacturer: "Mercedes", 
                year: 2016,
                vin: "CWMZD000000000007",
                registrationNumber: "CW0007",
                weight: 2499.99
            }}/>}
        </section>
    ), [section]);
}

export default Index;