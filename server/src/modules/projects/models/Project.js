import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required:true,
            trim:true,

        },
        description:{
            type:String,
            trim:true,
            required:true
        },
        owner:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true
        },
    
members: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
],

isPublic: {
  type: Boolean,
  default: false,
},

shareToken: {
  type: String,
  unique: true,
  sparse: true,
},
},
     {
            timestamps:true
        }
);

const Project = mongoose.model("Project",projectSchema);

export default Project;