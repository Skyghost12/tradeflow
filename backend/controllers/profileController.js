import streamifier from "streamifier";
import User from "../models/User.js";
import cloudinary from "../config/cloudinary.js";
import { AppError, asyncHandler } from "../middleware/errorHandler.js";

const streamUpload = (buffer, folder) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ folder }, (error, result) => {
      if (result) resolve(result);
      else reject(error);
    });
    streamifier.createReadStream(buffer).pipe(stream);
  });

// @desc    Update profile fields (username, timezone, trading style, etc.)
// @route   PUT /api/profile
// @access  Private
export const updateProfile = asyncHandler(async (req, res) => {
  const allowedFields = [
    "username",
    "timezone",
    "tradingStyle",
    "experience",
    "preferredPairs",
  ];
  const updates = {};
  for (const field of allowedFields) {
    if (req.body[field] !== undefined) updates[field] = req.body[field];
  }

  const user = await User.findByIdAndUpdate(req.user._id, updates, {
    new: true,
    runValidators: true,
  });

  res.json({ success: true, user });
});

// @desc    Upload/replace profile avatar
// @route   POST /api/profile/avatar
// @access  Private
export const uploadAvatar = asyncHandler(async (req, res) => {
  if (!req.file) throw new AppError("No image file provided", 400);

  const user = await User.findById(req.user._id);

  // Delete old avatar from Cloudinary if one exists, to avoid orphaned assets
  if (user.avatar?.publicId) {
    await cloudinary.uploader.destroy(user.avatar.publicId);
  }

  const result = await streamUpload(req.file.buffer, "tradeflow/avatars");

  user.avatar = { url: result.secure_url, publicId: result.public_id };
  await user.save();

  res.json({ success: true, avatar: user.avatar });
});

// @desc    Update favorite pairs watchlist
// @route   PUT /api/profile/watchlist
// @access  Private
export const updateWatchlist = asyncHandler(async (req, res) => {
  const { pairs } = req.body;
  if (!Array.isArray(pairs)) throw new AppError("pairs must be an array", 400);

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { watchlist: pairs.map((p) => p.toUpperCase()) },
    { new: true }
  );

  res.json({ success: true, watchlist: user.watchlist });
});
