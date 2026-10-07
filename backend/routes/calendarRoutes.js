import express from "express";
import { getEconomicCalendar } from "../controllers/calendarController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();
router.get("/", protect, getEconomicCalendar);

export default router;
