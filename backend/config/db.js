const mongoose = require("mongoose");

/**
 * Cached MongoDB connection.
 *
 * On serverless (Vercel) the module can be re-imported across warm invocations,
 * so we memoise the connection promise on `global` to avoid opening a new
 * connection per request. Idempotent: repeated calls resolve to the same conn.
 */
let cached = global._taskerMongoose;
if (!cached) {
  cached = global._taskerMongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const uri = process.env.MONGO_URI;
    if (!uri) {
      throw new Error("MONGO_URI is not defined. Set it in your environment.");
    }
    cached.promise = mongoose
      .connect(uri, { bufferCommands: false })
      .then((m) => {
        console.log(`✓ MongoDB connected: ${m.connection.host}`);
        return m;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    cached.promise = null; // allow a retry on the next request
    throw err;
  }
  return cached.conn;
};

module.exports = connectDB;
