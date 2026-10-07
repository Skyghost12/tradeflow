import crypto from "crypto";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { AppError, asyncHandler } from "../middleware/errorHandler.js";
import {
  generateAccessToken,
  generateRefreshToken,
  setRefreshTokenCookie,
} from "../utils/generateToken.js";
import sendEmail from "../utils/sendEmail.js";

// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
export const signup = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  const existingUser = await User.findOne({ $or: [{ email }, { username }] });
  if (existingUser) {
    const field = existingUser.email === email ? "Email" : "Username";
    throw new AppError(`${field} is already in use`, 409);
  }

  const user = await User.create({ username, email, password });

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);
  setRefreshTokenCookie(res, refreshToken);

  res.status(201).json({
    success: true,
    accessToken,
    user,
  });
});

// @desc    Authenticate user and return tokens
// @route   POST /api/auth/login
// @access  Public
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.matchPassword(password))) {
    throw new AppError("Invalid email or password", 401);
  }

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);
  setRefreshTokenCookie(res, refreshToken);

  res.json({
    success: true,
    accessToken,
    user,
  });
});

// @desc    Issue a new access token using the refresh token cookie
// @route   POST /api/auth/refresh
// @access  Public (requires valid refresh cookie)
export const refresh = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken;
  if (!token) {
    throw new AppError("No refresh token provided", 401);
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch {
    throw new AppError("Refresh token invalid or expired", 401);
  }

  const user = await User.findById(decoded.id);
  if (!user) {
    throw new AppError("User no longer exists", 401);
  }

  const accessToken = generateAccessToken(user._id);
  res.json({ success: true, accessToken });
});

// @desc    Log out — clears the refresh token cookie
// @route   POST /api/auth/logout
// @access  Public
export const logout = asyncHandler(async (req, res) => {
  res.clearCookie("refreshToken", { path: "/api/auth" });
  res.json({ success: true, message: "Logged out" });
});

// @desc    Send a password reset link to the user's email
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  // Always return the same response whether or not the user exists,
  // so this endpoint can't be used to enumerate registered emails.
  if (!user) {
    return res.json({
      success: true,
      message: "If that email is registered, a reset link has been sent",
    });
  }

  const resetToken = crypto.randomBytes(32).toString("hex");
  user.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  user.passwordResetExpires = Date.now() + 30 * 60 * 1000; // 30 minutes
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

  try {
    await sendEmail({
      to: user.email,
      subject: "Reset your TradeFlow password",
      html: `<p>You requested a password reset.</p>
             <p><a href="${resetUrl}">Click here to reset your password</a> — this link expires in 30 minutes.</p>
             <p>If you didn't request this, ignore this email.</p>`,
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    throw new AppError("Email could not be sent, please try again later", 500);
  }

  res.json({
    success: true,
    message: "If that email is registered, a reset link has been sent",
  });
});

// @desc    Reset password using the token emailed to the user
// @route   POST /api/auth/reset-password/:token
// @access  Public
export const resetPassword = asyncHandler(async (req, res) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  }).select("+passwordResetToken +passwordResetExpires");

  if (!user) {
    throw new AppError("Reset link is invalid or has expired", 400);
  }

  user.password = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  res.json({ success: true, message: "Password reset successful" });
});

// @desc    Get the currently authenticated user
// @route   GET /api/auth/me
// @access  Private
export const getMe = asyncHandler(async (req, res) => {
  res.json({ success: true, user: req.user });
});
