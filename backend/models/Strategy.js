import mongoose from "mongoose";

const strategySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: { type: String, required: true, trim: true, maxlength: 100 },
    rules: { type: String, trim: true, maxlength: 3000 },
    entryConditions: { type: String, trim: true, maxlength: 2000 },
    exitConditions: { type: String, trim: true, maxlength: 2000 },
    examples: [
      {
        screenshot: { url: String, publicId: String },
        caption: { type: String, trim: true, maxlength: 300 },
      },
    ],
  },
  { timestamps: true }
);

strategySchema.index({ user: 1, name: 1 });

export default mongoose.model("Strategy", strategySchema);
