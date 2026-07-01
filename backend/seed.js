/**
 * Seed script — creates a demo user and a few sample tasks owned by them.
 * Usage: npm run seed   (from the backend/ directory)
 *
 * Demo login:  demo@tasker.app  /  demo1234
 *
 * WARNING: this removes the demo user and their tasks first (other users
 * and their data are left untouched).
 */
require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");
const Task = require("./models/Task");

const DEMO = { name: "Demo User", email: "demo@tasker.app", password: "demo1234" };

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

    // Reset only the demo account's data.
    let user = await User.findOne({ email: DEMO.email });
    if (user) await Task.deleteMany({ user: user._id });
    else user = await User.create(DEMO);
    console.log(`✓ Demo user ready: ${DEMO.email} / ${DEMO.password}`);

    const created = await Task.insertMany(
      samples.map((t) => ({ ...t, user: user._id }))
    );
    console.log(`✓ Inserted ${created.length} sample tasks`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error(`✗ Seed failed: ${err.message}`);
    process.exit(1);
  }
})();
