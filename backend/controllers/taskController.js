const mongoose = require("mongoose");
const Task = require("../models/Task");

/** Utility: guard against invalid ObjectId strings before querying. */
const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

const validationErrors = (err) => ({
  message: "Validation failed",
  errors: Object.values(err.errors).map((e) => e.message),
});

/**
 * @route   GET /api/tasks
 * @desc    Get the current user's tasks (newest first)
 */
const getTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find({ user: req.userId }).sort({ createdAt: -1 });
    res.status(200).json(tasks);
  } catch (err) {
    next(err);
  }
};

/**
 * @route   GET /api/tasks/:id
 * @desc    Get a single task owned by the current user
 */
const getTaskById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) {
      return res.status(400).json({ message: "Invalid task id" });
    }

    const task = await Task.findOne({ _id: id, user: req.userId });
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json(task);
  } catch (err) {
    next(err);
  }
};

/**
 * @route   POST /api/tasks
 * @desc    Create a task for the current user
 */
const createTask = async (req, res, next) => {
  try {
    const { title, description, status, dueDate } = req.body;

    const task = await Task.create({
      title,
      description,
      status,
      dueDate,
      user: req.userId,
    });
    res.status(201).json(task);
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json(validationErrors(err));
    }
    next(err);
  }
};

/**
 * @route   PUT /api/tasks/:id
 * @desc    Update a task owned by the current user
 */
const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) {
      return res.status(400).json({ message: "Invalid task id" });
    }

    const { title, description, status, dueDate } = req.body;

    const task = await Task.findOneAndUpdate(
      { _id: id, user: req.userId },
      { title, description, status, dueDate },
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json(task);
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json(validationErrors(err));
    }
    next(err);
  }
};

/**
 * @route   DELETE /api/tasks/:id
 * @desc    Delete a task owned by the current user
 */
const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) {
      return res.status(400).json({ message: "Invalid task id" });
    }

    const task = await Task.findOneAndDelete({ _id: id, user: req.userId });
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ message: "Task deleted", id });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};
