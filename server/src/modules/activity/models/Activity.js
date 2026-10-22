import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
    {
        project:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Project",
            required:true,
        },

        user:{

            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true,
        },

        action:{
            type:String,
            required:true,
            enum:[
                "project_created",
                "note_created",
                "note_updated",
                "member_added",
                "file_uploaded",
            ],
        },

        description:{
            type:String,
            required:true,
            trim:true,
        },

    },
    {timestamps:true}
);

const Activity = mongoose.model("Activity",activitySchema);

export default Activity;