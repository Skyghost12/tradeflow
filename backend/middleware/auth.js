import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { AppError, asyncHandler } from "./errorHandler.js";

/**
 * Verifies the access token sent in the Authorization header
 * (format: "Bearer <token>") and attaches the authenticated user
 * to req.user. Use on any route that requires a logged-in user.
 */
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    throw new AppError("Not authorized, no token provided", 401);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      throw new AppError("User no longer exists", 401);
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      throw new AppError("Access token expired", 401);
    }
    throw new AppError("Not authorized, token invalid", 401);
  }
});
