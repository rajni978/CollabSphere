
import Note from "../models/../models/Note.js";
import Project from "../../projects/models/Project.js";
import Activity from "../../activity/models/Activity.js";

export const createNote = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title?.trim() || !content?.trim()) {
      return res.status(400).json({
        message: "Title and content are required.",
      });
    }

    const project = await Project.findOne({
      _id: req.params.id,
    
$or: [
  { owner: req.userId },
  { members: req.userId }
],

      
    });

    if (!project) {
      return res.status(404).json({
        message: "Project not found or access denied.",
      });
    }

    const note = await Note.create({
      title: title.trim(),
      content,
      project: project._id,
      author: req.userId,
    });

    await Activity.create({
  project: project._id,
  user: req.userId,
  action: "note_created",
  description: `Created note "${note.title}"`,
});

    return res.status(201).json({
      message: "Note saved successfully!",
      note,
    });
  } catch (error) {
    console.error("Create note error:", error);
    return res.status(500).json({
      message: "Failed to save note.",
    });
  }
};

export const getProjectNotes = async (req, res) => {
  try {
const project = await Project.findOne({
  _id: req.params.id,
  $or: [
    { owner: req.userId },
    { members: req.userId },
  ],
});

    if (!project) {
      return res.status(404).json({
        message: "Project not found or access denied.",
      });
    }

    const notes = await Note.find({
      project: project._id,
    })
      .populate("author", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      count: notes.length,
      notes,
    });
  } catch (error) {
    console.error("Get project notes error:", error);
    return res.status(500).json({
      message: "Failed to retrieve notes.",
    });
  }
};


export const updateNote = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title?.trim() || !content?.trim()) {
      return res.status(400).json({
        message: "Title and content are required.",
      });
    }

    const note = await Note.findById(req.params.noteId);

    if (!note) {
      return res.status(404).json({
        message: "Note not found.",
      });
    }

    const project = await Project.findOne({
      _id: note.project,
      $or: [
        { owner: req.userId },
        { members: req.userId },
      ],
    });

    if (!project) {
      return res.status(403).json({
        message: "You do not have access to this project.",
      });
    }

    const isOwner =
      project.owner.toString() === req.userId.toString();

    const isAuthor =
      note.author.toString() === req.userId.toString();

    if (!isOwner && !isAuthor) {
      return res.status(403).json({
        message: "You can only edit your own notes.",
      });
    }

    note.title = title.trim();
    note.content = content.trim();

    await note.save();

    await Activity.create({
  project: project._id,
  user: req.userId,
  action: "note_updated",
  description: `Updated note "${note.title}"`,
});

    return res.status(200).json({
      message: "Note updated successfully!",
      note,
    });
  } catch (error) {
    console.error("Update note error:", error.message);

    return res.status(500).json({
      message: "Failed to update note.",
    });
  }
};


export const deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.noteId);

    if (!note) {
      return res.status(404).json({
        message: "Note not found.",
      });
    }

    const project = await Project.findOne({
      _id: note.project,
      $or: [
        { owner: req.userId },
        { members: req.userId },
      ],
    });

    if (!project) {
      return res.status(403).json({
        message: "You do not have access to this project.",
      });
    }

    const isOwner =
      project.owner.toString() === req.userId.toString();

    const isAuthor =
      note.author.toString() === req.userId.toString();

    if (!isOwner && !isAuthor) {
      return res.status(403).json({
        message: "You can only delete your own notes.",
      });
    }

    await note.deleteOne();

    return res.status(200).json({
      message: "Note deleted successfully!",
    });
  } catch (error) {
    console.error("Delete note error:", error.message);

    return res.status(500).json({
      message: "Failed to delete note.",
    });
  }
};


