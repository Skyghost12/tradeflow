import Strategy from "../models/Strategy.js";
import Trade from "../models/Trade.js";
import { AppError, asyncHandler } from "../middleware/errorHandler.js";
import { calcWinRate } from "../services/analyticsService.js";

export const createStrategy = asyncHandler(async (req, res) => {
  const strategy = await Strategy.create({ ...req.body, user: req.user._id });
  res.status(201).json({ success: true, strategy });
});

// @desc    List strategies with computed win rate + trades-used count
export const getStrategies = asyncHandler(async (req, res) => {
  const strategies = await Strategy.find({ user: req.user._id }).sort("-createdAt");

  const enriched = await Promise.all(
    strategies.map(async (strategy) => {
      const trades = await Trade.find({ user: req.user._id, strategy: strategy._id });
      return {
        ...strategy.toObject(),
        winRate: calcWinRate(trades),
        tradesUsed: trades.length,
      };
    })
  );

  res.json({ success: true, strategies: enriched });
});

export const getStrategyById = asyncHandler(async (req, res) => {
  const strategy = await Strategy.findOne({ _id: req.params.id, user: req.user._id });
  if (!strategy) throw new AppError("Strategy not found", 404);
  res.json({ success: true, strategy });
});

export const updateStrategy = asyncHandler(async (req, res) => {
  const strategy = await Strategy.findOne({ _id: req.params.id, user: req.user._id });
  if (!strategy) throw new AppError("Strategy not found", 404);
  Object.assign(strategy, req.body);
  await strategy.save();
  res.json({ success: true, strategy });
});

export const deleteStrategy = asyncHandler(async (req, res) => {
  const strategy = await Strategy.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!strategy) throw new AppError("Strategy not found", 404);
  res.json({ success: true, message: "Strategy deleted" });
});
