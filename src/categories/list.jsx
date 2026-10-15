import { useState } from 'react';
import { categoryFn } from './utils/categoryUtil';
import './list.css';

function List() {
    const [list, setList] = useState(categoryFn.get());

    return (
        <section className="category-list-section">
            <search className="category-list-filters" aria-label="category filters">
                <label className="category-list-search">
                    <span className="category-list-sr-only">Search categories</span>
                    <input type="search" placeholder="Search categories" />
                </label>
            </search>

            <div className="category-list-card">
                <div className="category-list-card-header">
                    <h2>All categories</h2>
                    <span>{list.length} records</span>
                </div>
                <div className="category-list-table-scroll">
                    <table>
                        <thead>
                            <tr>
                                <th scope="col">Category name</th>
                                <th scope="col">Description</th>
                                <th scope="col">Min. weight</th>
                                <th scope="col">Max weight</th>
                                <th scope="col">Vehicles</th>
                                <th scope="col">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {list.map((item, index) => (
                                <tr key={`${item.id}-${index}`}>
                                    <td>{categoryFn.getSection(item.id)}</td>
                                    <td>{item.description}</td>
                                    <td>{item.minWeight} kg</td>
                                    <td>{item.maxWeight} kg</td>
                                    <td></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
}

export default List;
