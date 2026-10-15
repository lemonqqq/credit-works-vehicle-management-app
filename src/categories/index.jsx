import { default as CategoryDetail } from './detail';
import { default as CategoryList } from './list';
import { useMemo, useState } from 'react';
import './index.css';

function Index() {
    const [section, setSection] = useState('list');

    return useMemo(() => (
        <section className="category-page">
            <header className="category-page-header">
                <div>
                    <h1>Vehicle categories</h1>
                    <p>Define your fleet classifications, weight range and identifying icons.</p>
                </div>
                <button className="category-page-add" type="button" onClick={() => setSection('detail')}>+ Add category</button>
            </header>
            {section === 'list' && <CategoryList />}
            {section === 'detail' && <CategoryDetail data={{
                id: "10000000-0000-3000-7000-000000000003",
                name: "Heavy",
                description: "Heavy trucks and tractor units for long-haul freight.", 
                minWeight: 2500.01,
                maxWeight: null,
                iconKey: "heavy"
            }}/>}
        </section>
    ), [section]);
}

export default Index;