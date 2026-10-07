import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Card from "../components/UI/Card";
import Badge from "../components/UI/Badge";
import EmptyState from "../components/UI/EmptyState";
import LoadingScreen from "../components/UI/LoadingScreen";
import CountdownTimer from "../components/UI/CountdownTimer";
import { getEconomicCalendar } from "../services/calendarService";
import { formatDateTime } from "../utils/format";
import "./EconomicCalendar.css";

const IMPORTANCE_TONE = { 1: "neutral", 2: "gold", 3: "bear" };
const IMPORTANCE_LABEL = { 1: "Low", 2: "Medium", 3: "High" };

const EconomicCalendar = () => {
  const [currency, setCurrency] = useState("");
  const [importance, setImportance] = useState("");

  const { data: events = [], isLoading, isError, error } = useQuery({
    queryKey: ["economic-calendar", currency, importance],
    queryFn: () => getEconomicCalendar({ currency: currency || undefined, importance: importance || undefined }),
    retry: false,
  });

  return (
    <div className="econ-calendar">
      <div className="econ-calendar__filters">
        <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="journal__filter">
          <option value="">All currencies</option>
          {["USD", "EUR", "GBP", "JPY", "AUD", "CAD", "CHF", "NZD"].map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select value={importance} onChange={(e) => setImportance(e.target.value)} className="journal__filter">
          <option value="">All importance</option>
          <option value="3">High</option>
          <option value="2">Medium</option>
          <option value="1">Low</option>
        </select>
      </div>

      {isLoading ? (
        <LoadingScreen />
      ) : isError ? (
        <EmptyState
          title="Economic calendar isn't configured yet"
          message={error?.response?.data?.message || "Add a FINNHUB_API_KEY to the backend to enable this feed."}
        />
      ) : events.length === 0 ? (
        <EmptyState title="No events found" message="Try a different filter or check back later." />
      ) : (
        <Card padded={false}>
          <div className="econ-table">
            <div className="econ-table__head">
              <span>Event</span>
              <span>Currency</span>
              <span>Importance</span>
              <span>Forecast</span>
              <span>Previous</span>
              <span>Actual</span>
              <span>Countdown</span>
            </div>
            {events.map((event, i) => (
              <div className="econ-table__row" key={i}>
                <div className="econ-table__event">
                  <span>{event.event}</span>
                  <span className="econ-table__date">{formatDateTime(event.time)}</span>
                </div>
                <Badge tone="info">{event.country}</Badge>
                <Badge tone={IMPORTANCE_TONE[event.impact] || "neutral"}>
                  {IMPORTANCE_LABEL[event.impact] || "—"}
                </Badge>
                <span className="mono">{event.estimate ?? "—"}</span>
                <span className="mono">{event.prev ?? "—"}</span>
                <span className="mono">{event.actual ?? "—"}</span>
                <CountdownTimer targetDate={event.time} />
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default EconomicCalendar;
