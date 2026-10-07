import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import rateLimit from "express-rate-limit";

import connectDB from "./config/db.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";

import authRoutes from "./routes/authRoutes.js";
import tradeRoutes from "./routes/tradeRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import riskRoutes from "./routes/riskRoutes.js";
import strategyRoutes from "./routes/strategyRoutes.js";
import noteRoutes from "./routes/noteRoutes.js";
import goalRoutes from "./routes/goalRoutes.js";
import psychologyRoutes from "./routes/psychologyRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import newsRoutes from "./routes/newsRoutes.js";
import calendarRoutes from "./routes/calendarRoutes.js";

dotenv.config();
connectDB();

const app = express();

// ---- Security & parsing middleware ----
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true, // required so the refresh-token cookie is sent/received
  })
);
app.use(express.json({ limit: "10kb" })); // body size cap to blunt payload-based DoS
app.use(cookieParser());
app.use(mongoSanitize()); // strips $ and . from req.body/query/params — prevents NoSQL injection
app.use(xss()); // sanitizes user input against XSS payloads

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// Global API rate limiter (auth routes have their own stricter limiter)
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api", globalLimiter);

// ---- Routes ----
app.get("/api/health", (req, res) => res.json({ success: true, status: "ok" }));

app.use("/api/auth", authRoutes);
app.use("/api/trades", tradeRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/risk-calculator", riskRoutes);
app.use("/api/strategies", strategyRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/goals", goalRoutes);
app.use("/api/psychology", psychologyRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/calendar", calendarRoutes);

// ---- Error handling (must be last) ----
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`TradeFlow API running on port ${PORT} [${process.env.NODE_ENV || "development"}]`);
});
