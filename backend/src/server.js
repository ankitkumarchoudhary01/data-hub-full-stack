import "dotenv/config";

import express from "express";
import cors from "cors";

import connectDB from "./config/database.js";
import postRoutes from "./routes/postRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import requestLogger from "./middleware/requestLogger.js";

const app = express();

const PORT = process.env.PORT || 5000;

// CORS configuration
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

// Parse incoming JSON data
app.use(express.json());

// Custom request logger middleware
app.use(requestLogger);

// API routes
app.use("/posts", postRoutes);
app.use("/users", userRoutes);

// Root route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to the Data Hub API!",
  });
});

app.get('/healthz', (req, res) => {
  res.status(200).send('OK');
});


// Health check route
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "The Data Hub API is running",
  });
});

// Handle unknown routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Start server only after MongoDB connects
const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();