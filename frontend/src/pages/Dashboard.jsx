import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import {
  FiDollarSign,
  FiTrendingUp,
  FiTarget,
  FiActivity,
  FiZap,
  FiAward,
} from "react-icons/fi";
import { getDashboardSummary } from "../services/dashboardService";
import StatCard from "../components/UI/StatCard";
import Card from "../components/UI/Card";
import Badge from "../components/UI/Badge";
import EmptyState from "../components/UI/EmptyState";
import LoadingScreen from "../components/UI/LoadingScreen";
import { formatCurrency, formatDate, profitTone } from "../utils/format";
import "./Dashboard.css";

const Dashboard = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["dashboard"],
    queryFn: getDashboardSummary,
  });

  if (isLoading) return <LoadingScreen />;
  if (isError) {
    return <EmptyState title="Couldn't load your dashboard" message="Try refreshing the page." />;
  }

  const { summary, recentTrades, openTrades } = data;

  return (
    <div className="dashboard">
      <div className="dashboard__stats">
        <StatCard
          label="Today's Profit"
          value={formatCurrency(summary.todayProfit)}
          icon={FiDollarSign}
          tone={profitTone(summary.todayProfit)}
        />
        <StatCard
          label="Weekly Profit"
          value={formatCurrency(summary.weeklyProfit)}
          icon={FiTrendingUp}
          tone={profitTone(summary.weeklyProfit)}
        />
        <StatCard
          label="Monthly Profit"
          value={formatCurrency(summary.monthlyProfit)}
          icon={FiTrendingUp}
          tone={profitTone(summary.monthlyProfit)}
        />
        <StatCard label="Win Rate" value={summary.winRate} suffix="%" icon={FiTarget} tone="gold" />
        <StatCard label="Open Trades" value={summary.openTradesCount} icon={FiActivity} />
        <StatCard label="Best Pair" value={summary.bestPair || "—"} icon={FiAward} tone="bull" />
        <StatCard
          label="Current Streak"
          value={summary.currentStreak.count}
          suffix={summary.currentStreak.type ? ` ${summary.currentStreak.type}` : ""}
          icon={FiZap}
          tone={summary.currentStreak.type === "win" ? "bull" : "bear"}
        />
      </div>

      <div className="dashboard__grid">
        <Card className="dashboard__panel">
          <div className="dashboard__panel-head">
            <h3>Recent Trades</h3>
            <Link to="/journal">View all</Link>
          </div>
          {recentTrades.length === 0 ? (
            <EmptyState
              title="No trades logged yet"
              message="Your most recent journal entries will show up here."
            />
          ) : (
            <div className="trade-row-list">
              {recentTrades.map((trade) => (
                <Link to={`/journal/${trade._id}`} key={trade._id} className="trade-row">
                  <div className="trade-row__pair">
                    <span>{trade.pair}</span>
                    <Badge tone={trade.direction === "long" ? "bull" : "bear"}>
                      {trade.direction}
                    </Badge>
                  </div>
                  <span className="trade-row__date">{formatDate(trade.date)}</span>
                  <span className={`trade-row__profit trade-row__profit--${profitTone(trade.profit)}`}>
                    {formatCurrency(trade.profit)}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </Card>

        <Card className="dashboard__panel">
          <div className="dashboard__panel-head">
            <h3>Open Trades</h3>
          </div>
          {openTrades.length === 0 ? (
            <EmptyState title="No open positions" message="Trades you're currently in will appear here." />
          ) : (
            <div className="trade-row-list">
              {openTrades.map((trade) => (
                <Link to={`/journal/${trade._id}`} key={trade._id} className="trade-row">
                  <div className="trade-row__pair">
                    <span>{trade.pair}</span>
                    <Badge tone={trade.direction === "long" ? "bull" : "bear"}>
                      {trade.direction}
                    </Badge>
                  </div>
                  <span className="trade-row__date">Entry {trade.entry}</span>
                  <Badge tone="info">Open</Badge>
                </Link>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
