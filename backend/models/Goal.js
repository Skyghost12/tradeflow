import mongoose from "mongoose";

const goalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    timeframe: {
      type: String,
      enum: ["weekly", "monthly", "yearly"],
      required: true,
    },
    title: { type: String, required: true, trim: true, maxlength: 150 },
    targetType: {
      type: String,
      enum: ["profit", "winRate", "tradeCount", "riskDiscipline", "custom"],
      default: "profit",
    },
    targetValue: { type: Number, required: true },
    currentValue: { type: Number, default: 0 },
    startDate: { type: Date, required: true, default: Date.now },
    endDate: { type: Date, required: true },
    achieved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

goalSchema.virtual("progressPercent").get(function () {
  if (!this.targetValue) return 0;
  return Math.min(100, Math.round((this.currentValue / this.targetValue) * 100));
});

goalSchema.set("toJSON", { virtuals: true });
goalSchema.index({ user: 1, timeframe: 1, endDate: -1 });

export default mongoose.model("Goal", goalSchema);
