import express from "express";
import {
    createProject,
    getMyProjects,
    getProjectById,
    updateProject,
    deleteProject,
    addProjectMember,
    getMyNotesCount,
    enableProjectSharing,
  disableProjectSharing,
  getPublicProject,
    } from "../controllers/projectController.js";
    
import authMiddleware from "../../../middleware/authMiddleware.js";

const router=express.Router();

router.post("/",authMiddleware,createProject);
router.get("/",authMiddleware,getMyProjects);

router.get("/notes-count", authMiddleware, getMyNotesCount);

// Public project sharing
router.get("/public/:shareToken", getPublicProject);

// Owner-only sharing controls
router.post("/:id/share", authMiddleware, enableProjectSharing);
router.delete("/:id/share", authMiddleware, disableProjectSharing);

router.get("/:id",authMiddleware,getProjectById);
router.put("/:id",authMiddleware,updateProject);
router.delete("/:id",authMiddleware,deleteProject);

router.post("/:id/members", authMiddleware, addProjectMember);
export default router;
