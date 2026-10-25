import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from  "./src/config/db.js";
import authRoutes from "./src/modules/auth/routes/authRoutes.js";
import projectRoutes from "./src/modules/projects/routes/projectRoutes.js";
import noteRoutes from "./src/modules/notes/routes/noteRoutes.js";
import geminiRoutes from "./src/modules/ai/routes/geminiRoutes.js";
import activityRoutes from "./src/modules/activity/routes/activityRoutes.js";
import fileRoutes from "./src/modules/files/routes/fileRoutes.js";

dotenv.config();

const app= express()

const PORT =  process .env.PORT ||5000;

// Middleware
app.use(cors())
app.use(express.json())

app.use("/api/auth",authRoutes);
app.use("/api/projects",projectRoutes);
app.use("/api/projects", noteRoutes);
app.use("/api/gemini", geminiRoutes);
app.use("/api/projects", activityRoutes);
app.use("/api/files", fileRoutes);

// Test route

app.get("/",(req,res) => {
    res.json({
        message:"Welcome to colabsphere API!",
        status :"Server is running succesfully",
    });
});

const startServer = async() => {
   await connectDB();

   app.listen(PORT,() => {
    console.log(`Collabsphere server running on port ${PORT}`);
});
};

startServer();
