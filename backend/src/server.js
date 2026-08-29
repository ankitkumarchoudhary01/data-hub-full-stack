import "dotenv/config";
import express from "express";
import connectDB from "./config/database.js";
import postRoutes from "./routes/postRoutes.js";
import requestLogger from "./middleware/requestLogger.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();
app.use(requestLogger);

const PORT = 5000;

app.use(express.json());

app.use("/posts", postRoutes);
app.use("/users", userRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Data Hub API!" }); //api endpoint to send a welcome message
});

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Server startup failed:", error);
  });