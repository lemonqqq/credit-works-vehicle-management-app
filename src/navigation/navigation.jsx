import { ImStack } from "react-icons/im";
import { BsTruck } from "react-icons/bs";
import { FaArrowsToDot } from "react-icons/fa6";
import "./Navigation.css";

const nav = [
  { id: "vehicles", label: "Vehicles", icon: <BsTruck /> },
  { id: "categories", label: "Categories", icon: <ImStack /> },
];

function Navigation({ section, setSection }) {
  return (
    <div className="side-bar-section">
      <div className="side-bar-header">
        <span className="company-logo">
          <FaArrowsToDot />
        </span>
        <div>CreditWorks</div>
      </div>
      <nav
        className="side-bar-nav"
        aria-label="credit works vehicle management navigation"
      >
        <div>MANAGEMENT</div>
        {nav.map((item) => (
          <button
            key={item.id}
            className={section === item.id ? "active" : ""}
            onClick={() => setSection(item.id)}
          >
            <span>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>
    </div>
  );
}

export default Navigation;
