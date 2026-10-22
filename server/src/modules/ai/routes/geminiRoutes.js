
import { Router } from "express";
import authMiddleware from "../../../middleware/authMiddleware.js";
import {
  explainNote,
  improveNote,
} from "../controllers/geminiController.js";

const router = Router();

router.post("/explain", authMiddleware, explainNote);
router.post("/improve", authMiddleware, improveNote);

export default router;
