
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



export const getProjectContributionAnalytics = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findById(projectId)
      .populate("owner", "name email")
      .populate("members", "name email");

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const userId = req.userId.toString();

    const isOwner = project.owner._id.toString() === userId;
    const isMember = project.members.some(
      (member) => member._id.toString() === userId
    );

    if (!isOwner && !isMember) {
      return res.status(403).json({
        success: false,
        message: "You do not have access to this project's analytics",
      });
    }

    const collaborators = [
      project.owner,
      ...project.members.filter(
        (member) =>
          member._id.toString() !== project.owner._id.toString()
      ),
    ];

    const analytics = await Promise.all(
      collaborators.map(async (collaborator) => {
        const counts = await Activity.aggregate([
          {
            $match: {
              project: project._id,
              user: collaborator._id,
            },
          },
          {
            $group: {
              _id: "$action",
              count: { $sum: 1 },
            },
          },
        ]);

        const countFor = (action) =>
          counts.find((item) => item._id === action)?.count || 0;

        const notesCreated = countFor("note_created");
        const notesUpdated = countFor("note_updated");
        const filesUploaded = countFor("file_uploaded");
        const projectsCreated = countFor("project_created");
        const membersAdded = countFor("member_added");

        return {
          user: {
            _id: collaborator._id,
            name: collaborator.name,
            email: collaborator.email,
          },
          notesCreated,
          notesUpdated,
          filesUploaded,
          projectsCreated,
          membersAdded,
          totalContributions:
            notesCreated +
            notesUpdated +
            filesUploaded +
            projectsCreated +
            membersAdded,
        };
      })
    );

    const summary = analytics.reduce(
      (total, member) => ({
        notesCreated: total.notesCreated + member.notesCreated,
        notesUpdated: total.notesUpdated + member.notesUpdated,
        filesUploaded: total.filesUploaded + member.filesUploaded,
        totalContributions:
          total.totalContributions + member.totalContributions,
      }),
      {
        notesCreated: 0,
        notesUpdated: 0,
        filesUploaded: 0,
        totalContributions: 0,
      }
    );

    return res.status(200).json({
      success: true,
      project: {
        _id: project._id,
        name: project.name,
      },
      summary,
      analytics,
    });
  } catch (error) {
    console.error("Project contribution analytics error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch contribution analytics",
    });
  }
};

