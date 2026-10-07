import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true, trim: true, maxlength: 150 },
    content: { type: String, default: "" }, // rich text stored as HTML/JSON from the editor
    folder: { type: String, default: "Uncategorized", trim: true },
    tags: { type: [String], default: [] },
    pinned: { type: Boolean, default: false },
  },
  { timestamps: true }
);

noteSchema.index({ user: 1, folder: 1 });
noteSchema.index({ user: 1, tags: 1 });
noteSchema.index({ title: "text", content: "text" }); // for search

export default mongoose.model("Note", noteSchema);
