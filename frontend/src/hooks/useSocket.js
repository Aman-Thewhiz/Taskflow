import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connectSocket, disconnectSocket } from "../socket";
import {
  addTask,
  removeTask,
  updateTaskItem,
} from "../store/tasksSlice";
import { setAnalytics } from "../store/analyticsSlice";

const useSocket = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const userId = useSelector((state) => state.auth.user?.id);

  useEffect(() => {
    if (!isAuthenticated) {
      disconnectSocket();
      return;
    }

    const socket = connectSocket();

    const handleCreated = (task) => {
      dispatch(addTask(task));
    };

    const handleUpdated = (task) => {
      dispatch(updateTaskItem(task));
    };

    const handleDeleted = (payload) => {
      const taskId = payload?.taskId || payload?._id || payload;
      if (taskId) {
        dispatch(removeTask(taskId));
      }
    };

    const handleAnalyticsUpdated = (payload) => {
      if (!payload) {
        return;
      }

      if (payload.userId && userId && payload.userId !== userId) {
        return;
      }

      dispatch(setAnalytics(payload));
    };

    socket.on("task:created", handleCreated);
    socket.on("task:updated", handleUpdated);
    socket.on("task:deleted", handleDeleted);
    socket.on("analytics:updated", handleAnalyticsUpdated);

    return () => {
      socket.off("task:created", handleCreated);
      socket.off("task:updated", handleUpdated);
      socket.off("task:deleted", handleDeleted);
      socket.off("analytics:updated", handleAnalyticsUpdated);
      disconnectSocket();
    };
  }, [dispatch, isAuthenticated, userId]);
};

export default useSocket;
