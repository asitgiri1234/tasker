const express = require("express");
const router = express.Router();

const {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");
const auth = require("../middleware/auth");

// Every task route requires a valid token; handlers use req.userId.
router.use(auth);

// /api/tasks
router.route("/").get(getTasks).post(createTask);

// /api/tasks/:id
router
  .route("/:id")
  .get(getTaskById)
  .put(updateTask)
  .delete(deleteTask);

module.exports = router;
