
import Activity from "../models/Activity.js";
import Project from "../../projects/models/Project.js";

export const getProjectActivities = async (req, res) => {
  try {
    const { projectId } = req.params;

    // Find the project and check access.
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const isOwner = project.owner.toString() === req.userId;

    const isMember = project.members.some(
      (memberId) => memberId.toString() === req.userId
    );

    if (!isOwner && !isMember) {
      return res.status(403).json({
        success: false,
        message: "You do not have access to this project's activities",
      });
    }

    // Fetch the latest activities.
    const activities = await Activity.find({ project: projectId })
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .limit(50);

    return res.status(200).json({
      success: true,
      count: activities.length,
      activities,
    });
  } catch (error) {
    console.error("Get project activities error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch project activities",
    });
  }
};
