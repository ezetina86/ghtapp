import { Router } from "express";
import {
  getGoals,
  createGoal,
  updateGoal,
  deleteGoal,
  getGoalProgress,
} from "../controllers/goalController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = Router();

router.use(authenticateToken);

router.get("/", getGoals);
router.post("/", createGoal);
router.get("/:id/progress", getGoalProgress);
router.put("/:id", updateGoal);
router.delete("/:id", deleteGoal);

export default router;
