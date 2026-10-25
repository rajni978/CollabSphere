
import mongoose from "mongoose";

const fileSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    originalName: {
      type: String,
      required: true,
      trim: true,
    },
    publicId: {
      type: String,
      required: true,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    resourceType: {
      type: String,
      required: true,
      enum: ["image", "raw"],
    },
    mimeType: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const File = mongoose.model("File", fileSchema);

export default File;
