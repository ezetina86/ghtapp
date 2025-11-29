import { Router } from "express";
import {
  getBookProgress,
  getReadingPace,
  getProgressHistory,
} from "../controllers/progressController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = Router();

router.use(authenticateToken);

router.get("/book/:bookId", getBookProgress);
router.get("/pace", getReadingPace);
router.get("/history", getProgressHistory);

export default router;
