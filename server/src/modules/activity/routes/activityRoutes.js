
import express from "express";
import authMiddleware from "../../../middleware/authMiddleware.js";
import {
  getProjectActivities,
  getProjectContributionAnalytics,
} from "../controllers/activityController.js";

const router = express.Router();

router.get(
  "/:projectId/activities",
  authMiddleware,
  getProjectActivities
);

router.get(
  "/:projectId/analytics",
  authMiddleware,
  getProjectContributionAnalytics
);

export default router;


