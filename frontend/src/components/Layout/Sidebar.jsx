import { NavLink } from "react-router-dom";
import {
  FiGrid,
  FiBarChart2,
  FiStar,
  FiBookOpen,
  FiPieChart,
  FiPercent,
  FiCalendar,
  FiRss,
  FiLayers,
  FiHeart,
  FiTarget,
  FiFileText,
  FiSettings,
  FiLogOut,
} from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import "./Sidebar.css";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", icon: FiGrid },
  { to: "/charts", label: "Charts", icon: FiBarChart2 },
  { to: "/watchlist", label: "Watchlist", icon: FiStar },
  { to: "/journal", label: "Journal", icon: FiBookOpen },
  { to: "/analytics", label: "Analytics", icon: FiPieChart },
  { to: "/risk-calculator", label: "Risk Calculator", icon: FiPercent },
  { to: "/economic-calendar", label: "Economic Calendar", icon: FiCalendar },
  { to: "/market-news", label: "Market News", icon: FiRss },
  { to: "/strategies", label: "Strategies", icon: FiLayers },
  { to: "/psychology", label: "Psychology", icon: FiHeart },
  { to: "/goals", label: "Goals", icon: FiTarget },
  { to: "/notes", label: "Notes", icon: FiFileText },
];

const Sidebar = ({ collapsed, mobileOpen, onLinkClick }) => {
  const { logout } = useAuth();

  return (
    <aside
      className={`sidebar ${collapsed ? "sidebar--collapsed" : ""} ${
        mobileOpen ? "sidebar--mobile-open" : ""
      }`}
    >
      <div className="sidebar__brand">
        <span className="sidebar__brand-mark">T</span>
        {!collapsed && <span className="sidebar__brand-name">TradeFlow</span>}
      </div>

      <nav className="sidebar__nav">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onLinkClick}
            className={({ isActive }) => `sidebar__link ${isActive ? "sidebar__link--active" : ""}`}
          >
            <Icon className="sidebar__link-icon" />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar__footer">
        <NavLink
          to="/settings"
          className={({ isActive }) => `sidebar__link ${isActive ? "sidebar__link--active" : ""}`}
        >
          <FiSettings className="sidebar__link-icon" />
          {!collapsed && <span>Settings</span>}
        </NavLink>
        <button className="sidebar__link sidebar__logout" onClick={logout}>
          <FiLogOut className="sidebar__link-icon" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
