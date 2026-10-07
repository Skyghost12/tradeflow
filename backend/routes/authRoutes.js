import express from "express";
import rateLimit from "express-rate-limit";
import {
  signup,
  login,
  refresh,
  logout,
  forgotPassword,
  resetPassword,
  getMe,
} from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";
import {
  signupValidation,
  loginValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
  validate,
} from "../middleware/validate.js";

const router = express.Router();

// Stricter limiter on auth endpoints to slow down credential stuffing / brute force
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: "Too many attempts, try again later" },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/signup", authLimiter, signupValidation, validate, signup);
router.post("/login", authLimiter, loginValidation, validate, login);
router.post("/refresh", refresh);
router.post("/logout", logout);
router.post(
  "/forgot-password",
  authLimiter,
  forgotPasswordValidation,
  validate,
  forgotPassword
);
router.post(
  "/reset-password/:token",
  resetPasswordValidation,
  validate,
  resetPassword
);
router.get("/me", protect, getMe);

export default router;
