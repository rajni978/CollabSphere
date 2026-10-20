
import { Router } from "express";

import {
  createNote,
  getProjectNotes,
  updateNote,
  deleteNote,
} from "../controllers/noteController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = Router();

router.post("/:id/notes", authMiddleware, createNote);
router.get("/:id/notes", authMiddleware, getProjectNotes);
router.put("/notes/:noteId",authMiddleware,updateNote);
router.delete("/notes/:noteId",authMiddleware,deleteNote);

export default router;
