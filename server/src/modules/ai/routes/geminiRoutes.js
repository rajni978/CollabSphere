
import { Router } from "express";
import authMiddleware from "../../../middleware/authMiddleware.js";
import {
  explainNote,
  improveNote,
   generateDocs,
  generateReadme,
} from "../controllers/geminiController.js";

const router = Router();

router.post("/explain", authMiddleware, explainNote);
router.post("/improve", authMiddleware, improveNote);
router.post("/docs", authMiddleware, generateDocs);
router.post("/readme", authMiddleware, generateReadme);


export default router;
