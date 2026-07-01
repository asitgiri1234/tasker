const mongoose = require("mongoose");
const Task = require("../models/Task");

/** Utility: guard against invalid ObjectId strings before querying. */
const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

/**
 * @route   GET /api/tasks
 * @desc    Get all tasks (newest first)
 */
const getTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.status(200).json(tasks);
  } catch (err) {
    next(err);
  }
};

/**
 * @route   GET /api/tasks/:id
 * @desc    Get a single task by id
 */
const getTaskById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) {
      return res.status(400).json({ message: "Invalid task id" });
    }

    const task = await Task.findById(id);
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
 * @desc    Create a new task
 */
const createTask = async (req, res, next) => {
  try {
    const { title, description, status, dueDate } = req.body;

    const task = await Task.create({ title, description, status, dueDate });
    res.status(201).json(task);
  } catch (err) {
    // Surface Mongoose validation errors as 400s
    if (err.name === "ValidationError") {
      return res.status(400).json({
        message: "Validation failed",
        errors: Object.values(err.errors).map((e) => e.message),
      });
    }
    next(err);
  }
};

/**
 * @route   PUT /api/tasks/:id
 * @desc    Update an existing task
 */
const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) {
      return res.status(400).json({ message: "Invalid task id" });
    }

    const { title, description, status, dueDate } = req.body;

    const task = await Task.findByIdAndUpdate(
      id,
      { title, description, status, dueDate },
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json(task);
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({
        message: "Validation failed",
        errors: Object.values(err.errors).map((e) => e.message),
      });
    }
    next(err);
  }
};

/**
 * @route   DELETE /api/tasks/:id
 * @desc    Delete a task
 */
const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) {
      return res.status(400).json({ message: "Invalid task id" });
    }

    const task = await Task.findByIdAndDelete(id);
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
