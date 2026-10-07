/**
 * Pure calculation functions over an array of closed trades.
 * Kept out of controllers so they're unit-testable and reusable
 * across the Dashboard, Analytics, and Goals progress endpoints.
 */

const closedOnly = (trades) => trades.filter((t) => t.result !== "open");

export const calcWinRate = (trades) => {
  const closed = closedOnly(trades);
  if (closed.length === 0) return 0;
  const wins = closed.filter((t) => t.result === "win").length;
  return Number(((wins / closed.length) * 100).toFixed(1));
};

export const calcTotalProfit = (trades) =>
  Number(trades.reduce((sum, t) => sum + (t.profit || 0), 0).toFixed(2));

export const calcAverageRR = (trades) => {
  const closed = closedOnly(trades);
  if (closed.length === 0) return 0;
  const sum = closed.reduce((acc, t) => acc + (t.riskReward || 0), 0);
  return Number((sum / closed.length).toFixed(2));
};

/**
 * Max drawdown as the largest peak-to-trough decline in cumulative
 * equity, walking trades in chronological order.
 */
export const calcMaxDrawdown = (trades) => {
  const sorted = [...closedOnly(trades)].sort((a, b) => new Date(a.date) - new Date(b.date));
  let equity = 0;
  let peak = 0;
  let maxDrawdown = 0;

  for (const trade of sorted) {
    equity += trade.profit || 0;
    peak = Math.max(peak, equity);
    maxDrawdown = Math.max(maxDrawdown, peak - equity);
  }
  return Number(maxDrawdown.toFixed(2));
};

const groupBy = (trades, keyFn) => {
  const map = new Map();
  for (const trade of trades) {
    const key = keyFn(trade);
    if (!key) continue;
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(trade);
  }
  return map;
};

const bestWorstByProfit = (groups) => {
  let best = null;
  let worst = null;
  for (const [key, trades] of groups) {
    const profit = calcTotalProfit(trades);
    if (!best || profit > best.profit) best = { key, profit };
    if (!worst || profit < worst.profit) worst = { key, profit };
  }
  return { best, worst };
};

export const calcBestWorstPair = (trades) => {
  const groups = groupBy(closedOnly(trades), (t) => t.pair);
  const { best, worst } = bestWorstByProfit(groups);
  return {
    bestPair: best ? { pair: best.key, profit: best.profit } : null,
    worstPair: worst ? { pair: worst.key, profit: worst.profit } : null,
  };
};

export const calcBestWorstStrategy = (trades) => {
  const groups = groupBy(
    closedOnly(trades),
    (t) => t.strategy?.name || t.strategy?.toString()
  );
  const { best, worst } = bestWorstByProfit(groups);
  return {
    bestStrategy: best ? { strategy: best.key, profit: best.profit } : null,
    worstStrategy: worst ? { strategy: worst.key, profit: worst.profit } : null,
  };
};

export const calcSessionPerformance = (trades) => {
  const groups = groupBy(closedOnly(trades), (t) => t.session);
  const result = {};
  for (const [session, sessionTrades] of groups) {
    result[session] = {
      profit: calcTotalProfit(sessionTrades),
      winRate: calcWinRate(sessionTrades),
      count: sessionTrades.length,
    };
  }
  return result;
};

export const calcCurrentStreak = (trades) => {
  const sorted = [...closedOnly(trades)].sort((a, b) => new Date(b.date) - new Date(a.date));
  if (sorted.length === 0) return { type: null, count: 0 };

  const type = sorted[0].result; // 'win' or 'loss'
  let count = 0;
  for (const trade of sorted) {
    if (trade.result === type) count++;
    else break;
  }
  return { type, count };
};

/**
 * Buckets trades by week or month for the Analytics performance charts.
 */
export const calcPeriodPerformance = (trades, period = "monthly") => {
  const closed = closedOnly(trades);
  const buckets = new Map();

  for (const trade of closed) {
    const date = new Date(trade.date);
    let key;
    if (period === "weekly") {
      const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
      const week = Math.ceil(
        ((date - firstDayOfYear) / 86400000 + firstDayOfYear.getDay() + 1) / 7
      );
      key = `${date.getFullYear()}-W${week}`;
    } else {
      key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    }
    if (!buckets.has(key)) buckets.set(key, []);
    buckets.get(key).push(trade);
  }

  return Array.from(buckets.entries())
    .map(([period, periodTrades]) => ({
      period,
      profit: calcTotalProfit(periodTrades),
      winRate: calcWinRate(periodTrades),
      trades: periodTrades.length,
    }))
    .sort((a, b) => a.period.localeCompare(b.period));
};

/**
 * Flags the most frequent loss-correlated emotion as the "most common mistake" —
 * a proxy that's useful without requiring users to manually tag mistakes.
 */
export const calcMostCommonMistake = (trades) => {
  const losses = closedOnly(trades).filter((t) => t.result === "loss");
  if (losses.length === 0) return null;

  const counts = {};
  for (const trade of losses) {
    counts[trade.emotion] = (counts[trade.emotion] || 0) + 1;
  }
  const [emotion, count] = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
  return { emotion, occurredIn: count, totalLosses: losses.length };
};

export const buildFullAnalytics = (trades) => {
  return {
    winRate: calcWinRate(trades),
    totalProfit: calcTotalProfit(trades),
    averageRR: calcAverageRR(trades),
    maxDrawdown: calcMaxDrawdown(trades),
    ...calcBestWorstPair(trades),
    ...calcBestWorstStrategy(trades),
    sessionPerformance: calcSessionPerformance(trades),
    currentStreak: calcCurrentStreak(trades),
    monthlyPerformance: calcPeriodPerformance(trades, "monthly"),
    weeklyPerformance: calcPeriodPerformance(trades, "weekly"),
    mostCommonMistake: calcMostCommonMistake(trades),
  };
};
