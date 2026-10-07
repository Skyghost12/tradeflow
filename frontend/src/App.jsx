import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./components/Layout/DashboardLayout";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

import Dashboard from "./pages/Dashboard";
import Charts from "./pages/Charts";
import Watchlist from "./pages/Watchlist";
import Journal from "./pages/Journal";
import TradeDetails from "./pages/TradeDetails";
import Analytics from "./pages/Analytics";
import RiskCalculator from "./pages/RiskCalculator";
import EconomicCalendar from "./pages/EconomicCalendar";
import MarketNews from "./pages/MarketNews";
import Psychology from "./pages/Psychology";
import StrategyLibrary from "./pages/StrategyLibrary";
import Notes from "./pages/Notes";
import Goals from "./pages/Goals";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />

      {/* Authenticated app shell */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/charts" element={<Charts />} />
        <Route path="/watchlist" element={<Watchlist />} />
        <Route path="/journal" element={<Journal />} />
        <Route path="/journal/:id" element={<TradeDetails />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/risk-calculator" element={<RiskCalculator />} />
        <Route path="/economic-calendar" element={<EconomicCalendar />} />
        <Route path="/market-news" element={<MarketNews />} />
        <Route path="/strategies" element={<StrategyLibrary />} />
        <Route path="/psychology" element={<Psychology />} />
        <Route path="/goals" element={<Goals />} />
        <Route path="/notes" element={<Notes />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
