import { useQuery } from "@tanstack/react-query";
import { FiTrendingUp, FiTrendingDown, FiActivity, FiAward, FiTarget } from "react-icons/fi";
import { getAnalytics } from "../services/analyticsService";
import Card from "../components/UI/Card";
import StatCard from "../components/UI/StatCard";
import Badge from "../components/UI/Badge";
import BarChart from "../components/UI/BarChart";
import LoadingScreen from "../components/UI/LoadingScreen";
import EmptyState from "../components/UI/EmptyState";
import { formatCurrency, formatPercent, profitTone } from "../utils/format";
import "./Analytics.css";

const Analytics = () => {
  const { data: analytics, isLoading } = useQuery({
    queryKey: ["analytics"],
    queryFn: getAnalytics,
  });

  if (isLoading) return <LoadingScreen />;
  if (!analytics) {
    return <EmptyState title="No analytics yet" message="Log a few trades to see your performance breakdown." />;
  }

  const {
    winRate,
    totalProfit,
    averageRR,
    maxDrawdown,
    bestPair,
    worstPair,
    bestStrategy,
    worstStrategy,
    sessionPerformance,
    currentStreak,
    monthlyPerformance,
    mostCommonMistake,
  } = analytics;

  const monthlyChartData = monthlyPerformance.map((m) => ({ label: m.period.slice(5), value: m.profit }));
  const sessionChartData = Object.entries(sessionPerformance).map(([session, s]) => ({
    label: session,
    value: s.profit,
  }));

  return (
    <div className="analytics">
      <div className="analytics__stats">
        <StatCard label="Win Rate" value={formatPercent(winRate)} icon={FiTarget} tone="gold" />
        <StatCard
          label="Total Profit"
          value={formatCurrency(totalProfit)}
          icon={FiTrendingUp}
          tone={profitTone(totalProfit)}
        />
        <StatCard label="Average R:R" value={averageRR.toFixed(2)} icon={FiActivity} />
        <StatCard label="Max Drawdown" value={formatCurrency(maxDrawdown)} icon={FiTrendingDown} tone="bear" />
      </div>

      <div className="analytics__grid">
        <Card>
          <h3>Monthly Performance</h3>
          {monthlyChartData.length === 0 ? (
            <p className="analytics__empty-text">No closed trades yet</p>
          ) : (
            <BarChart data={monthlyChartData} formatValue={(v) => formatCurrency(v)} />
          )}
        </Card>

        <Card>
          <h3>Session Performance</h3>
          {sessionChartData.length === 0 ? (
            <p className="analytics__empty-text">No session data tagged yet</p>
          ) : (
            <BarChart data={sessionChartData} formatValue={(v) => formatCurrency(v)} tone="gold" />
          )}
        </Card>

        <Card>
          <h3>Best &amp; Worst Pair</h3>
          <div className="analytics__compare">
            <div className="analytics__compare-item analytics__compare-item--good">
              <FiAward />
              <div>
                <span>Best</span>
                <strong>{bestPair?.pair || "—"}</strong>
                {bestPair && <em>{formatCurrency(bestPair.profit)}</em>}
              </div>
            </div>
            <div className="analytics__compare-item analytics__compare-item--bad">
              <FiTrendingDown />
              <div>
                <span>Worst</span>
                <strong>{worstPair?.pair || "—"}</strong>
                {worstPair && <em>{formatCurrency(worstPair.profit)}</em>}
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <h3>Best &amp; Worst Strategy</h3>
          <div className="analytics__compare">
            <div className="analytics__compare-item analytics__compare-item--good">
              <FiAward />
              <div>
                <span>Best</span>
                <strong>{bestStrategy?.strategy || "—"}</strong>
                {bestStrategy && <em>{formatCurrency(bestStrategy.profit)}</em>}
              </div>
            </div>
            <div className="analytics__compare-item analytics__compare-item--bad">
              <FiTrendingDown />
              <div>
                <span>Worst</span>
                <strong>{worstStrategy?.strategy || "—"}</strong>
                {worstStrategy && <em>{formatCurrency(worstStrategy.profit)}</em>}
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <h3>Current Streak</h3>
          <div className="analytics__streak">
            <Badge tone={currentStreak.type === "win" ? "bull" : currentStreak.type === "loss" ? "bear" : "neutral"}>
              {currentStreak.type || "No trades"}
            </Badge>
            <span className="analytics__streak-count">{currentStreak.count}</span>
          </div>
        </Card>

        <Card>
          <h3>Most Common Mistake</h3>
          {mostCommonMistake ? (
            <div className="analytics__mistake">
              <p>
                Losses most often followed <strong className="capitalize">{mostCommonMistake.emotion}</strong> trades
              </p>
              <span className="analytics__mistake-detail">
                {mostCommonMistake.occurredIn} of {mostCommonMistake.totalLosses} losing trades
              </span>
            </div>
          ) : (
            <p className="analytics__empty-text">No losing trades logged yet</p>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
