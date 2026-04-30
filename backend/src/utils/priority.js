const MS_PER_DAY = 1000 * 60 * 60 * 24;

const getPriorityScore = (task) => {
  if (!task) {
    return 0;
  }

  if (task.status === "Completed") {
    return 0;
  }

  if (!task.deadline) {
    return 10;
  }

  const deadline = new Date(task.deadline);

  if (Number.isNaN(deadline.getTime())) {
    return 10;
  }

  const now = new Date();
  const diffMs = deadline.getTime() - now.getTime();

  if (diffMs < 0) {
    const overdueDays = Math.max(1, Math.ceil(Math.abs(diffMs) / MS_PER_DAY));
    return 10000 + overdueDays * 100;
  }

  const diffDays = Math.ceil(diffMs / MS_PER_DAY);

  if (diffDays <= 1) {
    return 5000;
  }

  if (diffDays <= 3) {
    return 3000;
  }

  if (diffDays <= 7) {
    return 1000;
  }

  return 100;
};

const getPriorityLevel = (score, task) => {
  if (!task || task.status === "Completed") {
    return "none";
  }

  if (score >= 10000) {
    return "overdue";
  }

  if (score >= 5000) {
    return "critical";
  }

  if (score >= 3000) {
    return "high";
  }

  if (score >= 1000) {
    return "medium";
  }

  if (score >= 10) {
    return "low";
  }

  return "none";
};

const enrichTask = (task) => {
  const priorityScore = getPriorityScore(task);
  const priorityLevel = getPriorityLevel(priorityScore, task);
  const data = typeof task.toObject === "function" ? task.toObject() : task;

  return {
    ...data,
    priorityScore,
    priorityLevel,
  };
};

const sortTasksByPriority = (tasks) => {
  const enriched = tasks.map(enrichTask);

  enriched.sort((a, b) => {
    if (b.priorityScore !== a.priorityScore) {
      return b.priorityScore - a.priorityScore;
    }

    return new Date(a.createdAt) - new Date(b.createdAt);
  });

  return enriched;
};

module.exports = {
  getPriorityScore,
  getPriorityLevel,
  enrichTask,
  sortTasksByPriority,
};
