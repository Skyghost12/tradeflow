import Goal from "../models/Goal.js";
import Trade from "../models/Trade.js";
import { AppError, asyncHandler } from "../middleware/errorHandler.js";
import { calcTotalProfit, calcWinRate } from "../services/analyticsService.js";

/**
 * Recomputes currentValue for a goal from real trade data over its
 * date range, so progress bars reflect actual performance rather
 * than a number the user has to update by hand.
 */
const refreshGoalProgress = async (goal) => {
  const trades = await Trade.find({
    user: goal.user,
    date: { $gte: goal.startDate, $lte: goal.endDate },
  });

  switch (goal.targetType) {
    case "profit":
      goal.currentValue = calcTotalProfit(trades);
      break;
    case "winRate":
      goal.currentValue = calcWinRate(trades);
      break;
    case "tradeCount":
      goal.currentValue = trades.filter((t) => t.result !== "open").length;
      break;
    default:
      break; // 'custom' and 'riskDiscipline' are updated manually by the user
  }

  goal.achieved = goal.currentValue >= goal.targetValue;
  await goal.save();
  return goal;
};

export const createGoal = asyncHandler(async (req, res) => {
  const goal = await Goal.create({ ...req.body, user: req.user._id });
  res.status(201).json({ success: true, goal });
});

export const getGoals = asyncHandler(async (req, res) => {
  const { timeframe } = req.query;
  const query = { user: req.user._id };
  if (timeframe) query.timeframe = timeframe;

  let goals = await Goal.find(query).sort("-endDate");
  goals = await Promise.all(goals.map(refreshGoalProgress));

  res.json({ success: true, goals });
});

export const updateGoal = asyncHandler(async (req, res) => {
  const goal = await Goal.findOne({ _id: req.params.id, user: req.user._id });
  if (!goal) throw new AppError("Goal not found", 404);
  Object.assign(goal, req.body);
  await goal.save();
  res.json({ success: true, goal });
});

export const deleteGoal = asyncHandler(async (req, res) => {
  const goal = await Goal.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!goal) throw new AppError("Goal not found", 404);
  res.json({ success: true, message: "Goal deleted" });
});
