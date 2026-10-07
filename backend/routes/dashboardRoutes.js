import express from "express";
import { getDashboardSummary } from "../controllers/analyticsController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();
router.get("/", protect, getDashboardSummary);

export default router;
