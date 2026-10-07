import Trade from "../models/Trade.js";
import { AppError, asyncHandler } from "../middleware/errorHandler.js";

// @desc    Create a new trade
// @route   POST /api/trades
// @access  Private
export const createTrade = asyncHandler(async (req, res) => {
  const trade = await Trade.create({ ...req.body, user: req.user._id });
  res.status(201).json({ success: true, trade });
});

// @desc    Get all trades for the logged-in user, with filter/search/sort/pagination
// @route   GET /api/trades?pair=EURUSD&result=win&strategy=...&sort=-date&page=1&limit=20&search=...
// @access  Private
export const getTrades = asyncHandler(async (req, res) => {
  const { pair, result, strategy, emotion, search, sort, page = 1, limit = 20 } = req.query;

  const query = { user: req.user._id };
  if (pair) query.pair = pair.toUpperCase();
  if (result) query.result = result;
  if (strategy) query.strategy = strategy;
  if (emotion) query.emotion = emotion;
  if (search) query.notes = { $regex: search, $options: "i" };

  const sortField = sort || "-date";
  const skip = (Number(page) - 1) * Number(limit);

  const [trades, total] = await Promise.all([
    Trade.find(query)
      .populate("strategy", "name")
      .sort(sortField)
      .skip(skip)
      .limit(Number(limit)),
    Trade.countDocuments(query),
  ]);

  res.json({
    success: true,
    trades,
    pagination: {
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    },
  });
});

// @desc    Get a single trade by id
// @route   GET /api/trades/:id
// @access  Private
export const getTradeById = asyncHandler(async (req, res) => {
  const trade = await Trade.findOne({ _id: req.params.id, user: req.user._id }).populate(
    "strategy",
    "name"
  );
  if (!trade) throw new AppError("Trade not found", 404);
  res.json({ success: true, trade });
});

// @desc    Update a trade
// @route   PUT /api/trades/:id
// @access  Private
export const updateTrade = asyncHandler(async (req, res) => {
  const trade = await Trade.findOne({ _id: req.params.id, user: req.user._id });
  if (!trade) throw new AppError("Trade not found", 404);

  Object.assign(trade, req.body);
  await trade.save();

  res.json({ success: true, trade });
});

// @desc    Delete a trade
// @route   DELETE /api/trades/:id
// @access  Private
export const deleteTrade = asyncHandler(async (req, res) => {
  const trade = await Trade.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!trade) throw new AppError("Trade not found", 404);
  res.json({ success: true, message: "Trade deleted" });
});
