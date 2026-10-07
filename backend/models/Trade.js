import mongoose from "mongoose";

const tradeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    pair: {
      type: String,
      required: [true, "Currency pair is required"],
      uppercase: true,
      trim: true,
    },
    direction: {
      type: String,
      enum: ["long", "short"],
      required: true,
    },
    entry: { type: Number, required: true },
    stopLoss: { type: Number, required: true },
    takeProfit: { type: Number, required: true },
    lotSize: { type: Number, required: true },
    riskPercent: { type: Number, required: true },
    riskReward: { type: Number }, // computed pre-save from entry/SL/TP
    strategy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Strategy",
    },
    emotion: {
      type: String,
      enum: ["confident", "anxious", "fomo", "greedy", "disciplined", "revenge", "neutral"],
      default: "neutral",
    },
    screenshot: {
      url: { type: String, default: "" },
      publicId: { type: String, default: "" },
    },
    result: {
      type: String,
      enum: ["win", "loss", "breakeven", "open"],
      default: "open",
    },
    profit: { type: Number, default: 0 }, // in account currency
    notes: { type: String, trim: true, maxlength: 2000 },
    date: { type: Date, required: true, default: Date.now },
    session: {
      type: String,
      enum: ["asian", "london", "new-york", "sydney"],
    },
  },
  { timestamps: true }
);

// Auto-calculate risk:reward ratio from price levels before saving
tradeSchema.pre("save", function (next) {
  const risk = Math.abs(this.entry - this.stopLoss);
  const reward = Math.abs(this.takeProfit - this.entry);
  this.riskReward = risk > 0 ? Number((reward / risk).toFixed(2)) : 0;
  next();
});

// Indexes for the journal's most common query patterns: per-user listing,
// filtering by pair/result, and date-range sorting.
tradeSchema.index({ user: 1, date: -1 });
tradeSchema.index({ user: 1, pair: 1 });
tradeSchema.index({ user: 1, result: 1 });

export default mongoose.model("Trade", tradeSchema);
