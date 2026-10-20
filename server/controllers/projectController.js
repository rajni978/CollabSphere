import Project from "../models/Project.js";
import User from "../models/User.js";

export const createProject = async(req,res)=> {

    try{

        const{name,description} = req.body;

        if(!name || !description){

            return res.status(400).json({
                message:"Project name description are required",
            });
        }

        const project = await Project.create({
            name:name.trim(),
            description:description.trim(),
            owner:req.userId,

        });
        return res.status(201).json({
            message:"Project created successfully!",
            project,
        });
    }catch(error){
        console.error("Create project error:",error.message);

        return res.status(500).json({
            message:"Something went wrong while creating the project.",
        });
    }
};


export const getMyProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      $or: [
        { owner: req.userId },
        { members: req.userId },
      ],
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      count: projects.length,
      projects,
    });
  } catch (error) {
    console.error("Fetch projects error:", error.message);

    return res.status(500).json({
      message: "Failed to fetch projects.",
    });
  }
};



export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      $or: [
        { owner: req.userId },
        { members: req.userId },
      ],
    }).populate("members", "name email");

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    return res.status(200).json({ project });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid project ID",
      });
    }

    console.error("Fetch project error:", error.message);

    return res.status(500).json({
      message: "Failed to fetch project details",
    });
  }
};



export const updateProject=async(req,res) => {

    try{

        const{name,description} = req.body;
        
      if(typeof name !=="string" || typeof description !=="string"
        || !name.trim() || !description.trim()
      ){

        return res.status(400).json({
            message:"Project name and description are required",
        });
      }

      const project = await Project.findOneAndUpdate(
        {
        _id:req.params.id,
        owner:req.userId,
        
      },
      {
        name:name.trim(),
        description:description.trim(),
      },
      {
        new:true,
        runValidators:true,
      }
    );

    if(!project){
        return res.status(404).json({
            message:"Project not found",
        });
    }

    return res.status(200).json({
  message: "Project updated successfully!",
  project
});
    }catch(error){
        if(error.name == "CastError"){
            return res.status(400).json({
                message:"Invalid project ID",
            });
        }

        console.error("Update project error:",error.message);

        return res.status(500).json({
            message:"Failed to update project",
        });
    }
}  ; 


export const deleteProject = async (req, res) => {
  try {
    console.log("Deleting project ID:", req.params.id);
    console.log("Authenticated user ID:", req.userId);

    const project = await Project.findOneAndDelete({
      _id: req.params.id,
      owner: req.userId,
    });

    if (!project) {
      return res.status(404).json({
        message: "Project not found.",
      });
    }

    return res.status(200).json({
      message: "Project deleted successfully!",
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid project ID.",
      });
    }

    console.error("Delete project error:", error.message);

    return res.status(500).json({
      message: "Failed to delete project.",
    });
  }

};



export const addProjectMember = async (req, res) => {
  try {
    const { email } = req.body;

    if (typeof email !== "string" || !email.trim()) {
      return res.status(400).json({
        message: "Collaborator email is required.",
      });
    }

    const project = await Project.findOne({
      _id: req.params.id,
      owner: req.userId,
    });

    if (!project) {
      return res.status(404).json({
        message: "Project not found or you are not the owner.",
      });
    }

    const user = await User.findOne({
      email: email.trim().toLowerCase(),
    });

    if (!user) {
      return res.status(404).json({
        message: "No registered user found with this email.",
      });
    }

    if (user._id.toString() === project.owner.toString()) {
      return res.status(400).json({
        message: "The project owner is already a member.",
      });
    }

    const alreadyMember = project.members.some(
      (memberId) => memberId.toString() === user._id.toString()
    );

    if (alreadyMember) {
      return res.status(409).json({
        message: "This user is already a project member.",
      });
    }

    project.members.push(user._id);
    await project.save();

    return res.status(200).json({
      message: "Project member added successfully!",
      member: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid project ID.",
      });
    }

    console.error("Add project member error:", error.message);

    return res.status(500).json({
      message: "Failed to add project member.",
    });
  }
};

