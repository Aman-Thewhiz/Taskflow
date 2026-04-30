import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiClient from "../api/client";

const initialState = {
  items: [],
  loading: false,
  error: null,
  filters: {
    status: "All",
    category: "All",
    search: "",
  },
};

const normalizeId = (value) => (value ? String(value) : "");

const compareTasks = (a, b) => {
  const scoreA = a?.priorityScore ?? 0;
  const scoreB = b?.priorityScore ?? 0;

  if (scoreB !== scoreA) {
    return scoreB - scoreA;
  }

  return new Date(a?.createdAt || 0) - new Date(b?.createdAt || 0);
};

const upsertTask = (items, task) => {
  const taskId = normalizeId(task?._id);
  const index = items.findIndex((item) => normalizeId(item._id) === taskId);
  const next = [...items];

  if (index >= 0) {
    next[index] = task;
  } else {
    next.push(task);
  }

  return next.sort(compareTasks);
};

export const fetchTasks = createAsyncThunk(
  "tasks/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get("/tasks");
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch tasks"
      );
    }
  }
);

export const createTask = createAsyncThunk(
  "tasks/create",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/tasks", payload);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create task"
      );
    }
  }
);

export const updateTask = createAsyncThunk(
  "tasks/update",
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(`/tasks/${id}`, updates);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update task"
      );
    }
  }
);

export const deleteTask = createAsyncThunk(
  "tasks/delete",
  async (taskId, { rejectWithValue }) => {
    try {
      const response = await apiClient.delete(`/tasks/${taskId}`);
      return response.data.data?.taskId || taskId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete task"
      );
    }
  }
);

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearTasksError: (state) => {
      state.error = null;
    },
    addTask: (state, action) => {
      state.items = upsertTask(state.items, action.payload);
    },
    updateTaskItem: (state, action) => {
      state.items = upsertTask(state.items, action.payload);
    },
    removeTask: (state, action) => {
      const taskId = normalizeId(action.payload);
      state.items = state.items.filter(
        (task) => normalizeId(task._id) !== taskId
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload || [];
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.loading = false;
        state.items = upsertTask(state.items, action.payload);
      })
      .addCase(createTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.loading = false;
        state.items = upsertTask(state.items, action.payload);
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(
          (task) => task._id !== action.payload
        );
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setFilters,
  clearTasksError,
  addTask,
  updateTaskItem,
  removeTask,
} = tasksSlice.actions;

export default tasksSlice.reducer;
