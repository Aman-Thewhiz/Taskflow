import { configureStore } from "@reduxjs/toolkit";
import authReducer, { logout } from "./authSlice";
import tasksReducer from "./tasksSlice";
import analyticsReducer from "./analyticsSlice";
import { setUnauthorizedHandler } from "../api/client";

const store = configureStore({
  reducer: {
    auth: authReducer,
    tasks: tasksReducer,
    analytics: analyticsReducer,
  },
});

setUnauthorizedHandler(() => {
  store.dispatch(logout());
});

export default store;
