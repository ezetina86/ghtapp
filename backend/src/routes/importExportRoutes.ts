import { Router } from "express";
import multer from "multer";
import {
  exportBooks,
  importBooks,
} from "../controllers/importExportController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.use(authenticateToken);

router.get("/export", exportBooks);
router.post("/import", upload.single("file"), importBooks);

export default router;
