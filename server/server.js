import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from  "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import noteRoutes from "./routes/noteRoutes.js";
import geminiRoutes from "./routes/geminiRoutes.js";

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
