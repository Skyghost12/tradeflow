import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import "./DashboardLayout.css";

const PAGE_TITLES = {
  "/dashboard": "Dashboard",
  "/charts": "Charts",
  "/watchlist": "Watchlist",
  "/journal": "Trade Journal",
  "/analytics": "Analytics",
  "/risk-calculator": "Risk Calculator",
  "/economic-calendar": "Economic Calendar",
  "/market-news": "Market News",
  "/strategies": "Strategy Library",
  "/psychology": "Psychology",
  "/goals": "Goals",
  "/notes": "Notes",
  "/profile": "Profile",
  "/settings": "Settings",
};

const DashboardLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const baseRoute = "/" + location.pathname.split("/")[1];
  const pageTitle = PAGE_TITLES[baseRoute] || "TradeFlow";

  return (
    <div className="dashboard-layout">
      <Sidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onLinkClick={() => setMobileOpen(false)}
      />
      {mobileOpen && (
        <div className="dashboard-layout__scrim" onClick={() => setMobileOpen(false)} />
      )}
      <div className="dashboard-layout__main">
        <Header
          onToggleSidebar={() => {
            if (window.innerWidth <= 900) setMobileOpen((o) => !o);
            else setCollapsed((c) => !c);
          }}
          pageTitle={pageTitle}
        />
        <main className="dashboard-layout__content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
