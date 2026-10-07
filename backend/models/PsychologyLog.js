import mongoose from "mongoose";

const psychologyLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    trade: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trade", // optional link back to the specific trade this entry covers
    },
    date: { type: Date, required: true, default: Date.now },
    emotionBefore: {
      type: String,
      enum: ["calm", "confident", "anxious", "excited", "fearful", "frustrated", "neutral"],
      required: true,
    },
    emotionAfter: {
      type: String,
      enum: ["calm", "confident", "anxious", "excited", "fearful", "frustrated", "neutral"],
      required: true,
    },
    confidence: { type: Number, min: 1, max: 10, required: true },
    stressLevel: { type: Number, min: 1, max: 10, required: true },
    sleepHours: { type: Number, min: 0, max: 24, required: true },
    disciplineScore: { type: Number, min: 1, max: 10, required: true },
    notes: { type: String, trim: true, maxlength: 1000 },
  },
  { timestamps: true }
);

psychologyLogSchema.index({ user: 1, date: -1 });

export default mongoose.model("PsychologyLog", psychologyLogSchema);
