import express from "express";
import { calculateRisk } from "../controllers/riskController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();
router.post("/", protect, calculateRisk);

export default router;
