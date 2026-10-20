import { useEffect, useState } from "react";
import { pollingService } from "../services/pollingService";
import "./Polling.css";

function Polling() {
  const [list, setList] = useState([]);

  useEffect(() => pollingService.subscribe(setList), []);

  return (
    <section className="polling-section" aria-label="Request progress">
      <div className="polling-panel">
        <h2>Request progress</h2>
        {list.length === 0 ? (
          <p className="polling-empty">No recent requests</p>
        ) : (
          <ul>
            {list.map((item) => (
              <li key={item.id}>
                <strong>
                  {item.method} {item.path}
                </strong>
                <div>
                  <span>Request ID:</span> {item.id.slice(0, 8)}
                </div>
                <div>
                  <span>Poll attempts:</span> {item.noOfAttempts}
                </div>
                <div>
                  <span>Status:</span> {item.status}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

export default Polling;
