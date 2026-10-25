
import express from "express";
import authMiddleware from "../../../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";
import {
  uploadFile,
  getProjectFiles,
 explainUploadedFile,
} from "../controllers/fileController.js";

const router = express.Router();

router.post(
  "/projects/:projectId",
  authMiddleware,
  upload.single("file"),
  uploadFile
);

router.get(
  "/projects/:projectId",
  authMiddleware,
  getProjectFiles
);
router.post(
  "/projects/:projectId/:fileId/explain",
  authMiddleware,
  explainUploadedFile
);

export default router;

