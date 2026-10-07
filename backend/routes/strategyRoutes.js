import express from "express";
import {
  createStrategy,
  getStrategies,
  getStrategyById,
  updateStrategy,
  deleteStrategy,
} from "../controllers/strategyController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();
router.use(protect);

router.route("/").post(createStrategy).get(getStrategies);
router.route("/:id").get(getStrategyById).put(updateStrategy).delete(deleteStrategy);

export default router;
