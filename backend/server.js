import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import taskRoutes from "./routes/taskRoutes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();
const app = express();

<<<<<<< HEAD
// Configure CORS
app.use(cors({
  origin: 'https://task-progress.netlify.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
}));
app.use(express.json());

// Log all requests - MUST be before routes
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

=======
// ===============================
// 🧩 CORS CONFIGURATION
// ===============================
const allowedOrigins = [
  "https://task-progress.netlify.app",
  "http://localhost:5173" // for local testing
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 200,
};

// ✅ Apply CORS before any routes
app.use(cors(corsOptions));

// ✅ Handle all preflight requests globally (Express 5 syntax)
app.options(/.*/, cors(corsOptions));

// ✅ Parse incoming JSON
app.use(express.json());

// ===============================
// 🚀 DATABASE CONNECTION
// ===============================
>>>>>>> c203618bb0053c56b9e9c863743e06352b02beb5
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ===============================
// 🧭 ROUTES
// ===============================
app.get("/", (req, res) => {
  res.send("Task Progress API running 🚀");
});

app.use("/api/tasks", taskRoutes);
app.use("/api/auth", authRoutes);

<<<<<<< HEAD
// Handle 404 - MUST be before error handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(`${new Date().toISOString()} - Error:`, err);
  
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      message: 'Invalid token or no token provided'
    });
  }

  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
=======
// ✅ Test route to check CORS
app.get("/test-cors", (req, res) => {
  res.json({ message: "CORS working ✅" });
>>>>>>> c203618bb0053c56b9e9c863743e06352b02beb5
});

// ===============================
// ⚙️ FALLBACK CORS HEADERS
// ===============================
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://task-progress.netlify.app");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, PATCH");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// ===============================
// 🧯 ERROR HANDLING
// ===============================
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.message);
  if (err.name === "UnauthorizedError") {
    return res.status(401).json({ message: "Invalid token" });
  }
  res.status(500).json({ message: err.message || "Internal Server Error" });
});

// ===============================
// 🚫 404 HANDLER
// ===============================
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ===============================
// 🚀 START SERVER
// ===============================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
