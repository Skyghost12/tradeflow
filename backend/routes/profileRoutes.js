import express from "express";
import { updateProfile, uploadAvatar, updateWatchlist } from "../controllers/profileController.js";
import { protect } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();
router.use(protect);

router.put("/", updateProfile);
router.post("/avatar", upload.single("avatar"), uploadAvatar);
router.put("/watchlist", updateWatchlist);

export default router;
