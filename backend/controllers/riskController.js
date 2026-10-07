import { asyncHandler } from "../middleware/errorHandler.js";
import { AppError } from "../middleware/errorHandler.js";

// Standard pip value assumptions per pair category. A production version
// would pull live conversion rates; this covers the common cases correctly.
const JPY_PAIRS = new Set(["USDJPY", "EURJPY", "GBPJPY", "AUDJPY", "CHFJPY", "CADJPY", "NZDJPY"]);

const getPipSize = (pair) => (JPY_PAIRS.has(pair?.toUpperCase()) ? 0.01 : 0.0001);

// @desc    Calculate position size from account risk parameters
// @route   POST /api/risk-calculator
// @access  Private
export const calculateRisk = asyncHandler(async (req, res) => {
  const { balance, riskPercent, stopLossPips, pair } = req.body;

  if (!balance || !riskPercent || !stopLossPips) {
    throw new AppError("balance, riskPercent, and stopLossPips are required", 400);
  }
  if (balance <= 0 || riskPercent <= 0 || stopLossPips <= 0) {
    throw new AppError("Values must be greater than zero", 400);
  }

  const moneyRisked = Number((balance * (riskPercent / 100)).toFixed(2));

  // Standard lot = 100,000 units; pip value for a standard lot on a
  // non-JPY pair is ~$10/pip, and ~$9.30 equivalent area for JPY pairs
  // at typical rates — we use the simplified standard-lot pip value model.
  const pipSize = getPipSize(pair);
  const pipValuePerStandardLot = pipSize === 0.01 ? 9.3 : 10; // USD, approximate

  const positionSizeUnits = Math.round(
    (moneyRisked / (stopLossPips * pipValuePerStandardLot)) * 100000
  );
  const suggestedLotSize = Number((positionSizeUnits / 100000).toFixed(2));

  res.json({
    success: true,
    result: {
      moneyRisked,
      positionSizeUnits,
      suggestedLotSize,
      pipValuePerStandardLot,
    },
  });
});
