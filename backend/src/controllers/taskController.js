const Task = require("../models/Task");
const {
  enrichTask,
  getPriorityScore,
  sortTasksByPriority,
} = require("../utils/priority");
const { calculateAnalytics } = require("../utils/analytics");
const { emitToUser } = require("../socket");

const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id });
    const tasksWithPriority = sortTasksByPriority(tasks);

    return res.status(200).json({
      success: true,
      message: "Tasks fetched successfully",
      data: tasksWithPriority,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch tasks",
      data: null,
    });
  }
};

const createTask = async (req, res) => {
  try {
    const { title, description, category, status, deadline } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Title is required",
        data: null,
      });
    }

    const task = new Task({
      title: title.trim(),
      description: description ? description.trim() : "",
      category: category ? category.trim() : "",
      status: status || "Pending",
      deadline: deadline || null,
      user: req.user.id,
    });

    task.priorityScore = getPriorityScore(task);
    await task.save();

    const taskPayload = enrichTask(task);
    emitToUser(req.user.id, "task:created", taskPayload);

    try {
      const analytics = await calculateAnalytics(req.user.id);
      emitToUser(req.user.id, "analytics:updated", analytics);
    } catch (err) {
      console.error("Analytics update failed:", err.message);
    }

    return res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: taskPayload,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create task",
      data: null,
    });
  }
};

const updateTask = async (req, res) => {
  try {
    const { title, description, category, status, deadline } = req.body;

    if (title !== undefined && !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Title cannot be empty",
        data: null,
      });
    }

    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
        data: null,
      });
    }

    if (title !== undefined) {
      task.title = title.trim();
    }

    if (description !== undefined) {
      task.description = description ? description.trim() : "";
    }

    if (category !== undefined) {
      task.category = category ? category.trim() : "";
    }

    if (status !== undefined) {
      task.status = status;
    }

    if (deadline !== undefined) {
      task.deadline = deadline || null;
    }

    task.priorityScore = getPriorityScore(task);
    await task.save();

    const taskPayload = enrichTask(task);
    emitToUser(req.user.id, "task:updated", taskPayload);

    try {
      const analytics = await calculateAnalytics(req.user.id);
      emitToUser(req.user.id, "analytics:updated", analytics);
    } catch (err) {
      console.error("Analytics update failed:", err.message);
    }

    return res.status(200).json({
      success: true,
      message: "Task updated successfully",
      data: taskPayload,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update task",
      data: null,
    });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
        data: null,
      });
    }

    emitToUser(req.user.id, "task:deleted", { taskId: task._id });

    try {
      const analytics = await calculateAnalytics(req.user.id);
      emitToUser(req.user.id, "analytics:updated", analytics);
    } catch (err) {
      console.error("Analytics update failed:", err.message);
    }

    return res.status(200).json({
      success: true,
      message: "Task deleted successfully",
      data: { taskId: task._id },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete task",
      data: null,
    });
  }
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
};
