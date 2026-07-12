import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";

const app = express();

// Security and utility middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Health Endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "success", message: "API is healthy" });
});

// Fallback route
app.get("/", (req, res) => {
  res.send("AI Finance Tracker API is Running...");
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

export default app;