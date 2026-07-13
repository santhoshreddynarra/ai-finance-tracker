import mongoose from "mongoose";
import dns from "dns";

// Configure explicit DNS servers to bypass Node.js c-ares DNS bug on Windows
dns.setServers(['8.8.8.8', '8.8.4.4']);

const connectDB = async () => {
  try {
    console.log("Connecting to MongoDB...");
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log(`✅ MongoDB Connected successfully: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error("❌ MongoDB Connection failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;