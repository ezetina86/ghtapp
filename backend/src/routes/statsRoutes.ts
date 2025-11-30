import { Router } from "express";
import {
  getDailyReadingHistory,
  getBookStats,
  getReadingPace,
  getAdvancedStats,
} from "../controllers/statsController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = Router();

router.use(authenticateToken);

router.get("/daily-history", getDailyReadingHistory);
router.get("/books", getBookStats);
router.get("/reading-pace", getReadingPace);

router.get("/advanced", getAdvancedStats);

export default router;
