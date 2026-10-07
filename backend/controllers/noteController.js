import Note from "../models/Note.js";
import { AppError, asyncHandler } from "../middleware/errorHandler.js";

export const createNote = asyncHandler(async (req, res) => {
  const note = await Note.create({ ...req.body, user: req.user._id });
  res.status(201).json({ success: true, note });
});

// @desc    List notes, optionally filtered by folder/tag/search text
export const getNotes = asyncHandler(async (req, res) => {
  const { folder, tag, search } = req.query;
  const query = { user: req.user._id };
  if (folder) query.folder = folder;
  if (tag) query.tags = tag;
  if (search) query.$text = { $search: search };

  const notes = await Note.find(query).sort({ pinned: -1, updatedAt: -1 });
  res.json({ success: true, notes });
});

export const getNoteById = asyncHandler(async (req, res) => {
  const note = await Note.findOne({ _id: req.params.id, user: req.user._id });
  if (!note) throw new AppError("Note not found", 404);
  res.json({ success: true, note });
});

export const updateNote = asyncHandler(async (req, res) => {
  const note = await Note.findOne({ _id: req.params.id, user: req.user._id });
  if (!note) throw new AppError("Note not found", 404);
  Object.assign(note, req.body);
  await note.save();
  res.json({ success: true, note });
});

export const deleteNote = asyncHandler(async (req, res) => {
  const note = await Note.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!note) throw new AppError("Note not found", 404);
  res.json({ success: true, message: "Note deleted" });
});
