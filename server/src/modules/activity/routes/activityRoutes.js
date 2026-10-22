
import express from "express";
import authMiddleware from "../../../middleware/authMiddleware.js";
import { getProjectActivities } from "../controllers/activityController.js";


const router = express.Router();

router.get(
  "/:projectId/activities",
  authMiddleware,
  getProjectActivities
);

export default router;
