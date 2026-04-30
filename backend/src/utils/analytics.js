const Task = require("../models/Task");

const startOfDay = (value) => {
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return date;
};

const isSameDay = (a, b) =>
  startOfDay(a).getTime() === startOfDay(b).getTime();

const pluralize = (count, singular, plural) =>
  count === 1 ? singular : plural || `${singular}s`;

const normalizeCategory = (value) => {
  if (!value) {
    return "Uncategorized";
  }

  const trimmed = value.trim();
  return trimmed ? trimmed : "Uncategorized";
};

const calculateAnalytics = async (userId) => {
  const tasks = await Task.find({ user: userId }).lean();
  const now = new Date();

  let totalTasks = 0;
  let completedTasks = 0;
  let pendingTasks = 0;
  let inProgressTasks = 0;
  let overdueTasks = 0;
  let completedToday = 0;

  const categoryCounts = {};

  tasks.forEach((task) => {
    totalTasks += 1;

    if (task.status === "Completed") {
      completedTasks += 1;
      if (task.updatedAt && isSameDay(task.updatedAt, now)) {
        completedToday += 1;
      }
    } else if (task.status === "Pending") {
      pendingTasks += 1;
    } else if (task.status === "In Progress") {
      inProgressTasks += 1;
    }

    if (task.deadline) {
      const deadline = new Date(task.deadline);
      if (!Number.isNaN(deadline.getTime())) {
        if (deadline < now && task.status !== "Completed") {
          overdueTasks += 1;
        }
      }
    }

    const category = normalizeCategory(task.category);
    categoryCounts[category] = (categoryCounts[category] || 0) + 1;
  });

  let mostActiveCategory = "None";
  let highestCount = 0;
  Object.entries(categoryCounts).forEach(([category, count]) => {
    if (count > highestCount) {
      highestCount = count;
      mostActiveCategory = category;
    }
  });

  const insights = [];

  if (completedToday > 0) {
    insights.push(
      `You completed ${completedToday} ${pluralize(
        completedToday,
        "task"
      )} today`
    );
  }

  if (mostActiveCategory !== "None") {
    insights.push(`Most active in: ${mostActiveCategory}`);
  }

  if (overdueTasks > 0) {
    insights.push(
      `You have ${overdueTasks} overdue ${pluralize(
        overdueTasks,
        "task"
      )}`
    );
  }

  if (insights.length === 0) {
    if (totalTasks === 0) {
      insights.push("No tasks yet. Create your first task.");
    } else {
      insights.push("Keep going! Your tasks are on track.");
    }
  }

  return {
    userId,
    totalTasks,
    completedTasks,
    pendingTasks,
    inProgressTasks,
    overdueTasks,
    completedToday,
    mostActiveCategory,
    insights,
  };
};

module.exports = {
  calculateAnalytics,
};
