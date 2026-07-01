/**
 * Seed script — populates the database with a few sample tasks.
 * Usage: npm run seed   (from the backend/ directory)
 *
 * WARNING: this clears the existing Task collection first.
 */
require("dotenv").config();
const mongoose = require("mongoose");
const Task = require("./models/Task");

const samples = [
  {
    title: "Set up MongoDB Atlas cluster",
    description: "Create a free-tier cluster and whitelist the app IP.",
    status: "completed",
  },
  {
    title: "Build REST API",
    description: "CRUD endpoints for tasks with validation.",
    status: "completed",
  },
  {
    title: "Design the React UI",
    description: "Responsive layout with form and task list.",
    status: "in-progress",
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
  },
  {
    title: "Deploy frontend & backend",
    description: "Render for the API, Vercel for the React app.",
    status: "pending",
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  },
];

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(`✓ Connected to ${mongoose.connection.name}`);

    await Task.deleteMany({});
    console.log("✓ Cleared existing tasks");

    const created = await Task.insertMany(samples);
    console.log(`✓ Inserted ${created.length} sample tasks`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error(`✗ Seed failed: ${err.message}`);
    process.exit(1);
  }
})();
