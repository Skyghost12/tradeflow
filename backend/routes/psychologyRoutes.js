import express from "express";
import {
  createLog,
  getLogs,
  updateLog,
  deleteLog,
  getPsychologyReport,
} from "../controllers/psychologyController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();
router.use(protect);

router.get("/report", getPsychologyReport);
router.route("/").post(createLog).get(getLogs);
router.route("/:id").put(updateLog).delete(deleteLog);

export default router;
