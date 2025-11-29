import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import {
  getSessions,
  createSession,
  updateSession,
  deleteSession,
  getSessionStats,
} from "../controllers/sessionController.js";

const router = express.Router();

router.use(authenticateToken);

router.get("/stats", getSessionStats);
router.get("/", getSessions);
router.post("/", createSession);
router.put("/:id", updateSession);
router.delete("/:id", deleteSession);

export default router;
