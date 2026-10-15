import { categoryFn } from '../categories/utils/categoryUtil';
import './list.css';


function List() {
    const list = [
        {
            id: "10000000-0000-4000-8000-000000000001",
            ownerName: "Amelia Wilson",
            manufacturer: "Mazda", 
            year: 2018,
            vin: "CWMZD000000000001",
            registrationNumber: "CW0001",
            weight: 420.50
        },
        {
            id: "10000000-0000-4000-8000-000000000002",
            ownerName: "Noah Thompson",
            manufacturer: "Mazda", 
            year: 2020,
            vin: "CWMZD000000000002",
            registrationNumber: "CW0002",
            weight: 499.99
        },
        {
            id: "10000000-0000-4000-8000-000000000003",
            ownerName: "Isla Martin",
            manufacturer: "Mazda", 
            year: 2022,
            vin: "CWMZD000000000003",
            registrationNumber: "CW0003",
            weight: 500.00
        },
        {
            id: "10000000-0000-4000-8000-000000000004",
            ownerName: "Olivia Chen",
            manufacturer: "Mazda", 
            year: 2017,
            vin: "CWMZD000000000004",
            registrationNumber: "CW0004",
            weight: 420.50
        },
        {
            id: "10000000-0000-4000-8000-000000000005",
            ownerName: "Sophia Patel",
            manufacturer: "Mercedes", 
            year: 2019,
            vin: "CWMZD000000000005",
            registrationNumber: "CW0005",
            weight: 1850.75
        },
        {
            id: "10000000-0000-4000-8000-000000000006",
            ownerName: "Liam Roberts",
            manufacturer: "Mercedes", 
            year: 2021,
            vin: "CWMZD000000000006",
            registrationNumber: "CW0006",
            weight: 2200.00
        },
        {
            id: "10000000-0000-4000-8000-000000000007",
            ownerName: "Mia Anderson",
            manufacturer: "Mercedes", 
            year: 2016,
            vin: "CWMZD000000000007",
            registrationNumber: "CW0007",
            weight: 2499.99
        }
    ];

    // useEffect(async () => {
    //     await vehiclesApi.list().then((response) => {
    //         setList(response.data);
    //     });
    // }, []);

    return (
        <section className="vehicle-list-section">
            <search className="vehicle-list-filters" aria-label="Vehicle filters">
                <label className="vehicle-list-search">
                    <span className="vehicle-list-sr-only">Search vehicles</span>
                    <input type="search" placeholder="Search registration, owner or VIN" />
                </label>
                <label>
                    <span className="vehicle-list-sr-only">Category</span>
                    <select defaultValue="">
                    <option value="">All categories</option>
                    <option>Light</option>
                    <option>Medium</option>
                    <option>Heavy</option>
                    </select>
                </label>
                <label>
                    <span className="vehicle-list-sr-only">Manufacturer</span>
                    <select defaultValue="">
                    <option value="">All manufacturers</option>
                    <option>Mazda</option>
                    <option>Mercedes</option>
                    <option>Honda</option>
                    <option>Ferrari</option>
                    <option>Toyota</option>
                    </select>
                </label>
                <label>
                    <span className="vehicle-list-sr-only">Year</span>
                    <select defaultValue="">
                    <option value="">All years</option>
                    <option>2000</option>
                    <option>2001</option>
                    <option>2002</option>
                    <option>2003</option>
                    <option>2004</option>
                    <option>2005</option>
                    <option>2006</option>
                    <option>2007</option>
                    <option>2008</option>
                    <option>2009</option>
                    <option>2010</option>
                    <option>2011</option>
                    <option>2012</option>
                    <option>2013</option>
                    <option>2014</option>
                    <option>2015</option>
                    <option>2016</option>
                    <option>2017</option>
                    <option>2018</option>
                    <option>2019</option>
                    <option>2020</option>
                    <option>2021</option>
                    <option>2022</option>
                    <option>2023</option>
                    <option>2024</option>
                    </select>
                </label>
            </search>

            <div className="vehicle-list-card">
                <div className="vehicle-list-card-header">
                    <h2>All vehicles</h2>
                    <span>{list.length} records</span>
                </div>
                <div className="vehicle-list-table-scroll">
                    <table>
                        <thead>
                            <tr>
                                <th scope="col">Owner name</th>
                                <th scope="col">Manufacturer</th>
                                <th scope="col">Category</th>
                                <th scope="col">Year</th>
                                <th scope="col">Weight</th>
                            </tr>
                        </thead>
                        <tbody>
                            {list.map((item, index) => (
                                <tr key={`${item.id}-${index}`}>
                                    <td>{item.ownerName}</td>
                                    <td>{item.manufacturer}</td>
                                    <td>{categoryFn.getSection(null, item.weight)}</td>
                                    <td>{item.year}</td>
                                    <td>{item.weight} kg</td>
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
