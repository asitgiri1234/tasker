require("dotenv").config();
const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const taskRoutes = require("./routes/taskRoutes");

const app = express();

// ---- Middleware ----
const clientOrigin = process.env.CLIENT_ORIGIN || "*";
app.use(cors({ origin: clientOrigin }));
app.use(express.json());

// ---- Health check ----
app.get("/", (req, res) => {
  res.status(200).json({ status: "ok", service: "tasker-api" });
});

// ---- Routes ----
app.use("/api/tasks", taskRoutes);

// ---- 404 handler ----
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ---- Central error handler ----
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || "Internal server error",
  });
});

const PORT = process.env.PORT || 5000;

// Connect to DB, then start listening.
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`✓ Server running on http://localhost:${PORT}`);
  });
});

module.exports = app;
