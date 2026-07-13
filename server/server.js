import dotenv from "dotenv";
import mongoose from "mongoose";
import app from "./app.js";
import connectDB from "./config/db.js";

dotenv.config();

// Validate required environment variables
if (!process.env.MONGODB_URI) {
  console.error("❌ FATAL ERROR: MONGODB_URI is not defined.");
  process.exit(1);
}

const PORT = process.env.PORT || 5000;

let server;

// Initialize server after successful DB connection
const initServer = async () => {
  await connectDB();
  
  // Start Server
  server = app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
};

initServer();

// Graceful shutdown
const gracefulShutdown = () => {
  console.log("Received kill signal, shutting down gracefully...");
  
  if (server) {
    server.close(async () => {
      console.log("Closed out remaining connections.");
      if (mongoose.connection.readyState === 1) { // 1 = connected
        await mongoose.connection.close(false);
        console.log("MongoDB connection closed.");
      }
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
  
  // Force close after 10 seconds
  setTimeout(() => {
    console.error("Could not close connections in time, forcefully shutting down");
    process.exit(1);
  }, 10000);
};

process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);