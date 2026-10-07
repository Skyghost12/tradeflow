import express from "express";
import {
  createTrade,
  getTrades,
  getTradeById,
  updateTrade,
  deleteTrade,
} from "../controllers/tradeController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();
router.use(protect);

router.route("/").post(createTrade).get(getTrades);
router.route("/:id").get(getTradeById).put(updateTrade).delete(deleteTrade);

export default router;
