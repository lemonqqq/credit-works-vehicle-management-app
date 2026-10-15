import { useEffect, useMemo, useState } from 'react';
import './App.css';
import Navigation from '../navigation/navigation';
import { default as CategoryMain } from '../categories/index';
import { default as VehicleMain } from '../vehicles/index';
import { categoryFn } from '../categories/utils/categoryUtil';

function App() {
  const [section, setSection] = useState("vehicles");
  const [loading, setLoading] = useState(true);

  const go = (next) => {
      setSection(next);
      window.scrollTo({ top: 0, behavior: "smooth" });
  }

  useEffect(() => {
    categoryFn.set([
        {
            id: "10000000-0000-3000-7000-000000000001",
            name: "Light",
            description: "Vans and light-duty vehicles for local distribution.", 
            minWeight: 0,
            maxWeight: 500.00,
            iconKey: "light"
        },
        {
            id: "10000000-0000-3000-7000-000000000002",
            name: "Medium",
            description: "Rigid delivery vehicles for regional distribution.", 
            minWeight: 500.01,
            maxWeight: 2500.00,
            iconKey: "medium"
        },
        {
            id: "10000000-0000-3000-7000-000000000003",
            name: "Heavy",
            description: "Heavy trucks and tractor units for long-haul freight.", 
            minWeight: 2500.01,
            maxWeight: null,
            iconKey: "heavy"
        }
    ]);
    setLoading(false);
  }, []);

  return (
    <div className="credit-works-app">
      <aside className="credit-works-side-panel">
        <Navigation section={section} setSection={go} />
      </aside>
      <main className="credit-works-main-section">
        {section === 'vehicles' && !loading && <VehicleMain />}
        {section === 'categories' && <CategoryMain />}
      </main>
    </div>
  );
}

export default App
