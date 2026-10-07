import Trade from "../models/Trade.js";
import { asyncHandler } from "../middleware/errorHandler.js";
import {
  buildFullAnalytics,
  calcWinRate,
  calcTotalProfit,
  calcCurrentStreak,
  calcBestWorstPair,
} from "../services/analyticsService.js";

// @desc    Full analytics breakdown for the Analytics page
// @route   GET /api/analytics
// @access  Private
export const getAnalytics = asyncHandler(async (req, res) => {
  const trades = await Trade.find({ user: req.user._id }).populate("strategy", "name");
  res.json({ success: true, analytics: buildFullAnalytics(trades) });
});

// @desc    Summary cards + recent trades for the Dashboard
// @route   GET /api/dashboard
// @access  Private
export const getDashboardSummary = asyncHandler(async (req, res) => {
  const allTrades = await Trade.find({ user: req.user._id }).sort("-date");

  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfWeek = new Date(startOfDay);
  startOfWeek.setDate(startOfDay.getDate() - startOfDay.getDay());
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const todayTrades = allTrades.filter((t) => new Date(t.date) >= startOfDay);
  const weekTrades = allTrades.filter((t) => new Date(t.date) >= startOfWeek);
  const monthTrades = allTrades.filter((t) => new Date(t.date) >= startOfMonth);
  const openTrades = allTrades.filter((t) => t.result === "open");

  const { bestPair } = calcBestWorstPair(allTrades);

  res.json({
    success: true,
    summary: {
      todayProfit: calcTotalProfit(todayTrades),
      weeklyProfit: calcTotalProfit(weekTrades),
      monthlyProfit: calcTotalProfit(monthTrades),
      winRate: calcWinRate(allTrades),
      openTradesCount: openTrades.length,
      bestPair: bestPair?.pair || null,
      currentStreak: calcCurrentStreak(allTrades),
    },
    recentTrades: allTrades.slice(0, 5),
    openTrades,
  });
});
