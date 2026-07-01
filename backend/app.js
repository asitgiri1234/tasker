require("dotenv").config();
const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");

const app = express();

// ---- Middleware ----
const clientOrigin = process.env.CLIENT_ORIGIN || "*";
const origins = clientOrigin.split(",").map((o) => o.trim());
app.use(cors({ origin: origins.includes("*") ? "*" : origins }));
app.use(express.json());

// ---- Health check (no DB needed) ----
app.get("/", (req, res) => {
  res.status(200).json({ status: "ok", service: "tasker-api" });
});

// ---- Ensure DB is connected before handling API requests ----
// The connection is cached, so this is a no-op after the first (cold) call.
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    next(err);
  }
});

// ---- Routes ----
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// ---- 404 handler ----
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ---- Central error handler ----
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err.stack || err.message);
  res.status(err.status || 500).json({
    message: err.message || "Internal server error",
  });
});

module.exports = app;
