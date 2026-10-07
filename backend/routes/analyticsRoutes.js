import express from "express";
import { getAnalytics, getDashboardSummary } from "../controllers/analyticsController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();
router.use(protect);

router.get("/", getAnalytics);

export default router;
