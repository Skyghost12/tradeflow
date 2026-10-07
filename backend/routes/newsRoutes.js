import express from "express";
import { getMarketNews } from "../controllers/newsController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();
router.get("/", protect, getMarketNews);

export default router;
