const mongoose = require("mongoose");
const dns = require("dns");

const connectDB = async () => {
  try {
    // Use reliable DNS servers for MongoDB Atlas SRV resolution
    dns.setServers(["8.8.8.8", "1.1.1.1"]);

    const mongoURI = process.env.MONGODB_URI;

    if (!mongoURI) {
      throw new Error("MONGODB_URI is not defined in .env");
    }

    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 15000,
      connectTimeoutMS: 15000,
    });

    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    console.error("❌ MongoDB Connection Failed");
    console.error(error.message);
  }
};

module.exports = connectDB;