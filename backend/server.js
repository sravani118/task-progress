import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import taskRoutes from "./routes/taskRoutes.js";
import authRoutes from "./routes/authRoutes.js";


dotenv.config();
const app = express();

app.use(cors({
  origin: ['https://task-progress.netlify.app', 'http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error(err));

app.get("/", (req, res) => {
  res.send("TaskFlow API running 🚀");
});

app.use("/api/tasks", taskRoutes);
app.use("/api/auth", authRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
