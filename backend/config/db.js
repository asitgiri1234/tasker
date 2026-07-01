const mongoose = require("mongoose");

/**
 * Establishes a connection to MongoDB using the MONGO_URI env variable.
 * Exits the process on failure so the app doesn't run in a broken state.
 */
const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.error("✗ MONGO_URI is not defined. Set it in your .env file.");
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(uri);
    console.log(`✓ MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`✗ MongoDB connection error: ${err.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
