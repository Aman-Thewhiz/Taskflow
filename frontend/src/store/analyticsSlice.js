import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiClient from "../api/client";

const initialState = {
  data: null,
  loading: false,
  error: null,
};

export const fetchAnalytics = createAsyncThunk(
  "analytics/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get("/analytics");
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch analytics"
      );
    }
  }
);

const analyticsSlice = createSlice({
  name: "analytics",
  initialState,
  reducers: {
    setAnalytics: (state, action) => {
      state.data = action.payload;
      state.error = null;
    },
    clearAnalyticsError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setAnalytics, clearAnalyticsError } = analyticsSlice.actions;

export default analyticsSlice.reducer;
